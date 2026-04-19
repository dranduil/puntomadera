<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use App\Models\Product;
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
            'products' => Product::query()
                ->where('is_published', true)
                ->orderByDesc('is_featured')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function show(Product $product): Response
    {
        $landing = HomeLanding::query()->first();

        abort_unless($product->is_published, 404);

        return Inertia::render('shop/show', [
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
            ],
            'product' => $product,
        ]);
    }
}
