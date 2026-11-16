<?php

use App\Models\CatalogItem;
use App\Models\ServiceZone;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\ServiceSeeder;
use Illuminate\Support\Facades\DB;

test('catalog seeder links items to services and can run twice without duplicates', function () {
    $this->seed(ServiceSeeder::class);
    $this->seed(CatalogSeeder::class);

    $items = CatalogItem::count();
    $suggestions = DB::table('catalog_item_suggestions')->count();

    $this->seed(CatalogSeeder::class);

    expect(CatalogItem::count())->toBe($items)
        ->and(DB::table('catalog_item_suggestions')->count())->toBe($suggestions)
        ->and(ServiceZone::count())->toBe(5)
        ->and(CatalogItem::where('slug', 'material-closet-batiente')->first())
        ->service->slug->toBe('closets-anaqueles-cocina-guayaquil')
        ->price_min_cents->toBe(22000);
});

test('catalog seeder keeps prices edited in the admin', function () {
    $this->seed(ServiceSeeder::class);
    $this->seed(CatalogSeeder::class);
    CatalogItem::where('slug', 'rapido-puerta-interior')->update(['price_min_cents' => 4200]);

    $this->seed(CatalogSeeder::class);

    expect(CatalogItem::where('slug', 'rapido-puerta-interior')->value('price_min_cents'))->toBe(4200);
});

test('the initial catalog migration only seeds a site that has services and no catalog', function () {
    $migration = require database_path('migrations/2026_11_16_100007_seed_initial_catalog.php');

    $migration->up();
    expect(CatalogItem::count())->toBe(0);

    $this->seed(ServiceSeeder::class);
    $migration->up();
    $seeded = CatalogItem::count();
    expect($seeded)->toBeGreaterThan(30);

    CatalogItem::where('slug', 'rapido-marco')->delete();
    $migration->up();
    expect(CatalogItem::count())->toBe($seeded - 1);
});
