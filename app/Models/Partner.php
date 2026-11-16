<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Partner extends Model
{
    protected $fillable = [
        'name',
        'trade',
        'phone',
        'commission_percent',
        'notes',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'commission_percent' => 'float',
            'is_active' => 'boolean',
        ];
    }

    public function catalogItems(): HasMany
    {
        return $this->hasMany(CatalogItem::class);
    }

    public function quoteItems(): HasMany
    {
        return $this->hasMany(QuoteItem::class);
    }
}
