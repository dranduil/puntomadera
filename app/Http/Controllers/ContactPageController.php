<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use Inertia\Inertia;
use Inertia\Response;

class ContactPageController extends Controller
{
    public function show(): Response
    {
        $landing = HomeLanding::query()->first();

        $siteUrl = rtrim((string) config('app.url', 'http://localhost'), '/') ?: 'http://localhost';

        return Inertia::render('contact/index', [
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
                'contact_email' => null,
                'contact_phone' => null,
            ],
            // Printed by the Blade layout when SSR is unavailable; mirrors the page's own <Head>.
            'seo' => [
                'title' => 'Contacto y WhatsApp en Guayaquil | Punto Madera',
                'description' => 'Escríbenos por WhatsApp o llámanos. Atendemos Guayaquil, Urdesa, Vía a la Costa, Samborondón y Daule. Para un precio, pide tu cotización en línea.',
                'canonical' => "{$siteUrl}/contacto",
            ],
        ]);
    }
}
