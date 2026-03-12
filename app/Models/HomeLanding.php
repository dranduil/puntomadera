<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HomeLanding extends Model
{
    protected $fillable = [
        'hero_title',
        'hero_subtitle',
        'seo_title',
        'seo_description',
        'whatsapp_number',
        'contact_email',
        'contact_phone',
        'areas_served',
    ];

    protected function casts(): array
    {
        return [
            'areas_served' => 'array',
        ];
    }
}
