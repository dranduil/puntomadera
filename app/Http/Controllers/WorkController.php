<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('works/index', [
            'works' => Work::query()
                ->where('is_published', true)
                ->latest()
                ->paginate(12)
                ->withQueryString(),
        ]);
    }
}
