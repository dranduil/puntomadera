<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use App\Support\BusinessSchema;
use App\Support\QuotePackages;
use App\Support\QuoteSettings;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Landing pages that sell bigger jobs: new-house packages and maintenance
 * plans for businesses. No prices: every call to action opens /cotizar.
 */
class MoneyPageController extends Controller
{
    /** Also published in llms-full.txt. */
    public const CASA_NUEVA_FAQS = [
        ['q' => '¿Cuánto tarda un paquete para casa nueva?', 'a' => 'Depende de cuántos closets y metros de cocina sean. Te damos el plazo exacto en la cotización, después de la visita de medidas.'],
        ['q' => '¿Qué material usan para la cocina?', 'a' => 'Melamina RH, resistente a la humedad, para muebles bajos y altos. Si prefieres MDF lacado también lo cotizamos.'],
        ['q' => '¿Los closets se hinchan con la humedad de Guayaquil?', 'a' => 'Sellamos todos los cantos y separamos el mueble del piso. Si el closet va junto al baño o en una pared húmeda, pídelo en melamina RH, resistente a la humedad.'],
        ['q' => '¿Incluye el mesón?', 'a' => 'El mesón de granito o cuarzo lo coordinamos con un aliado de confianza y va en la misma cotización, para que tengas un solo responsable.'],
        ['q' => '¿Cómo se paga?', 'a' => 'Con un anticipo para comprar materiales y empezar, y el saldo a la entrega. Puedes pagar con Deuna o transferencia.'],
        ['q' => '¿Atienden mi urbanización?', 'a' => 'Sí, trabajamos en Guayaquil, La Aurora, Daule, Samborondón, Vía a la Costa y Durán. La movilización depende de la zona y se indica en la cotización.'],
    ];

    public const EMPRESAS_FAQS = [
        ['q' => '¿Atienden varias propiedades a la vez?', 'a' => 'Sí. Armamos un cronograma de visitas para tus suites, departamentos u oficinas y te reportamos cada trabajo con fotos.'],
        ['q' => '¿Qué incluye el mantenimiento?', 'a' => 'Revisión y ajuste de puertas, chapas, bisagras, closets, cajones y muebles, además de reparaciones que aparezcan entre visitas.'],
        ['q' => '¿Cuánto cuesta un plan?', 'a' => 'Depende del número de propiedades y de la frecuencia de visitas. Cuéntanos tu caso y te enviamos una propuesta.'],
        ['q' => '¿Qué pasa con una urgencia?', 'a' => 'Los clientes con plan tienen prioridad para reparaciones urgentes, como una chapa dañada antes de la llegada de un huésped.'],
    ];

    public function casaNueva(): Response
    {
        return $this->render('landing/casa-nueva', '/casa-nueva-guayaquil', [
            'title' => 'Muebles para casa nueva en Guayaquil | Punto Madera',
            'description' => 'Paquetes para casa nueva en Guayaquil, La Aurora, Daule y Vía a la Costa: closets, cocina de melamina RH y puertas, con una sola visita. Cotiza en línea.',
            'serviceName' => 'Paquetes de carpintería para casa nueva en Guayaquil',
            'breadcrumb' => 'Casa nueva',
            'image' => 'images/works/punto-madera/punto-madera-10.jpg',
        ], self::CASA_NUEVA_FAQS, [
            'packages' => QuotePackages::forPublic(),
        ]);
    }

    public function empresas(): Response
    {
        return $this->render('landing/empresas', '/empresas', [
            'title' => 'Carpintería para empresas y Airbnb en Guayaquil | Punto Madera',
            'description' => 'Planes de mantenimiento de puertas, chapas, closets y muebles para Airbnb, edificios y oficinas en Guayaquil. Prioridad en urgencias y reporte con fotos.',
            'serviceName' => 'Mantenimiento de carpintería para empresas en Guayaquil',
            'breadcrumb' => 'Empresas y Airbnb',
            'image' => 'images/works/punto-madera/punto-madera-01.jpg',
        ], self::EMPRESAS_FAQS);
    }

    /**
     * @param  array{title: string, description: string, serviceName: string, breadcrumb: string, image: string}  $meta
     * @param  list<array{q: string, a: string}>  $faqs
     * @param  array<string, mixed>  $props
     */
    private function render(string $component, string $path, array $meta, array $faqs, array $props = []): Response
    {
        $landing = HomeLanding::query()->first()?->toArray() ?? ['whatsapp_number' => null, 'contact_phone' => null, 'areas_served' => null];
        $siteUrl = rtrim((string) config('app.url', 'http://localhost'), '/') ?: 'http://localhost';
        $canonical = $siteUrl.$path;

        return Inertia::render($component, [
            ...$props,
            'faqs' => $faqs,
            'whatsapp_number' => QuoteSettings::whatsappNumber(),
            'seo' => [
                'title' => $meta['title'],
                'description' => $meta['description'],
                'canonical' => $canonical,
                'image' => "{$siteUrl}/{$meta['image']}",
                'jsonLd' => [
                    '@context' => 'https://schema.org',
                    '@graph' => [
                        BusinessSchema::node($siteUrl, $landing),
                        [
                            '@type' => 'Service',
                            '@id' => "{$canonical}#service",
                            'name' => $meta['serviceName'],
                            'description' => $meta['description'],
                            'provider' => ['@id' => "{$siteUrl}/#business"],
                            'areaServed' => collect(BusinessSchema::areasServed($landing['areas_served'] ?? null))
                                ->map(fn (string $name) => ['@type' => 'Place', 'name' => $name])
                                ->values(),
                            'url' => $canonical,
                        ],
                        [
                            '@type' => 'FAQPage',
                            'mainEntity' => collect($faqs)->map(fn (array $faq) => [
                                '@type' => 'Question',
                                'name' => $faq['q'],
                                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $faq['a']],
                            ])->values(),
                        ],
                        [
                            '@type' => 'BreadcrumbList',
                            'itemListElement' => [
                                ['@type' => 'ListItem', 'position' => 1, 'name' => 'Inicio', 'item' => $siteUrl],
                                ['@type' => 'ListItem', 'position' => 2, 'name' => $meta['breadcrumb'], 'item' => $canonical],
                            ],
                        ],
                    ],
                ],
            ],
        ]);
    }
}
