<?php

namespace App\Mcp\Tools;

use App\Models\Partner;
use App\Support\BusinessMetrics;
use App\Support\Money;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Description('List partner businesses (marmolería, vidrio, etc.) and the commission owed on accepted or paid quotes.')]
#[IsReadOnly]
class ListPartners extends ReadTool
{
    public function handle(Request $request): Response
    {
        $commissions = collect(BusinessMetrics::commissions())->keyBy('partner_id');

        return Response::json(Partner::query()->orderBy('name')->get()->map(fn (Partner $partner) => [
            'id' => $partner->id,
            'name' => $partner->name,
            'trade' => $partner->trade,
            'commission_percent' => $partner->commission_percent,
            'is_active' => $partner->is_active,
            'commission_owed' => Money::format($commissions[$partner->id]['commission_cents'] ?? 0),
        ]));
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
