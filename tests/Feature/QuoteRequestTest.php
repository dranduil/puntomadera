<?php

use App\Models\CatalogItem;
use App\Models\Partner;
use App\Models\QuoteRequest;
use App\Models\ServiceZone;
use App\Models\User;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\ServiceSeeder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed([ServiceSeeder::class, CatalogSeeder::class]);
});

function quoteCaptcha(string $answer = '7'): array
{
    return [
        'quote_captcha' => [
            'question' => '¿Cuánto es 3 + 4?',
            'answer' => hash('sha256', $answer),
            'expires_at' => now()->addMinutes(5)->timestamp,
        ],
    ];
}

function validQuoteRequest(array $overrides = []): array
{
    $door = CatalogItem::query()->where('slug', 'rapido-puerta-interior')->firstOrFail();

    return [
        'type' => 'cliente',
        'services' => [$door->service_id],
        'items' => [['catalog_item_id' => $door->id, 'quantity' => 2]],
        'accepted_suggestions' => [CatalogItem::query()->where('slug', 'producto-chapa-pomo')->value('id')],
        'message' => 'Dos puertas de dormitorio.',
        'service_zone_id' => ServiceZone::query()->value('id'),
        'sector' => 'Sauces 8',
        'name' => 'María López',
        'phone' => '0991234567',
        'captcha_answer' => '7',
        ...$overrides,
    ];
}

test('the quote form shows the public catalog without any price', function () {
    $response = $this->get('/cotizar?item=material-puerta-mdf')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('quote/request')
            ->has('services')
            ->has('zones', 5)
            ->has('packages', 3)
            ->where('prefill.item_ids', [CatalogItem::query()->where('slug', 'material-puerta-mdf')->value('id')])
            ->where('prefill.type', 'cliente'));

    $props = json_encode($response->viewData('page')['props']);

    expect($props)
        ->not->toContain('price')
        ->not->toContain('cost')
        ->not->toContain('fee_cents')
        ->not->toContain('partner')
        ->not->toContain('cargo-minimo-visita');
});

test('package and business links prefill the form type', function () {
    $this->get('/cotizar?paquete=cocina')
        ->assertInertia(fn (Assert $page) => $page
            ->where('prefill.type', 'casa_nueva')
            ->where('prefill.package', 'cocina'));

    $this->get('/cotizar?tipo=empresa')
        ->assertInertia(fn (Assert $page) => $page->where('prefill.type', 'empresa'));
});

test('a visitor can send a quote request with photos and campaign attribution', function () {
    Storage::fake('local');

    $this->get('/instalacion-puertas-guayaquil?utm_source=facebook&utm_campaign=puertas-nov');

    $response = $this->withSession(quoteCaptcha())->post(route('quote-requests.store'), validQuoteRequest([
        'photos' => [UploadedFile::fake()->image('puerta.jpg', 1200, 900)],
    ]));

    $quoteRequest = QuoteRequest::query()->firstOrFail();

    $response->assertRedirect(route('quote-requests.sent', $quoteRequest->reference));

    expect($quoteRequest)
        ->reference->toStartWith('PM-')
        ->status->toBe('nuevo')
        ->utm_source->toBe('facebook')
        ->utm_campaign->toBe('puertas-nov')
        ->source_path->toBe('/instalacion-puertas-guayaquil')
        ->and($quoteRequest->items[0])->toMatchArray(['name' => 'Instalación de puerta interior', 'quantity' => 2])
        ->and($quoteRequest->photos)->toHaveCount(1);

    Storage::disk('local')->assertExists($quoteRequest->photos[0]);

    $this->get(route('quote-requests.sent', $quoteRequest->reference))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('quote/sent')
            ->where('reference', $quoteRequest->reference)
            ->where('trackLead', true)
            ->where('whatsappHref', fn (string $href) => str_contains($href, 'wa.me/')
                && str_contains(rawurldecode($href), $quoteRequest->reference)
                && str_contains(rawurldecode($href), 'Instalación de puerta interior — 2 unidades')));

    $this->get(route('quote-requests.sent', $quoteRequest->reference))
        ->assertInertia(fn (Assert $page) => $page->where('trackLead', false));
});

test('the confirmation page is only shown to the visitor who sent it', function () {
    $quoteRequest = QuoteRequest::query()->create(['name' => 'Otra persona', 'phone' => '0990000000']);

    $this->get(route('quote-requests.sent', $quoteRequest->reference))
        ->assertRedirect(route('quote-requests.create'));
});

