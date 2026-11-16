<?php

namespace App\Mcp\Tools;

use App\Models\CatalogItem;
use App\Support\Money;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Validation\Rule;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;

#[Description('Add a new item to the price catalog (service, product, extra or partner job).')]
class CreateCatalogItem extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'kind' => ['required', Rule::in(CatalogItem::KINDS)],
            'name' => ['required', 'string', 'max:255'],
            'unit' => ['required', Rule::in(CatalogItem::UNITS)],
            'service' => ['nullable', 'string'],
            'description' => ['nullable', 'string', 'max:1000'],
            'price_min' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'price_max' => ['nullable', 'numeric', 'min:0', 'max:100000', 'gte:price_min'],
            'cost' => ['nullable', 'numeric', 'min:0', 'max:100000'],
            'includes_material' => ['nullable', 'boolean'],
            'is_public' => ['nullable', 'boolean'],
        ]);
        $isPercentage = $data['unit'] === 'porcentaje';
        $toStorage = fn ($value) => $value === null ? null : ($isPercentage ? (int) round((float) $value) : Money::toCents($value));

        $item = CatalogItem::query()->create([
            'kind' => $data['kind'],
            'name' => $data['name'],
            'slug' => CatalogItem::uniqueSlug($data['name']),
            'unit' => $data['unit'],
            'service_id' => isset($data['service']) ? $this->findService($data['service'])->id : null,
            'description' => $data['description'] ?? null,
            'price_min_cents' => $toStorage($data['price_min'] ?? null) ?? 0,
            'price_max_cents' => $toStorage($data['price_max'] ?? null),
            'cost_cents' => $toStorage($data['cost'] ?? null),
            'includes_material' => $data['includes_material'] ?? false,
            'is_public' => $data['is_public'] ?? true,
            'is_active' => true,
            'sort_order' => (int) CatalogItem::query()->max('sort_order') + 10,
        ]);
        $this->logChange($request, "Nuevo ítem de catálogo {$item->slug} ({$item->name}).");

        return Response::json(['created' => $item->slug, 'id' => $item->id]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'kind' => $schema->string()->enum(CatalogItem::KINDS)->required(),
            'name' => $schema->string()->required(),
            'unit' => $schema->string()->enum(CatalogItem::UNITS)->required(),
            'service' => $schema->string()->description('Service slug this item belongs to.'),
            'description' => $schema->string(),
            'price_min' => $schema->number()->description('USD. 0 = priced per job.'),
            'price_max' => $schema->number(),
            'cost' => $schema->number(),
            'includes_material' => $schema->boolean(),
            'is_public' => $schema->boolean()->description('Default true.'),
        ];
    }
}
