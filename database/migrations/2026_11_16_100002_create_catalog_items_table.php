<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('catalog_items', function (Blueprint $table) {
            $table->id();
            $table->string('kind', 20);
            $table->foreignId('service_id')->nullable()->constrained('services', indexName: 'catalog_items_service_fk')->nullOnDelete();
            $table->foreignId('partner_id')->nullable()->constrained('partners', indexName: 'catalog_items_partner_fk')->nullOnDelete();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('unit', 20)->default('unidad');
            // For unit "porcentaje" these hold the percentage itself, not cents.
            $table->unsignedInteger('price_min_cents')->default(0);
            $table->unsignedInteger('price_max_cents')->nullable();
            $table->unsignedInteger('cost_cents')->nullable();
            $table->boolean('includes_material')->default(false);
            $table->string('image_path')->nullable();
            $table->boolean('is_public')->default(true);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'is_public', 'kind'], 'catalog_items_visibility_idx');
        });

        Schema::create('catalog_item_suggestions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_item_id')->constrained('catalog_items', indexName: 'catalog_suggestions_item_fk')->cascadeOnDelete();
            $table->foreignId('suggested_item_id')->constrained('catalog_items', indexName: 'catalog_suggestions_suggested_fk')->cascadeOnDelete();
            $table->string('reason')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->unique(['catalog_item_id', 'suggested_item_id'], 'catalog_suggestions_pair_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('catalog_item_suggestions');
        Schema::dropIfExists('catalog_items');
    }
};
