<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class CustomerReview extends Model
{
    public const STATUS_PENDING = 'pending';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    protected $fillable = [
        'name',
        'location',
        'rating',
        'message',
        'photos',
        'consent_to_publish',
        'status',
        'published_at',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'integer',
            'photos' => 'array',
            'consent_to_publish' => 'boolean',
            'published_at' => 'datetime',
        ];
    }

    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    public function photoUrls(): array
    {
        return collect($this->photos ?? [])
            ->filter(fn ($path) => is_string($path) && $path !== '')
            ->map(fn (string $path) => route('reviews.photo', [
                'review' => $this->getKey(),
                'photo' => basename($path),
            ]))
            ->values()
            ->all();
    }

    public function asPublicData(): array
    {
        return [
            'id' => $this->getKey(),
            'name' => $this->name,
            'location' => $this->location,
            'rating' => $this->rating,
            'message' => $this->message,
            'photos' => $this->photoUrls(),
            'published_at' => $this->published_at?->toDateString(),
        ];
    }

    public function asAdminData(): array
    {
        return [
            ...$this->asPublicData(),
            'status' => $this->status,
            'admin_notes' => $this->admin_notes,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
