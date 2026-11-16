<?php

use Database\Seeders\CatalogSeeder;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Production only runs migrations on deploy, so the starting price list is
 * loaded here. It runs once: only on a site that already has its services and
 * an empty catalog, so prices edited in the admin are never overwritten.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (DB::table('services')->exists() && ! DB::table('catalog_items')->exists()) {
            (new CatalogSeeder)->run();
        }
    }

    public function down(): void
    {
        // Catalog rows are business data; rolling back leaves them in place.
    }
};
