<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SavePartnerRequest;
use App\Models\Partner;
use App\Models\QuoteRequest;
use App\Support\BusinessMetrics;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PartnerAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/partners', [
            'partners' => Partner::query()->orderBy('name')->get(),
            'commissions' => BusinessMetrics::commissions(),
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
}
