<?php

namespace App\Mcp\Tools;

use App\Support\Money;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Description('Change a catalog item: name, description, prices in USD (for percentage items, the percentage), cost, visibility in the public form, or deactivate it. Only the fields you pass change.')]
#[IsIdempotent]
class UpdateCatalogItem extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'item' => ['required'],
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string', 'max:1000'],
            'price_min' => ['sometimes', 'numeric', 'min:0', 'max:100000'],
            'price_max' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:100000'],
            'cost' => ['sometimes', 'nullable', 'numeric', 'min:0', 'max:100000'],
            'includes_material' => ['sometimes', 'boolean'],
            'is_public' => ['sometimes', 'boolean'],
            'is_active' => ['sometimes', 'boolean'],
        ]);
        $item = $this->findCatalogItem($data['item']);
        $toStorage = fn ($value) => $value === null ? null : ($item->isPercentage() ? (int) round((float) $value) : Money::toCents($value));
        $changes = collect($data)->except(['item', 'price_min', 'price_max', 'cost'])->all();

        foreach (['price_min' => 'price_min_cents', 'price_max' => 'price_max_cents', 'cost' => 'cost_cents'] as $input => $column) {
            if (array_key_exists($input, $data)) {
                $changes[$column] = $toStorage($data[$input]) ?? ($column === 'price_min_cents' ? 0 : null);
            }
        }

        $min = $changes['price_min_cents'] ?? $item->price_min_cents;
        $max = array_key_exists('price_max_cents', $changes) ? $changes['price_max_cents'] : $item->price_max_cents;

        if ($max !== null && $max < $min) {
            return Response::error('price_max must be greater than or equal to price_min.');
        }

        if ($changes === []) {
            return Response::error('Nothing to change: pass at least one field.');
        }

        $before = $item->only(array_keys($changes));
        $item->update($changes);
        $after = $item->only(array_keys($changes));
        $this->logChange($request, "Catálogo {$item->slug}: ".json_encode(['antes' => $before, 'después' => $after], JSON_UNESCAPED_UNICODE));

        return Response::json(['updated' => $item->slug, 'before' => $before, 'after' => $after]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'item' => $schema->string()->description('Catalog item slug or id.')->required(),
            'name' => $schema->string(),
            'description' => $schema->string(),
            'price_min' => $schema->number()->description('USD, e.g. 35 or 35.50. Percentage items: the percent.'),
            'price_max' => $schema->number()->description('USD upper range; null to remove.'),
            'cost' => $schema->number()->description('Internal material cost in USD; null to clear.'),
            'includes_material' => $schema->boolean(),
            'is_public' => $schema->boolean()->description('Show (without price) in the public /cotizar form.'),
            'is_active' => $schema->boolean()->description('false deactivates the item instead of deleting it.'),
        ];
    }
}
