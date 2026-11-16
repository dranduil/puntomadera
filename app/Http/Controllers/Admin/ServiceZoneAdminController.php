<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SaveServiceZoneRequest;
use App\Models\ServiceZone;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ServiceZoneAdminController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/zones', [
            'zones' => ServiceZone::query()->orderBy('sort_order')->orderBy('id')->get(),
        ]);
    }

    public function store(SaveServiceZoneRequest $request): RedirectResponse
    {
        ServiceZone::query()->create($request->zoneData());

        return back()->with('status', 'Zona creada.');
    }

    public function update(SaveServiceZoneRequest $request, ServiceZone $zone): RedirectResponse
    {
        $zone->update($request->zoneData());

        return back()->with('status', "Guardado: {$zone->name}.");
    }
}
