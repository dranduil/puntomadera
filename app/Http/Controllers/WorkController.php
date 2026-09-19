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
        $siteUrl = rtrim((string) config('app.url', 'http://localhost'), '/') ?: 'http://localhost';
        $page = max(1, (int) request()->query('page', 1));
        $canonicalUrl = "{$siteUrl}/trabajos".($page > 1 ? "?page={$page}" : '');

        return Inertia::render('works/index', [
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
            ],
            'seo' => [
                'title' => 'Trabajos de carpintería en Guayaquil | Proyectos reales | Punto Madera',
                'description' => 'Conoce proyectos reales de carpintería en Guayaquil: muebles a medida, cocinas, closets, puertas y reparaciones. Cotiza tu proyecto por WhatsApp.',
                'canonical' => $canonicalUrl,
            ],
            'works' => Work::query()
                ->where('is_published', true)
                ->latest()
                ->paginate(12)
                ->withQueryString(),
        ]);
    }
}
