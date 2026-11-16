<?php

namespace App\Mcp\Tools;

use App\Models\CustomerReview;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Description('List customer reviews waiting for moderation.')]
#[IsReadOnly]
class ListPendingReviews extends ReadTool
{
    public function handle(Request $request): Response
    {
        return Response::json(CustomerReview::query()
            ->where('status', CustomerReview::STATUS_PENDING)
            ->latest()
            ->limit(30)
            ->get()
            ->map(fn (CustomerReview $review) => [
                'id' => $review->id,
                'name' => $review->name,
                'location' => $review->location,
                'rating' => $review->rating,
                'message' => $review->message,
                'photos_count' => count($review->photos ?? []),
                'created_at' => $review->created_at->toDateTimeString(),
            ]));
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
