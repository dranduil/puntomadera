<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use App\Models\Service;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('services/index', [
            'services' => Service::query()
                ->where('is_published', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function show(Service $service): Response
    {
        $landing = HomeLanding::query()->first();

        return Inertia::render('services/show', [
            'service' => $service,
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
                'contact_email' => null,
                'contact_phone' => null,
            ],
        ]);
    }
}

