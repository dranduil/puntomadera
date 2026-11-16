<?php

namespace App\Mcp\Tools;

use App\Models\ServiceZone;
use App\Support\Money;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Description('List service zones with the travel fee (movilización) and technical visit fee charged from Guasmo.')]
#[IsReadOnly]
class ListZones extends ReadTool
{
    public function handle(Request $request): Response
    {
        return Response::json(ServiceZone::query()->orderBy('sort_order')->get()->map(fn (ServiceZone $zone) => [
            'id' => $zone->id,
            'name' => $zone->name,
            'neighborhoods' => $zone->neighborhoods ?? [],
            'travel_fee' => $zone->travel_fee_cents !== null ? Money::format($zone->travel_fee_cents) : 'a convenir',
            'visit_fee' => $zone->visit_fee_cents !== null ? Money::format($zone->visit_fee_cents) : 'a convenir',
            'is_active' => $zone->is_active,
        ]));
    }

    public function schema(JsonSchema $schema): array
    {
        return [];
    }
}
