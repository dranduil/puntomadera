<?php

namespace App\Mcp\Tools;

use App\Models\HomeLanding;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Description('Change the defaults for new quotes: terms/warning text, validity days, deposit %, IVA on/off, Deuna payment link, bank transfer details.')]
#[IsIdempotent]
class UpdateQuoteSettings extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'quote_terms' => ['sometimes', 'nullable', 'string', 'max:4000'],
            'quote_validity_days' => ['sometimes', 'integer', 'min:1', 'max:180'],
            'deposit_percent' => ['sometimes', 'integer', 'min:0', 'max:100'],
            'iva_enabled' => ['sometimes', 'boolean'],
            'deuna_payment_link' => ['sometimes', 'nullable', 'url:https', 'max:255'],
            'bank_transfer_details' => ['sometimes', 'nullable', 'string', 'max:1000'],
        ]);

        if ($data === []) {
            return Response::error('Nothing to change: pass at least one field.');
        }

        $landing = HomeLanding::query()->firstOrNew();
        $landing->fill($data)->save();
        $this->logChange($request, 'Ajustes de cotización: '.implode(', ', array_keys($data)).'.');

        return Response::json(['updated' => array_keys($data)]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'quote_terms' => $schema->string()->description('Spanish text shown at the bottom of every quote.'),
            'quote_validity_days' => $schema->integer()->min(1)->max(180),
            'deposit_percent' => $schema->integer()->min(0)->max(100),
            'iva_enabled' => $schema->boolean()->description('Charge IVA 15% by default.'),
            'deuna_payment_link' => $schema->string()->description('https link from Deuna Negocios.'),
            'bank_transfer_details' => $schema->string(),
        ];
    }
}
