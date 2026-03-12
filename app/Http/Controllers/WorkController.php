<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use App\Models\Work;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller
{
    public function index(): Response
    {
        $landing = HomeLanding::query()->first();

        return Inertia::render('works/index', [
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
            ],
            'works' => Work::query()
                ->where('is_published', true)
                ->latest()
                ->paginate(12)
                ->withQueryString(),
        ]);
    }
}
