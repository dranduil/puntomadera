<?php

namespace App\Models;

use App\Support\QuotePackages;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuoteRequest extends Model
{
    public const TYPES = ['cliente', 'casa_nueva', 'empresa'];

    public const STATUSES = ['nuevo', 'cotizado', 'derivado', 'cerrado', 'perdido'];

    public const TYPE_LABELS = ['cliente' => 'Hogar', 'casa_nueva' => 'Casa nueva', 'empresa' => 'Empresa'];

    protected $fillable = [
        'reference',
        'type',
        'package',
        'name',
        'phone',
        'email',
        'company',
        'properties_count',
        'service_zone_id',
        'sector',
        'message',
        'services',
        'items',
        'accepted_suggestions',
        'photos',
        'source_path',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'status',
        'referred_partner_id',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'services' => 'array',
            'items' => 'array',
            'accepted_suggestions' => 'array',
            'photos' => 'array',
            'properties_count' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::created(function (QuoteRequest $request): void {
            if ($request->reference === null) {
                $request->forceFill([
                    'reference' => sprintf('PM-%s-%04d', $request->created_at->format('ym'), $request->id),
                ])->saveQuietly();
            }
        });
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(ServiceZone::class, 'service_zone_id');
    }

    public function referredPartner(): BelongsTo
    {
        return $this->belongsTo(Partner::class, 'referred_partner_id');
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }

    /**
     * Human summary of what the client asked for, shared by the confirmation
     * page, the WhatsApp message and the admin inbox.
     *
     * @return list<string>
     */
    public function summaryLines(): array
    {
        $lines = [];

        if ($this->type === 'casa_nueva') {
            $lines[] = 'Casa nueva'.(($name = QuotePackages::name($this->package)) ? ": {$name}" : '');
        }

        if ($this->type === 'empresa') {
            $lines[] = 'Empresa: '.($this->company ?: '—').($this->properties_count ? " ({$this->properties_count} propiedades)" : '');
        }

        $services = Service::query()->whereIn('id', $this->services ?? [])->pluck('name');

        if ($services->isNotEmpty()) {
            $lines[] = 'Servicios: '.$services->map(fn (string $name) => preg_replace('/\s+en Guayaquil$/u', '', $name))->implode(', ');
        }

        foreach ($this->items ?? [] as $item) {
            $lines[] = '• '.$item['name'].' — '.self::formatQuantity((float) $item['quantity'], (string) ($item['unit'] ?? 'unidad'));
        }

        $suggestions = CatalogItem::query()->whereIn('id', $this->accepted_suggestions ?? [])->pluck('name');

        if ($suggestions->isNotEmpty()) {
            $lines[] = 'También me interesa: '.$suggestions->implode(', ');
        }

        $place = collect([$this->zone?->name, $this->sector])->filter()->implode(' — ');

        if ($place !== '') {
            $lines[] = "Zona: {$place}";
        }

        return $lines;
    }

    public function whatsappMessage(): string
    {
        return "Hola, soy {$this->name}. Acabo de pedir una cotización en la web, referencia {$this->reference}.\n\n"
            .implode("\n", $this->summaryLines())
            ."\n\nTe envío fotos o medidas por aquí.";
    }

    public static function formatQuantity(float $quantity, string $unit): string
    {
        $number = rtrim(rtrim(number_format($quantity, 2, ',', '.'), '0'), ',');

        return match ($unit) {
            'metro_lineal' => "{$number} m lineales",
            'm2' => "{$number} m²",
            'servicio' => 'servicio',
            default => "{$number} ".($quantity == 1 ? 'unidad' : 'unidades'),
        };
    }
}
