<?php

use App\Mcp\Resources\BusinessContext;
use App\Mcp\Servers\PuntoMaderaServer;
use App\Mcp\Tools\AddSuggestion;
use App\Mcp\Tools\AdjustCatalogPrices;
use App\Mcp\Tools\BusinessSummary;
use App\Mcp\Tools\CreateQuoteDraft;
use App\Mcp\Tools\GetQuoteRequest;
use App\Mcp\Tools\ListCatalogItems;
use App\Mcp\Tools\MarkQuotePaid;
use App\Mcp\Tools\ModerateReview;
use App\Mcp\Tools\UpdateCatalogItem;
use App\Mcp\Tools\UpdateQuoteRequestStatus;
use App\Mcp\Tools\UpdateQuoteSettings;
use App\Mcp\Tools\UpdateZone;
use App\Models\CatalogItem;
use App\Models\CustomerReview;
use App\Models\HomeLanding;
use App\Models\McpChangeLog;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\ServiceZone;
use App\Models\User;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\ServiceSeeder;

beforeEach(function () {
    $this->seed([ServiceSeeder::class, CatalogSeeder::class]);
});

function mcpInitialize(): array
{
    return [
        'jsonrpc' => '2.0',
        'id' => 1,
        'method' => 'initialize',
        'params' => [
            'protocolVersion' => '2025-06-18',
            'capabilities' => [],
            'clientInfo' => ['name' => 'test', 'version' => '1.0'],
        ],
    ];
}

test('the MCP endpoint is off without a token and rejects a wrong one', function () {
    config(['services.mcp.token' => null]);
    $this->postJson('/mcp', mcpInitialize())->assertNotFound();

    config(['services.mcp.token' => 'secret-token-for-tests']);
    $this->postJson('/mcp', mcpInitialize())->assertUnauthorized();
    $this->postJson('/mcp', mcpInitialize(), ['Authorization' => 'Bearer wrong'])->assertUnauthorized();

    $this->postJson('/mcp', mcpInitialize(), ['Authorization' => 'Bearer secret-token-for-tests'])
        ->assertOk()
        ->assertJsonPath('result.serverInfo.name', 'Punto Madera');
});

test('read tools return catalog prices and request details', function () {
    PuntoMaderaServer::tool(ListCatalogItems::class, ['service' => 'instalacion-reparacion-puertas-madera-guayaquil'])
        ->assertOk()
        ->assertSee(['rapido-puerta-interior', '$35,00']);

    $quoteRequest = QuoteRequest::query()->create(['name' => 'María López', 'phone' => '0991234567', 'message' => 'Dos puertas']);

    PuntoMaderaServer::tool(GetQuoteRequest::class, ['request' => $quoteRequest->reference])
        ->assertOk()
        ->assertSee(['María López', 'Dos puertas']);

    PuntoMaderaServer::tool(GetQuoteRequest::class, ['request' => 'PM-0000-9999'])->assertHasErrors();

    PuntoMaderaServer::tool(BusinessSummary::class)->assertOk()->assertSee('"requests":1');

    PuntoMaderaServer::resource(BusinessContext::class)->assertOk()->assertSee(['Guasmo', 'porcentaje']);

    expect(McpChangeLog::query()->count())->toBe(0);
});

test('bulk price changes only preview unless dry_run is false', function () {
    $door = CatalogItem::query()->where('slug', 'rapido-puerta-interior')->firstOrFail();

    PuntoMaderaServer::tool(AdjustCatalogPrices::class, ['percent' => 10])
        ->assertOk()
        ->assertSee(['"dry_run":true', '$38,50']);

    expect($door->fresh()->price_min_cents)->toBe(3500)
        ->and(McpChangeLog::query()->count())->toBe(0);

    PuntoMaderaServer::tool(AdjustCatalogPrices::class, ['percent' => 10, 'dry_run' => false])->assertOk();

    expect($door->fresh()->price_min_cents)->toBe(3850)
        ->and(McpChangeLog::query()->sole()->tool)->toBe('adjust-catalog-prices');
});

test('catalog edits validate prices and are logged', function () {
    PuntoMaderaServer::tool(UpdateCatalogItem::class, ['item' => 'rapido-puerta-interior', 'price_min' => 50, 'price_max' => 40])
        ->assertHasErrors();

    PuntoMaderaServer::tool(UpdateCatalogItem::class, ['item' => 'rapido-puerta-interior', 'price_min' => 40, 'is_public' => false])
        ->assertOk();

    expect(CatalogItem::query()->where('slug', 'rapido-puerta-interior')->first())
        ->price_min_cents->toBe(4000)
        ->is_public->toBeFalse();

    PuntoMaderaServer::tool(AddSuggestion::class, ['item' => 'rapido-ajuste-puerta', 'suggested' => 'producto-bisagras-puerta', 'reason' => 'Bisagras nuevas'])
        ->assertOk();

    expect(McpChangeLog::query()->pluck('tool')->all())->toBe(['update-catalog-item', 'add-suggestion']);
});

