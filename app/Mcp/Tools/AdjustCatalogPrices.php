<?php

namespace App\Mcp\Tools;

use App\Models\CatalogItem;
use App\Support\Money;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;

#[Description('Raise or lower all money prices (min, max, cost) by a percentage, optionally for one service. dry_run defaults to TRUE: it only previews. Pass dry_run=false to apply. Percentage items and items without price are skipped.')]
class AdjustCatalogPrices extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'percent' => ['required', 'numeric', 'min:-50', 'max:100', 'not_in:0'],
            'service' => ['nullable', 'string'],
            'dry_run' => ['nullable', 'boolean'],
        ]);
        $dryRun = $data['dry_run'] ?? true;
        $serviceId = isset($data['service']) ? $this->findService($data['service'])->id : null;
        $changes = CatalogItem::adjustPrices((float) $data['percent'], $serviceId, $dryRun);

        if (! $dryRun) {
            $this->logChange($request, "Precios ajustados {$data['percent']}% en ".count($changes).' ítems'.(isset($data['service']) ? " de {$data['service']}" : '').'.');
        }

        return Response::json([
            'dry_run' => $dryRun,
            'items' => count($changes),
            'changes' => collect($changes)->map(fn (array $change) => [
                'slug' => $change['slug'],
                'from' => Money::format($change['from_cents']),
                'to' => Money::format($change['to_cents']),
            ]),
            'note' => $dryRun ? 'Preview only. Call again with dry_run=false to apply.' : 'Applied.',
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'percent' => $schema->number()->description('e.g. 8 for +8%, -5 for -5%.')->required(),
            'service' => $schema->string()->description('Only items of this service slug.'),
            'dry_run' => $schema->boolean()->description('Default true (preview). false applies the change.'),
        ];
    }
}
