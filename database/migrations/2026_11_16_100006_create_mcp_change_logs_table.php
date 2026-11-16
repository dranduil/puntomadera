<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mcp_change_logs', function (Blueprint $table) {
            $table->id();
            $table->string('tool', 80);
            $table->json('arguments')->nullable();
            $table->string('summary', 500);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mcp_change_logs');
    }
};
