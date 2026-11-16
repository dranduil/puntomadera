<?php

namespace App\Mcp\Tools;

use App\Models\CustomerReview;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Description('Approve (publish) or reject a customer review. Rejected reviews are kept, not deleted.')]
#[IsIdempotent]
class ModerateReview extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'review' => ['required', 'integer', 'exists:customer_reviews,id'],
            'decision' => ['required', 'in:approve,reject'],
        ]);
        $review = CustomerReview::query()->findOrFail($data['review']);
        $approve = $data['decision'] === 'approve';

        $review->update([
            'status' => $approve ? CustomerReview::STATUS_APPROVED : CustomerReview::STATUS_REJECTED,
            'published_at' => $approve ? ($review->published_at ?? now()) : null,
        ]);
        $this->logChange($request, ($approve ? 'Reseña aprobada' : 'Reseña rechazada')." #{$review->id} de {$review->name}.");

        return Response::json(['review' => $review->id, 'status' => $review->status]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'review' => $schema->integer()->description('Review id from list-pending-reviews.')->required(),
            'decision' => $schema->string()->enum(['approve', 'reject'])->required(),
        ];
    }
}
