<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Work extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'description',
        'worked_on',
        'location',
        'images',
        'image_alts',
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'worked_on' => 'date',
            'images' => 'array',
            'image_alts' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
