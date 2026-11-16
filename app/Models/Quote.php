<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Quote extends Model
{
    public const STATUSES = ['borrador', 'enviada', 'vista', 'aceptada', 'rechazada', 'pagada'];

    public const PAYMENT_METHODS = ['deuna', 'transferencia', 'efectivo', 'tarjeta', 'otro'];

    protected $fillable = [
        'quote_request_id',
        'client_name',
        'client_phone',
        'service_zone_id',
        'travel_fee_cents',
        'visit_fee_cents',
        'discount_cents',
        'iva_percent',
        'subtotal_cents',
        'iva_cents',
        'total_cents',
        'deposit_percent',
        'deposit_cents',
        'valid_until',
        'notes',
        'terms',
        'payment_link',
        'status',
        'sent_at',
        'viewed_at',
        'accepted_at',
        'rejected_at',
        'payment_reported_at',
        'paid_at',
        'paid_amount_cents',
        'payment_method',
    ];

    protected $hidden = ['token'];

    protected function casts(): array
    {
        return [
            'travel_fee_cents' => 'integer',
            'visit_fee_cents' => 'integer',
            'discount_cents' => 'integer',
            'iva_percent' => 'integer',
            'subtotal_cents' => 'integer',
            'iva_cents' => 'integer',
            'total_cents' => 'integer',
            'deposit_percent' => 'integer',
            'deposit_cents' => 'integer',
            'paid_amount_cents' => 'integer',
            'valid_until' => 'date',
            'sent_at' => 'datetime',
            'viewed_at' => 'datetime',
            'accepted_at' => 'datetime',
            'rejected_at' => 'datetime',
            'payment_reported_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Quote $quote): void {
            $quote->token ??= Str::random(48);
        });

        static::created(function (Quote $quote): void {
            if ($quote->number === null) {
                $quote->forceFill(['number' => sprintf('COT-%s-%04d', $quote->created_at->format('ym'), $quote->id)])->saveQuietly();
            }
        });
    }

    public function request(): BelongsTo
    {
        return $this->belongsTo(QuoteRequest::class, 'quote_request_id');
    }

    public function zone(): BelongsTo
    {
        return $this->belongsTo(ServiceZone::class, 'service_zone_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(QuoteItem::class)->orderBy('sort_order')->orderBy('id');
    }

    public function publicUrl(): string
    {
        return route('quotes.public.show', $this->token);
    }

    public function isExpired(): bool
    {
        return $this->valid_until !== null
            && $this->valid_until->endOfDay()->isPast()
            && ! in_array($this->status, ['aceptada', 'pagada'], true);
    }

    public function isLocked(): bool
    {
        return in_array($this->status, ['aceptada', 'pagada'], true);
    }
}
