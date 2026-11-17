<?php

use App\Http\Controllers\ServiceController;
use App\Models\HomeLanding;
use App\Models\Service;
use App\Support\SiteLinks;
use Inertia\Ssr\Gateway;
use Inertia\Ssr\Response as SsrResponse;
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

test('public contact and service pages receive the configured coverage areas', function () {
    $areas = [
        'Guayaquil (Norte y Sur)',
        'Urdesa',
        'Vía a la Costa',
        'Samborondón',
        'Daule',
    ];

    HomeLanding::query()->create(['areas_served' => $areas]);

    foreach ([route('home'), route('services.index'), route('contact.show')] as $url) {
        $this->get($url)->assertInertia(fn (Assert $page) => $page
            ->where('landing.areas_served', $areas),
        );
    }
});

test('door installation page exposes outcome and WhatsApp metadata', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $response = $this->get(route('seo.doors.installation'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<title>Instalación de puertas en Guayaquil | Alineadas y listas para usar</title>')
        ->toContain('Entrega limpia, cierre correcto y cotización por WhatsApp.')
        ->toContain('Guayaquil (Norte y Sur)')
        ->toContain('Samborondón')
        ->toContain('Vía a la Costa')
        ->toContain('<link rel="canonical" href="https://punto-madera.com/instalacion-puertas-guayaquil">');
});

test('door product page presents quote-only offers and illustrative images', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $response = $this->get(route('seo.doors.products'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<title>Puertas de madera, chapas y accesorios en Guayaquil | Punto Madera</title>')
        ->toContain('<link rel="canonical" href="https://punto-madera.com/puertas-madera-chapas-guayaquil">')
        ->toContain('te enviamos la cotización por WhatsApp antes de avanzar')
        ->toContain('href="https://wa.me/')
        ->toContain('/images/doors-cotizacion/puerta-laqueada-referencia.jpg')
        ->toContain('/images/doors-cotizacion/chapas-herrajes-referencia.jpg')
        ->toContain('Imágenes ilustrativas generadas para presentar opciones');
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
        'seo.doors.products',
        'seo.custom.carpentry',
        'seo.guides.humidity',
        'seo.guides.termites',
        'seo.guides.security',
    ] as $routeName) {
        $response = $this->get(route($routeName));

        $response->assertSuccessful();

        $html = $response->getContent();

        expect($html)
            ->toContain('Navegación principal')
            ->toContain('aria-label="Páginas del sitio"')
            ->toContain('© '.now()->year);

        foreach (collect(SiteLinks::footer())->flatMap(fn (array $group) => $group['links']) as $link) {
            expect($html)->toContain('href="'.$link['href'].'"');
        }
    }
});

test('auth pages are excluded from search indexing', function () {
    $response = $this->get(route('login'));

    $response->assertSuccessful();

    expect($response->getContent())
        ->toContain('<meta name="robots" content="noindex,follow">');
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
        ->toContain('<title inertia>Muebles a medida en Guayaquil | Punto Madera</title>')
        ->toContain('https://punto-madera.com/servicios/muebles-a-medida-guayaquil')
        ->toContain('Diseño y fabricación de muebles a medida en Guayaquil. Cotiza por WhatsApp.');
});

test('service titles name the city and the brand once', function (string $name, string $title) {
    $service = new Service(['name' => $name]);

    expect(ServiceController::snippetTitle($service))->toBe($title);
})->with([
    ['Muebles a medida en Guayaquil', 'Muebles a medida en Guayaquil | Punto Madera'],
    ['Reparación de muebles de madera', 'Reparación de muebles de madera en Guayaquil | Punto Madera'],
]);

test('ssr head replaces the blade fallback tags instead of duplicating them', function () {
    app()->instance(Gateway::class, new class implements Gateway
    {
        public function dispatch(array $page): ?SsrResponse
        {
            return new SsrResponse(
                '<title inertia>SSR title</title><meta inertia="description" name="description" content="SSR description">',
                '<div id="app" data-page="{}"><h1>Carpintero en Guayaquil</h1></div>',
            );
        }
    });

    $content = $this->get(route('home'))->assertSuccessful()->getContent();

    expect($content)
        ->toContain('<title inertia>SSR title</title>')
        ->toContain('<h1>Carpintero en Guayaquil</h1>')
        ->not->toContain('<title inertia>Carpintero en Guayaquil')
        ->and(substr_count($content, 'name="description"'))->toBe(1);
});

