<?php

namespace App\Http\Controllers;

use App\Models\CatalogItem;
use App\Models\HomeLanding;
use App\Models\Service;
use App\Models\Work;
use App\Support\BusinessSchema;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Carbon;
use Illuminate\View\View;

class LocalSeoPageController extends Controller
{
    public function show(string $slug): View
    {
        abort_unless(array_key_exists($slug, self::pages()), 404);

        $landing = HomeLanding::query()->first();
        $page = self::pages()[$slug];
        $landingData = $landing?->toArray() ?? [
            'whatsapp_number' => null,
            'contact_phone' => null,
            'areas_served' => null,
        ];
        $siteUrl = rtrim(config('app.url'), '/');
        $canonicalUrl = "{$siteUrl}/{$slug}";
        $areasServed = BusinessSchema::areasServed($landingData['areas_served'] ?? null);
        $whatsappNumber = preg_replace('/[^0-9]/', '', (string) (
            config('services.whatsapp.number')
            ?: $landingData['whatsapp_number']
            ?: '593998897813'
        ));
        $whatsappHref = "https://wa.me/{$whatsappNumber}?text=".rawurlencode($page['message']);
        $quoteHref = '/cotizar'.(empty($page['quoteService']) ? '' : '?servicio='.$page['quoteService']);
        $products = $this->products($page);

        $schemas = [
            ['@context' => 'https://schema.org'] + BusinessSchema::node($siteUrl, $landingData),
            [
                '@context' => 'https://schema.org',
                '@type' => 'Service',
                '@id' => "{$canonicalUrl}#service",
                'name' => $page['serviceName'],
                'description' => $page['metaDescription'],
                'provider' => ['@id' => "{$siteUrl}/#business"],
                'areaServed' => collect($areasServed)->map(fn (string $name) => [
                    '@type' => 'Place',
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
            'quoteHref' => $quoteHref,
            'products' => $products,
            'schemas' => $schemas,
        ]);
    }

    public function sitemap(): HttpResponse
    {
        $baseUrl = rtrim(config('app.url'), '/');

        // path => last modification. Only pages backed by real timestamps get a
        // <lastmod>; guessed dates would teach Google to ignore the field.
        $urls = collect(['/', '/cotizar', '/casa-nueva-guayaquil', '/empresas', '/servicios', '/trabajos', '/resenas', '/contacto'])
            ->merge(collect(array_keys(self::pages()))->map(fn (string $slug) => "/{$slug}"))
            ->mapWithKeys(fn (string $path) => [$path => null]);

        $services = Service::query()
            ->where('is_published', true)
            ->get(['slug', 'updated_at']);

        foreach ($services as $service) {
            $urls["/servicios/{$service->slug}"] = $service->updated_at;
        }

        $urls['/servicios'] = $services->max('updated_at');
        $urls['/trabajos'] = Work::query()->where('is_published', true)->max('updated_at');

        $items = $urls
            ->map(function (mixed $lastModified, string $path) use ($baseUrl): string {
                $url = $baseUrl.($path === '/' ? '' : '/'.ltrim($path, '/'));
                $lastmod = $lastModified
                    ? '<lastmod>'.Carbon::parse($lastModified)->toDateString().'</lastmod>'
                    : '';

                return '    <url><loc>'.e($url).'</loc>'.$lastmod.'</url>';
            })
            ->implode("\n");

        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
            ."<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
            .$items."\n"
            .'</urlset>';

        return response($xml, 200)->header('Content-Type', 'application/xml');
    }

    /**
     * Catalog cards for a page, never with prices: a fixed list of slugs in the
     * page's order, or the products and with-material items of one service.
     * Inactive or hidden items drop out until they are switched on in the admin.
     *
     * @param  array<string, mixed>  $page
     * @return list<array<string, mixed>>
     */
    private function products(array $page): array
    {
        if (! empty($page['productSlugs'])) {
            $order = array_flip($page['productSlugs']);
            $items = CatalogItem::query()
                ->public()
                ->whereIn('slug', $page['productSlugs'])
                ->get()
                ->sortBy(fn (CatalogItem $item) => $order[$item->slug]);
        } elseif (! empty($page['productsService'])) {
            $items = CatalogItem::query()
                ->public()
                ->whereHas('service', fn ($query) => $query->where('slug', $page['productsService']))
                ->where(fn ($query) => $query->where('kind', 'producto')->orWhere('includes_material', true))
                ->get();
        } else {
            return [];
        }

        return $items
            ->map(fn (CatalogItem $item) => [...$item->toPublicArray(), 'quote_href' => '/cotizar?item='.$item->slug])
            ->values()
            ->all();
    }

    /**
     * Every server-rendered service and guide page, keyed by slug. Also read by
     * the sitemap and llms.txt. Guides carry `'guide' => true`.
     *
     * @return array<string, array<string, mixed>>
     */
    public static function pages(): array
    {
        return [
            'instalacion-puertas-guayaquil' => [
                'slug' => 'instalacion-puertas-guayaquil',
                'quoteService' => 'instalacion-reparacion-puertas-madera-guayaquil',
                'title' => 'Instalación de puertas en Guayaquil | Punto Madera',
                'metaDescription' => 'Instalamos puertas en Guayaquil con medición, nivelación, marcos, bisagras y cerraduras. Entrega limpia, cierre correcto y cotización por WhatsApp.',
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
                    ['label' => 'Puertas, chapas y accesorios', 'href' => '/puertas-madera-chapas-guayaquil'],
                    ['label' => 'Servicios', 'href' => '/servicios'],
                ],
            ],
            'reparacion-puertas-guayaquil' => [
                'slug' => 'reparacion-puertas-guayaquil',
                'quoteService' => 'instalacion-reparacion-puertas-madera-guayaquil',
                'title' => 'Reparación de puertas en Guayaquil | Punto Madera',
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
                    ['label' => 'Puertas, chapas y accesorios', 'href' => '/puertas-madera-chapas-guayaquil'],
                    ['label' => 'Comején en puertas y muebles', 'href' => '/comejen-puertas-muebles-guayaquil'],
                    ['label' => 'Puertas de seguridad', 'href' => '/puertas-seguridad-guayaquil'],
                ],
            ],
            'carpinteria-a-medida-guayaquil' => [
                'slug' => 'carpinteria-a-medida-guayaquil',
                'quoteService' => 'muebles-a-medida-guayaquil',
                'title' => 'Diseño de muebles a medida en Guayaquil | Punto Madera',
                'metaDescription' => 'Diseño y fabricación de muebles a medida en Guayaquil: closets, repisas, paneles, puertas y soluciones para interiores y exteriores. Cotiza por WhatsApp.',
                'serviceName' => 'Carpintería a medida en Guayaquil',
                'h1' => 'Diseño de muebles a medida para interiores y exteriores en Guayaquil',
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
                    ['label' => 'Muebles a medida', 'href' => '/servicios/muebles-a-medida-guayaquil'],
                    ['label' => 'Instalación de puertas', 'href' => '/instalacion-puertas-guayaquil'],
                    ['label' => 'Puertas, chapas y accesorios', 'href' => '/puertas-madera-chapas-guayaquil'],
                    ['label' => 'Muebles resistentes a la humedad', 'href' => '/muebles-resistentes-humedad-guayaquil'],
                    ['label' => 'Trabajos recientes', 'href' => '/trabajos'],
                ],
            ],
            'puertas-madera-chapas-guayaquil' => [
                'slug' => 'puertas-madera-chapas-guayaquil',
                'quoteService' => 'instalacion-reparacion-puertas-madera-guayaquil',
                'productsService' => 'instalacion-reparacion-puertas-madera-guayaquil',
                'title' => 'Puertas de madera y chapas en Guayaquil | Punto Madera',
                'metaDescription' => 'Puertas de madera, acabados laqueados, chapas, manijas y bisagras en Guayaquil. Confirmamos modelo, medida y disponibilidad antes de instalar.',
                'serviceName' => 'Puertas, chapas y accesorios en Guayaquil',
                'h1' => 'Puertas, acabados laqueados y chapas en Guayaquil',
                'eyebrow' => 'Puertas · Acabados · Herrajes',
                'intro' => 'Cotiza puertas de madera, opciones con acabado laqueado, chapas y accesorios para completar o renovar tu puerta. La medida, el modelo, el acabado, la compatibilidad y la disponibilidad se revisan contigo antes de confirmar cada pedido.',
                'intent' => 'Para hogares, remodelaciones, oficinas y obras que necesitan consultar una puerta o sus herrajes con cotización directa por WhatsApp.',
                'heroImage' => '/images/doors-cotizacion/puerta-madera-referencia.jpg',
                'heroImageAlt' => 'Puerta de madera en un interior residencial, imagen ilustrativa de referencia.',
                'heroImageWidth' => 1536,
                'heroImageHeight' => 1024,
                'heroCaptionTitle' => 'Cotización directa por WhatsApp',
                'heroCaption' => 'Modelo, acabado, compatibilidad y disponibilidad se confirman antes de avanzar.',
                'quoteOnly' => true,
                'primaryCta' => 'Cotizar puertas y chapas',
                'finalCta' => 'Pedir cotización',
                'message' => 'Hola, quiero cotizar una puerta, acabado laqueado o chapa/accesorio. Enviaré fotos, medidas, cantidad y sector por este medio.',
                'galleryTitle' => 'Puertas y detalles para completar el espacio',
                'galleryNote' => 'Imágenes ilustrativas generadas para presentar opciones; los modelos, tonos, compatibilidad y disponibilidad se confirman en cada cotización.',
                'gallery' => [
                    [
                        'src' => '/images/doors-cotizacion/puerta-laqueada-referencia.jpg',
                        'alt' => 'Puerta interior blanca con acabado satinado, imagen ilustrativa de referencia.',
                        'title' => 'Acabados laqueados',
                        'description' => 'Consulta tonos, material base y compatibilidad del acabado para el modelo que necesitas.',
                    ],
                    [
                        'src' => '/images/doors-cotizacion/chapas-herrajes-referencia.jpg',
                        'alt' => 'Chapas, manijas, bisagras y herrajes para puertas, imagen ilustrativa de referencia.',
                        'title' => 'Chapas y accesorios',
                        'description' => 'Cotiza cerraduras, manijas, bisagras y otros accesorios según medida y disponibilidad.',
                    ],
                ],
                'servicesTitle' => 'Qué puedes cotizar',
                'problemsTitle' => 'Datos que ayudan a cotizar',
                'materialsTitle' => 'Productos y opciones',
                'services' => [
                    'Puertas de madera y otros modelos, sujetos a medidas y disponibilidad.',
                    'Opciones de acabado laqueado; tono y compatibilidad se confirman al cotizar.',
                    'Chapas o cerraduras, manijas, bisagras y accesorios para puertas.',
                    'Instalación o ajustes relacionados, cotizados según ubicación y alcance.',
                ],
                'problems' => [
                    'Envía una foto de la puerta y del espacio donde irá instalada.',
                    'Comparte medidas aproximadas, cantidad de unidades y sector de entrega.',
                    'Para una chapa, incluye fotos de ambos lados y cualquier marca o medida visible.',
                    'Indica si también necesitas instalación, cambio de chapa o ajuste.',
                ],
                'processHeading' => 'Cómo funciona la cotización',
                'processIntro' => 'Revisamos lo que necesitas, confirmamos disponibilidad y compatibilidad, y te enviamos la cotización por WhatsApp antes de avanzar. No hay compra automática ni precio fijo publicado.',
                'process' => [
                    'Escríbenos por WhatsApp con una foto, el producto que buscas y tu sector.',
                    'Añade medidas aproximadas, cantidad, acabado preferido y si requieres instalación.',
                    'Confirmamos opciones, compatibilidad, disponibilidad y precio para tu caso.',
                    'El pedido y cualquier instalación se coordinan solo después de aceptar la cotización.',
                ],
                'materials' => ['Puertas de madera', 'Acabados laqueados', 'Chapas y cerraduras', 'Manijas', 'Bisagras', 'Topes y otros accesorios'],
                'faqs' => [
                    [
                        'q' => '¿Publican precios fijos para puertas o chapas?',
                        'a' => 'No. Cada precio se confirma por cotización según el modelo, medidas, acabado, cantidad, compatibilidad y si necesitas instalación.',
                    ],
                    [
                        'q' => '¿Puedo cotizar solo una chapa o un accesorio?',
                        'a' => 'Sí. Envíanos por WhatsApp una foto, el tipo de accesorio que buscas, medidas visibles y tu sector para revisar opciones y disponibilidad.',
                    ],
                    [
                        'q' => '¿Todas las puertas se pueden entregar laqueadas?',
                        'a' => 'Depende del modelo y del material base. Revisamos la opción de acabado y su compatibilidad antes de incluirla en la cotización.',
                    ],
                    [
                        'q' => '¿La instalación está incluida en el precio?',
                        'a' => 'Solo cuando aparece expresamente en la cotización. Puedes pedir que coticemos el suministro y la instalación por separado.',
                    ],
                    [
                        'q' => '¿Las imágenes muestran modelos disponibles?',
                        'a' => 'Son imágenes ilustrativas generadas para presentar referencias. El modelo, tono y disponibilidad reales se confirman por WhatsApp.',
                    ],
                ],
                'ctaTitle' => 'Cuéntanos qué necesitas y te cotizamos por WhatsApp',
                'ctaDescription' => 'Envía fotos, medidas aproximadas, cantidad y sector. Confirmaremos opciones y disponibilidad antes de que aceptes cualquier pedido.',
                'relatedLinksTitle' => 'También te puede servir',
                'relatedLinks' => [
                    ['label' => 'Instalación de puertas', 'href' => '/instalacion-puertas-guayaquil'],
                    ['label' => 'Reparación de puertas', 'href' => '/reparacion-puertas-guayaquil'],
                    ['label' => 'Puertas de seguridad', 'href' => '/puertas-seguridad-guayaquil'],
                    ['label' => 'Carpintería a medida', 'href' => '/carpinteria-a-medida-guayaquil'],
                ],
            ],
            'muebles-resistentes-humedad-guayaquil' => [
                'slug' => 'muebles-resistentes-humedad-guayaquil',
                'guide' => true,
                'quoteService' => 'closets-anaqueles-cocina-guayaquil',
                'productSlugs' => ['material-closet-batiente', 'material-cocina-baja', 'material-mueble-bano'],
                'productsEyebrow' => 'Muebles para zonas húmedas',
                'productsTitle' => 'Cotiza tu mueble con material resistente a la humedad',
                'productsIntro' => 'Las cocinas y los muebles de baño ya van en melamina RH. Para closets, puedes pedirla como mejora en el formulario.',
                'title' => 'Muebles resistentes a la humedad en Guayaquil | Punto Madera',
                'metaDescription' => 'Closets, cocinas y muebles de baño que no se hinchan con la humedad de Guayaquil: melamina RH, cantos sellados y ventilación. Cotiza sin compromiso.',
                'serviceName' => 'Muebles resistentes a la humedad en Guayaquil',
                'h1' => 'Muebles que aguantan la humedad de Guayaquil',
                'eyebrow' => 'Guía · Humedad · Closets y cocinas',
                'intro' => 'En Guayaquil la humedad hincha los tableros comunes, despega los cantos y deja olor a encierro. Fabricamos closets, cocinas y muebles de baño con melamina resistente a la humedad (RH), cantos sellados y espacio para que el aire circule.',
                'intent' => 'Para casas cerca del río o del estero, cuartos junto al baño, cocinas y paredes que se humedecen en invierno.',
                'heroImage' => '/images/works/punto-madera/punto-madera-08.jpg',
                'heroImageAlt' => 'Closet blanco de melamina instalado por Punto Madera',
                'heroCaptionTitle' => 'Material que no se hincha',
                'heroCaption' => 'Te recomendamos el tablero para cada espacio antes de fabricar.',
                'primaryCta' => 'Cotizar mi mueble',
                'message' => 'Hola, quiero cotizar un mueble resistente a la humedad en Guayaquil.',
                'servicesTitle' => 'Cómo lo hacemos',
                'services' => [
                    'Melamina RH (resistente a la humedad) en cocinas, baños y lavanderías.',
                    'Cantos sellados en todas las piezas para que la humedad no entre por los bordes.',
                    'Patas o zócalo que separan el mueble del piso.',
                    'Espacio para ventilar en closets pegados a paredes húmedas.',
                ],
                'problemsTitle' => 'Señales de que la humedad dañó tu mueble',
                'problems' => [
                    'Bordes inflados o tablero que se abre como esponja.',
                    'Cantos despegados o puertas que ya no cierran.',
                    'Manchas negras y olor a humedad dentro del closet.',
                    'Bisagras flojas porque el tablero ya no sujeta el tornillo.',
                ],
                'materialsTitle' => 'Materiales que usamos',
                'materials' => ['Melamina RH', 'MDF RH', 'Cantos sellados', 'Bisagras de acero', 'Patas o zócalo'],
                'processHeading' => 'Del diagnóstico al mueble instalado',
                'process' => [
                    'Nos envías fotos del espacio y, si lo hay, del mueble dañado.',
                    'Revisamos la pared y la ventilación para elegir el tablero correcto.',
                    'Fabricamos con melamina RH y sellamos todos los cantos.',
                    'Instalamos separado de la pared y del piso, y te damos consejos de cuidado.',
                ],
                'faqs' => [
                    [
                        'q' => '¿Qué es la melamina RH?',
                        'a' => 'Es un tablero de melamina con un núcleo resistente a la humedad. Suele reconocerse porque el núcleo es verde. Aguanta mucho mejor el clima de Guayaquil que el tablero común.',
                    ],
                    [
                        'q' => '¿La melamina RH es a prueba de agua?',
                        'a' => 'No. Resiste la humedad del ambiente y las salpicaduras, pero si el mueble pasa mojado o hay una fuga debajo, igual se daña. Por eso también sellamos los cantos y lo separamos del piso.',
                    ],
                    [
                        'q' => '¿Cuesta más que la melamina común?',
                        'a' => 'Un poco más. En cocinas y muebles de baño ya va incluida. En closets la puedes pedir como mejora y la diferencia aparece en la cotización.',
                    ],
                    [
                        'q' => '¿Pueden arreglar un mueble que ya se hinchó?',
                        'a' => 'Depende del daño. Si es una pieza, la cambiamos por una de melamina RH. Si está dañado casi todo el mueble, suele convenir hacerlo nuevo. Lo revisamos con fotos.',
                    ],
                ],
                'ctaTitle' => '¿Tu closet o cocina está en una zona húmeda?',
                'ctaDescription' => 'Envía fotos del espacio y te recomendamos el material antes de cotizar.',
                'relatedLinks' => [
                    ['label' => 'Closets y cocinas', 'href' => '/servicios/closets-anaqueles-cocina-guayaquil'],
                    ['label' => 'Muebles para casa nueva', 'href' => '/casa-nueva-guayaquil'],
                    ['label' => 'Comején en puertas y muebles', 'href' => '/comejen-puertas-muebles-guayaquil'],
                    ['label' => 'Carpintería a medida', 'href' => '/carpinteria-a-medida-guayaquil'],
                ],
            ],
            'comejen-puertas-muebles-guayaquil' => [
                'slug' => 'comejen-puertas-muebles-guayaquil',
                'guide' => true,
                'quoteService' => 'reparacion-muebles-madera-guayaquil',
                'productSlugs' => ['rapido-cambio-piezas-comejen', 'producto-puerta-wpc', 'rapido-puerta-interior'],
                'productsEyebrow' => 'Reparación y cambio',
                'productsTitle' => 'Cambiamos lo que el comején dañó',
                'productsIntro' => 'Primero revisamos el daño con fotos. El precio depende de cuántas piezas hay que cambiar.',
                'title' => 'Daños por comején en puertas y muebles | Punto Madera',
                'metaDescription' => '¿Polvillo o huecos en tu puerta, marco o closet? En Guayaquil cambiamos las piezas dañadas por comején y te recomendamos materiales que resisten mejor.',
                'serviceName' => 'Reparación de daños por comején en Guayaquil',
                'h1' => 'Puertas, marcos y muebles dañados por comején',
                'eyebrow' => 'Guía · Comején · Reparación',
                'intro' => 'El comején avanza por dentro de la madera y casi siempre se nota tarde: polvillo, huecos o una puerta que suena hueca. Cambiamos marcos, puertas y piezas de muebles dañadas, y te recomendamos materiales que el comején ataca menos.',
                'intent' => 'Para casas, departamentos y locales de Guayaquil con marcos, puertas, closets o muebles de madera afectados.',
                'heroImage' => '/images/works/punto-madera/punto-madera-28.jpg',
                'heroImageAlt' => 'Instalación de una puerta nueva por Punto Madera',
                'heroCaptionTitle' => 'Primero se elimina la plaga',
                'heroCaption' => 'Si el comején sigue activo, fumiga con una empresa de control de plagas antes de cambiar las piezas.',
                'primaryCta' => 'Cotizar reparación',
                'message' => 'Hola, tengo comején en una puerta o mueble y quiero cotizar el cambio de piezas. Les envío fotos.',
                'servicesTitle' => 'Qué hacemos',
                'services' => [
                    'Revisamos con fotos o en visita hasta dónde llega el daño.',
                    'Retiramos y cambiamos marcos, tapamarcos, puertas o piezas de muebles.',
                    'Sellamos los cantos y las uniones de las piezas nuevas.',
                    'Te recomendamos materiales que el comején ataca menos.',
                ],
                'problemsTitle' => 'Señales de comején',
                'problems' => [
                    'Polvillo fino o bolitas como arena cerca de la madera.',
                    'Huecos pequeños o caminos de tierra en paredes y marcos.',
                    'Madera que suena hueca o se hunde al presionarla.',
                    'Alas pequeñas en el piso después de una lluvia.',
                ],
                'materialsTitle' => 'Materiales que recomendamos',
                'materials' => ['Melamina con cantos sellados', 'Madera tratada', 'Puertas de material compuesto (WPC), según disponibilidad', 'Marcos nuevos'],
                'processHeading' => 'Cómo trabajamos un daño por comején',
                'process' => [
                    'Nos envías fotos o un video del daño y de la zona.',
                    'Si la plaga sigue activa, primero se fumiga con una empresa especializada.',
                    'Cambiamos las piezas dañadas por material nuevo y sellado.',
                    'Te explicamos cómo revisar la madera para detectar el comején a tiempo.',
                ],
                'faqs' => [
                    [
                        'q' => '¿Ustedes fumigan el comején?',
                        'a' => 'No. La fumigación la hace una empresa de control de plagas. Nosotros cambiamos y reparamos la madera dañada, mejor después de fumigar para que la plaga no pase a las piezas nuevas.',
                    ],
                    [
                        'q' => '¿Se puede salvar una puerta con comején?',
                        'a' => 'Si el daño es pequeño y está en una sola zona, a veces se repara. Si la puerta suena hueca en varias partes o el marco está comido, conviene cambiarlos.',
                    ],
                    [
                        'q' => '¿Qué material resiste mejor el comején?',
                        'a' => 'Ninguna madera es inmune. La melamina con cantos sellados y la madera tratada resisten mejor, y las puertas de material compuesto (WPC) no le sirven de alimento. Consúltanos la disponibilidad.',
                    ],
                    [
                        'q' => '¿Cómo sé si todavía hay comején?',
                        'a' => 'Limpia el polvillo y revisa en unos días. Si aparece polvillo nuevo, la plaga sigue activa: fumiga primero y luego cambiamos las piezas.',
                    ],
                ],
                'ctaTitle' => 'Envía fotos del daño y te decimos qué conviene',
                'ctaDescription' => 'Con fotos del marco, la puerta o el mueble te decimos si conviene reparar o cambiar antes de cotizar.',
                'relatedLinks' => [
                    ['label' => 'Reparación de puertas', 'href' => '/reparacion-puertas-guayaquil'],
                    ['label' => 'Reparación de muebles', 'href' => '/servicios/reparacion-muebles-madera-guayaquil'],
                    ['label' => 'Muebles resistentes a la humedad', 'href' => '/muebles-resistentes-humedad-guayaquil'],
                    ['label' => 'Instalación de puertas', 'href' => '/instalacion-puertas-guayaquil'],
                ],
            ],
            'puertas-seguridad-guayaquil' => [
                'slug' => 'puertas-seguridad-guayaquil',
                'guide' => true,
                'quoteService' => 'instalacion-reparacion-puertas-madera-guayaquil',
                'productSlugs' => ['rapido-refuerzo-puerta', 'producto-cerradura-digital', 'producto-chapa-sobreponer', 'material-puerta-laurel'],
                'productsEyebrow' => 'Para tu puerta principal',
                'productsTitle' => 'Refuerza tu puerta o cambia la cerradura',
                'productsIntro' => 'El precio depende del tipo de puerta, del marco y de la cerradura que elijas.',
                'title' => 'Puertas de seguridad en Guayaquil | Punto Madera',
                'metaDescription' => 'Refuerza tu puerta principal en Guayaquil: marco y bisagras firmes, cerrojo o cerradura digital y puertas macizas de madera. Cotiza por WhatsApp.',
                'serviceName' => 'Puertas y chapas de seguridad en Guayaquil',
                'h1' => 'Una puerta principal más segura para tu casa',
                'eyebrow' => 'Guía · Seguridad · Puertas y chapas',
                'intro' => 'Muchas puertas ceden por el marco, las bisagras o una sola chapa débil, no por la hoja. Reforzamos marcos y bisagras, instalamos cerrojos y cerraduras digitales y cambiamos puertas huecas por puertas macizas de madera.',
                'intent' => 'Para casas, departamentos, suites y locales que quieren una entrada más difícil de forzar.',
                'heroImage' => '/images/works/punto-madera/punto-madera-02.jpg',
                'heroImageAlt' => 'Puerta maciza de madera instalada por Punto Madera',
                'heroCaptionTitle' => 'Revisamos toda la puerta',
                'heroCaption' => 'Marco, bisagras, cerradura y hoja: te decimos qué reforzar primero.',
                'primaryCta' => 'Cotizar refuerzo',
                'message' => 'Hola, quiero reforzar la seguridad de mi puerta principal. Les envío fotos.',
                'servicesTitle' => 'Qué hacemos',
                'services' => [
                    'Refuerzo del marco con tornillos largos que llegan a la pared.',
                    'Bisagras más gruesas y bien fijadas.',
                    'Instalación de cerrojos de sobreponer y cerraduras digitales.',
                    'Cambio de puertas huecas por puertas macizas de madera.',
                ],
                'problemsTitle' => 'Puntos débiles más comunes',
                'problems' => [
                    'Marco flojo o fijado solo con tornillos cortos.',
                    'Puerta hueca (tamborada) en la entrada principal.',
                    'Una chapa de pomo como única cerradura.',
                    'Bisagras delgadas o con tornillos flojos.',
                ],
                'materialsTitle' => 'Opciones',
                'materials' => ['Cerrojo de sobreponer', 'Cerradura digital', 'Puerta maciza de madera', 'Bisagras reforzadas', 'Tornillos largos al muro'],
                'processHeading' => 'Cómo reforzamos tu puerta',
                'process' => [
                    'Nos envías fotos de la puerta por fuera y por dentro, y del marco.',
                    'Te decimos qué punto débil conviene reforzar primero.',
                    'Instalamos el refuerzo, la cerradura o la puerta nueva.',
                    'Probamos el cierre, las llaves o las claves y te explicamos el uso.',
                ],
                'faqs' => [
                    [
                        'q' => '¿Una puerta reforzada evita un robo?',
                        'a' => 'Ninguna puerta es imposible de abrir, pero una con marco firme, buenas bisagras y dos puntos de cierre toma mucho más tiempo y esfuerzo para forzarla.',
                    ],
                    [
                        'q' => '¿Qué conviene más: cerrojo o cerradura digital?',
                        'a' => 'El cerrojo de sobreponer suma un segundo punto de cierre a bajo costo. La cerradura digital evita copias de llaves y es práctica en suites y Airbnb. Muchas casas usan ambos.',
                    ],
                    [
                        'q' => '¿Tengo que cambiar toda la puerta?',
                        'a' => 'No siempre. Si la hoja es maciza y está firme, basta con reforzar el marco, las bisagras y la cerradura. Si es hueca, conviene cambiarla por una maciza.',
                    ],
                    [
                        'q' => '¿Instalan puertas metálicas o rejas?',
                        'a' => 'No. Trabajamos puertas de madera, marcos y cerraduras. Para rejas o puertas metálicas te conviene un taller de metalmecánica.',
                    ],
                ],
                'ctaTitle' => 'Envía fotos de tu puerta y te decimos qué reforzar',
                'ctaDescription' => 'Con fotos de la puerta por ambos lados y del marco te recomendamos el refuerzo antes de cotizar.',
                'relatedLinks' => [
                    ['label' => 'Puertas, chapas y accesorios', 'href' => '/puertas-madera-chapas-guayaquil'],
                    ['label' => 'Instalación de puertas', 'href' => '/instalacion-puertas-guayaquil'],
                    ['label' => 'Reparación de puertas', 'href' => '/reparacion-puertas-guayaquil'],
                    ['label' => 'Empresas y Airbnb', 'href' => '/empresas'],
                ],
            ],
        ];
    }
}
