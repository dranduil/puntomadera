<?php

namespace App\Mcp\Tools;

use App\Mcp\Tools\Concerns\FindsRecords;
use App\Models\CatalogItem;
use App\Support\Money;
use Laravel\Mcp\Server\Tool;

abstract class ReadTool extends Tool
{
    use FindsRecords;

    /** Prices as the agent should read them: dollars, or a percentage for surcharge lines. */
    protected function catalogPrices(CatalogItem $item): array
    {
        if ($item->isPercentage()) {
            return ['price_percent_min' => $item->price_min_cents, 'price_percent_max' => $item->price_max_cents];
        }

        return [
            'price_min' => Money::format($item->price_min_cents),
            'price_max' => $item->price_max_cents !== null ? Money::format($item->price_max_cents) : null,
            'cost' => $item->cost_cents !== null ? Money::format($item->cost_cents) : null,
        ];
    }
}
