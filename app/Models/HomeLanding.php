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
        'quote_terms',
        'quote_validity_days',
        'deposit_percent',
        'iva_enabled',
        'deuna_payment_link',
        'deuna_qr_path',
        'bank_transfer_details',
    ];

    protected function casts(): array
    {
        return [
            'areas_served' => 'array',
            'quote_validity_days' => 'integer',
            'deposit_percent' => 'integer',
            'iva_enabled' => 'boolean',
        ];
    }
}
