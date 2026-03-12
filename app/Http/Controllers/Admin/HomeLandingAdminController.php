<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateHomeLandingRequest;
use App\Models\HomeLanding;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class HomeLandingAdminController extends Controller
{
    public function edit(): Response
    {
        return Inertia::render('admin/home-landing', [
            'landing' => HomeLanding::query()->first(),
        ]);
    }

    public function update(UpdateHomeLandingRequest $request): RedirectResponse
    {
        $landing = HomeLanding::query()->first();

        if (! $landing) {
            HomeLanding::query()->create($request->validated());

            return to_route('admin.home.edit');
        }

        $landing->update($request->validated());

        return to_route('admin.home.edit');
    }
}
