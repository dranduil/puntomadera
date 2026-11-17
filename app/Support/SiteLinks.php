<?php

namespace App\Support;

use App\Models\HomeLanding;

/**
 * The public footer's links, grouped by what a visitor is looking for. Blade
 * pages read them here and Inertia pages receive them as the shared `site`
 * prop, so every public page shows the same footer.
 */
final class SiteLinks
{
    /**
     * @return list<array{title: string, links: list<array{label: string, href: string}>}>
     */
    public static function footer(): array
    {
        return [
            [
                'title' => 'Servicios',
                'links' => [
                    ['label' => 'Closets y cocinas', 'href' => '/servicios/closets-anaqueles-cocina-guayaquil'],
                    ['label' => 'Muebles a medida', 'href' => '/carpinteria-a-medida-guayaquil'],
                    ['label' => 'Puertas y chapas', 'href' => '/puertas-madera-chapas-guayaquil'],
                    ['label' => 'Instalar puertas', 'href' => '/instalacion-puertas-guayaquil'],
                    ['label' => 'Reparar puertas', 'href' => '/reparacion-puertas-guayaquil'],
                    ['label' => 'Todos los servicios', 'href' => '/servicios'],
                ],
            ],
            [
                'title' => 'Proyectos',
                'links' => [
                    ['label' => 'Casa nueva', 'href' => '/casa-nueva-guayaquil'],
                    ['label' => 'Empresas y Airbnb', 'href' => '/empresas'],
                ],
            ],
            [
                'title' => 'Guías',
                'links' => [
                    ['label' => 'Muebles y humedad', 'href' => '/muebles-resistentes-humedad-guayaquil'],
                    ['label' => 'Comején', 'href' => '/comejen-puertas-muebles-guayaquil'],
                    ['label' => 'Puertas de seguridad', 'href' => '/puertas-seguridad-guayaquil'],
                ],
            ],
            [
                'title' => 'Punto Madera',
                'links' => [
                    ['label' => 'Trabajos', 'href' => '/trabajos'],
                    ['label' => 'Opiniones', 'href' => '/resenas'],
                    ['label' => 'Contacto', 'href' => '/contacto'],
                ],
            ],
        ];
    }

    /**
     * Footer data for Inertia pages.
     *
     * @return array{footer: list<array{title: string, links: list<array{label: string, href: string}>}>, whatsappNumber: string, contactPhone: ?string}
     */
    public static function shared(): array
    {
        $landing = HomeLanding::query()->first();

        return [
            'footer' => self::footer(),
            'whatsappNumber' => QuoteSettings::whatsappNumber($landing),
            'contactPhone' => $landing?->contact_phone ?: null,
        ];
    }
}
