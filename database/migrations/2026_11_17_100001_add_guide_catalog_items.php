<?php

use Database\Seeders\CatalogSeeder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Adds the catalog items behind the humidity, comején and security guides to
 * a catalog that is already live. A brand-new site gets them from the initial
 * catalog seed instead. Existing rows and prices are never touched.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::table('catalog_items')->exists()) {
            (new CatalogSeeder)->addItems(CatalogSeeder::GUIDE_ITEMS);
        }
    }

    public function down(): void
    {
        // Catalog rows are business data; rolling back leaves them in place.
    }
};
