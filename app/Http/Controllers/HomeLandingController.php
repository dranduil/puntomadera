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
            ?: 'Carpintero en Guayaquil | Muebles a medida, closets y puertas';
        $seoDescription = trim((string) ($landingData['seo_description'] ?? ''))
            ?: 'Carpintería a domicilio en Guayaquil, Ecuador. Muebles a medida, anaqueles de cocina, closets empotrados, instalación y reparación de puertas. Cotiza hoy por WhatsApp.';

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
