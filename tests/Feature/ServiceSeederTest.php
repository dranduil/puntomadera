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
