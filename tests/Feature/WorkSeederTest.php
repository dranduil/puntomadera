<?php

use App\Models\Work;
use Database\Seeders\WorkSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('work seeder creates the published portfolio idempotently', function () {
    $this->seed(WorkSeeder::class);

    expect(Work::query()->count())->toBe(4)
        ->and(Work::query()->where('is_published', true)->count())->toBe(4)
        ->and(Work::query()->get()->sum(fn (Work $work) => count($work->images ?? [])))->toBe(50)
        ->and(Work::query()->get()->sum(fn (Work $work) => count($work->image_alts ?? [])))->toBe(50);

    $this->seed(WorkSeeder::class);

    expect(Work::query()->count())->toBe(4);
});
