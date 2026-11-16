const usd = new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
});

/** "$1.234,50" from integer cents. */
export function formatCents(cents: number | null | undefined): string {
    return usd.format((cents ?? 0) / 100);
}

/** Value for a dollar input: 3500 → "35", 3550 → "35.50", null → "". */
export function centsToInput(cents: number | null | undefined): string {
    if (cents === null || cents === undefined) {
        return '';
    }

    return cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2);
}

export function inputToCents(value: string): number {
    const amount = Number.parseFloat(value.replace(',', '.'));

    return Number.isFinite(amount) ? Math.round(amount * 100) : 0;
}

/**
 * Catalog price for the admin. Percentage items store the percentage itself.
 */
export function formatCatalogPrice(
    min: number,
    max: number | null,
    unit: string,
): string {
    if (unit === 'porcentaje') {
        return max ? `${min}–${max}%` : `${min}%`;
    }

    if (min === 0 && !max) {
        return 'Sin precio';
    }

    return max ? `${formatCents(min)} – ${formatCents(max)}` : formatCents(min);
}
