<?php

namespace App\Mcp\Tools;

use App\Models\HomeLanding;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Description('Edit home page and contact settings: hero title/subtitle, SEO title/description, areas served, WhatsApp number, contact email/phone.')]
#[IsIdempotent]
class UpdateSiteSettings extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'hero_title' => ['sometimes', 'string', 'max:160'],
            'hero_subtitle' => ['sometimes', 'string', 'max:400'],
            'seo_title' => ['sometimes', 'nullable', 'string', 'max:70'],
            'seo_description' => ['sometimes', 'nullable', 'string', 'max:170'],
            'areas_served' => ['sometimes', 'array', 'max:40'],
            'areas_served.*' => ['string', 'max:80'],
            'whatsapp_number' => ['sometimes', 'string', 'regex:/^593\d{8,9}$/'],
            'contact_email' => ['sometimes', 'nullable', 'email', 'max:120'],
            'contact_phone' => ['sometimes', 'nullable', 'string', 'max:30'],
        ], ['whatsapp_number.regex' => 'Use the international format without +, e.g. 593991234567.']);

        if ($data === []) {
            return Response::error('Nothing to change: pass at least one field.');
        }

        $landing = HomeLanding::query()->firstOrNew();
        $landing->fill($data)->save();
        $this->logChange($request, 'Ajustes del sitio: '.implode(', ', array_keys($data)).'.');

        return Response::json([
            'updated' => array_keys($data),
            'note' => isset($data['whatsapp_number']) && config('services.whatsapp.number')
                ? 'WHATSAPP_NUMBER in the server env still takes priority over this value.'
                : null,
        ]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'hero_title' => $schema->string(),
            'hero_subtitle' => $schema->string(),
            'seo_title' => $schema->string(),
            'seo_description' => $schema->string(),
            'areas_served' => $schema->array()->items($schema->string()),
            'whatsapp_number' => $schema->string()->description('e.g. 593991234567'),
            'contact_email' => $schema->string(),
            'contact_phone' => $schema->string(),
        ];
    }
}
