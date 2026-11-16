<?php

namespace App\Mcp\Tools\Concerns;

use App\Models\CatalogItem;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\Service;
use Illuminate\Validation\ValidationException;

/** Look records up by the human key an agent knows (slug, reference, number) or by id. */
trait FindsRecords
{
    protected function findCatalogItem(string|int $key, string $field = 'item'): CatalogItem
    {
        return CatalogItem::query()->where('slug', (string) $key)->orWhere('id', (int) $key)->first()
            ?? throw ValidationException::withMessages([$field => "Catalog item [{$key}] not found. Use list-catalog-items to see slugs."]);
    }

    protected function findQuoteRequest(string|int $key): QuoteRequest
    {
        return QuoteRequest::query()->where('reference', (string) $key)->orWhere('id', (int) $key)->first()
            ?? throw ValidationException::withMessages(['request' => "Quote request [{$key}] not found."]);
    }

    protected function findQuote(string|int $key): Quote
    {
        return Quote::query()->where('number', (string) $key)->orWhere('id', (int) $key)->first()
            ?? throw ValidationException::withMessages(['quote' => "Quote [{$key}] not found."]);
    }

    protected function findService(string $slug): Service
    {
        return Service::query()->where('slug', $slug)->first()
            ?? throw ValidationException::withMessages(['service' => "Service [{$slug}] not found. Use list-catalog-items or business-context to see service slugs."]);
    }
}
