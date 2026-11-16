<?php

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Description('Stop suggesting one catalog item for another. The items themselves are kept.')]
#[IsIdempotent]
class RemoveSuggestion extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate(['item' => ['required'], 'suggested' => ['required']]);
        $item = $this->findCatalogItem($data['item']);
        $suggested = $this->findCatalogItem($data['suggested'], 'suggested');

        $item->suggestions()->detach($suggested->id);
        $this->logChange($request, "Sugerencia quitada: {$item->slug} → {$suggested->slug}.");

        return Response::json(['item' => $item->slug, 'suggests' => $item->suggestions()->pluck('slug')]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'item' => $schema->string()->required(),
            'suggested' => $schema->string()->required(),
        ];
    }
}
