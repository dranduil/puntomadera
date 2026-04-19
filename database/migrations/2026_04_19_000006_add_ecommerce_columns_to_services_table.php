<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->string('sku')->nullable()->unique()->after('slug');
            $table->unsignedInteger('price_cents')->default(0)->after('default_message');
            $table->string('currency', 3)->default('USD')->after('price_cents');
            $table->unsignedInteger('stock_qty')->default(0)->after('currency');
            $table->string('image_path')->nullable()->after('stock_qty');
            $table->boolean('is_featured')->default(false)->after('image_path');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropUnique(['sku']);
            $table->dropColumn([
                'sku',
                'price_cents',
                'currency',
                'stock_qty',
                'image_path',
                'is_featured',
            ]);
        });
    }
};
