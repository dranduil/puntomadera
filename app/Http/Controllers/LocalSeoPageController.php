<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\View\View;

class LocalSeoPageController extends Controller
{
    public function show(string $slug): View
    {
        abort_unless(array_key_exists($slug, $this->pages()), 404);

        $landing = HomeLanding::query()->first();
        $page = $this->pages()[$slug];
        $landingData = $landing?->toArray() ?? [
            'whatsapp_number' => null,
            'contact_email' => null,
            'contact_phone' => null,
            'areas_served' => null,
        ];
        $siteUrl = rtrim(config('app.url'), '/');
        $canonicalUrl = "{$siteUrl}/{$slug}";
        $areasServed = $landingData['areas_served'] ?? [
            'Guayaquil',
            'Samborondón',
            'Daule',
            'Vía a la Costa',
            'Urdesa',
        ];
        $whatsappNumber = preg_replace('/[^0-9]/', '', (string) (
            config('services.whatsapp.number')
            ?: env('VITE_WHATSAPP_NUMBER')
            ?: $landingData['whatsapp_number']
            ?: '593000000000'
        ));
        $whatsappHref = "https://wa.me/{$whatsappNumber}?text=".rawurlencode($page['message']);

        $schemas = [
            [
                '@context' => 'https://schema.org',
                '@type' => 'HomeAndConstructionBusiness',
                '@id' => "{$siteUrl}/#business",
                'name' => str_replace('-', ' ', config('app.name', 'punto madera')),
                'url' => $siteUrl,
                'telephone' => $landingData['contact_phone'] ?? $landingData['whatsapp_number'] ?? null,
                'email' => $landingData['contact_email'] ?? null,
                'address' => [
                    '@type' => 'PostalAddress',
                    'addressLocality' => 'Guayaquil',
                    'addressRegion' => 'Guayas',
                    'addressCountry' => 'EC',
                ],
                'areaServed' => collect($areasServed)->map(fn (string $name) => [
                    '@type' => 'City',
                    'name' => $name,
                ])->values(),
            ],
            [
                '@context' => 'https://schema.org',
                '@type' => 'Service',
                '@id' => "{$canonicalUrl}#service",
                'name' => $page['serviceName'],
                'description' => $page['metaDescription'],
                'provider' => ['@id' => "{$siteUrl}/#business"],
                'areaServed' => collect($areasServed)->map(fn (string $name) => [
                    '@type' => 'City',
                    'name' => $name,
                ])->values(),
                'serviceType' => $page['serviceName'],
                'url' => $canonicalUrl,
            ],
            [
                '@context' => 'https://schema.org',
                '@type' => 'FAQPage',
                'mainEntity' => collect($page['faqs'])->map(fn (array $faq) => [
                    '@type' => 'Question',
                    'name' => $faq['q'],
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => $faq['a'],
                    ],
                ])->values(),
            ],
            [
                '@context' => 'https://schema.org',
                '@type' => 'BreadcrumbList',
                'itemListElement' => [
                    [
                        '@type' => 'ListItem',
                        'position' => 1,
                        'name' => 'Inicio',
                        'item' => $siteUrl,
                    ],
                    [
                        '@type' => 'ListItem',
                        'position' => 2,
                        'name' => $page['serviceName'],
                        'item' => $canonicalUrl,
                    ],
                ],
            ],
        ];

