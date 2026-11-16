<?php

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Description('Full detail of one quote request (by reference like PM-2611-0042, or id): items, accepted suggestions, message, source and its quotes.')]
#[IsReadOnly]
class GetQuoteRequest extends ReadTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate(['request' => ['required']]);
        $quoteRequest = $this->findQuoteRequest($data['request'])->load(['zone', 'referredPartner', 'quotes']);

        return Response::json([
            ...$quoteRequest->only([
                'id', 'reference', 'type', 'package', 'status', 'name', 'phone', 'email', 'company',
                'properties_count', 'sector', 'message', 'items', 'accepted_suggestions', 'admin_notes',
                'utm_source', 'utm_medium', 'utm_campaign', 'source_path',
            ]),
            'created_at' => $quoteRequest->created_at->toDateTimeString(),
            'zone' => $quoteRequest->zone?->name,
            'referred_partner' => $quoteRequest->referredPartner?->name,
            'photos_count' => count($quoteRequest->photos ?? []),
            'summary' => $quoteRequest->summaryLines(),
            'quotes' => $quoteRequest->quotes->map(fn ($quote) => [
                'number' => $quote->number,
                'status' => $quote->status,
                'total_cents' => $quote->total_cents,
            ]),
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'request' => $schema->string()->description('Reference (PM-…) or numeric id.')->required(),
        ];
    }
}
