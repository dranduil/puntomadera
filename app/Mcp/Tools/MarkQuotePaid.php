<?php

namespace App\Mcp\Tools;

use App\Models\Quote;
use App\Support\Money;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Validation\Rule;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;

#[Description('Record a payment received for a quote (deposit or total). Only use it when the business confirmed the money arrived.')]
class MarkQuotePaid extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'quote' => ['required'],
            'amount' => ['required', 'numeric', 'min:0.01', 'max:100000'],
            'method' => ['required', Rule::in(Quote::PAYMENT_METHODS)],
        ]);
        $quote = $this->findQuote($data['quote']);

        $quote->update([
            'status' => 'pagada',
            'paid_at' => now(),
            'accepted_at' => $quote->accepted_at ?? now(),
            'paid_amount_cents' => Money::toCents($data['amount']),
            'payment_method' => $data['method'],
        ]);
        $quote->request?->update(['status' => 'cerrado']);
        $this->logChange($request, "Pago de {$quote->number}: ".Money::format($quote->paid_amount_cents)." por {$data['method']}.");

        return Response::json(['number' => $quote->number, 'status' => $quote->status, 'paid' => Money::format($quote->paid_amount_cents)]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'quote' => $schema->string()->description('Quote number (COT-…) or id.')->required(),
            'amount' => $schema->number()->description('USD received.')->required(),
            'method' => $schema->string()->enum(Quote::PAYMENT_METHODS)->required(),
        ];
    }
}
