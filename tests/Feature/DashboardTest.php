<?php

use App\Models\CatalogItem;
use App\Models\Partner;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\User;
use App\Support\QuoteBuilder;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\ServiceSeeder;
use Inertia\Testing\AssertableInertia as Assert;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('admins see this month\'s money numbers on the dashboard', function () {
    $this->seed([ServiceSeeder::class, CatalogSeeder::class]);
    $admin = User::factory()->create(['is_admin' => true]);
    $partner = Partner::query()->create(['name' => 'Marmolería Sur', 'trade' => 'Marmolería', 'commission_percent' => 10]);
    $countertop = CatalogItem::query()->where('slug', 'aliado-meson-granito')->firstOrFail();
    $countertop->update(['partner_id' => $partner->id]);

    QuoteRequest::query()->create(['name' => 'Ana', 'phone' => '0990000000', 'utm_source' => 'facebook']);
    QuoteRequest::query()->create(['name' => 'Luis', 'phone' => '0990000001', 'status' => 'cotizado']);

    $quote = QuoteBuilder::save(new Quote, [
        'client_name' => 'Ana',
        'travel_fee_cents' => 0,
        'iva_percent' => 0,
        'deposit_percent' => 50,
        'items' => [
            ['catalog_item_id' => $countertop->id, 'description' => 'Mesón', 'unit' => 'metro_lineal', 'quantity' => 2, 'unit_price_cents' => 15000],
        ],
    ]);
    $quote->update([
        'status' => 'aceptada',
        'sent_at' => now(),
        'viewed_at' => now(),
        'accepted_at' => now(),
        'payment_reported_at' => now(),
    ]);

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('metrics.requests', 2)
            ->where('metrics.quotes_sent', 1)
            ->where('metrics.quotes_accepted', 1)
            ->where('metrics.close_rate_percent', 100)
            ->where('metrics.accepted_cents', 30000)
            ->where('metrics.commissions_owed_cents', 3000)
            ->where('metrics.pending_requests', 1)
            ->where('metrics.leads_by_source.facebook', 1)
            ->where('month', now()->format('Y-m'))
            ->has('months', 6)
            ->where('newRequests.0.name', 'Ana')
            ->where('paymentsToConfirm.0.number', $quote->number)
            ->where('commissions.0.partner', 'Marmolería Sur'));

    $this->actingAs($admin)
        ->get(route('dashboard', ['mes' => now()->subMonth()->format('Y-m')]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('month', now()->subMonth()->format('Y-m'))
            ->where('metrics.requests', 0));

    $this->actingAs($admin)
        ->get(route('dashboard', ['mes' => '1999-01']))
        ->assertInertia(fn (Assert $page) => $page->where('month', now()->format('Y-m')));
});

test('non-admin accounts do not see business numbers', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('metrics', null)->missing('commissions'));
});
