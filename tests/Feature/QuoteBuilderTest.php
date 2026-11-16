<?php

use App\Models\CatalogItem;
use App\Models\Partner;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\ServiceZone;
use App\Models\User;
use App\Support\QuoteBuilder;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\ServiceSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed([ServiceSeeder::class, CatalogSeeder::class]);
    $this->admin = User::factory()->create(['is_admin' => true]);
});

function draftQuote(array $overrides = []): Quote
{
    return QuoteBuilder::save(new Quote, [
        'client_name' => 'María López',
        'client_phone' => '0991234567',
        'travel_fee_cents' => 500,
        'iva_percent' => 0,
        'deposit_percent' => 50,
        'valid_until' => now()->addDays(15)->toDateString(),
        'items' => [
            ['description' => 'Instalación de puerta interior', 'unit' => 'unidad', 'quantity' => 2, 'unit_price_cents' => 4000],
        ],
        ...$overrides,
    ]);
}

test('a quote starts from the request with its items, suggestions and zone fee', function () {
    $zone = ServiceZone::query()->whereNotNull('travel_fee_cents')->firstOrFail();
    $door = CatalogItem::query()->where('slug', 'rapido-puerta-interior')->firstOrFail();
    $lock = CatalogItem::query()->where('slug', 'producto-chapa-pomo')->firstOrFail();
    $quoteRequest = QuoteRequest::query()->create([
        'name' => 'María López',
        'phone' => '0991234567',
        'service_zone_id' => $zone->id,
        'items' => [['catalog_item_id' => $door->id, 'name' => $door->name, 'unit' => 'unidad', 'quantity' => 2]],
        'accepted_suggestions' => [$lock->id],
    ]);

    $this->actingAs($this->admin)
        ->get(route('admin.quotes.create', ['solicitud' => $quoteRequest->id]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/quote-builder')
            ->where('quote.quote_request_id', $quoteRequest->id)
            ->where('quote.travel_fee_cents', $zone->travel_fee_cents)
            ->where('quote.items.0.catalog_item_id', $door->id)
            ->where('quote.items.0.quantity', 2)
            ->where('quote.items.0.unit_price_cents', $door->price_min_cents)
            ->where('quote.items.1.catalog_item_id', $lock->id)
            ->where('request.reference', $quoteRequest->reference)
            ->where('meta', null));
});

test('saving a quote recalculates totals on the server and marks the request quoted', function () {
    $partner = Partner::query()->create(['name' => 'Marmolería Sur', 'trade' => 'Marmolería', 'commission_percent' => 12]);
    $countertop = CatalogItem::query()->where('slug', 'aliado-meson-cuarzo')->firstOrFail();
    $countertop->update(['partner_id' => $partner->id]);
    $quoteRequest = QuoteRequest::query()->create(['name' => 'Ana', 'phone' => '0990000000']);

    $response = $this->actingAs($this->admin)->post(route('admin.quotes.store'), [
        'quote_request_id' => $quoteRequest->id,
        'client_name' => 'Ana',
        'travel_fee_cents' => 500,
        'visit_fee_cents' => 0,
        'discount_cents' => 1000,
        'iva_percent' => 15,
        'deposit_percent' => 50,
        'total_cents' => 1,
        'items' => [
            ['catalog_item_id' => $countertop->id, 'description' => 'Mesón de cuarzo', 'unit' => 'metro_lineal', 'quantity' => 2, 'unit_price_cents' => 20000],
            ['description' => 'Recargo urgencia', 'unit' => 'porcentaje', 'quantity' => 10, 'unit_price_cents' => 0],
        ],
    ]);

    $quote = Quote::query()->with('items')->firstOrFail();
    $response->assertRedirect(route('admin.quotes.edit', $quote));

    // items 40000 + 10% 4000 + travel 500 - discount 1000 = 43500; IVA 6525; total 50025.
    expect($quote)
        ->status->toBe('borrador')
        ->subtotal_cents->toBe(43500)
        ->iva_cents->toBe(6525)
        ->total_cents->toBe(50025)
        ->deposit_cents->toBe(25013)
        ->and($quote->items[0])->partner_id->toBe($partner->id)->commission_percent->toBe(12.0)
        ->and($quote->items[1]->total_cents)->toBe(4000)
        ->and($quoteRequest->fresh()->status)->toBe('cotizado');
});

test('quote admin is only for admins', function () {
    $user = User::factory()->create();
    $quote = draftQuote();

    $this->actingAs($user)->get(route('admin.quotes.index'))->assertForbidden();
    $this->actingAs($user)->get(route('admin.quotes.create'))->assertForbidden();
    $this->actingAs($user)->post(route('admin.quotes.paid', $quote), ['paid_amount_cents' => 100, 'payment_method' => 'deuna'])->assertForbidden();
});

test('admin can send, duplicate and mark a quote paid', function () {
    $quoteRequest = QuoteRequest::query()->create(['name' => 'María', 'phone' => '0991234567']);
    $quote = draftQuote(['quote_request_id' => $quoteRequest->id]);

    $this->actingAs($this->admin)
        ->get(route('admin.quotes.edit', $quote))
        ->assertInertia(fn (Assert $page) => $page
            ->where('meta.number', $quote->number)
            ->where('meta.send_href', fn (string $href) => str_starts_with($href, 'https://wa.me/593991234567?text=')
                && str_contains(rawurldecode($href), $quote->publicUrl())));

    $this->actingAs($this->admin)->post(route('admin.quotes.sent', $quote));
    expect($quote->fresh())->status->toBe('enviada')->sent_at->not->toBeNull();

    $this->actingAs($this->admin)->post(route('admin.quotes.duplicate', $quote))->assertRedirect();
    $copy = Quote::query()->latest('id')->firstOrFail();
    expect($copy)
        ->id->not->toBe($quote->id)
        ->status->toBe('borrador')
        ->token->not->toBe($quote->token)
        ->number->not->toBe($quote->number)
        ->and($copy->items()->count())->toBe(1);

    $this->actingAs($this->admin)
        ->post(route('admin.quotes.paid', $quote), ['paid_amount_cents' => 4250, 'payment_method' => 'deuna'])
        ->assertSessionHasNoErrors();

    expect($quote->fresh())
        ->status->toBe('pagada')
        ->paid_amount_cents->toBe(4250)
        ->payment_method->toBe('deuna')
        ->and($quoteRequest->fresh()->status)->toBe('cerrado');

    $this->actingAs($this->admin)
        ->put(route('admin.quotes.update', $quote), [
            'client_name' => 'Cambio',
            'travel_fee_cents' => 0,
            'visit_fee_cents' => 0,
            'discount_cents' => 0,
            'iva_percent' => 0,
            'deposit_percent' => 50,
            'items' => [['description' => 'X', 'unit' => 'unidad', 'quantity' => 1, 'unit_price_cents' => 1]],
        ])
        ->assertSessionHasErrors('quote');

    expect($quote->fresh()->client_name)->toBe('María López');
});

test('the client page records the first visit but not admin previews', function () {
    $quote = draftQuote();
    $quote->update(['status' => 'enviada']);

    $this->actingAs($this->admin)->get($quote->publicUrl())->assertOk();
    expect($quote->fresh()->viewed_at)->toBeNull();

    auth()->logout();

    $response = $this->get($quote->publicUrl())
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('quote/show')
            ->where('quote.number', $quote->number)
            ->where('quote.total_cents', 8500)
            ->where('quote.deposit_cents', 4250)
            ->where('seo.robots', 'noindex,nofollow'));

    expect(json_encode($response->viewData('page')['props']))
        ->not->toContain('commission')
        ->not->toContain('partner')
        ->not->toContain('cost');

    expect($quote->fresh())->status->toBe('vista')->viewed_at->not->toBeNull();
});

