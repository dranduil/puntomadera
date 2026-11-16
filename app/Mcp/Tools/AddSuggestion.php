<?php

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Description('Suggest a related product or add-on when a client picks an item in /cotizar (e.g. door installation → lock).')]
#[IsIdempotent]
class AddSuggestion extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'item' => ['required'],
            'suggested' => ['required'],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);
        $item = $this->findCatalogItem($data['item']);
        $suggested = $this->findCatalogItem($data['suggested'], 'suggested');

        if ($item->is($suggested)) {
            return Response::error('An item cannot suggest itself.');
        }

        $item->suggestions()->syncWithoutDetaching([
            $suggested->id => ['reason' => $data['reason'] ?? null, 'sort_order' => ($item->suggestions()->count() + 1) * 10],
        ]);
        $this->logChange($request, "Sugerencia: {$item->slug} → {$suggested->slug}.");

        return Response::json(['item' => $item->slug, 'suggests' => $item->suggestions()->pluck('slug')]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'item' => $schema->string()->description('Slug of the item the client picks.')->required(),
            'suggested' => $schema->string()->description('Slug of the item to suggest.')->required(),
            'reason' => $schema->string()->description('Short Spanish hint shown to the client, e.g. "Completa tu puerta con chapa".'),
        ];
    }
}
