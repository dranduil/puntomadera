<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateQuoteRequestRequest;
use App\Models\Partner;
use App\Models\QuoteRequest;
use App\Support\QuoteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class QuoteRequestAdminController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->validate([
            'estado' => ['nullable', Rule::in(QuoteRequest::STATUSES)],
        ])['estado'] ?? null;

        $requests = QuoteRequest::query()
            ->with(['zone:id,name', 'referredPartner:id,name', 'quotes:id,quote_request_id,number,status'])
            ->when($status, fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (QuoteRequest $quoteRequest) => [
                'id' => $quoteRequest->id,
                'reference' => $quoteRequest->reference,
                'type' => QuoteRequest::TYPE_LABELS[$quoteRequest->type] ?? $quoteRequest->type,
                'created_at' => $quoteRequest->created_at->format('d/m/Y H:i'),
                'name' => $quoteRequest->name,
                'phone' => $quoteRequest->phone,
                'email' => $quoteRequest->email,
                'whatsapp_href' => QuoteSettings::whatsappHref(
                    QuoteSettings::ecuadorPhone($quoteRequest->phone),
                    "Hola {$quoteRequest->name}, te escribo de Punto Madera por tu solicitud {$quoteRequest->reference}.",
                ),
                'summary' => $quoteRequest->summaryLines(),
                'message' => $quoteRequest->message,
                'photos' => collect($quoteRequest->photos ?? [])->keys()
                    ->map(fn (int $index) => route('admin.quote-requests.photo', [$quoteRequest, $index]))
                    ->all(),
                'source' => collect([
                    $quoteRequest->utm_source,
                    $quoteRequest->utm_campaign,
                    $quoteRequest->source_path,
                ])->filter()->implode(' · '),
                'status' => $quoteRequest->status,
                'referred_partner_id' => $quoteRequest->referred_partner_id,
                'admin_notes' => $quoteRequest->admin_notes,
                'quotes' => $quoteRequest->quotes->map->only(['id', 'number', 'status'])->values(),
            ]);

        return Inertia::render('admin/quote-requests', [
            'requests' => $requests,
            'status' => $status,
            'statuses' => QuoteRequest::STATUSES,
            'counts' => QuoteRequest::query()->selectRaw('status, count(*) as total')->groupBy('status')->pluck('total', 'status'),
            'partners' => Partner::query()->where('is_active', true)->orderBy('name')->get(['id', 'name', 'trade']),
        ]);
    }

    public function update(UpdateQuoteRequestRequest $request, QuoteRequest $quoteRequest): RedirectResponse
    {
        $data = $request->validated();

        $quoteRequest->update([
            ...$data,
            'referred_partner_id' => $data['status'] === 'derivado' ? $data['referred_partner_id'] : $quoteRequest->referred_partner_id,
        ]);

        return back()->with('status', "Solicitud {$quoteRequest->reference} actualizada.");
    }

    public function photo(Request $request, QuoteRequest $quoteRequest, int $index): BinaryFileResponse
    {
        abort_unless($request->user()?->is_admin, 403);

        $path = ($quoteRequest->photos ?? [])[$index] ?? null;

        abort_unless(is_string($path) && Storage::disk('local')->exists($path), 404);

        return response()->file(Storage::disk('local')->path($path), ['Cache-Control' => 'private, max-age=3600']);
    }
}