test('a client can accept a quote and report the deposit payment', function () {
    $quoteRequest = QuoteRequest::query()->create(['name' => 'María', 'phone' => '0991234567']);
    $quote = draftQuote(['quote_request_id' => $quoteRequest->id]);

    $this->post(route('quotes.public.payment', $quote->token))->assertStatus(422);

    $this->post(route('quotes.public.accept', $quote->token))->assertSessionHasNoErrors();
    expect($quote->fresh())->status->toBe('aceptada')->accepted_at->not->toBeNull()
        ->and($quoteRequest->fresh()->status)->toBe('cerrado');

    $this->post(route('quotes.public.payment', $quote->token))->assertRedirect();
    expect($quote->fresh()->payment_reported_at)->not->toBeNull();

    $this->get($quote->publicUrl())
        ->assertInertia(fn (Assert $page) => $page
            ->where('quote.accepted', true)
            ->where('quote.payment_reported', true)
            ->where('whatsapp.paid_href', fn (string $href) => str_contains(rawurldecode($href), $quote->number)));
});

test('an expired quote cannot be accepted', function () {
    $quote = draftQuote(['valid_until' => now()->subDay()->toDateString()]);

    $this->get($quote->publicUrl())->assertInertia(fn (Assert $page) => $page->where('quote.expired', true));

    $this->post(route('quotes.public.accept', $quote->token))->assertSessionHasErrors('quote');
    expect($quote->fresh()->accepted_at)->toBeNull();
});

test('unknown quote links return 404 and actions are rate limited', function () {
    $this->get('/cotizacion/'.str_repeat('a', 48))->assertNotFound();

    $quote = draftQuote();

    foreach (range(1, 10) as $attempt) {
        $this->post(route('quotes.public.accept', $quote->token));
    }

    $this->post(route('quotes.public.accept', $quote->token))->assertTooManyRequests();
});
