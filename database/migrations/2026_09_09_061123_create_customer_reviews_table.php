<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('customer_reviews', function (Blueprint $table) {
            $table->id();
            $table->string('name', 80);
            $table->string('location', 100)->nullable();
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('message');
            $table->json('photos')->nullable();
            $table->boolean('consent_to_publish')->default(false);
            $table->string('status')->default('pending');
            $table->timestamp('published_at')->nullable();
            $table->text('admin_notes')->nullable();
            $table->index(['status', 'published_at']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_reviews');
    }
};
