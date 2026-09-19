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
        $landingData = $landing?->toArray() ?? [
            'hero_title' => null,
            'hero_subtitle' => null,
            'seo_title' => null,
            'seo_description' => null,
            'whatsapp_number' => null,
            'contact_email' => null,
            'contact_phone' => null,
            'areas_served' => null,
        ];
        $siteUrl = rtrim((string) config('app.url', 'http://localhost'), '/') ?: 'http://localhost';
        $seoTitle = trim((string) ($landingData['seo_title'] ?? ''))
            ?: 'Carpintero en Guayaquil | Muebles, closets y puertas a medida';
        $seoDescription = trim((string) ($landingData['seo_description'] ?? ''))
            ?: 'Carpintero en Guayaquil para muebles a medida, closets, cocinas y puertas. Cotiza por WhatsApp instalación, reparación y acabados para tu hogar o negocio.';

        return Inertia::render('landing/carpintero', [
            'landing' => $landingData,
            'seo' => [
                'title' => $seoTitle,
                'description' => $seoDescription,
                'canonical' => "{$siteUrl}/",
                'image' => "{$siteUrl}/images/works/puerta-caoba-regenerada.png",
                'imageAlt' => 'Puerta de madera color caoba con acabado profesional en Guayaquil',
            ],
            'bookingStatus' => $request->session()->get('booking_status'),
        ]);
    }
}
