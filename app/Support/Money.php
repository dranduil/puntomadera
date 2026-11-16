<?php

namespace App\Support;

final class Money
{
    /** "$1.234,50": the es-EC format clients see in quotes and WhatsApp messages. */
    public static function format(int $cents): string
    {
        return '$'.number_format($cents / 100, 2, ',', '.');
    }

    public static function toCents(float|int|string|null $amount): int
    {
        if ($amount === null || $amount === '') {
            return 0;
        }

        return (int) round(((float) str_replace(',', '.', (string) $amount)) * 100);
    }
}
