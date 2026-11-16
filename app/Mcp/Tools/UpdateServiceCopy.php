<?php

namespace App\Mcp\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Description('Edit the Spanish text of a service page (/servicios/{slug}): summary, description, default WhatsApp message, or publish/unpublish it.')]
#[IsIdempotent]
class UpdateServiceCopy extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'service' => ['required', 'string'],
            'summary' => ['sometimes', 'string', 'max:300'],
            'description' => ['sometimes', 'string', 'max:5000'],
            'default_message' => ['sometimes', 'string', 'max:500'],
            'is_published' => ['sometimes', 'boolean'],
        ]);
        $service = $this->findService($data['service']);
        $changes = collect($data)->except('service')->all();

        if ($changes === []) {
            return Response::error('Nothing to change: pass at least one field.');
        }

        $service->update($changes);
        $this->logChange($request, "Servicio {$service->slug}: ".implode(', ', array_keys($changes)).'.');

        return Response::json(['updated' => $service->slug, 'fields' => array_keys($changes)]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'service' => $schema->string()->description('Service slug.')->required(),
            'summary' => $schema->string(),
            'description' => $schema->string(),
            'default_message' => $schema->string()->description('Prefilled WhatsApp text for this service.'),
            'is_published' => $schema->boolean(),
        ];
    }
}
