<?php

namespace App\Mcp\Tools;

use App\Support\Money;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Description('Full detail of one quote (by number like COT-2611-0007, or id): lines, totals, timeline, admin and client links.')]
#[IsReadOnly]
class GetQuote extends ReadTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate(['quote' => ['required']]);
        $quote = $this->findQuote($data['quote'])->load('items', 'request');

        return Response::json([
            'number' => $quote->number,
            'status' => $quote->status,
            'expired' => $quote->isExpired(),
            'client_name' => $quote->client_name,
            'client_phone' => $quote->client_phone,
            'request' => $quote->request?->reference,
            'items' => $quote->items->map(fn ($item) => [
                'description' => $item->description,
                'unit' => $item->unit,
                'quantity' => $item->quantity,
                'unit_price' => Money::format($item->unit_price_cents),
                'total' => Money::format($item->total_cents),
            ]),
            'travel_fee' => Money::format($quote->travel_fee_cents),
            'visit_fee' => Money::format($quote->visit_fee_cents),
            'discount' => Money::format($quote->discount_cents),
            'iva_percent' => $quote->iva_percent,
            'total' => Money::format($quote->total_cents),
            'deposit' => Money::format($quote->deposit_cents),
            'valid_until' => $quote->valid_until?->toDateString(),
            'timeline' => collect($quote->only(['sent_at', 'viewed_at', 'accepted_at', 'payment_reported_at', 'paid_at']))
                ->filter()
                ->map(fn ($date) => $date->toDateTimeString()),
            'paid_amount' => $quote->paid_amount_cents ? Money::format($quote->paid_amount_cents) : null,
            'payment_method' => $quote->payment_method,
            'admin_url' => route('admin.quotes.edit', $quote),
            'client_url' => $quote->publicUrl(),
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'quote' => $schema->string()->description('Quote number (COT-…) or numeric id.')->required(),
        ];
    }
}