test('landing pages share one business entity with a phone number', function () {
    config([
        'app.url' => 'https://punto-madera.com',
        'services.whatsapp.number' => '593998897813',
        'services.business.same_as' => ['https://www.instagram.com/puntomadera'],
        'services.business.opening_hours' => 'Mo-Sa 08:00-18:00',
    ]);

    $content = $this->get(route('seo.doors.repair'))->assertSuccessful()->getContent();

    expect($content)
        ->toContain('"@id":"https://punto-madera.com/#business"')
        ->toContain('"name":"Punto Madera"')
        ->toContain('"telephone":"+593998897813"')
        ->toContain('"sameAs":["https://www.instagram.com/puntomadera"]')
        ->toContain('"openingHours":"Mo-Sa 08:00-18:00"');

    $this->get(route('home'))->assertInertia(fn (Assert $page) => $page
        ->where('business.@id', 'https://punto-madera.com/#business')
        ->where('business.name', 'Punto Madera')
        ->where('business.telephone', '+593998897813'),
    );
});

test('business phone prefers the admin contact phone', function () {
    HomeLanding::query()->create(['contact_phone' => '+593 4 123 4567']);

    $this->get(route('home'))->assertInertia(fn (Assert $page) => $page
        ->where('business.telephone', '+593 4 123 4567'),
    );
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
        ->toContain('<loc>https://example.test/puertas-madera-chapas-guayaquil</loc>')
        ->toContain('<loc>https://example.test/servicios/published-service</loc>')
        ->not->toContain('/servicios/draft-service')
        ->not->toContain('/tienda');
});

test('sitemap dates only pages backed by real timestamps', function () {
    config(['app.url' => 'https://example.test']);

    $service = Service::query()->create([
        'name' => 'Published service',
        'slug' => 'published-service',
        'is_published' => true,
    ]);
    $service->forceFill(['updated_at' => '2026-10-05 12:00:00'])->saveQuietly();

    expect($this->get(route('sitemap'))->getContent())
        ->toContain('<loc>https://example.test/servicios/published-service</loc><lastmod>2026-10-05</lastmod>')
        ->toContain('<loc>https://example.test/servicios</loc><lastmod>2026-10-05</lastmod>')
        ->toContain('<loc>https://example.test/contacto</loc></url>');
});

test('removed storefront urls permanently redirect to custom furniture', function () {
    foreach (['/tienda', '/tienda/repisa-flotante-madera', '/tienda/panel-decorativo-listonado'] as $url) {
        $this->get($url)
            ->assertStatus(301)
            ->assertRedirect('/carpinteria-a-medida-guayaquil');
    }
});

test('contact page is available for WhatsApp quotations', function () {
    config(['app.url' => 'https://punto-madera.com']);

    $response = $this->get(route('contact.show'))
        ->assertSuccessful()
        ->assertInertia(fn (Assert $page) => $page
            ->component('contact/index'),
        );

    expect($response->getContent())
        ->toContain('<title inertia>Cotizar carpintería en Guayaquil | Punto Madera</title>')
        ->toContain('<link inertia="canonical" rel="canonical" href="https://punto-madera.com/contacto">');
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

test('whatsapp clicks are tracked as a conversion when tracking is configured', function () {
    config([
        'services.google_analytics.measurement_id' => 'G-TEST123',
        'services.meta_pixel.id' => '123456789',
    ]);

    expect($this->get(route('home'))->getContent())
        ->toContain("'whatsapp_click'")
        ->toContain("window.fbq('track', 'Contact')");
});

test('campaign tags and the landing page are remembered for lead attribution', function () {
    $this->get('/servicios?utm_source=facebook&utm_medium=cpc&utm_campaign=closets')
        ->assertSuccessful();
    $this->get('/contacto')->assertSuccessful();

    expect(session('attribution'))->toMatchArray([
        'utm_source' => 'facebook',
        'utm_medium' => 'cpc',
        'utm_campaign' => 'closets',
        'landing_path' => '/servicios',
    ]);
});
