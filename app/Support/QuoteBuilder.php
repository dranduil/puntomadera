<?php

namespace App\Support;

use App\Models\CatalogItem;
use App\Models\Quote;
use App\Models\QuoteRequest;
use Illuminate\Support\Facades\DB;

/**
 * Saves a quote and its lines with server-calculated totals. Shared by the
 * admin quote builder and the MCP draft tool so both price quotes the same way.
 */
final class QuoteBuilder
{
    /**
     * @param  array{
     *     client_name: string,
     *     client_phone?: ?string,
     *     quote_request_id?: ?int,
     *     service_zone_id?: ?int,
     *     travel_fee_cents?: ?int,
     *     visit_fee_cents?: ?int,
     *     discount_cents?: ?int,
     *     iva_percent?: ?int,
     *     deposit_percent?: ?int,
     *     valid_until?: ?string,
     *     notes?: ?string,
     *     terms?: ?string,
     *     payment_link?: ?string,
     *     items: list<array{catalog_item_id?: ?int, description: string, unit?: ?string, quantity: float|int|string, unit_price_cents: int}>
     * }  $data
     */
    public static function save(Quote $quote, array $data): Quote
    {
        return DB::transaction(function () use ($quote, $data): Quote {
            $catalog = CatalogItem::query()
                ->with('partner')
                ->whereIn('id', collect($data['items'])->pluck('catalog_item_id')->filter())
                ->get()
                ->keyBy('id');

            $lines = collect($data['items'])->values()->map(function (array $line) use ($catalog): array {
                $item = $catalog->get($line['catalog_item_id'] ?? null);

                return [
                    'catalog_item_id' => $item?->id,
                    'partner_id' => $item?->partner_id,
                    'commission_percent' => $item?->partner?->commission_percent,
                    'description' => trim($line['description']),
                    'unit' => $line['unit'] ?? $item?->unit ?? 'unidad',
                    'quantity' => (float) $line['quantity'],
                    'unit_price_cents' => (int) $line['unit_price_cents'],
                ];
            })->all();

            $totals = QuoteCalculator::calculate(
                $lines,
                (int) ($data['travel_fee_cents'] ?? 0),
                (int) ($data['visit_fee_cents'] ?? 0),
                (int) ($data['discount_cents'] ?? 0),
                (int) ($data['iva_percent'] ?? 0),
                (int) ($data['deposit_percent'] ?? 50),
            );

            $quote->fill([
                'quote_request_id' => $data['quote_request_id'] ?? $quote->quote_request_id,
                'client_name' => $data['client_name'],
                'client_phone' => $data['client_phone'] ?? null,
                'service_zone_id' => $data['service_zone_id'] ?? null,
                'travel_fee_cents' => (int) ($data['travel_fee_cents'] ?? 0),
                'visit_fee_cents' => (int) ($data['visit_fee_cents'] ?? 0),
                'discount_cents' => (int) ($data['discount_cents'] ?? 0),
                'iva_percent' => (int) ($data['iva_percent'] ?? 0),
                'deposit_percent' => (int) ($data['deposit_percent'] ?? 50),
                'subtotal_cents' => $totals['subtotal_cents'],
                'iva_cents' => $totals['iva_cents'],
                'total_cents' => $totals['total_cents'],
                'deposit_cents' => $totals['deposit_cents'],
                'valid_until' => $data['valid_until'] ?? null,
                'notes' => $data['notes'] ?? null,
                'terms' => $data['terms'] ?? null,
                'payment_link' => $data['payment_link'] ?? null,
            ]);
            $quote->status ??= 'borrador';
            $quote->save();

            $quote->items()->delete();

            foreach ($lines as $index => $line) {
                $quote->items()->create([
                    ...$line,
                    'total_cents' => $totals['line_totals'][$index],
                    'sort_order' => ($index + 1) * 10,
                ]);
            }

            if ($quote->request && $quote->request->status === 'nuevo') {
                $quote->request->update(['status' => 'cotizado']);
            }

            return $quote->load('items');
        });
    }

    /**
     * Starting values for a new quote: business settings, the request's zone
     * fees and its items at the catalog's minimum price.
     *
     * @return array<string, mixed>
     */
    public static function defaultsFor(?QuoteRequest $request): array
    {
        $settings = QuoteSettings::current();
        $zone = $request?->zone ?? null;
        $requested = collect($request?->items ?? [])
            ->merge(collect($request?->accepted_suggestions ?? [])->map(fn ($id) => ['catalog_item_id' => $id, 'quantity' => 1]));
        $catalog = CatalogItem::query()->whereIn('id', $requested->pluck('catalog_item_id')->filter())->get()->keyBy('id');

        return [
            'quote_request_id' => $request?->id,
            'client_name' => $request?->company ? "{$request->name} ({$request->company})" : ($request?->name ?? ''),
            'client_phone' => $request?->phone,
            'service_zone_id' => $zone?->id,
            'travel_fee_cents' => $zone?->travel_fee_cents ?? 0,
            'visit_fee_cents' => 0,
            'discount_cents' => 0,
            'iva_percent' => $settings['iva_enabled'] ? 15 : 0,
            'deposit_percent' => $settings['deposit_percent'],
            'valid_until' => now()->addDays($settings['validity_days'])->toDateString(),
            'notes' => null,
            'terms' => $settings['terms'],
            'payment_link' => $settings['deuna_payment_link'],
            'items' => $requested
                ->map(function (array $line) use ($catalog): ?array {
                    $item = $catalog->get($line['catalog_item_id'] ?? null);

                    if (! $item) {
                        return null;
                    }

                    return [
                        'catalog_item_id' => $item->id,
                        'description' => $item->name,
                        'unit' => $item->unit,
                        'quantity' => $item->isPercentage() ? $item->price_min_cents : max(1, (float) ($line['quantity'] ?? 1)),
                        'unit_price_cents' => $item->isPercentage() ? 0 : $item->price_min_cents,
                    ];
                })
                ->filter()
                ->unique('catalog_item_id')
                ->values()
                ->all(),
        ];
    }
}
