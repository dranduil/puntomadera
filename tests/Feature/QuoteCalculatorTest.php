<?php

use App\Support\QuoteCalculator;

test('quote totals add travel and visit, subtract discount, then apply IVA and deposit', function () {
    $totals = QuoteCalculator::calculate(
        [
            ['quantity' => 2, 'unit_price_cents' => 4000, 'unit' => 'unidad'],
            ['quantity' => 2.5, 'unit_price_cents' => 25000, 'unit' => 'metro_lineal'],
        ],
        travelFeeCents: 1500,
        visitFeeCents: 0,
        discountCents: 1000,
        ivaPercent: 15,
        depositPercent: 50,
    );

    expect($totals)->toMatchArray([
        'line_totals' => [8000, 62500],
        'items_cents' => 70500,
        'subtotal_cents' => 71000,
        'iva_cents' => 10650,
        'total_cents' => 81650,
        'deposit_cents' => 40825,
    ]);
});

test('percentage lines are a share of the per-unit lines only', function () {
    $totals = QuoteCalculator::calculate(
        [
            ['quantity' => 1, 'unit_price_cents' => 10000, 'unit' => 'unidad'],
            ['quantity' => 30, 'unit_price_cents' => 0, 'unit' => 'porcentaje'],
        ],
        travelFeeCents: 2000,
        ivaPercent: 0,
        depositPercent: 100,
    );

    expect($totals['line_totals'])->toBe([10000, 3000])
        ->and($totals['total_cents'])->toBe(15000)
        ->and($totals['deposit_cents'])->toBe(15000);
});

test('a discount never makes the total negative', function () {
    $totals = QuoteCalculator::calculate(
        [['quantity' => 1, 'unit_price_cents' => 1000]],
        discountCents: 5000,
    );

    expect($totals['subtotal_cents'])->toBe(0)
        ->and($totals['total_cents'])->toBe(0);
});
