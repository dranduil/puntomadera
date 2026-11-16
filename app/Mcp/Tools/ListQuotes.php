<?php

namespace App\Mcp\Tools;

use App\Models\Quote;
use App\Support\Money;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Validation\Rule;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Description('List quotes (newest first). Status: borrador, enviada, vista, aceptada, rechazada, pagada.')]
#[IsReadOnly]
class ListQuotes extends ReadTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'status' => ['nullable', Rule::in(Quote::STATUSES)],
            'limit' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $rows = Quote::query()
            ->when($data['status'] ?? null, fn ($query, string $status) => $query->where('status', $status))
            ->latest()
            ->limit($data['limit'] ?? 20)
            ->get()
            ->map(fn (Quote $quote) => [
                'number' => $quote->number,
                'client_name' => $quote->client_name,
                'status' => $quote->status,
                'expired' => $quote->isExpired(),
                'total' => Money::format($quote->total_cents),
                'deposit' => Money::format($quote->deposit_cents),
                'valid_until' => $quote->valid_until?->toDateString(),
                'payment_reported' => $quote->payment_reported_at !== null,
                'created_at' => $quote->created_at->toDateString(),
            ]);

        return Response::json(['count' => $rows->count(), 'quotes' => $rows]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'status' => $schema->string()->enum(Quote::STATUSES)->description('Only quotes with this status.'),
            'limit' => $schema->integer()->min(1)->max(50)->description('Max rows, default 20.'),
        ];
    }
}
