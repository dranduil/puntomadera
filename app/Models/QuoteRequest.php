<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class QuoteRequest extends Model
{
    public const TYPES = ['cliente', 'casa_nueva', 'empresa'];

    public const STATUSES = ['nuevo', 'cotizado', 'derivado', 'cerrado', 'perdido'];

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
}
