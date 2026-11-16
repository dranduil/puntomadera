<?php

namespace App\Mcp\Tools;

use App\Models\Quote;
use App\Support\Money;
use App\Support\QuoteBuilder;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;

#[Description('Create a DRAFT quote, from a quote request and/or explicit lines. It is never sent to the client: the business reviews and sends it from the admin. Without lines, the request items are priced at the catalog minimum.')]
class CreateQuoteDraft extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'request' => ['nullable'],
            'client_name' => ['required_without:request', 'nullable', 'string', 'max:120'],
            'client_phone' => ['nullable', 'string', 'max:30'],
            'items' => ['required_without:request', 'nullable', 'array', 'max:60'],
            'items.*.catalog_item' => ['nullable'],
            'items.*.description' => ['required_without:items.*.catalog_item', 'nullable', 'string', 'max:255'],
            'items.*.quantity' => ['required', 'numeric', 'min:0.01', 'max:100000'],
            'items.*.unit_price' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'travel_fee' => ['nullable', 'numeric', 'min:0', 'max:1000'],
            'discount' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'iva' => ['nullable', 'boolean'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);
        $quoteRequest = isset($data['request']) ? $this->findQuoteRequest($data['request']) : null;
        $draft = QuoteBuilder::defaultsFor($quoteRequest);

        if (! empty($data['items'])) {
            $draft['items'] = collect($data['items'])->map(function (array $line, int $index): array {
                $item = isset($line['catalog_item']) ? $this->findCatalogItem($line['catalog_item'], "items.{$index}.catalog_item") : null;
                $isPercentage = $item?->isPercentage() ?? false;

                return [
                    'catalog_item_id' => $item?->id,
                    'description' => $line['description'] ?? $item->name,
                    'unit' => $item?->unit ?? 'unidad',
                    'quantity' => $line['quantity'],
                    'unit_price_cents' => $isPercentage ? 0 : (isset($line['unit_price']) ? Money::toCents($line['unit_price']) : ($item?->price_min_cents ?? 0)),
                ];
            })->all();
        }

        if ($draft['items'] === []) {
            return Response::error('The draft needs at least one line: pass items.');
        }

        $quote = QuoteBuilder::save(new Quote, [
            ...$draft,
            'client_name' => $data['client_name'] ?? $draft['client_name'],
            'client_phone' => $data['client_phone'] ?? $draft['client_phone'],
            'travel_fee_cents' => isset($data['travel_fee']) ? Money::toCents($data['travel_fee']) : $draft['travel_fee_cents'],
            'discount_cents' => isset($data['discount']) ? Money::toCents($data['discount']) : 0,
            'iva_percent' => isset($data['iva']) ? ($data['iva'] ? 15 : 0) : $draft['iva_percent'],
            'notes' => $data['notes'] ?? null,
        ]);
        $this->logChange($request, "Borrador {$quote->number} para {$quote->client_name}: total ".Money::format($quote->total_cents).'.');

        return Response::json([
            'number' => $quote->number,
            'status' => $quote->status,
            'total' => Money::format($quote->total_cents),
            'deposit' => Money::format($quote->deposit_cents),
            'admin_url' => route('admin.quotes.edit', $quote),
            'client_url' => $quote->publicUrl(),
            'note' => 'Draft only. Not sent to the client. Review it in the admin and use "Enviar por WhatsApp".',
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'request' => $schema->string()->description('Quote request reference (PM-…) or id to start from.'),
            'client_name' => $schema->string()->description('Required without request.'),
            'client_phone' => $schema->string(),
            'items' => $schema->array()->items($schema->object([
                'catalog_item' => $schema->string()->description('Catalog slug or id.'),
                'description' => $schema->string()->description('Required for lines without catalog_item.'),
                'quantity' => $schema->number()->description('Units, meters, or the % for percentage items.')->required(),
                'unit_price' => $schema->number()->description('USD. Default: catalog minimum.'),
            ]))->description('Quote lines. Default: the request items.'),
            'travel_fee' => $schema->number()->description('USD. Default: the zone fee.'),
            'discount' => $schema->number()->description('USD.'),
            'iva' => $schema->boolean()->description('Charge IVA 15%. Default: quote settings.'),
            'notes' => $schema->string()->description('Spanish note shown to the client.'),
        ];
    }
}
