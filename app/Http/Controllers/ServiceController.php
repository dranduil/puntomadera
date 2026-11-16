<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use App\Models\Service;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        $landing = HomeLanding::query()->first();
        $siteUrl = rtrim((string) config('app.url', 'http://localhost'), '/') ?: 'http://localhost';

        return Inertia::render('services/index', [
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
            ],
            'seo' => [
                'title' => 'Servicios de carpintería en Guayaquil | Muebles, closets y puertas',
                'description' => 'Muebles a medida, closets, anaqueles de cocina, instalación y reparación de puertas en Guayaquil. Revisa el proceso y cotiza por WhatsApp.',
                'canonical' => "{$siteUrl}/servicios",
            ],
            'services' => Service::query()
                ->where('is_published', true)
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function show(Service $service): Response
    {
        $landing = HomeLanding::query()->first();
        $siteUrl = rtrim((string) config('app.url', 'http://localhost'), '/') ?: 'http://localhost';
        $canonicalUrl = "{$siteUrl}/servicios/{$service->slug}";
        $description = self::snippetDescription($service);
        $imageUrl = $service->image_path
            ? (preg_match('/^https?:\/\//i', $service->image_path)
                ? $service->image_path
                : "{$siteUrl}/".ltrim($service->image_path, '/'))
            : null;

        return Inertia::render('services/show', [
            'service' => $service,
            'seo' => [
                'title' => self::snippetTitle($service),
                'description' => $description,
                'canonical' => $canonicalUrl,
                'image' => $imageUrl,
                'imageAlt' => Str::before(self::snippetTitle($service), ' | '),
            ],
            'landing' => $landing?->toArray() ?? [
                'whatsapp_number' => null,
                'contact_email' => null,
                'contact_phone' => null,
            ],
        ]);
    }

    /**
     * "Muebles a medida en Guayaquil | Punto Madera": the city once, the brand once.
     */
    public static function snippetTitle(Service $service): string
    {
        $name = Str::squish($service->name);
        $place = Str::contains($name, 'Guayaquil', ignoreCase: true) ? '' : ' en Guayaquil';

        return "{$name}{$place} | Punto Madera";
    }

    /**
     * Summary as the search snippet, closed with the WhatsApp call to action
     * the landing pages use when there is room for it within ~160 characters.
     */
    public static function snippetDescription(Service $service): string
    {
        $description = Str::squish((string) (
            $service->summary ?: $service->description ?: "Servicio de {$service->name} en Guayaquil."
        ));
        $cta = ' Cotiza por WhatsApp.';

        if (! Str::contains($description, 'WhatsApp', ignoreCase: true)
            && mb_strlen($description.$cta) <= 160) {
            return $description.$cta;
        }

        return Str::limit($description, 160);
    }
}
