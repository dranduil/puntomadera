<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('home_landings', function (Blueprint $table) {
            $table->text('quote_terms')->nullable();
            $table->unsignedSmallInteger('quote_validity_days')->default(15);
            $table->unsignedTinyInteger('deposit_percent')->default(50);
            $table->boolean('iva_enabled')->default(false);
            $table->string('deuna_payment_link')->nullable();
            $table->string('deuna_qr_path')->nullable();
            $table->text('bank_transfer_details')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('home_landings', function (Blueprint $table) {
            $table->dropColumn([
                'quote_terms',
                'quote_validity_days',
                'deposit_percent',
                'iva_enabled',
                'deuna_payment_link',
                'deuna_qr_path',
                'bank_transfer_details',
            ]);
        });
    }
};
