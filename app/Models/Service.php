<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'summary',
        'description',
        'process_steps',
        'default_message',
        'sku',
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
            'process_steps' => 'array',
            'price_cents' => 'integer',
            'stock_qty' => 'integer',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ];
    }
}
