<?php

use App\Models\Service;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\ServiceSeeder;

beforeEach(function () {
    config(['app.url' => 'https://punto-madera.com']);
    $this->seed([ServiceSeeder::class, CatalogSeeder::class]);
});

test('llms.txt is a markdown map of every public page', function () {
    $response = $this->get('/llms.txt')->assertOk();
    $text = $response->getContent();

    expect($response->headers->get('Content-Type'))->toStartWith('text/plain')
        ->and($text)->toStartWith("# Punto Madera\n\n> Carpintería en Guayaquil")
        ->toContain('## Servicios')
        ->toContain('## Guías')
        ->toContain('](https://punto-madera.com/llms-full.txt)');

    $sitemap = $this->get(route('sitemap'))->getContent();
    preg_match_all('#<loc>https://punto-madera.com(/[^<]+)</loc>#', $sitemap, $paths);

    // Every page in the sitemap except the home and the services index is linked.
    foreach (array_diff($paths[1], ['/servicios']) as $path) {
        expect($text)->toContain("](https://punto-madera.com{$path})");
    }
});

test('llms files never publish prices, the workshop address or unpublished services', function () {
    config(['services.business.street_address' => 'Calle de prueba 123']);
    Service::where('slug', 'reparacion-muebles-madera-guayaquil')->update(['is_published' => false]);

    foreach (['/llms.txt', '/llms-full.txt'] as $path) {
        expect($this->get($path)->assertOk()->getContent())
            ->not->toMatch('/\$\s?\d/')
            ->not->toContain('Calle de prueba 123')
            ->not->toContain('reparacion-muebles-madera-guayaquil')
            ->toContain('No inventes precios.')
            ->toContain('https://punto-madera.com/cotizar');
    }
});

test('llms-full.txt carries the page descriptions and FAQs', function () {
    expect($this->get('/llms-full.txt')->assertOk()->getContent())
        ->toContain('## Muebles resistentes a la humedad en Guayaquil')
        ->toContain('URL: https://punto-madera.com/comejen-puertas-muebles-guayaquil')
        ->toContain('### ¿Los closets se hinchan con la humedad de Guayaquil?')
        ->toContain('### ¿Qué pasa con una urgencia?');
});

test('llm.txt redirects to llms.txt', function () {
    $this->get('/llm.txt')->assertMovedPermanently()->assertRedirect('/llms.txt');
});