test('quote requests reject hidden items, empty choices and a wrong captcha', function () {
    $hidden = CatalogItem::query()->where('slug', 'cargo-minimo-visita')->firstOrFail();

    $this->withSession(quoteCaptcha())
        ->post(route('quote-requests.store'), validQuoteRequest([
            'items' => [['catalog_item_id' => $hidden->id, 'quantity' => 1]],
        ]))
        ->assertSessionHasErrors('items.0.catalog_item_id');

    $this->withSession(quoteCaptcha())
        ->post(route('quote-requests.store'), validQuoteRequest([
            'services' => [],
            'items' => [],
            'accepted_suggestions' => [],
        ]))
        ->assertSessionHasErrors(['services' => 'Elige al menos un servicio o trabajo.']);

    $this->withSession(quoteCaptcha('8'))
        ->post(route('quote-requests.store'), validQuoteRequest())
        ->assertSessionHasErrors('captcha_answer');

    expect(QuoteRequest::query()->count())->toBe(0);
});

test('the review captcha cannot be reused for a quote request', function () {
    $this->withSession(['review_captcha' => quoteCaptcha()['quote_captcha']])
        ->post(route('quote-requests.store'), validQuoteRequest())
        ->assertSessionHasErrors('captcha_answer');
});

test('business requests need a company name', function () {
    $this->withSession(quoteCaptcha())
        ->post(route('quote-requests.store'), validQuoteRequest(['type' => 'empresa', 'company' => '']))
        ->assertSessionHasErrors('company');

    $this->withSession(quoteCaptcha())
        ->post(route('quote-requests.store'), validQuoteRequest(['type' => 'empresa', 'company' => 'Suites del Río', 'properties_count' => 8]))
        ->assertSessionHasNoErrors();

    expect(QuoteRequest::query()->firstOrFail())
        ->company->toBe('Suites del Río')
        ->properties_count->toBe(8);
});

test('admins see quote requests in the inbox and can refer them to a partner', function () {
    Storage::fake('local');
    $admin = User::factory()->create(['is_admin' => true]);
    $partner = Partner::query()->create(['name' => 'Marmolería Sur', 'trade' => 'Marmolería']);
    $quoteRequest = QuoteRequest::query()->create([
        'name' => 'María López',
        'phone' => '0991234567',
        'items' => [['catalog_item_id' => 1, 'name' => 'Mesón de cuarzo instalado', 'unit' => 'metro_lineal', 'quantity' => 3]],
        'photos' => [UploadedFile::fake()->image('cocina.jpg')->store('quote-requests/1', 'local')],
    ]);

    $this->actingAs(User::factory()->create())->get(route('admin.quote-requests.index'))->assertForbidden();
    $this->actingAs(User::factory()->create())->get(route('admin.quote-requests.photo', [$quoteRequest, 0]))->assertForbidden();

    $this->actingAs($admin)
        ->get(route('admin.quote-requests.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/quote-requests')
            ->where('requests.data.0.reference', $quoteRequest->reference)
            ->where('requests.data.0.summary', ['• Mesón de cuarzo instalado — 3 m lineales'])
            ->where('requests.data.0.whatsapp_href', fn (string $href) => str_starts_with($href, 'https://wa.me/593991234567'))
            ->where('counts.nuevo', 1));

    $this->actingAs($admin)->get(route('admin.quote-requests.photo', [$quoteRequest, 0]))->assertOk();

    $this->actingAs($admin)
        ->patch(route('admin.quote-requests.update', $quoteRequest), ['status' => 'derivado', 'referred_partner_id' => ''])
        ->assertSessionHasErrors('referred_partner_id');

    $this->actingAs($admin)
        ->patch(route('admin.quote-requests.update', $quoteRequest), ['status' => 'derivado', 'referred_partner_id' => $partner->id, 'admin_notes' => 'Le pasé el contacto.'])
        ->assertSessionHasNoErrors();

    expect($quoteRequest->fresh())
        ->status->toBe('derivado')
        ->referred_partner_id->toBe($partner->id);
});

test('the sitemap lists the quote form', function () {
    $this->get(route('sitemap'))
        ->assertOk()
        ->assertSee('/cotizar</loc>', false);
});
