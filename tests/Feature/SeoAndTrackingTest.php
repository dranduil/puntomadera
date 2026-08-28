<?php

use App\Models\Service;
use Inertia\Testing\AssertableInertia as Assert;

test('public document titles never use the Laravel framework fallback', function () {
    config(['app.name' => 'Laravel']);

    $response = $this->get(route('home'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<title inertia>Punto Madera</title>')
        ->not->toContain('<title inertia>Laravel</title>');
});

test('robots explicitly allows OpenAI search crawling', function () {
    $robots = file_get_contents(public_path('robots.txt'));

    expect($robots)
        ->toContain('User-agent: OAI-SearchBot')
        ->toContain('Allow: /')
        ->toContain('Sitemap: /sitemap.xml');
});

test('sitemap lists public pages and published services', function () {
    config(['app.url' => 'https://example.test']);

    Service::query()->create([
        'name' => 'Published service',
        'slug' => 'published-service',
        'is_published' => true,
    ]);
    Service::query()->create([
        'name' => 'Draft service',
        'slug' => 'draft-service',
        'is_published' => false,
    ]);
    $response = $this->get(route('sitemap'));

    $response->assertSuccessful()
        ->assertHeader('Content-Type', 'application/xml');

    expect(simplexml_load_string($response->getContent()))
        ->toBeInstanceOf(SimpleXMLElement::class);

    expect($response->getContent())
        ->toContain('<loc>https://example.test</loc>')
        ->toContain('<loc>https://example.test/servicios/published-service</loc>')
        ->not->toContain('/servicios/draft-service')
        ->not->toContain('/tienda');
});

test('public storefront routes are removed', function () {
    $this->get('/tienda')->assertNotFound();
    $this->get('/tienda/repisa-flotante-madera')->assertNotFound();
});

test('contact page is available for WhatsApp quotations', function () {
    $this->get(route('contact.show'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('contact/index'),
        );
});

test('tracking scripts are rendered only when their ids are configured', function () {
    config([
        'services.google_analytics.measurement_id' => 'G-TEST123',
        'services.meta_pixel.id' => '123456789',
    ]);

    $response = $this->get(route('home'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('googletagmanager.com/gtag/js?id=G-TEST123')
        ->toContain('G-TEST123')
        ->toContain('connect.facebook.net/en_US/fbevents.js')
        ->toContain('123456789');
});

test('tracking scripts are also rendered on server-rendered seo pages', function () {
    config([
        'services.google_analytics.measurement_id' => 'G-SEO123',
        'services.meta_pixel.id' => '987654321',
    ]);

    $response = $this->get(route('seo.doors.installation'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('G-SEO123')
        ->toContain('987654321');
});

test('tracking scripts are omitted when ids are not configured', function () {
    config([
        'services.google_analytics.measurement_id' => null,
        'services.meta_pixel.id' => null,
    ]);

    $response = $this->get(route('home'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->not->toContain('googletagmanager.com/gtag/js')
        ->not->toContain('connect.facebook.net/en_US/fbevents.js');
});
