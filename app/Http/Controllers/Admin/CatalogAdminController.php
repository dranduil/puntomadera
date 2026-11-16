<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveCatalogItemRequest;
use App\Models\CatalogItem;
use App\Models\Partner;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CatalogAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/catalog', [
            'items' => CatalogItem::query()
                ->with(['suggestions:id,name', 'service:id,name', 'partner:id,name'])
                ->orderBy('service_id')
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get()
                ->map(fn (CatalogItem $item) => [
                    ...$item->only([
                        'id', 'kind', 'service_id', 'partner_id', 'name', 'slug', 'description', 'unit',
                        'price_min_cents', 'price_max_cents', 'cost_cents', 'includes_material', 'is_public', 'is_active',
                    ]),
                    'service_name' => $item->service?->name,
                    'partner_name' => $item->partner?->name,
                    'suggestions' => $item->suggestions->map(fn (CatalogItem $suggested) => [
                        'id' => $suggested->id,
                        'name' => $suggested->name,
                        'reason' => $suggested->pivot->reason,
                    ])->values(),
                ]),
            'services' => Service::query()->orderBy('name')->get(['id', 'name']),
            'partners' => Partner::query()->orderBy('name')->get(['id', 'name']),
            'kinds' => CatalogItem::KINDS,
            'units' => CatalogItem::UNIT_LABELS,
        ]);
    }

    public function store(SaveCatalogItemRequest $request): RedirectResponse
    {
        $data = $request->catalogData();

        CatalogItem::query()->create([
            ...$data,
            'slug' => CatalogItem::uniqueSlug($data['name']),
            'sort_order' => (int) CatalogItem::query()->max('sort_order') + 10,
        ]);

        return back()->with('status', 'Ítem creado.');
    }

    public function update(SaveCatalogItemRequest $request, CatalogItem $item): RedirectResponse
    {
        $item->update($request->catalogData());

        return back()->with('status', "Guardado: {$item->name}.");
    }

    public function adjustPrices(Request $request): RedirectResponse
    {
        abort_unless($request->user()?->is_admin, 403);

        $data = $request->validate([
            'percent' => ['required', 'numeric', 'min:-50', 'max:100', 'not_in:0'],
            'service_id' => ['nullable', 'integer', 'exists:services,id'],
        ]);

        $count = count(CatalogItem::adjustPrices((float) $data['percent'], $data['service_id'] ?? null));

        return back()->with('status', "Precios ajustados {$data['percent']}% en {$count} ítems.");
    }

    public function storeSuggestion(Request $request, CatalogItem $item): RedirectResponse
    {
        abort_unless($request->user()?->is_admin, 403);

        $data = $request->validate([
            'suggested_item_id' => ['required', 'integer', 'exists:catalog_items,id', Rule::notIn([$item->id])],
            'reason' => ['nullable', 'string', 'max:255'],
        ]);

        $item->suggestions()->syncWithoutDetaching([
            $data['suggested_item_id'] => [
                'reason' => $data['reason'] ?? null,
                'sort_order' => ($item->suggestions()->count() + 1) * 10,
            ],
        ]);

        return back()->with('status', 'Sugerencia agregada.');
    }

    public function destroySuggestion(Request $request, CatalogItem $item, CatalogItem $suggested): RedirectResponse
    {
        abort_unless($request->user()?->is_admin, 403);

        $item->suggestions()->detach($suggested->id);

        return back()->with('status', 'Sugerencia quitada.');
    }
}
