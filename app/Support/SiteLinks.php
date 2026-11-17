<?php

namespace App\Support;

use App\Models\HomeLanding;

/**
 * The public header and footer links. Blade pages read them here and Inertia
 * pages receive them as the shared `site` prop, so every public page shows
 * the same menu and footer.
 */
final class SiteLinks
{
    /**
     * Main menu: what people come for, then proof and contact. The logo links
     * home, and guides and door pages live in the footer.
     *
     * @return list<array{label: string, href: string}>
     */
    public static function header(): array
    {
        return [
            ['label' => 'Servicios', 'href' => '/servicios'],
            ['label' => 'Casa nueva', 'href' => '/casa-nueva-guayaquil'],
            ['label' => 'Empresas', 'href' => '/empresas'],
            ['label' => 'Trabajos', 'href' => '/trabajos'],
            ['label' => 'Opiniones', 'href' => '/resenas'],
            ['label' => 'Contacto', 'href' => '/contacto'],
        ];
    }

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
     * Header and footer data for Inertia pages.
     *
     * @return array{header: list<array{label: string, href: string}>, footer: list<array{title: string, links: list<array{label: string, href: string}>}>, whatsappNumber: string, contactPhone: ?string}
     */
    public static function shared(): array
    {
        $landing = HomeLanding::query()->first();

        return [
            'header' => self::header(),
            'footer' => self::footer(),
            'whatsappNumber' => QuoteSettings::whatsappNumber($landing),
            'contactPhone' => $landing?->contact_phone ?: null,
        ];
    }
}
