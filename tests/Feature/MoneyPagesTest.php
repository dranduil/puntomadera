<?php

use Database\Seeders\CatalogSeeder;
use Database\Seeders\ServiceSeeder;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    $this->seed([ServiceSeeder::class, CatalogSeeder::class]);
});

test('the casa nueva page lists packages without prices', function () {
    $response = $this->get('/casa-nueva-guayaquil')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('landing/casa-nueva')
            ->has('packages', 3)
            ->where('packages.0.key', 'closets')
            ->where('packages.0.item_ids', fn ($ids) => count($ids) > 0)
            ->has('faqs')
            ->where('seo.canonical', rtrim(config('app.url'), '/').'/casa-nueva-guayaquil')
            ->where('seo.jsonLd.@graph.2.@type', 'FAQPage'));

    expect(json_encode($response->viewData('page')['props']))
        ->not->toContain('price')
        ->not->toContain('cents')
        ->not->toContain('cost');
});

test('the empresas page sends companies to the quote form', function () {
    $this->get('/empresas')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('landing/empresas')
            ->has('faqs')
            ->where('seo.jsonLd.@graph.1.@type', 'Service'));
});

test('the doors page shows products that link to the quote form without prices', function () {
    $html = $this->get('/puertas-madera-chapas-guayaquil')->assertOk()->getContent();

    expect($html)
        ->toContain('id="productos"')
        ->toContain('href="/cotizar?item=producto-chapa-pomo"')
        ->toContain('href="/cotizar?item=material-puerta-mdf"')
        ->not->toContain('href="/cotizar?item=rapido-ajuste-puerta"')
        ->not->toMatch('/\$\s?\d/');

    expect($this->get('/instalacion-puertas-guayaquil')->getContent())->not->toContain('id="productos"');
});

test('the new pages are in the sitemap and the menus', function () {
    $sitemap = $this->get(route('sitemap'))->getContent();

    expect($sitemap)
        ->toContain('/casa-nueva-guayaquil</loc>')
        ->toContain('/empresas</loc>');

    expect($this->get('/reparacion-puertas-guayaquil')->getContent())
        ->toContain('href="/casa-nueva-guayaquil"')
        ->toContain('href="/empresas"');
});
