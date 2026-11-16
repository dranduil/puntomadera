<?php

namespace App\Http\Controllers;

use App\Http\Middleware\CaptureAttribution;
use App\Http\Requests\StoreQuoteRequestRequest;
use App\Models\CatalogItem;
use App\Models\QuoteRequest;
use App\Models\Service;
use App\Models\ServiceZone;
use App\Support\QuotePackages;
use App\Support\QuoteSettings;
use App\Support\SimpleCaptcha;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Public quote request form (/cotizar). Visitors describe the job; prices are
 * never sent to these pages. The business prices it later in the admin.
 */
class QuoteRequestController extends Controller
{
    private const SENT_SESSION_KEY = 'quote_requests_sent';

    public function create(Request $request): Response
    {
        $siteUrl = rtrim((string) config('app.url', 'http://localhost'), '/') ?: 'http://localhost';
        $services = Service::query()->where('is_published', true)->orderBy('id')->get();
        $items = CatalogItem::query()
            ->public()
            ->with(['suggestions' => fn ($query) => $query
                ->where('catalog_items.is_public', true)
                ->where('catalog_items.is_active', true)])
            ->get();

        return Inertia::render('quote/request', [
            'services' => $services->map(fn (Service $service) => [
                'id' => $service->id,
                'slug' => $service->slug,
                'name' => preg_replace('/\s+en Guayaquil$/u', '', $service->name),
                'summary' => $service->summary,
            ])->values(),
            'items' => $items->map(fn (CatalogItem $item) => [
                ...$item->toPublicArray(),
                'suggestions' => $item->suggestions
                    ->map(fn (CatalogItem $suggested) => ['id' => $suggested->id, 'reason' => $suggested->pivot->reason])
                    ->values(),
            ])->values(),
            'zones' => ServiceZone::query()->active()->get()->map->toPublicArray()->values(),
            'packages' => QuotePackages::forPublic(),
            'prefill' => $this->prefill($request, $services, $items),
            'captcha' => SimpleCaptcha::for(StoreQuoteRequestRequest::CAPTCHA_KEY)->challenge(),
            'whatsapp_number' => QuoteSettings::whatsappNumber(),
            'seo' => [
                'title' => 'Pide tu cotización de carpintería en Guayaquil | Punto Madera',
                'description' => 'Cuéntanos qué necesitas: puertas, closets, cocinas, muebles o reparaciones en Guayaquil. Responde unas preguntas y recibe tu cotización por WhatsApp.',
                'canonical' => "{$siteUrl}/cotizar",
            ],
        ]);
    }

    public function store(StoreQuoteRequestRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $lines = collect($data['items'] ?? []);
        $catalog = CatalogItem::query()->whereIn('id', $lines->pluck('catalog_item_id'))->get()->keyBy('id');

        $quoteRequest = QuoteRequest::query()->create([
            'type' => $data['type'],
            'package' => $data['package'] ?? null,
            'name' => trim($data['name']),
            'phone' => trim($data['phone']),
            'email' => $data['email'] ?? null,
            'company' => $data['type'] === 'empresa' ? ($data['company'] ?? null) : null,
            'properties_count' => $data['type'] === 'empresa' ? ($data['properties_count'] ?? null) : null,
            'service_zone_id' => $data['service_zone_id'],
            'sector' => $data['sector'] ?? null,
            'message' => $data['message'] ?? null,
            'services' => array_map('intval', $data['services'] ?? []),
            'items' => $lines->map(fn (array $line) => [
                'catalog_item_id' => (int) $line['catalog_item_id'],
                'name' => $catalog[$line['catalog_item_id']]->name,
                'unit' => $catalog[$line['catalog_item_id']]->unit,
                'quantity' => (float) $line['quantity'],
            ])->values()->all(),
            'accepted_suggestions' => array_map('intval', $data['accepted_suggestions'] ?? []),
            ...CaptureAttribution::fromSession($request),
        ]);

        $this->storePhotos($request, $quoteRequest);

        SimpleCaptcha::for(StoreQuoteRequestRequest::CAPTCHA_KEY)->clear();

        $sent = collect((array) $request->session()->get(self::SENT_SESSION_KEY, []))
            ->push($quoteRequest->reference)
            ->take(-5)
            ->values()
            ->all();
        $request->session()->put(self::SENT_SESSION_KEY, $sent);
        $request->session()->flash('quote_lead', true);

        return to_route('quote-requests.sent', $quoteRequest->reference);
    }

    /** Confirmation page, only for the visitor who sent that request. */
    public function sent(Request $request, string $reference): Response|RedirectResponse
    {
        if (! in_array($reference, (array) $request->session()->get(self::SENT_SESSION_KEY, []), true)) {
            return to_route('quote-requests.create');
        }

        $quoteRequest = QuoteRequest::query()->with('zone')->where('reference', $reference)->firstOrFail();

        return Inertia::render('quote/sent', [
            'reference' => $quoteRequest->reference,
            'name' => $quoteRequest->name,
            'summary' => $quoteRequest->summaryLines(),
            'whatsappHref' => QuoteSettings::whatsappHref(QuoteSettings::whatsappNumber(), $quoteRequest->whatsappMessage()),
            'trackLead' => (bool) $request->session()->get('quote_lead'),
            'seo' => [
                'title' => 'Solicitud enviada | Punto Madera',
                'description' => 'Recibimos tu solicitud de cotización.',
                'robots' => 'noindex,nofollow',
            ],
        ]);
    }

    /**
     * @param  Collection<int, Service>  $services
     * @param  Collection<int, CatalogItem>  $items
     * @return array{type: string, package: ?string, service_ids: list<int>, item_ids: list<int>}
     */
    private function prefill(Request $request, $services, $items): array
    {
        $package = in_array($request->query('paquete'), QuotePackages::keys(), true) ? $request->query('paquete') : null;
        $type = $package ? 'casa_nueva' : $request->query('tipo');
        $item = $items->firstWhere('slug', (string) $request->query('item'));
        $serviceIds = collect([
            $services->firstWhere('slug', (string) $request->query('servicio'))?->id,
            $item?->service_id,
        ])->filter()->unique()->values()->all();

        return [
            'type' => in_array($type, QuoteRequest::TYPES, true) ? $type : 'cliente',
            'package' => $package,
            'service_ids' => $serviceIds,
            'item_ids' => $item ? [$item->id] : [],
        ];
    }

    private function storePhotos(StoreQuoteRequestRequest $request, QuoteRequest $quoteRequest): void
    {
        $photos = $request->file('photos', []);
        $photos = is_array($photos) ? $photos : [$photos];
        $stored = [];

        try {
            foreach ($photos as $photo) {
                if ($photo instanceof UploadedFile) {
                    $stored[] = $photo->store("quote-requests/{$quoteRequest->getKey()}", 'local');
                }
            }
        } catch (\Throwable $exception) {
            Storage::disk('local')->delete($stored);
            $quoteRequest->delete();

            throw $exception;
        }

        if ($stored !== []) {
            $quoteRequest->update(['photos' => $stored]);
        }
    }
}
