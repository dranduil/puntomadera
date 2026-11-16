<?php

namespace App\Support;

use App\Models\CatalogItem;

/**
 * "Casa nueva" bundles: a starting set of catalog items for people who just
 * got the keys to a new house. Used by /cotizar and the casa nueva page.
 */
final class QuotePackages
{
    public const ALL = [
        'closets' => [
            'name' => 'Paquete closets',
            'description' => 'Closets de melamina para los dormitorios, a medida de cada espacio.',
            'highlights' => ['Closet por dormitorio', 'Cajones y repisas a tu gusto', 'Opción de puertas corredizas'],
            'items' => ['material-closet-batiente', 'material-extra-cierre-suave'],
        ],
        'cocina' => [
            'name' => 'Paquete cocina',
            'description' => 'Muebles bajos y altos de melamina resistente a la humedad, con mesón coordinado.',
            'highlights' => ['Muebles bajos y altos', 'Melamina RH para cocina', 'Mesón de granito o cuarzo con aliado'],
            'items' => ['material-cocina-baja', 'material-cocina-alta', 'aliado-meson-granito', 'material-extra-cierre-suave'],
        ],
        'completo' => [
            'name' => 'Casa completa',
            'description' => 'Closets, cocina y puertas interiores en un solo proyecto y con una sola visita de medidas.',
            'highlights' => ['Closets + cocina + puertas', 'Una sola visita de medidas', 'Un solo cronograma de entrega'],
            'items' => ['material-closet-batiente', 'material-cocina-baja', 'material-cocina-alta', 'aliado-meson-granito', 'material-puerta-mdf', 'producto-chapa-pomo'],
        ],
    ];

    public static function keys(): array
    {
        return array_keys(self::ALL);
    }

    /**
     * Packages with their item slugs resolved to public catalog ids.
     *
     * @return list<array{key: string, name: string, description: string, highlights: list<string>, item_ids: list<int>}>
     */
    public static function forPublic(): array
    {
        $ids = CatalogItem::query()->active()->public()
            ->whereIn('slug', collect(self::ALL)->pluck('items')->flatten()->unique())
            ->pluck('id', 'slug');

        return collect(self::ALL)->map(fn (array $package, string $key) => [
            'key' => $key,
            'name' => $package['name'],
            'description' => $package['description'],
            'highlights' => $package['highlights'],
            'item_ids' => collect($package['items'])->map(fn (string $slug) => $ids[$slug] ?? null)->filter()->values()->all(),
        ])->values()->all();
    }

    public static function name(?string $key): ?string
    {
        return $key ? (self::ALL[$key]['name'] ?? null) : null;
    }
}
