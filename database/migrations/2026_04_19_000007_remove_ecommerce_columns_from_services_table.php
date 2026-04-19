<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $columns = collect([
            'sku',
            'price_cents',
            'currency',
            'stock_qty',
            'image_path',
            'is_featured',
        ])->filter(fn (string $column) => Schema::hasColumn('services', $column))
            ->values()
            ->all();

        if ($columns === []) {
            return;
        }

        Schema::table('services', function (Blueprint $table) use ($columns) {
            $table->dropColumn($columns);
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            if (! Schema::hasColumn('services', 'sku')) {
                $table->string('sku')->nullable()->unique()->after('slug');
            }
            if (! Schema::hasColumn('services', 'price_cents')) {
                $table->unsignedInteger('price_cents')->default(0)->after('default_message');
            }
            if (! Schema::hasColumn('services', 'currency')) {
                $table->string('currency', 3)->default('USD')->after('price_cents');
            }
            if (! Schema::hasColumn('services', 'stock_qty')) {
                $table->unsignedInteger('stock_qty')->default(0)->after('currency');
            }
            if (! Schema::hasColumn('services', 'image_path')) {
                $table->string('image_path')->nullable()->after('stock_qty');
            }
            if (! Schema::hasColumn('services', 'is_featured')) {
                $table->boolean('is_featured')->default(false)->after('image_path');
            }
        });
    }
};
