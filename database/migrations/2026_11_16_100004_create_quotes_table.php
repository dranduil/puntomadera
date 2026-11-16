<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
            $table->string('number', 30)->nullable()->unique();
            $table->string('token', 64)->unique();
            $table->foreignId('quote_request_id')->nullable()->constrained('quote_requests', indexName: 'quotes_request_fk')->nullOnDelete();
            $table->string('client_name');
            $table->string('client_phone', 30)->nullable();
            $table->foreignId('service_zone_id')->nullable()->constrained('service_zones', indexName: 'quotes_zone_fk')->nullOnDelete();
            $table->unsignedInteger('travel_fee_cents')->default(0);
            $table->unsignedInteger('visit_fee_cents')->default(0);
            $table->unsignedInteger('discount_cents')->default(0);
            $table->unsignedTinyInteger('iva_percent')->default(0);
            $table->unsignedInteger('subtotal_cents')->default(0);
            $table->unsignedInteger('iva_cents')->default(0);
            $table->unsignedInteger('total_cents')->default(0);
            $table->unsignedTinyInteger('deposit_percent')->default(50);
            $table->unsignedInteger('deposit_cents')->default(0);
            $table->date('valid_until')->nullable();
            $table->text('notes')->nullable();
            $table->text('terms')->nullable();
            $table->string('payment_link')->nullable();
            $table->string('status', 20)->default('borrador');
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('accepted_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamp('payment_reported_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->unsignedInteger('paid_amount_cents')->nullable();
            $table->string('payment_method', 30)->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at'], 'quotes_status_idx');
        });

        Schema::create('quote_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('quote_id')->constrained('quotes', indexName: 'quote_items_quote_fk')->cascadeOnDelete();
            $table->foreignId('catalog_item_id')->nullable()->constrained('catalog_items', indexName: 'quote_items_catalog_fk')->nullOnDelete();
            $table->foreignId('partner_id')->nullable()->constrained('partners', indexName: 'quote_items_partner_fk')->nullOnDelete();
            $table->string('description');
            $table->string('unit', 20)->default('unidad');
            $table->decimal('quantity', 8, 2)->default(1);
            $table->unsignedInteger('unit_price_cents')->default(0);
            $table->unsignedInteger('total_cents')->default(0);
            $table->decimal('commission_percent', 5, 2)->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_items');
        Schema::dropIfExists('quotes');
    }
};
