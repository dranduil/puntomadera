<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuoteItem extends Model
{
    protected $fillable = [
        'quote_id',
        'catalog_item_id',
        'partner_id',
        'description',
        'unit',
        'quantity',
        'unit_price_cents',
        'total_cents',
        'commission_percent',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'float',
            'unit_price_cents' => 'integer',
            'total_cents' => 'integer',
            'commission_percent' => 'float',
            'sort_order' => 'integer',
        ];
    }

    public function quote(): BelongsTo
    {
        return $this->belongsTo(Quote::class);
    }

    public function catalogItem(): BelongsTo
    {
        return $this->belongsTo(CatalogItem::class);
    }

    public function partner(): BelongsTo
    {
        return $this->belongsTo(Partner::class);
    }
}
