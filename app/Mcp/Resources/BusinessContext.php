<?php

namespace App\Mcp\Resources;

use App\Models\Service;
use App\Models\ServiceZone;
use App\Support\Money;
use App\Support\QuoteSettings;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\MimeType;
use Laravel\Mcp\Server\Attributes\Uri;
use Laravel\Mcp\Server\Resource;

#[Uri('punto-madera://business-context')]
#[MimeType('text/markdown')]
#[Description('How Punto Madera prices and quotes jobs: services, zones and travel fees, quote rules and settings. Read this before changing anything.')]
class BusinessContext extends Resource
{
    public function handle(Request $request): Response
    {
        $settings = QuoteSettings::current();
        $services = Service::query()->where('is_published', true)->orderBy('id')->get(['slug', 'name'])
            ->map(fn (Service $service) => "- `{$service->slug}`: {$service->name}")->implode("\n");
        $zones = ServiceZone::query()->active()->get()->map(fn (ServiceZone $zone) => sprintf(
            '- %s (id %d): movilización %s, visita %s. Barrios: %s',
            $zone->name,
            $zone->id,
            $zone->travel_fee_cents !== null ? Money::format($zone->travel_fee_cents) : 'a convenir',
            $zone->visit_fee_cents !== null ? Money::format($zone->visit_fee_cents) : 'a convenir',
            implode(', ', array_slice($zone->neighborhoods ?? [], 0, 12)),
        ))->implode("\n");
        $iva = $settings['iva_enabled'] ? 'sí (15%)' : 'no';

        return Response::text(<<<MD
        # Punto Madera

        Carpentry business in Guayaquil, Ecuador: doors (installation, repair, locks), closets, kitchens, custom furniture and furniture repair. The owner works from Guasmo (south Guayaquil), so every quote adds a travel fee by zone. Clients talk in Spanish; write anything client-facing in Spanish (Ecuador).

        ## How quoting works
        1. Clients fill /cotizar. They never see prices. That creates a quote request (reference PM-YYMM-NNNN, status nuevo).
        2. The business builds a quote (number COT-YYMM-NNNN) from the internal catalog, then sends the client link by WhatsApp.
        3. The client opens the link, accepts, pays the deposit (Deuna link/QR or bank transfer) and taps "Ya pagué".
        4. The business confirms the money and marks the quote paid.

        ## Rules
        - All money is USD. Tools take dollars (35.50) and report formatted amounts; the database stores cents.
        - Catalog prices are internal ranges. The quote uses the minimum by default; the owner adjusts per job.
        - Items with unit `porcentaje` are surcharges: their quantity is a % of the other lines (urgency, high floor, MDF lacquer).
        - Subtotal = lines + travel fee + visit fee − discount. IVA is optional. Deposit = total × deposit %.
        - Never delete anything. Deactivate catalog items instead (is_active=false).
        - adjust-catalog-prices previews by default; only apply (dry_run=false) when the owner asked.
        - create-quote-draft never sends anything. The owner reviews and sends the quote himself.
        - Only mark a quote paid when the owner confirms the money arrived.
        - Every change you make is listed for the owner in /admin/historial-ia.

        ## Current quote settings
        - Validity: {$settings['validity_days']} days
        - Deposit: {$settings['deposit_percent']}%
        - IVA by default: {$iva}
        - Terms shown to clients: {$settings['terms']}

        ## Services (slugs)
        {$services}

        ## Zones
        {$zones}
        MD);
    }
}
