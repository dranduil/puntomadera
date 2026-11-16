<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

/**
 * One line of the internal price list. Prices never leave the admin: public
 * pages only receive {@see toPublicArray()}.
 */
class CatalogItem extends Model
{
    public const KINDS = ['servicio', 'producto', 'extra', 'aliado'];

    public const UNITS = ['unidad', 'metro_lineal', 'm2', 'servicio', 'porcentaje'];

    public const UNIT_LABELS = [
        'unidad' => 'unidad',
        'metro_lineal' => 'metro lineal',
        'm2' => 'm²',
        'servicio' => 'servicio',
        'porcentaje' => '%',
    ];

    protected $fillable = [
        'kind',
        'service_id',
        'partner_id',
        'name',
        'slug',
        'description',
        'unit',
        'price_min_cents',
        'price_max_cents',
        'cost_cents',
        'includes_material',
        'image_path',
        'is_public',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'price_min_cents' => 'integer',
            'price_max_cents' => 'integer',
            'cost_cents' => 'integer',
            'includes_material' => 'boolean',
            'is_public' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }

    public function suggestions(): BelongsToMany
    {
        return $this->belongsToMany(self::class, 'catalog_item_suggestions', 'catalog_item_id', 'suggested_item_id')
            ->withPivot(['reason', 'sort_order'])
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order')->orderBy('name');
    }

    public function scopePublic(Builder $query): Builder
    {
        return $query->active()->where('is_public', true);
    }

    /**
     * Raise or lower money prices (min, max, cost) by a percentage. Percentage
     * items and items without a price are left alone.
     *
     * @return list<array{slug: string, name: string, from_cents: int, to_cents: int}>
     */
    public static function adjustPrices(float $percent, ?int $serviceId = null, bool $dryRun = false): array
    {
        $factor = 1 + $percent / 100;
        $scale = fn (?int $cents): ?int => $cents === null ? null : (int) round($cents * $factor);

        return self::query()
            ->where('unit', '!=', 'porcentaje')
            ->where('price_min_cents', '>', 0)
            ->when($serviceId, fn (Builder $query) => $query->where('service_id', $serviceId))
            ->get()
            ->map(function (self $item) use ($scale, $dryRun): array {
                $change = [
                    'slug' => $item->slug,
                    'name' => $item->name,
                    'from_cents' => $item->price_min_cents,
                    'to_cents' => $scale($item->price_min_cents),
                ];

                if (! $dryRun) {
                    $item->update([
                        'price_min_cents' => $change['to_cents'],
                        'price_max_cents' => $scale($item->price_max_cents),
                        'cost_cents' => $scale($item->cost_cents),
                    ]);
                }

                return $change;
            })
            ->all();
    }

    public static function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'item';
        $slug = $base;
        $i = 1;

        while (self::query()->where('slug', $slug)->when($ignoreId, fn ($q) => $q->whereKeyNot($ignoreId))->exists()) {
            $slug = "{$base}-".$i++;
        }

        return $slug;
    }

    public function isPercentage(): bool
    {
        return $this->unit === 'porcentaje';
    }

    /**
     * What a visitor may see: never a price, cost or partner.
     *
     * @return array{id: int, slug: string, kind: string, name: string, description: ?string, unit: string, service_id: ?int, includes_material: bool, image_url: ?string}
     */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'kind' => $this->kind,
            'name' => $this->name,
            'description' => $this->description,
            'unit' => $this->unit,
            'service_id' => $this->service_id,
            'includes_material' => $this->includes_material,
            'image_url' => $this->image_path ? '/'.ltrim($this->image_path, '/') : null,
        ];
    }
}
