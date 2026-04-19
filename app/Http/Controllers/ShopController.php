<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function index(): Response
    {
        $landing = HomeLanding::query()->first();

        return Inertia::render('shop/index', [
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
            ],
            'products' => Service::query()
                ->where('is_published', true)
                ->where('price_cents', '>', 0)
                ->orderByDesc('is_featured')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function show(Service $service): Response
    {
        $landing = HomeLanding::query()->first();

        abort_unless($service->is_published && $service->price_cents > 0, 404);

        return Inertia::render('shop/show', [
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
            ],
            'product' => $service,
        ]);
    }

    public function cart(): Response
    {
        $landing = HomeLanding::query()->first();

        return Inertia::render('shop/cart', [
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
            ],
        ]);
    }
}