        return view('seo.service', [
            'landing' => $landingData,
            'page' => $page,
            'siteUrl' => $siteUrl,
            'canonicalUrl' => $canonicalUrl,
            'areasServed' => $areasServed,
            'whatsappHref' => $whatsappHref,
            'schemas' => $schemas,
        ]);
    }

    public function sitemap(): HttpResponse
    {
        $baseUrl = rtrim(config('app.url'), '/');
        $urls = collect(['/', '/servicios', '/trabajos', '/contacto'])
            ->merge(collect(array_keys($this->pages()))->map(fn (string $slug) => "/{$slug}"));

        $items = $urls
            ->map(fn (string $path) => $baseUrl.$path)
            ->map(fn (string $url) => '    <url><loc>'.e($url).'</loc></url>')
            ->implode("\n");

        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
            ."<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
            .$items."\n"
            .'</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    /**
     * @return array<string, array<string, mixed>>
     */
    private function pages(): array
    {
        return [
            'instalacion-puertas-guayaquil' => [
                'slug' => 'instalacion-puertas-guayaquil',
                'title' => 'Instalación de puertas en Guayaquil | Obra nueva y acabados',
                'metaDescription' => 'Instalación profesional de puertas para obra nueva en Guayaquil. Medición, nivelación, marcos, bisagras, cerraduras y acabado limpio para interiores y exteriores.',
                'serviceName' => 'Instalación de puertas en Guayaquil',
                'h1' => 'Instalación de puertas para obra nueva en Guayaquil',
                'eyebrow' => 'Puertas · Obra nueva · Guayaquil',
                'intro' => 'Instalamos puertas interiores y exteriores en construcciones nuevas, remodelaciones y entregas de obra. Trabajamos con medición clara, marcos alineados, herrajes firmes y acabado prolijo para que la puerta abra, cierre y selle como debe desde el primer día.',
                'intent' => 'Para constructores, arquitectos, maestros de obra y propietarios que necesitan un instalador responsable para puertas nuevas.',
                'heroImage' => '/images/works/service03.jpg',
                'primaryCta' => 'Cotizar instalación',
                'message' => 'Hola, necesito cotizar instalación de puertas en Guayaquil para una obra nueva.',
                'services' => [
                    'Instalación de puertas interiores de madera, MDF, melamina o similares.',
                    'Colocación de marco, bisagras, cerradura, topes y ajustes finales.',
                    'Revisión de vano, nivel, plomo, holguras y sentido de apertura.',
                    'Instalación por unidad o por lote para vivienda, oficina o local.',
                ],
                'problems' => [
                    'Puertas que rozan el piso o el marco por mala nivelación.',
                    'Bisagras débiles o mal ubicadas que aflojan la hoja.',
                    'Marcos descuadrados que afectan cierre y seguridad.',
                    'Acabados finales sin protección en zonas de humedad o uso alto.',
                ],
                'process' => [
                    'Revisamos medidas, tipo de puerta, marco y condiciones del vano.',
                    'Confirmamos herrajes, sentido de apertura y acabado esperado.',
                    'Instalamos, nivelamos y ajustamos la hoja con pruebas de cierre.',
                    'Entregamos recomendaciones de uso, cuidado y mantenimiento.',
                ],
                'materials' => ['Madera', 'MDF', 'Melamina', 'Bisagras', 'Cerraduras', 'Marcos'],
                'faqs' => [
                    [
                        'q' => '¿Instalan puertas para casas nuevas en Guayaquil?',
                        'a' => 'Sí. Podemos instalar una puerta puntual o varias puertas para una obra nueva, casa, departamento, oficina o local comercial en Guayaquil y zonas cercanas.',
                    ],
                    [
                        'q' => '¿Qué necesito para cotizar la instalación?',
                        'a' => 'Lo ideal es enviar medidas del vano, foto del espacio, cantidad de puertas, tipo de marco y si ya tienes bisagras o cerradura compradas.',
                    ],
                    [
                        'q' => '¿También instalan cerraduras y bisagras?',
                        'a' => 'Sí. La instalación puede incluir bisagras, cerradura, manija, topes y ajuste final, según el tipo de puerta y herraje.',
                    ],
                ],
                'relatedLinks' => [
                    ['label' => 'Reparación de puertas', 'href' => '/reparacion-puertas-guayaquil'],
                    ['label' => 'Carpintería a medida', 'href' => '/carpinteria-a-medida-guayaquil'],
                    ['label' => 'Servicios', 'href' => '/servicios'],
                ],
            ],
            'reparacion-puertas-guayaquil' => [
                'slug' => 'reparacion-puertas-guayaquil',
                'title' => 'Reparación de puertas en Guayaquil | Ajuste, bisagras y marcos',
                'metaDescription' => 'Reparación de puertas en Guayaquil: puertas caídas, bisagras flojas, cerraduras, marcos, roces, humedad y ajustes de madera. Cotiza por WhatsApp.',
                'serviceName' => 'Reparación de puertas en Guayaquil',
                'h1' => 'Reparación de puertas en Guayaquil con ajuste prolijo',
                'eyebrow' => 'Puertas · Reparación · Mantenimiento',
                'intro' => 'Reparamos puertas que rozan, no cierran, están caídas, tienen bisagras flojas, marcos vencidos, cerraduras dañadas o golpes en la madera. El objetivo es recuperar función, seguridad y apariencia sin cambiar la puerta cuando todavía puede salvarse.',
                'intent' => 'Para hogares, locales y oficinas que necesitan resolver una puerta dañada sin improvisaciones.',
                'heroImage' => '/images/works/service07.jpg',
                'primaryCta' => 'Cotizar reparación',
                'message' => 'Hola, necesito cotizar reparación de una puerta en Guayaquil.',
                'services' => [
                    'Ajuste de puertas que rozan, se traban o no cierran bien.',
                    'Cambio o refuerzo de bisagras, tornillos y puntos de apoyo.',
                    'Reparación de marcos, golpes, bordes abiertos y piezas flojas.',
                    'Instalación o reemplazo de cerraduras, manijas y accesorios.',
                ],
                'problems' => [
                    'La puerta se cae o queda desalineada al cerrar.',
                    'La cerradura no entra bien en el recibidor.',
                    'La madera está hinchada por humedad o desgaste.',
                    'El marco está flojo, abierto o mal fijado a la pared.',
                ],
                'process' => [
                    'Recibimos fotos o video para entender el daño.',
                    'Diagnosticamos si conviene reparar, reforzar o reemplazar piezas.',
                    'Realizamos ajuste, cepillado, fijación o cambio de herrajes.',
                    'Probamos apertura, cierre y seguridad antes de entregar.',
                ],
                'materials' => ['Bisagras', 'Cerraduras', 'Madera', 'Masilla', 'Tornillería', 'Sellador'],
                'faqs' => [
                    [
                        'q' => '¿Arreglan puertas que rozan el piso?',
                        'a' => 'Sí. Revisamos bisagras, nivel, hinchazón por humedad y holguras para corregir el roce sin dañar el acabado.',
                    ],
                    [
                        'q' => '¿Conviene reparar o cambiar la puerta?',
                        'a' => 'Depende del daño. Si la estructura todavía está firme, muchas puertas pueden repararse con ajuste, refuerzo o cambio de herrajes.',
                    ],
                    [
                        'q' => '¿Atienden reparaciones pequeñas?',
                        'a' => 'Sí. Podemos revisar reparaciones puntuales como bisagras flojas, cerraduras, manijas, golpes y marcos sueltos.',
                    ],
                ],
                'relatedLinks' => [
                    ['label' => 'Instalación de puertas', 'href' => '/instalacion-puertas-guayaquil'],
                    ['label' => 'Carpintería a medida', 'href' => '/carpinteria-a-medida-guayaquil'],
                    ['label' => 'Contacto', 'href' => '/contacto'],
                ],
            ],
            'carpinteria-a-medida-guayaquil' => [
                'slug' => 'carpinteria-a-medida-guayaquil',
                'title' => 'Carpintería a medida en Guayaquil | Interior y exterior',
                'metaDescription' => 'Carpintería a medida en Guayaquil para muebles interiores, exteriores, detalles en madera, closets, repisas, paneles, puertas y soluciones personalizadas.',
                'serviceName' => 'Carpintería a medida en Guayaquil',
                'h1' => 'Carpintería a medida para interiores y exteriores en Guayaquil',
                'eyebrow' => 'Madera · Diseño funcional · A medida',
                'intro' => 'Diseñamos y fabricamos trabajos personalizados en madera y derivados para interiores y exteriores: muebles, repisas, paneles, detalles decorativos, soluciones para patios, puertas, closets y piezas funcionales que se adaptan al espacio real.',
                'intent' => 'Para personas que buscan un carpintero con criterio de diseño, medidas claras y fabricación cuidada.',
                'heroImage' => '/images/works/service04.jpg',
                'primaryCta' => 'Cotizar proyecto',
                'message' => 'Hola, quiero cotizar un trabajo de carpintería a medida en Guayaquil.',
                'services' => [
                    'Muebles a medida para sala, dormitorio, cocina, oficina o local.',
                    'Repisas, paneles, divisiones, revestimientos y detalles en madera.',
                    'Soluciones exteriores con criterio de uso, clima y mantenimiento.',
                    'Diseño, fabricación, instalación y ajuste final del proyecto.',
                ],
                'problems' => [
                    'Muebles comerciales que no encajan en la medida real del espacio.',
                    'Espacios exteriores que requieren materiales y sellado adecuados.',
                    'Ideas de diseño que necesitan aterrizarse en medidas y materiales.',
                    'Piezas existentes que no combinan con el estilo del ambiente.',
                ],
                'process' => [
                    'Conversamos sobre uso, medidas, referencias y presupuesto.',
                    'Definimos material, acabado, herrajes y alcance de instalación.',
                    'Fabricamos la pieza con control de proporción, función y detalle.',
                    'Instalamos y ajustamos para que el resultado quede limpio y durable.',
                ],
                'materials' => ['Madera natural', 'Melamina', 'MDF', 'Plywood', 'Selladores', 'Herrajes'],
                'faqs' => [
                    [
                        'q' => '¿Hacen trabajos de madera para exteriores?',
                        'a' => 'Sí. Evaluamos exposición al sol, humedad, uso y mantenimiento para recomendar material, sellado y acabado adecuados.',
                    ],
                    [
                        'q' => '¿Pueden fabricar una idea desde una foto de referencia?',
                        'a' => 'Sí. Una foto ayuda mucho, pero adaptamos proporciones, materiales y medidas para que funcione en tu espacio.',
                    ],
                    [
                        'q' => '¿Trabajan solo madera natural?',
                        'a' => 'No. Según el proyecto podemos usar madera natural, melamina, MDF, plywood u otros derivados, explicando ventajas y cuidados.',
                    ],
                ],
                'relatedLinks' => [
                    ['label' => 'Instalación de puertas', 'href' => '/instalacion-puertas-guayaquil'],
                    ['label' => 'Trabajos recientes', 'href' => '/trabajos'],
                    ['label' => 'Servicios', 'href' => '/servicios'],
                ],
            ],
        ];
    }
}
