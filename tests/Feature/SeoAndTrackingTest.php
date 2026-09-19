<?php

use App\Models\Service;
use Inertia\Testing\AssertableInertia as Assert;

test('public document titles never use the Laravel framework fallback', function () {
    config(['app.name' => 'Laravel']);

    $response = $this->get(route('home'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<title inertia>Carpintero en Guayaquil | Muebles, closets y puertas a medida</title>')
        ->not->toContain('<title inertia>Laravel</title>');
});

test('homepage exposes crawler metadata for the canonical host', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $response = $this->get(route('home'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<title inertia>Carpintero en Guayaquil | Muebles, closets y puertas a medida</title>')
        ->toContain('<meta inertia="description" name="description"')
        ->toContain('Carpintero en Guayaquil para muebles a medida, closets, cocinas y puertas.')
        ->toContain('<link inertia="canonical" rel="canonical" href="https://punto-madera.com/">')
        ->toContain('<meta inertia="og:url" property="og:url" content="https://punto-madera.com/">')
        ->toContain('href="https://punto-madera.com/sitemap.xml"');
});

test('works page exposes descriptive metadata and cleans page one canonical', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $response = $this->get('/trabajos?page=1');

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<title inertia>Trabajos de carpintería en Guayaquil | Proyectos reales | Punto Madera</title>')
        ->toContain('<meta inertia="description" name="description"')
        ->toContain('<link inertia="canonical" rel="canonical" href="https://punto-madera.com/trabajos">')
        ->not->toContain('href="https://punto-madera.com/trabajos?page=1"');
});

test('services index exposes a stronger local conversion snippet', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $response = $this->get(route('services.index'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<title inertia>Servicios de carpintería en Guayaquil | Muebles, closets y puertas</title>')
        ->toContain('Revisa el proceso y cotiza por WhatsApp.')
        ->toContain('<link inertia="canonical" rel="canonical" href="https://punto-madera.com/servicios">');
});

test('door installation page exposes outcome and WhatsApp metadata', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $response = $this->get(route('seo.doors.installation'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<title>Instalación de puertas en Guayaquil | Alineadas y listas para usar</title>')
        ->toContain('Entrega limpia, cierre correcto y cotización por WhatsApp.')
        ->toContain('<link rel="canonical" href="https://punto-madera.com/instalacion-puertas-guayaquil">');
});

test('custom carpentry page targets furniture design intent', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $response = $this->get(route('seo.custom.carpentry'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<title>Diseño de muebles a medida en Guayaquil | Carpintería personalizada</title>')
        ->toContain('Diseño y fabricación de muebles a medida en Guayaquil')
        ->toContain('<link rel="canonical" href="https://punto-madera.com/carpinteria-a-medida-guayaquil">');
});

test('server rendered seo pages share the public shell and footer', function () {
    foreach ([
        'seo.doors.installation',
        'seo.doors.repair',
        'seo.custom.carpentry',
    ] as $routeName) {
        $response = $this->get(route($routeName));

        $response->assertSuccessful();

        expect($response->getContent())
            ->toContain('Navegación principal')
            ->toContain('Muebles a medida, closets empotrados, cocinas, puertas y reparaciones.')
            ->toContain('Todos los derechos reservados.');
    }
});

test('auth pages are excluded from search indexing', function () {
    $response = $this->get(route('login'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<meta inertia="robots" name="robots" content="noindex,follow">');
});

test('www public requests redirect to the canonical host', function () {
    $response = $this->get('http://www.punto-madera.com/carpinteria-a-medida-guayaquil?utm_source=search');

    $response->assertRedirect('https://punto-madera.com/carpinteria-a-medida-guayaquil?utm_source=search');
});

test('service detail pages expose searchable metadata', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $service = Service::query()->create([
        'name' => 'Muebles a medida en Guayaquil',
        'slug' => 'muebles-a-medida-guayaquil',
        'summary' => 'Diseño y fabricación de muebles a medida en Guayaquil.',
        'description' => 'Soluciones personalizadas para hogares y negocios.',
        'image_path' => 'images/works/service01.jpg',
        'is_published' => true,
    ]);

    $response = $this->get(route('services.show', ['service' => $service]));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<title inertia>Muebles a medida en Guayaquil | Punto Madera Guayaquil</title>')
        ->toContain('https://punto-madera.com/servicios/muebles-a-medida-guayaquil')
        ->toContain('Diseño y fabricación de muebles a medida en Guayaquil.');
});

test('robots explicitly allows OpenAI search crawling', function () {
    $robots = file_get_contents(public_path('robots.txt'));

    expect($robots)
        ->toContain('User-agent: OAI-SearchBot')
        ->toContain('Allow: /')
        ->toContain('Disallow: /_boost/')
        ->toContain('Sitemap: https://punto-madera.com/sitemap.xml');
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
