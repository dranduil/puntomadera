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
        'is_published',
    ];

    protected function casts(): array
    {
        return [
            'process_steps' => 'array',
            'is_published' => 'boolean',
        ];
    }
}
