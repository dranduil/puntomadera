<?php

namespace App\Support;

use App\Models\Quote;
use App\Models\QuoteItem;
use App\Models\QuoteRequest;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;

/**
 * Money numbers for the admin dashboard and the AI agent's business summary.
 */
final class BusinessMetrics
{
    /**
     * @return array<string, mixed>
     */
    public static function forMonth(?CarbonInterface $month = null): array
    {
        $start = ($month ?? now())->copy()->startOfMonth();
        $range = [$start, $start->copy()->endOfMonth()];
        $sent = Quote::query()->whereBetween('sent_at', $range);
        $sentCount = (clone $sent)->count();
        $sentAccepted = (clone $sent)->whereNotNull('accepted_at')->count();

        return [
            'month' => $start->format('Y-m'),
            'requests' => QuoteRequest::query()->whereBetween('created_at', $range)->count(),
            'quotes_sent' => $sentCount,
            'quotes_viewed' => Quote::query()->whereBetween('viewed_at', $range)->count(),
            'quotes_accepted' => Quote::query()->whereBetween('accepted_at', $range)->count(),
            'close_rate_percent' => $sentCount > 0 ? (int) round($sentAccepted / $sentCount * 100) : null,
            'accepted_cents' => (int) Quote::query()->whereBetween('accepted_at', $range)->sum('total_cents'),
            'paid_cents' => (int) Quote::query()->whereBetween('paid_at', $range)->sum('paid_amount_cents'),
            'commissions_owed_cents' => array_sum(array_column(self::commissions(), 'commission_cents')),
            'pending_requests' => QuoteRequest::query()->where('status', 'nuevo')->count(),
            'payments_to_confirm' => Quote::query()->whereNotNull('payment_reported_at')->whereNull('paid_at')->count(),
            'leads_by_source' => QuoteRequest::query()
                ->whereBetween('created_at', $range)
                ->select(DB::raw("coalesce(utm_source, source_path, 'directo') as source"), DB::raw('count(*) as total'))
                ->groupBy('source')
                ->orderByDesc('total')
                ->limit(8)
                ->pluck('total', 'source')
                ->map(fn ($total) => (int) $total)
                ->all(),
        ];
    }

    /**
     * Commission owed per partner on quotes the client accepted or paid.
     *
     * @return list<array{partner_id: int, partner: string, quotes: int, sales_cents: int, commission_cents: int}>
     */
    public static function commissions(): array
    {
        return QuoteItem::query()
            ->with(['partner:id,name'])
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
