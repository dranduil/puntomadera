<?php

namespace App\Mcp\Servers;

use App\Mcp\Resources\BusinessContext;
use App\Mcp\Tools;
use Laravel\Mcp\Server;
use Laravel\Mcp\Server\Attributes\Instructions;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Attributes\Version;

#[Name('Punto Madera')]
#[Version('1.0.0')]
#[Instructions('Manage the Punto Madera carpentry business: quote requests, quotes, the internal price catalog, zones, partners, quote settings, site copy and reviews. Read the business-context resource first. Nothing can be deleted; every write is logged for the owner. Draft quotes are never sent automatically.')]
class PuntoMaderaServer extends Server
{
    protected array $tools = [
        Tools\BusinessSummary::class,
        Tools\ListQuoteRequests::class,
        Tools\GetQuoteRequest::class,
        Tools\ListQuotes::class,
        Tools\GetQuote::class,
        Tools\ListCatalogItems::class,
        Tools\ListZones::class,
        Tools\ListPartners::class,
        Tools\ListPendingReviews::class,
        Tools\UpdateCatalogItem::class,
        Tools\CreateCatalogItem::class,
        Tools\AdjustCatalogPrices::class,
        Tools\AddSuggestion::class,
        Tools\RemoveSuggestion::class,
        Tools\UpdateZone::class,
        Tools\UpdateQuoteSettings::class,
        Tools\UpdateQuoteRequestStatus::class,
        Tools\CreateQuoteDraft::class,
        Tools\MarkQuotePaid::class,
        Tools\UpdateServiceCopy::class,
        Tools\UpdateSiteSettings::class,
        Tools\ModerateReview::class,
    ];

    protected array $resources = [
        BusinessContext::class,
    ];

    protected array $prompts = [];
}
