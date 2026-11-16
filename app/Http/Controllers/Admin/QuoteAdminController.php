<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MarkQuotePaidRequest;
use App\Http\Requests\Admin\SaveQuoteRequest;
use App\Models\CatalogItem;
use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Models\ServiceZone;
use App\Support\Money;
use App\Support\QuoteBuilder;
use App\Support\QuoteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class QuoteAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->validate([
            'estado' => ['nullable', Rule::in(Quote::STATUSES)],
        ])['estado'] ?? null;

        return Inertia::render('admin/quotes', [
            'quotes' => Quote::query()
                ->with('request:id,reference')
                ->when($status, fn ($query) => $query->where('status', $status))
                ->latest()
                ->paginate(25)
                ->withQueryString()
                ->through(fn (Quote $quote) => [
                    'id' => $quote->id,
                    'number' => $quote->number,
                    'client_name' => $quote->client_name,
                    'request_reference' => $quote->request?->reference,
                    'total_cents' => $quote->total_cents,
                    'deposit_cents' => $quote->deposit_cents,
                    'status' => $quote->status,
                    'expired' => $quote->isExpired(),
                    'valid_until' => $quote->valid_until?->format('d/m/Y'),
                    'created_at' => $quote->created_at->format('d/m/Y'),
                    'public_url' => $quote->publicUrl(),
                    'payment_reported' => $quote->payment_reported_at !== null && $quote->paid_at === null,
                ]),
            'status' => $status,
            'statuses' => Quote::STATUSES,
        ]);
    }

    public function create(Request $request): Response
    {
        $quoteRequest = $request->integer('solicitud')
            ? QuoteRequest::query()->with('zone')->find($request->integer('solicitud'))
            : null;

        return $this->builder(QuoteBuilder::defaultsFor($quoteRequest), null, $quoteRequest);
    }

    public function store(SaveQuoteRequest $request): RedirectResponse
    {
        $quote = QuoteBuilder::save(new Quote, $request->validated());

        return to_route('admin.quotes.edit', $quote)->with('status', "Cotización {$quote->number} guardada.");
    }

    public function edit(Quote $quote): Response
    {
        $quote->load(['items', 'request.zone']);

        return $this->builder([
            ...$quote->only([
                'quote_request_id', 'client_name', 'client_phone', 'service_zone_id', 'travel_fee_cents',
                'visit_fee_cents', 'discount_cents', 'iva_percent', 'deposit_percent', 'notes', 'terms', 'payment_link',
            ]),
            'valid_until' => $quote->valid_until?->toDateString(),
            'items' => $quote->items->map(fn ($item) => [
                'catalog_item_id' => $item->catalog_item_id,
                'description' => $item->description,
                'unit' => $item->unit,
                'quantity' => $item->quantity,
                'unit_price_cents' => $item->unit_price_cents,
            ])->values()->all(),
        ], $quote, $quote->request);
    }

    public function update(SaveQuoteRequest $request, Quote $quote): RedirectResponse
    {
        if ($quote->isLocked()) {
            return back()->withErrors(['quote' => 'Esta cotización ya fue aceptada o pagada. Duplícala para hacer cambios.']);
        }

        QuoteBuilder::save($quote, $request->validated());

        return back()->with('status', "Cotización {$quote->number} guardada.");
    }

    /** Called when the admin taps "Enviar por WhatsApp"; the link itself opens in the browser. */
    public function markSent(Quote $quote): RedirectResponse
    {
        if ($quote->status === 'borrador') {
            $quote->update(['status' => 'enviada', 'sent_at' => now()]);
        }

        return back();
    }

    public function duplicate(Quote $quote): RedirectResponse
    {
        $quote->load('items');
        $copy = $quote->replicate(['number', 'token', 'status', 'sent_at', 'viewed_at', 'accepted_at', 'rejected_at', 'payment_reported_at', 'paid_at', 'paid_amount_cents', 'payment_method']);
        $copy->status = 'borrador';
        $copy->valid_until = now()->addDays(QuoteSettings::current()['validity_days']);
        $copy->save();

        foreach ($quote->items as $item) {
            $copy->items()->create($item->replicate(['quote_id'])->toArray());
        }

        return to_route('admin.quotes.edit', $copy)->with('status', "Copia creada: {$copy->number}.");
    }

    public function markPaid(MarkQuotePaidRequest $request, Quote $quote): RedirectResponse
    {
        $quote->update([
            ...$request->validated(),
            'status' => 'pagada',
            'paid_at' => now(),
            'accepted_at' => $quote->accepted_at ?? now(),
        ]);
        $quote->request?->update(['status' => 'cerrado']);

        return back()->with('status', "Pago registrado en {$quote->number}.");
    }

    /**
     * @param  array<string, mixed>  $quote
     */
    private function builder(array $quote, ?Quote $model, ?QuoteRequest $quoteRequest): Response
    {
        return Inertia::render('admin/quote-builder', [
            'quote' => $quote,
            'meta' => $model ? [
                'id' => $model->id,
                'number' => $model->number,
                'status' => $model->status,
                'locked' => $model->isLocked(),
                'expired' => $model->isExpired(),
                'public_url' => $model->publicUrl(),
                'send_href' => QuoteSettings::whatsappHref(QuoteSettings::ecuadorPhone($model->client_phone), self::clientMessage($model)),
                'deposit_cents' => $model->deposit_cents,
                'timeline' => collect([
                    'Enviada' => $model->sent_at,
                    'Vista por el cliente' => $model->viewed_at,
                    'Aceptada' => $model->accepted_at,
                    'Cliente dice que pagó' => $model->payment_reported_at,
                    'Pagada' => $model->paid_at,
                ])->filter()->map(fn ($date) => $date->format('d/m/Y H:i'))->all(),
                'paid_amount_cents' => $model->paid_amount_cents,
                'payment_method' => $model->payment_method,
            ] : null,
            'request' => $quoteRequest ? [
                'id' => $quoteRequest->id,
                'reference' => $quoteRequest->reference,
                'name' => $quoteRequest->name,
                'summary' => $quoteRequest->summaryLines(),
                'message' => $quoteRequest->message,
            ] : null,
            'catalog' => CatalogItem::query()
                ->active()
                ->with(['suggestions:id', 'partner:id,name'])
                ->get()
                ->map(fn (CatalogItem $item) => [
                    'id' => $item->id,
                    'name' => $item->name,
                    'kind' => $item->kind,
                    'unit' => $item->unit,
                    'price_min_cents' => $item->price_min_cents,
                    'price_max_cents' => $item->price_max_cents,
                    'partner_name' => $item->partner?->name,
                    'suggestion_ids' => $item->suggestions->pluck('id')->values(),
                ])->values(),
            'zones' => ServiceZone::query()->active()->get(['id', 'name', 'travel_fee_cents', 'visit_fee_cents']),
            'units' => CatalogItem::UNIT_LABELS,
            'paymentMethods' => Quote::PAYMENT_METHODS,
        ]);
    }

    public static function clientMessage(Quote $quote): string
    {
        $validUntil = $quote->valid_until ? ' Válida hasta el '.$quote->valid_until->format('d/m/Y').'.' : '';

        return "Hola {$quote->client_name}, te envío tu cotización {$quote->number} de Punto Madera.\n\n"
            .'Total: '.Money::format($quote->total_cents).'. Anticipo para empezar: '.Money::format($quote->deposit_cents).".{$validUntil}\n\n"
            ."Puedes verla y aceptarla aquí: {$quote->publicUrl()}";
    }
}
