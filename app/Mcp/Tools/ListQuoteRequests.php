<?php

namespace App\Mcp\Tools;

use App\Models\QuoteRequest;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Validation\Rule;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Description('List quote requests sent by clients from /cotizar (newest first). Status: nuevo, cotizado, derivado, cerrado, perdido.')]
#[IsReadOnly]
class ListQuoteRequests extends ReadTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'status' => ['nullable', Rule::in(QuoteRequest::STATUSES)],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $rows = QuoteRequest::query()
            ->with('zone:id,name')
            ->when($data['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->limit($data['limit'] ?? 20)
            ->get()
            ->map(fn (QuoteRequest $quoteRequest) => [
                'reference' => $quoteRequest->reference,
                'created_at' => $quoteRequest->created_at->toDateTimeString(),
                'status' => $quoteRequest->status,
                'type' => $quoteRequest->type,
                'name' => $quoteRequest->name,
                'phone' => $quoteRequest->phone,
                'summary' => $quoteRequest->summaryLines(),
            ]);

        return Response::json(['count' => $rows->count(), 'requests' => $rows]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->enum(QuoteRequest::STATUSES)->description('Only requests with this status.'),
            'limit' => $schema->integer()->min(1)->max(50)->description('Max rows, default 20.'),
        ];
    }
}
