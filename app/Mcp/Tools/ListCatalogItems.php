<?php

namespace App\Mcp\Tools;

use App\Models\CatalogItem;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Validation\Rule;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[Description('List the internal price catalog with prices in USD (never shown on public pages). Percentage items are surcharges as a % of the job.')]
#[IsReadOnly]
class ListCatalogItems extends ReadTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'service' => ['nullable', 'string'],
            'kind' => ['nullable', Rule::in(CatalogItem::KINDS)],
            'search' => ['nullable', 'string', 'max:100'],
            'include_inactive' => ['nullable', 'boolean'],
        ]);

        $items = CatalogItem::query()
            ->with(['service:id,slug', 'partner:id,name', 'suggestions:id,slug'])
            ->when(! ($data['include_inactive'] ?? false), fn ($query) => $query->where('is_active', true))
            ->when($data['service'] ?? null, fn ($query, string $slug) => $query->whereHas('service', fn ($service) => $service->where('slug', $slug)))
            ->when($data['kind'] ?? null, fn ($query, string $kind) => $query->where('kind', $kind))
            ->when($data['search'] ?? null, fn ($query, string $search) => $query->where('name', 'like', "%{$search}%"))
            ->orderBy('service_id')
            ->orderBy('sort_order')
            ->get()
            ->map(fn (CatalogItem $item) => [
                'slug' => $item->slug,
                'name' => $item->name,
                'kind' => $item->kind,
                'unit' => $item->unit,
                'service' => $item->service?->slug,
                ...$this->catalogPrices($item),
                'partner' => $item->partner?->name,
                'includes_material' => $item->includes_material,
                'is_public' => $item->is_public,
                'is_active' => $item->is_active,
                'suggests' => $item->suggestions->pluck('slug'),
            ]);

        return Response::json(['count' => $items->count(), 'items' => $items]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'service' => $schema->string()->description('Service slug, e.g. instalacion-reparacion-puertas-madera-guayaquil.'),
            'kind' => $schema->string()->enum(CatalogItem::KINDS),
            'search' => $schema->string()->description('Part of the item name.'),
            'include_inactive' => $schema->boolean()->description('Also list deactivated items.'),
        ];
    }
}
