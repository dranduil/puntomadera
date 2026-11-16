/**
 * Live preview of quote totals for the admin builder. Mirrors
 * app/Support/QuoteCalculator.php; the server recalculates on save.
 */
export type QuoteLine = {
    unit: string;
    quantity: number;
    unit_price_cents: number;
};

export type QuoteTotals = {
    line_totals: number[];
    items_cents: number;
    subtotal_cents: number;
    iva_cents: number;
    total_cents: number;
    deposit_cents: number;
};

export function calculateQuote(
    lines: QuoteLine[],
    travelFeeCents = 0,
    visitFeeCents = 0,
    discountCents = 0,
    ivaPercent = 0,
    depositPercent = 50,
): QuoteTotals {
    const isPercentage = (line: QuoteLine) => line.unit === 'porcentaje';
    const base = lines
        .filter((line) => !isPercentage(line))
        .reduce(
            (sum, line) =>
                sum + Math.round((line.quantity || 0) * line.unit_price_cents),
            0,
        );
    const lineTotals = lines.map((line) =>
        isPercentage(line)
            ? Math.round((base * (line.quantity || 0)) / 100)
            : Math.round((line.quantity || 0) * line.unit_price_cents),
    );
    const itemsCents = lineTotals.reduce((sum, total) => sum + total, 0);
    const subtotal = Math.max(
        0,
        itemsCents + travelFeeCents + visitFeeCents - discountCents,
    );
    const iva = Math.round((subtotal * ivaPercent) / 100);
    const total = subtotal + iva;

    return {
        line_totals: lineTotals,
        items_cents: itemsCents,
        subtotal_cents: subtotal,
        iva_cents: iva,
        total_cents: total,
        deposit_cents: Math.round(
            (total * Math.max(0, Math.min(100, depositPercent))) / 100,
        ),
    };
}
