<?php

use App\Models\CatalogItem;
use App\Models\HomeLanding;
use App\Models\Partner;
use App\Models\Quote;
use App\Models\ServiceZone;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

function catalogItem(array $attributes = []): CatalogItem
{
    return CatalogItem::query()->create([
        'kind' => 'servicio',
        'name' => 'Instalación de puerta',
        'slug' => 'instalacion-de-puerta-'.uniqid(),
        'unit' => 'unidad',
        'price_min_cents' => 4000,
        'price_max_cents' => 6000,
        'cost_cents' => 1000,
        ...$attributes,
    ]);
}

test('quote admin pages are only for admins', function (string $routeName) {
    $this->get(route($routeName))->assertRedirect(route('login'));

    $this->actingAs(User::factory()->create())
        ->get(route($routeName))
        ->assertForbidden();

    $this->actingAs(User::factory()->create(['is_admin' => true]))
        ->get(route($routeName))
        ->assertOk();
})->with([
    'admin.catalog.index',
    'admin.zones.index',
    'admin.partners.index',
    'admin.quote-settings.edit',
]);

test('non admins cannot change catalog prices', function () {
    $item = catalogItem();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.catalog.adjust'), ['percent' => 10])
        ->assertForbidden();

    $this->actingAs(User::factory()->create())
        ->patch(route('admin.catalog.update', $item), ['name' => 'X'])
        ->assertForbidden();

    expect($item->fresh()->price_min_cents)->toBe(4000);
});

test('admin can create and update catalog items with dollar prices', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $partner = Partner::query()->create(['name' => 'Marmolería Sur', 'trade' => 'Marmolería']);

    $this->actingAs($admin)
        ->post(route('admin.catalog.store'), [
            'kind' => 'aliado',
            'partner_id' => (string) $partner->id,
            'service_id' => 'none',
            'name' => 'Mesón de cuarzo',
            'unit' => 'metro_lineal',
            'price_min' => '$180,50',
            'price_max' => '250',
            'cost' => '',
            'includes_material' => '1',
            'is_public' => '1',
            'is_active' => '1',
        ])
        ->assertRedirect()
        ->assertSessionHas('status', 'Ítem creado.');

    $item = CatalogItem::query()->where('slug', 'meson-de-cuarzo')->firstOrFail();

    expect($item->price_min_cents)->toBe(18050)
        ->and($item->price_max_cents)->toBe(25000)
        ->and($item->cost_cents)->toBeNull()
        ->and($item->partner_id)->toBe($partner->id)
        ->and($item->service_id)->toBeNull();

    $this->actingAs($admin)
        ->patch(route('admin.catalog.update', $item), [
            'kind' => 'aliado',
            'partner_id' => (string) $partner->id,
            'name' => 'Mesón de cuarzo blanco',
            'unit' => 'porcentaje',
            'price_min' => '15',
            'includes_material' => '0',
            'is_public' => '0',
            'is_active' => '1',
        ])
        ->assertSessionHasNoErrors();

    expect($item->fresh())
        ->name->toBe('Mesón de cuarzo blanco')
        ->price_min_cents->toBe(15)
        ->is_public->toBeFalse();
});

test('catalog price ranges must be in order', function () {
    $this->actingAs(User::factory()->create(['is_admin' => true]))
        ->post(route('admin.catalog.store'), [
            'kind' => 'servicio',
            'name' => 'Closet',
            'unit' => 'metro_lineal',
            'price_min' => '200',
            'price_max' => '100',
            'includes_material' => '1',
            'is_public' => '1',
            'is_active' => '1',
        ])
        ->assertSessionHasErrors('price_max');
});

test('admin can raise prices in bulk without touching percentage or unpriced items', function () {
    $priced = catalogItem();
    $percent = catalogItem(['name' => 'Recargo urgencia', 'unit' => 'porcentaje', 'price_min_cents' => 30, 'price_max_cents' => null, 'cost_cents' => null]);
    $unpriced = catalogItem(['name' => 'Chapa digital', 'kind' => 'producto', 'price_min_cents' => 0, 'price_max_cents' => null, 'cost_cents' => null]);

    $this->actingAs(User::factory()->create(['is_admin' => true]))
        ->post(route('admin.catalog.adjust'), ['percent' => 10])
        ->assertSessionHas('status', 'Precios ajustados 10% en 1 ítems.');

    expect($priced->fresh())
        ->price_min_cents->toBe(4400)
        ->price_max_cents->toBe(6600)
        ->cost_cents->toBe(1100)
        ->and($percent->fresh()->price_min_cents)->toBe(30)
        ->and($unpriced->fresh()->price_min_cents)->toBe(0);
});

