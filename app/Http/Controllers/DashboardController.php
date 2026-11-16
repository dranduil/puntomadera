<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Models\QuoteRequest;
use App\Support\BusinessMetrics;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Money dashboard: this month's requests, quotes, payments and commissions.
 * Only admins see the numbers; other accounts get the plain dashboard.
 */
class DashboardController extends Controller
{
    private const MONTHS_BACK = 6;

    public function __invoke(Request $request): Response
    {
        if (! $request->user()->is_admin) {
            return Inertia::render('dashboard', ['metrics' => null]);
        }

        $months = collect(range(0, self::MONTHS_BACK - 1))
            ->map(fn (int $back) => CarbonImmutable::now()->startOfMonth()->subMonths($back))
            ->map(fn (CarbonImmutable $month) => [
                'value' => $month->format('Y-m'),
                'label' => ucfirst($month->locale('es')->translatedFormat('F Y')),
            ]);
        $selected = $months->firstWhere('value', $request->query('mes')) ?? $months->first();

        return Inertia::render('dashboard', [
            'metrics' => BusinessMetrics::forMonth(CarbonImmutable::createFromFormat('!Y-m', $selected['value'])),
            'month' => $selected['value'],
            'months' => $months->values(),
            'commissions' => BusinessMetrics::commissions(),
            'newRequests' => QuoteRequest::query()
                ->with('zone:id,name')
                ->where('status', 'nuevo')
                ->latest()
                ->limit(5)
                ->get()
                ->map(fn (QuoteRequest $quoteRequest) => [
                    'id' => $quoteRequest->id,
                    'reference' => $quoteRequest->reference,
                    'name' => $quoteRequest->name,
                    'type' => QuoteRequest::TYPE_LABELS[$quoteRequest->type] ?? $quoteRequest->type,
                    'zone' => $quoteRequest->zone?->name,
                    'created_at' => $quoteRequest->created_at?->toIso8601String(),
                ]),
            'paymentsToConfirm' => Quote::query()
                ->whereNotNull('payment_reported_at')
                ->whereNull('paid_at')
                ->latest('payment_reported_at')
                ->limit(5)
                ->get()
                ->map(fn (Quote $quote) => [
                    'id' => $quote->id,
                    'number' => $quote->number,
                    'client_name' => $quote->client_name,
                    'deposit_cents' => $quote->deposit_cents,
                    'payment_reported_at' => $quote->payment_reported_at?->toIso8601String(),
                ]),
        ]);
    }
}
