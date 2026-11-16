<?php

namespace App\Support;

/**
 * The one HomeAndConstructionBusiness node shared by every page that emits
 * structured data, so search engines see a single consistent business entity
 * (same @id, name, phone and coverage) instead of slightly different copies.
 */
final class BusinessSchema
{
    public const NAME = 'Punto Madera';

    /** @var list<string> */
    public const DEFAULT_AREAS = [
        'Guayaquil (Norte y Sur)',
        'Urdesa',
        'Vía a la Costa',
        'Samborondón',
        'Daule',
    ];

    /**
     * @param  array<int, mixed>|null  $configuredAreas
     * @return list<string>
     */
    public static function areasServed(?array $configuredAreas): array
    {
        $areas = collect($configuredAreas ?? [])
            ->map(fn (mixed $area) => trim((string) $area))
            ->filter()
            ->unique()
            ->values()
            ->all();

        return $areas === [] ? self::DEFAULT_AREAS : $areas;
    }

    /**
     * @param  array<string, mixed>  $landing  HomeLanding attributes (may be the empty defaults).
     * @return array<string, mixed>
     */
    public static function node(string $siteUrl, array $landing): array
    {
        $siteUrl = rtrim($siteUrl, '/');
        $business = (array) config('services.business', []);

        return array_filter([
            '@type' => 'HomeAndConstructionBusiness',
            '@id' => "{$siteUrl}/#business",
            'name' => self::NAME,
            'url' => "{$siteUrl}/",
            'logo' => "{$siteUrl}/apple-touch-icon.png",
            'image' => "{$siteUrl}/images/works/puerta-caoba-regenerada.png",
            'telephone' => self::telephone($landing),
            'email' => self::clean($landing['contact_email'] ?? null),
            'address' => array_filter([
                '@type' => 'PostalAddress',
                'streetAddress' => self::clean($business['street_address'] ?? null),
                'addressLocality' => 'Guayaquil',
                'addressRegion' => 'Guayas',
                'addressCountry' => 'EC',
            ]),
            'geo' => [
                '@type' => 'GeoCoordinates',
                'latitude' => -2.170998,
                'longitude' => -79.922356,
            ],
            'areaServed' => [
                ['@type' => 'City', 'name' => 'Guayaquil'],
                ...collect(self::areasServed($landing['areas_served'] ?? null))
                    ->map(fn (string $name) => ['@type' => 'Place', 'name' => $name])
                    ->all(),
            ],
            'openingHours' => self::clean($business['opening_hours'] ?? null),
            'sameAs' => array_values(array_filter((array) ($business['same_as'] ?? []))),
        ], fn (mixed $value) => filled($value));
    }

    /**
     * Admin contact phone, then BUSINESS_PHONE, then the WhatsApp number in E.164.
     *
     * @param  array<string, mixed>  $landing
     */
    public static function telephone(array $landing): ?string
    {
        $phone = self::clean($landing['contact_phone'] ?? null)
            ?? self::clean(config('services.business.phone'));

        if ($phone !== null) {
            return $phone;
        }

        $digits = preg_replace('/\D/', '', (string) (
            config('services.whatsapp.number') ?: ($landing['whatsapp_number'] ?? '')
        ));

        return $digits !== '' ? "+{$digits}" : null;
    }

    private static function clean(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' ? null : $value;
    }
}
