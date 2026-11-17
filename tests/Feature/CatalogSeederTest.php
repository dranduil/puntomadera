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

test('the guide migration adds the new items to a live catalog without undoing admin edits', function () {
    $this->seed(ServiceSeeder::class);
    $this->seed(CatalogSeeder::class);

    // A catalog seeded before the guides existed, then edited in the admin.
    CatalogItem::whereIn('slug', CatalogSeeder::GUIDE_ITEMS)->get()->each->delete();
    $closet = CatalogItem::where('slug', 'material-closet-batiente')->first();
    $closet->update(['price_min_cents' => 25000]);
    $closet->suggestions()->detach();

    $migration = require database_path('migrations/2026_11_17_100001_add_guide_catalog_items.php');
    $migration->up();
    $links = DB::table('catalog_item_suggestions')->count();
    $migration->up();

    expect(CatalogItem::whereIn('slug', CatalogSeeder::GUIDE_ITEMS)->count())->toBe(4)
        ->and(CatalogItem::where('slug', 'producto-puerta-wpc')->first()->is_active)->toBeFalse()
        ->and($closet->fresh()->price_min_cents)->toBe(25000)
        ->and($closet->suggestions()->pluck('slug')->all())->toBe(['material-extra-melamina-rh'])
        ->and(DB::table('catalog_item_suggestions')->count())->toBe($links);
});

test('the guide migration leaves an empty catalog to the initial seed', function () {
    $this->seed(ServiceSeeder::class);

    $migration = require database_path('migrations/2026_11_17_100001_add_guide_catalog_items.php');
    $migration->up();

    expect(CatalogItem::count())->toBe(0);
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
