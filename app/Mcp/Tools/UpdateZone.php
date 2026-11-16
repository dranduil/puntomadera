<?php

namespace App\Mcp\Tools;

use App\Models\ServiceZone;
use App\Support\Money;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Description('Change a service zone: travel fee, visit fee (USD, null = "a convenir"), neighborhoods, name or active flag.')]
#[IsIdempotent]
class UpdateZone extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'zone' => ['required', 'integer', 'exists:service_zones,id'],
            'name' => ['sometimes', 'string', 'max:120'],
            'neighborhoods' => ['sometimes', 'array', 'max:60'],
            'neighborhoods.*' => ['string', 'max:80'],
            'travel_fee' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:1000'],
            'visit_fee' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:1000'],
            'is_active' => ['sometimes', 'boolean'],
        ]);
        $zone = ServiceZone::query()->findOrFail($data['zone']);
        $changes = collect($data)->only(['name', 'neighborhoods', 'is_active'])->all();

        foreach (['travel_fee' => 'travel_fee_cents', 'visit_fee' => 'visit_fee_cents'] as $input => $column) {
            if (array_key_exists($input, $data)) {
                $changes[$column] = $data[$input] === null ? null : Money::toCents($data[$input]);
            }
        }

        $before = $zone->only(array_keys($changes));
        $zone->update($changes);
        $this->logChange($request, "Zona {$zone->name}: ".json_encode(['antes' => $before, 'después' => $zone->only(array_keys($changes))], JSON_UNESCAPED_UNICODE));

        return Response::json(['updated' => $zone->name, 'after' => $zone->only(array_keys($changes))]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'zone' => $schema->integer()->description('Zone id from list-zones.')->required(),
            'name' => $schema->string(),
            'neighborhoods' => $schema->array()->items($schema->string()),
            'travel_fee' => $schema->number()->description('USD; null = a convenir.'),
            'visit_fee' => $schema->number()->description('USD; null = a convenir.'),
            'is_active' => $schema->boolean(),
        ];
    }
}
