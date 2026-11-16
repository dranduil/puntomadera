<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quote_requests', function (Blueprint $table) {
            $table->id();
            $table->string('reference', 30)->nullable()->unique();
            $table->string('type', 20)->default('cliente');
            $table->string('package', 60)->nullable();
            $table->string('name');
            $table->string('phone', 30);
            $table->string('email')->nullable();
            $table->string('company')->nullable();
            $table->unsignedInteger('properties_count')->nullable();
            $table->foreignId('service_zone_id')->nullable()->constrained('service_zones', indexName: 'quote_requests_zone_fk')->nullOnDelete();
            $table->string('sector')->nullable();
            $table->text('message')->nullable();
            $table->json('services')->nullable();
            $table->json('items')->nullable();
            $table->json('accepted_suggestions')->nullable();
            $table->json('photos')->nullable();
            $table->string('source_path')->nullable();
            $table->string('utm_source', 100)->nullable();
            $table->string('utm_medium', 100)->nullable();
            $table->string('utm_campaign', 100)->nullable();
            $table->string('status', 20)->default('nuevo');
            $table->foreignId('referred_partner_id')->nullable()->constrained('partners', indexName: 'quote_requests_partner_fk')->nullOnDelete();
            $table->text('admin_notes')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at'], 'quote_requests_status_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quote_requests');
    }
};
