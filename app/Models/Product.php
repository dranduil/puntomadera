<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'sku',
        'summary',
        'description',
        'price_cents',
        'currency',
        'stock_qty',
        'image_path',
        'is_featured',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'price_cents' => 'integer',
            'stock_qty' => 'integer',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ];
    }
}