test('admin can link and unlink suggestions but not to the same item', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $door = catalogItem();
    $lock = catalogItem(['name' => 'Chapa', 'kind' => 'producto']);

    $this->actingAs($admin)
        ->post(route('admin.catalog.suggestions.store', $door), ['suggested_item_id' => $door->id])
        ->assertSessionHasErrors('suggested_item_id');

    $this->actingAs($admin)
        ->post(route('admin.catalog.suggestions.store', $door), ['suggested_item_id' => $lock->id, 'reason' => 'Completa tu puerta'])
        ->assertSessionHasNoErrors();

    expect($door->suggestions()->pluck('catalog_items.id')->all())->toBe([$lock->id]);

    $this->actingAs($admin)
        ->delete(route('admin.catalog.suggestions.destroy', ['item' => $door, 'suggested' => $lock]))
        ->assertSessionHasNoErrors();

    expect($door->suggestions()->count())->toBe(0);
});

test('admin can save zones with fees and neighborhoods', function () {
    $this->actingAs(User::factory()->create(['is_admin' => true]))
        ->post(route('admin.zones.store'), [
            'name' => 'Zona Sur',
            'neighborhoods' => "Guasmo, Floresta\nCentenario",
            'travel_fee' => '5',
            'visit_fee' => '',
            'sort_order' => '1',
            'is_active' => '1',
        ])
        ->assertSessionHasNoErrors();

    expect(ServiceZone::query()->firstOrFail())
        ->neighborhoods->toBe(['Guasmo', 'Floresta', 'Centenario'])
        ->travel_fee_cents->toBe(500)
        ->visit_fee_cents->toBeNull();
});

test('partners page shows commission owed on accepted quotes only', function () {
    $partner = Partner::query()->create(['name' => 'Vidriería Norte', 'trade' => 'Vidrio', 'commission_percent' => 10]);

    foreach (['aceptada' => 30000, 'borrador' => 50000] as $status => $amount) {
        $quote = Quote::query()->create(['client_name' => 'Cliente', 'status' => $status]);
        $quote->items()->create([
            'partner_id' => $partner->id,
            'description' => 'Mampara',
            'unit' => 'unidad',
            'quantity' => 1,
            'unit_price_cents' => $amount,
            'total_cents' => $amount,
            'commission_percent' => 10,
        ]);
    }

    $this->actingAs(User::factory()->create(['is_admin' => true]))
        ->get(route('admin.partners.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/partners')
            ->has('commissions', 1)
            ->where('commissions.0.sales_cents', 30000)
            ->where('commissions.0.commission_cents', 3000));
});

test('admin can save quote settings and upload a public Deuna QR', function () {
    Storage::fake('local');
    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->post(route('admin.quote-settings.update'), [
            'quote_terms' => 'Precios pueden cambiar.',
            'quote_validity_days' => '10',
            'deposit_percent' => '40',
            'iva_enabled' => '1',
            'deuna_payment_link' => 'https://pagar.deuna.app/ejemplo',
            'bank_transfer_details' => 'Banco Pichincha, ahorros',
            'deuna_qr' => UploadedFile::fake()->image('qr.png', 300, 300),
            'remove_deuna_qr' => '0',
        ])
        ->assertSessionHasNoErrors();

    $landing = HomeLanding::query()->firstOrFail();

    expect($landing)
        ->quote_validity_days->toBe(10)
        ->deposit_percent->toBe(40)
        ->iva_enabled->toBeTrue()
        ->deuna_qr_path->not->toBeNull();

    Storage::disk('local')->assertExists($landing->deuna_qr_path);
    $this->get(route('quote-settings.qr'))->assertOk();

    $this->actingAs($admin)
        ->post(route('admin.quote-settings.update'), [
            'quote_validity_days' => '10',
            'deposit_percent' => '40',
            'iva_enabled' => '0',
            'deuna_payment_link' => 'http://inseguro.test',
        ])
        ->assertSessionHasErrors('deuna_payment_link');

    $this->actingAs($admin)
        ->post(route('admin.quote-settings.update'), [
            'quote_validity_days' => '10',
            'deposit_percent' => '40',
            'iva_enabled' => '0',
            'remove_deuna_qr' => '1',
        ])
        ->assertSessionHasNoErrors();

    Storage::disk('local')->assertMissing($landing->deuna_qr_path);
    $this->get(route('quote-settings.qr'))->assertNotFound();
});
