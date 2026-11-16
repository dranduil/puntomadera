<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SavePartnerRequest;
use App\Models\Partner;
use App\Models\QuoteItem;
use App\Models\QuoteRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PartnerAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/partners', [
            'partners' => Partner::query()->orderBy('name')->get(),
            'commissions' => self::commissions(),
            'referrals' => QuoteRequest::query()
                ->with('referredPartner:id,name')
                ->where('status', 'derivado')
                ->latest()
                ->limit(50)
                ->get(['id', 'reference', 'name', 'referred_partner_id', 'created_at'])
                ->map(fn (QuoteRequest $request) => [
                    'id' => $request->id,
                    'reference' => $request->reference,
                    'client' => $request->name,
                    'partner' => $request->referredPartner?->name,
                    'date' => $request->created_at->toDateString(),
                ]),
        ]);
    }

    public function store(SavePartnerRequest $request): RedirectResponse
    {
        Partner::query()->create($request->validated());

        return back()->with('status', 'Aliado creado.');
    }

    public function update(SavePartnerRequest $request, Partner $partner): RedirectResponse
    {
        $partner->update($request->validated());

        return back()->with('status', "Guardado: {$partner->name}.");
    }

    /**
     * Commission owed per partner on quotes the client accepted or paid.
     *
     * @return list<array{partner_id: int, partner: string, quotes: int, sales_cents: int, commission_cents: int}>
     */
    public static function commissions(): array
    {
        return QuoteItem::query()
            ->with(['partner:id,name', 'quote:id,status'])
            ->whereNotNull('partner_id')
            ->whereHas('quote', fn ($query) => $query->whereIn('status', ['aceptada', 'pagada']))
            ->get()
            ->groupBy('partner_id')
            ->map(fn ($items) => [
                'partner_id' => (int) $items->first()->partner_id,
                'partner' => (string) $items->first()->partner?->name,
                'quotes' => $items->pluck('quote_id')->unique()->count(),
                'sales_cents' => (int) $items->sum('total_cents'),
                'commission_cents' => (int) round($items->sum(fn (QuoteItem $item) => $item->total_cents * ($item->commission_percent ?? 0) / 100)),
            ])
            ->values()
            ->all();
    }
}
