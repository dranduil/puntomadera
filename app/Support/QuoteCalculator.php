<?php

namespace App\Support;

/**
 * Single source of truth for quote money. Lines priced per unit multiply
 * quantity × unit price; "porcentaje" lines (surcharges) take their quantity as
 * a percentage of the per-unit lines. Mirrored for live preview in
 * resources/js/lib/quote-math.ts; the server result is the one saved.
 */
final class QuoteCalculator
{
    /**
     * @param  list<array{quantity: float|int|string, unit_price_cents: int, unit?: ?string}>  $lines
     * @return array{line_totals: list<int>, items_cents: int, subtotal_cents: int, iva_cents: int, total_cents: int, deposit_cents: int}
     */
    public static function calculate(
        array $lines,
        int $travelFeeCents = 0,
        int $visitFeeCents = 0,
        int $discountCents = 0,
        int $ivaPercent = 0,
        int $depositPercent = 50,
    ): array {
        $base = 0;
        $lineTotals = [];

        foreach ($lines as $index => $line) {
            if (($line['unit'] ?? null) !== 'porcentaje') {
                $lineTotals[$index] = (int) round(((float) $line['quantity']) * $line['unit_price_cents']);
                $base += $lineTotals[$index];
            }
        }

        foreach ($lines as $index => $line) {
            if (($line['unit'] ?? null) === 'porcentaje') {
                $lineTotals[$index] = (int) round($base * ((float) $line['quantity']) / 100);
            }
        }

        ksort($lineTotals);
        $itemsCents = array_sum($lineTotals);
        $subtotal = max(0, $itemsCents + $travelFeeCents + $visitFeeCents - $discountCents);
        $iva = (int) round($subtotal * $ivaPercent / 100);
        $total = $subtotal + $iva;

        return [
            'line_totals' => array_values($lineTotals),
            'items_cents' => $itemsCents,
            'subtotal_cents' => $subtotal,
            'iva_cents' => $iva,
            'total_cents' => $total,
            'deposit_cents' => (int) round($total * max(0, min(100, $depositPercent)) / 100),
        ];
    }
}
