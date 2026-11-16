<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ServiceZone extends Model
{
    protected $fillable = [
        'name',
        'neighborhoods',
        'travel_fee_cents',
        'visit_fee_cents',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'neighborhoods' => 'array',
            'travel_fee_cents' => 'integer',
            'visit_fee_cents' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order')->orderBy('id');
    }

    /**
     * Public view of a zone: no fees, the visitor only picks where they are.
     *
     * @return array{id: int, name: string, neighborhoods: list<string>}
     */
    public function toPublicArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'neighborhoods' => array_values($this->neighborhoods ?? []),
        ];
    }
}