test('a quote draft from the AI is never sent', function () {
    $zone = ServiceZone::query()->whereNotNull('travel_fee_cents')->firstOrFail();
    $door = CatalogItem::query()->where('slug', 'rapido-puerta-interior')->firstOrFail();
    $quoteRequest = QuoteRequest::query()->create([
        'name' => 'María López',
        'phone' => '0991234567',
        'service_zone_id' => $zone->id,
        'items' => [['catalog_item_id' => $door->id, 'name' => $door->name, 'unit' => 'unidad', 'quantity' => 2]],
    ]);

    PuntoMaderaServer::tool(CreateQuoteDraft::class, ['request' => $quoteRequest->reference, 'notes' => 'Incluye ajuste de marco.'])
        ->assertOk()
        ->assertSee(['borrador', 'Not sent']);

    $quote = Quote::query()->sole();

    expect($quote)
        ->status->toBe('borrador')
        ->sent_at->toBeNull()
        ->total_cents->toBe(7000 + $zone->travel_fee_cents)
        ->and($quoteRequest->fresh()->status)->toBe('cotizado')
        ->and(McpChangeLog::query()->sole()->tool)->toBe('create-quote-draft');

    PuntoMaderaServer::tool(CreateQuoteDraft::class, [
        'client_name' => 'Hotel Sur',
        'items' => [
            ['catalog_item' => 'rapido-ajuste-puerta', 'quantity' => 6, 'unit_price' => 18],
            ['catalog_item' => 'recargo-urgencia', 'quantity' => 30],
            ['description' => 'Retiro de escombros', 'quantity' => 1, 'unit_price' => 10],
        ],
    ])->assertOk();

    // Per-unit lines: 6 × $18 + $10 = $118; the 30% surcharge applies to all of them ($35.40) → $153.40.
    expect(Quote::query()->latest('id')->first()->total_cents)->toBe(15340);
});

test('status, payment, zone, settings and review tools change data and log it', function () {
    $quoteRequest = QuoteRequest::query()->create(['name' => 'Ana', 'phone' => '0990000000']);
    $quote = Quote::query()->create(['client_name' => 'Ana', 'status' => 'aceptada', 'quote_request_id' => $quoteRequest->id]);
    $zone = ServiceZone::query()->firstOrFail();
    $review = CustomerReview::query()->create(['name' => 'Luis', 'rating' => 5, 'message' => 'Muy buen trabajo con las puertas.', 'status' => CustomerReview::STATUS_PENDING]);

    PuntoMaderaServer::tool(UpdateQuoteRequestStatus::class, ['request' => $quoteRequest->reference, 'status' => 'derivado'])->assertHasErrors();
    PuntoMaderaServer::tool(UpdateQuoteRequestStatus::class, ['request' => $quoteRequest->reference, 'status' => 'perdido', 'admin_notes' => 'Eligió otro'])->assertOk();
    PuntoMaderaServer::tool(MarkQuotePaid::class, ['quote' => $quote->number, 'amount' => 120.5, 'method' => 'transferencia'])->assertOk();
    PuntoMaderaServer::tool(UpdateZone::class, ['zone' => $zone->id, 'travel_fee' => 7])->assertOk();
    PuntoMaderaServer::tool(UpdateQuoteSettings::class, ['deposit_percent' => 40, 'deuna_payment_link' => 'http://no-https.test'])->assertHasErrors();
    PuntoMaderaServer::tool(UpdateQuoteSettings::class, ['deposit_percent' => 40])->assertOk();
    PuntoMaderaServer::tool(ModerateReview::class, ['review' => $review->id, 'decision' => 'approve'])->assertOk();

    expect($quote->fresh())->status->toBe('pagada')->paid_amount_cents->toBe(12050)
        ->and($quoteRequest->fresh()->status)->toBe('cerrado')
        ->and($zone->fresh()->travel_fee_cents)->toBe(700)
        ->and(HomeLanding::query()->first()->deposit_percent)->toBe(40)
        ->and($review->fresh())->status->toBe(CustomerReview::STATUS_APPROVED)->published_at->not->toBeNull()
        ->and(McpChangeLog::query()->count())->toBe(5);
});

test('admins can read the AI change history', function () {
    McpChangeLog::record('update-zone', ['zone' => 1], 'Zona Sur: movilización $7,00.');

    $this->actingAs(User::factory()->create())->get(route('admin.ai-history.index'))->assertForbidden();

    $this->actingAs(User::factory()->create(['is_admin' => true]))
        ->get(route('admin.ai-history.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/ai-history')
            ->where('logs.data.0.summary', 'Zona Sur: movilización $7,00.'));
});
