<?php

namespace App\Http\Controllers;

use App\Models\CatalogItem;
use App\Models\Quote;
use App\Models\QuoteItem;
use App\Support\Money;
use App\Support\QuoteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The client's own quote, reached by its secret link. Shows prices and lets
 * the client accept it and report the deposit payment. Never indexed.
 */
class QuotePublicController extends Controller
{
    public function show(Request $request, string $token): Response
    {
        $quote = $this->find($token);

        if (! $request->user()?->is_admin && $quote->viewed_at === null) {
            $quote->forceFill([
                'viewed_at' => now(),
                'status' => in_array($quote->status, ['borrador', 'enviada'], true) ? 'vista' : $quote->status,
            ])->save();
        }

        $settings = QuoteSettings::current();
        $whatsapp = $settings['whatsapp_number'];

        return Inertia::render('quote/show', [
            'token' => $quote->token,
            'quote' => [
                'number' => $quote->number,
                'client_name' => $quote->client_name,
                'status' => $quote->status,
                'created_at' => $quote->created_at->format('d/m/Y'),
                'valid_until' => $quote->valid_until?->format('d/m/Y'),
                'expired' => $quote->isExpired(),
                'items' => $quote->items->map(fn (QuoteItem $item) => [
                    'description' => $item->description,
                    'unit' => $item->unit,
                    'unit_label' => CatalogItem::UNIT_LABELS[$item->unit] ?? $item->unit,
                    'quantity' => $item->quantity,
                    'unit_price_cents' => $item->unit_price_cents,
                    'total_cents' => $item->total_cents,
                ])->values(),
                ...$quote->only([
                    'travel_fee_cents', 'visit_fee_cents', 'discount_cents', 'subtotal_cents', 'iva_percent',
                    'iva_cents', 'total_cents', 'deposit_percent', 'deposit_cents', 'notes', 'terms',
                ]),
                'accepted' => $quote->accepted_at !== null,
                'payment_reported' => $quote->payment_reported_at !== null,
                'paid' => $quote->paid_at !== null,
            ],
            'payment' => [
                'deuna_link' => $quote->payment_link ?: $settings['deuna_payment_link'],
                'deuna_qr_url' => $settings['deuna_qr_url'],
                'bank_transfer_details' => $settings['bank_transfer_details'],
            ],
            'whatsapp' => [
                'paid_href' => QuoteSettings::whatsappHref($whatsapp, "Hola, ya pagué el anticipo de la cotización {$quote->number} (".Money::format($quote->deposit_cents).'). Te envío el comprobante.'),
                'question_href' => QuoteSettings::whatsappHref($whatsapp, "Hola, tengo una pregunta sobre la cotización {$quote->number}."),
                'renew_href' => QuoteSettings::whatsappHref($whatsapp, "Hola, mi cotización {$quote->number} venció. ¿Me la pueden actualizar?"),
            ],
            'seo' => [
                'title' => "Cotización {$quote->number} | Punto Madera",
                'description' => 'Tu cotización de Punto Madera.',
                'robots' => 'noindex,nofollow',
            ],
        ]);
    }

    public function accept(string $token): RedirectResponse
    {
        $quote = $this->find($token);

        if ($quote->isExpired()) {
            return back()->withErrors(['quote' => 'Esta cotización venció. Pídenos una actualización por WhatsApp.']);
        }

        if ($quote->status === 'rechazada') {
            return back()->withErrors(['quote' => 'Esta cotización ya no está disponible.']);
        }

        if ($quote->accepted_at === null) {
            $quote->forceFill([
                'accepted_at' => now(),
                'status' => $quote->status === 'pagada' ? 'pagada' : 'aceptada',
            ])->save();
            $quote->request?->update(['status' => 'cerrado']);
        }

        return back()->with('status', '¡Gracias! Cotización aceptada. Abajo tienes cómo pagar el anticipo.');
    }

    public function reportPayment(string $token): RedirectResponse
    {
        $quote = $this->find($token);

        abort_if($quote->accepted_at === null, 422);

        $quote->payment_reported_at ??= now();
        $quote->save();

        return back();
    }

    private function find(string $token): Quote
    {
        return Quote::query()->with('items')->where('token', $token)->firstOrFail();
    }
}
