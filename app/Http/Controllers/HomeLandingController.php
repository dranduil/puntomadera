<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeLandingController extends Controller
{
    public function show(Request $request): Response
    {
        $landing = HomeLanding::query()->first();

        return Inertia::render('landing/carpintero', [
            'landing' => $landing?->toArray() ?? [
                'hero_title' => null,
                'hero_subtitle' => null,
                'seo_title' => null,
                'seo_description' => null,
                'whatsapp_number' => null,
                'contact_email' => null,
                'contact_phone' => null,
                'areas_served' => null,
            ],
            'bookingStatus' => $request->session()->get('booking_status'),
        ]);
    }
}
