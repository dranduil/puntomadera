<?php

use App\Models\Service;
use Database\Seeders\ServiceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('service seeder creates the published services idempotently', function () {
    $this->seed(ServiceSeeder::class);

    expect(Service::query()->count())->toBe(6)
        ->and(Service::query()->where('is_published', true)->count())->toBe(6);

    $this->seed(ServiceSeeder::class);

    expect(Service::query()->count())->toBe(6);
});

test('accent migration fixes seeded copy but keeps admin edits', function () {
    $seeded = Service::query()->create([
        'name' => 'Instalacion y reparacion de puertas de madera',
        'slug' => 'instalacion-reparacion-puertas-madera-guayaquil',
        'summary' => 'Instalacion y reparacion de puertas de madera en Guayaquil: bisagras, marcos, cerraduras y ajustes de nivel.',
        'process_steps' => [
            'Diagnostico de puerta, marco y herrajes existentes.',
            'Ajuste o reemplazo de piezas necesarias.',
            'Instalacion final y prueba de apertura, cierre y seguridad.',
        ],
        'is_published' => true,
    ]);
    $edited = Service::query()->create([
        'name' => 'Muebles a medida en Guayaquil',
        'slug' => 'muebles-a-medida-guayaquil',
        'summary' => 'Texto editado desde el panel.',
        'is_published' => true,
    ]);

    $migration = require database_path('migrations/2026_11_16_000001_add_accents_to_seeded_service_copy.php');
    $migration->up();

    expect($seeded->fresh())
        ->name->toBe('Instalación y reparación de puertas de madera')
        ->summary->toStartWith('Instalación y reparación de puertas de madera en Guayaquil')
        ->process_steps->toContain('Diagnóstico de puerta, marco y herrajes existentes.')
        ->and($edited->fresh()->summary)->toBe('Texto editado desde el panel.');

    $migration->down();

    expect($seeded->fresh()->name)->toBe('Instalacion y reparacion de puertas de madera');
});
