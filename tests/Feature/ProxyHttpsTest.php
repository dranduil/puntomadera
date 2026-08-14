<?php

use Illuminate\Support\Facades\Vite;

test('generates secure asset URLs behind the HTTPS proxy', function () {
    Vite::useHotFile(storage_path('framework/testing/missing-vite-hot-file'));

    $response = $this->withHeaders([
        'X-Forwarded-Host' => 'punto-madera.com',
        'X-Forwarded-Proto' => 'https',
    ])->get(route('home'));

    $response->assertOk();

    expect($response->getContent())
        ->toContain('https://punto-madera.com/build/assets/')
        ->not->toContain('http://punto-madera.com/build/assets/');
});
