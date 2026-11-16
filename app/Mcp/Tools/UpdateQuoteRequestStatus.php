<?php

namespace App\Mcp\Tools;

use App\Models\Partner;
use App\Models\QuoteRequest;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Validation\Rule;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[Description('Change the status of a quote request and add internal notes. Use derivado with a partner id when the job was passed to a partner.')]
#[IsIdempotent]
class UpdateQuoteRequestStatus extends WriteTool
{
    public function handle(Request $request): Response
    {
        $data = $request->validate([
            'request' => ['required'],
            'status' => ['required', Rule::in(QuoteRequest::STATUSES)],
            'admin_notes' => ['nullable', 'string', 'max:2000'],
            'partner' => ['nullable', 'required_if:status,derivado', 'integer', 'exists:partners,id'],
        ]);
        $quoteRequest = $this->findQuoteRequest($data['request']);

        $quoteRequest->update([
            'status' => $data['status'],
            'admin_notes' => array_key_exists('admin_notes', $data) ? $data['admin_notes'] : $quoteRequest->admin_notes,
            'referred_partner_id' => $data['status'] === 'derivado' ? $data['partner'] : $quoteRequest->referred_partner_id,
        ]);
        $partner = $data['status'] === 'derivado' ? ' a '.Partner::query()->find($data['partner'])?->name : '';
        $this->logChange($request, "Solicitud {$quoteRequest->reference}: estado {$data['status']}{$partner}.");

        return Response::json(['reference' => $quoteRequest->reference, 'status' => $quoteRequest->status]);
    }

    public function schema(JsonSchema $schema): array
    {
        return [
            'request' => $schema->string()->description('Reference (PM-…) or id.')->required(),
            'status' => $schema->string()->enum(QuoteRequest::STATUSES)->required(),
            'admin_notes' => $schema->string(),
            'partner' => $schema->integer()->description('Partner id (list-partners). Required for derivado.'),
        ];
    }
}
