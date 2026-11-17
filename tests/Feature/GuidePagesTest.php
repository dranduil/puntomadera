<?php

use App\Models\CatalogItem;
use App\Support\SiteLinks;
use Database\Seeders\CatalogSeeder;
use Database\Seeders\ServiceSeeder;

beforeEach(function () {
    $this->seed([ServiceSeeder::class, CatalogSeeder::class]);
});

test('each guide page lists its catalog cards in order and without prices', function (string $path, array $slugs) {
    $html = $this->get($path)->assertOk()->getContent();

    expect($html)
        ->toContain('<link rel="canonical" href="'.rtrim(config('app.url'), '/').$path.'">')
        ->toContain('"@type":"FAQPage"')
        ->not->toMatch('/\$\s?\d/');

    $positions = array_map(fn (string $slug) => strpos($html, 'href="/cotizar?item='.$slug.'"'), $slugs);

    expect($positions)->each->toBeInt()
        ->and($positions)->toBe(collect($positions)->sort()->values()->all());
})->with([
    'humidity' => ['/muebles-resistentes-humedad-guayaquil', ['material-closet-batiente', 'material-cocina-baja', 'material-mueble-bano']],
    'termites' => ['/comejen-puertas-muebles-guayaquil', ['rapido-cambio-piezas-comejen', 'rapido-puerta-interior']],
    'security' => ['/puertas-seguridad-guayaquil', ['rapido-refuerzo-puerta', 'producto-cerradura-digital', 'producto-chapa-sobreponer', 'material-puerta-laurel']],
]);

test('the WPC door stays hidden until it is switched on in the admin', function () {
    expect($this->get('/comejen-puertas-muebles-guayaquil')->getContent())
        ->not->toContain('producto-puerta-wpc');

    CatalogItem::where('slug', 'producto-puerta-wpc')->update(['is_active' => true]);

    expect($this->get('/comejen-puertas-muebles-guayaquil')->getContent())
        ->toContain('href="/cotizar?item=producto-puerta-wpc"');
});

test('cards say whether material is included', function () {
    expect($this->get('/puertas-seguridad-guayaquil')->getContent())
        ->toContain('Mano de obra')
        ->toContain('Producto + instalación')
        ->toContain('Material e instalación incluidos');
});

test('the quote form suggests the new items next to related work', function () {
    $props = $this->get('/cotizar')->assertOk()->viewData('page')['props'];
    $items = collect(json_decode(json_encode($props['items']), true))->keyBy('slug');
    $suggested = fn (string $slug): array => collect($items[$slug]['suggestions'])->pluck('id')->all();

    expect($suggested('material-closet-batiente'))->toContain($items['material-extra-melamina-rh']['id'])
        ->and($suggested('rapido-puerta-principal'))->toContain($items['rapido-refuerzo-puerta']['id'])
        ->and($suggested('rapido-reparacion-mueble'))->toContain($items['rapido-cambio-piezas-comejen']['id'])
        ->and($suggested('rapido-cambio-piezas-comejen'))->toBe([])
        ->and($items)->not->toHaveKey('producto-puerta-wpc');
});

test('the guides are in the sitemap and linked from related pages', function () {
    $sitemap = $this->get(route('sitemap'))->getContent();

    expect($sitemap)
        ->toContain('/muebles-resistentes-humedad-guayaquil</loc>')
        ->toContain('/comejen-puertas-muebles-guayaquil</loc>')
        ->toContain('/puertas-seguridad-guayaquil</loc>');

    expect($this->get('/puertas-madera-chapas-guayaquil')->getContent())
        ->toContain('href="/puertas-seguridad-guayaquil"');
    expect($this->get('/reparacion-puertas-guayaquil')->getContent())
        ->toContain('href="/comejen-puertas-muebles-guayaquil"');
    expect($this->get('/carpinteria-a-medida-guayaquil')->getContent())
        ->toContain('href="/muebles-resistentes-humedad-guayaquil"');
});

test('every public Inertia page renders the shared header and footer', function (string $path) {
    $page = $this->get($path)->assertOk()->viewData('page');

    expect($page['props']['site']['header'])->toBe(SiteLinks::header())
        ->and($page['props']['site']['footer'])->toBe(SiteLinks::footer())
        ->and(file_get_contents(resource_path("js/pages/{$page['component']}.tsx")))
        ->toContain('<PublicFooter />');
})->with([
    'home' => '/',
    'services' => '/servicios',
    'service' => '/servicios/closets-anaqueles-cocina-guayaquil',
    'works' => '/trabajos',
    'reviews' => '/resenas',
    'contact' => '/contacto',
    'casa nueva' => '/casa-nueva-guayaquil',
    'empresas' => '/empresas',
]);

test('every header and footer link points to a page that exists', function () {
    $links = collect(SiteLinks::footer())->flatMap(fn (array $group) => $group['links'])->merge(SiteLinks::header());

    foreach ($links as $link) {
        $this->get($link['href'])->assertOk();
    }
});

test('the Blade pages show the same header menu', function () {
    $html = $this->get('/puertas-seguridad-guayaquil')->getContent();

    foreach (SiteLinks::header() as $link) {
        expect($html)->toContain('href="'.$link['href'].'" class="text-muted-foreground');
    }
});
