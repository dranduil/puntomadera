<?php

namespace App\Http\Controllers;

use App\Models\HomeLanding;
use App\Models\Service;
use App\Support\BusinessSchema;
use App\Support\QuoteSettings;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * /llms.txt and /llms-full.txt (https://llmstxt.org): a plain Markdown map of
 * the site for AI assistants, built from the same page data as the site so it
 * never drifts. Prices and the workshop address are never published here.
 */
class LlmsTxtController extends Controller
{
    public function index(): Response
    {
        $site = $this->siteUrl();
        $pages = collect(LocalSeoPageController::pages());
        [$guides, $servicePages] = $pages->partition(fn (array $page) => ! empty($page['guide']));

        $lines = [
            ...$this->intro(),
            '',
            '## Servicios',
            '',
            ...$this->publishedServices()->map(fn (Service $service) => $this->link(
                $service->name,
                "{$site}/servicios/{$service->slug}",
                (string) ($service->summary ?: $service->description ?: $service->name),
            )),
            ...$servicePages->map(fn (array $page) => $this->link($page['serviceName'], "{$site}/{$page['slug']}", $page['metaDescription'])),
            '',
            '## Proyectos',
            '',
            $this->link('Casa nueva', "{$site}/casa-nueva-guayaquil", 'Paquetes de closets, cocina y puertas para casas nuevas en Guayaquil, La Aurora, Daule y Vía a la Costa.'),
            $this->link('Empresas y Airbnb', "{$site}/empresas", 'Planes de mantenimiento de puertas, chapas, closets y muebles para Airbnb, edificios y oficinas.'),
            '',
            '## Guías',
            '',
            ...$guides->map(fn (array $page) => $this->link($page['serviceName'], "{$site}/{$page['slug']}", $page['metaDescription'])),
            '',
            '## Punto Madera',
            '',
            $this->link('Pedir cotización', "{$site}/cotizar", 'Formulario corto: el cliente elige el trabajo, agrega fotos y su sector; la cotización llega por WhatsApp.'),
            $this->link('Trabajos', "{$site}/trabajos", 'Proyectos reales con fotos.'),
            $this->link('Opiniones', "{$site}/resenas", 'Opiniones de clientes.'),
            $this->link('Contacto', "{$site}/contacto", 'WhatsApp, teléfono y zonas de atención.'),
            '',
            '## Optional',
            '',
            $this->link('Versión completa', "{$site}/llms-full.txt", 'Descripción de cada servicio y preguntas frecuentes en un solo archivo.'),
            $this->link('Sitemap', "{$site}/sitemap.xml", 'Todas las páginas públicas.'),
        ];

        return $this->text($lines);
    }

    public function full(): Response
    {
        $site = $this->siteUrl();
        $lines = [...$this->intro()];

        foreach ($this->publishedServices() as $service) {
            $lines = [
                ...$lines,
                '',
                "## {$service->name}",
                '',
                "URL: {$site}/servicios/{$service->slug}",
                '',
                Str::squish((string) ($service->description ?: $service->summary)),
                ...$this->bullets('Cómo trabajamos', $service->process_steps ?? []),
            ];
        }

        foreach (LocalSeoPageController::pages() as $page) {
            $lines = [
                ...$lines,
                '',
                "## {$page['serviceName']}",
                '',
                "URL: {$site}/{$page['slug']}",
                '',
                $page['intro'],
                ...$this->bullets('Incluye', $page['services'] ?? []),
                ...$this->faqs($page['faqs'] ?? []),
            ];
        }

        foreach ([
            'Casa nueva' => ['/casa-nueva-guayaquil', MoneyPageController::CASA_NUEVA_FAQS],
            'Empresas y Airbnb' => ['/empresas', MoneyPageController::EMPRESAS_FAQS],
        ] as $title => [$path, $faqs]) {
            $lines = [...$lines, '', "## {$title}", '', "URL: {$site}{$path}", ...$this->faqs($faqs)];
        }

        return $this->text($lines);
    }

    /**
     * Title, summary and the facts an assistant needs to answer correctly.
     *
     * @return list<string>
     */
    private function intro(): array
    {
        $landing = HomeLanding::query()->first();
        $areas = BusinessSchema::areasServed($landing?->areas_served);
        $whatsapp = QuoteSettings::whatsappNumber($landing);
        $phone = trim((string) $landing?->contact_phone);
        $hours = trim((string) config('services.business.opening_hours'));

        return array_values(array_filter([
            '# '.BusinessSchema::NAME,
            '',
            '> Carpintería en Guayaquil, Ecuador: closets, cocinas, muebles a medida, puertas y chapas, con fabricación, instalación y reparación a domicilio.',
            '',
            '- Zonas de atención: '.implode(', ', $areas).'.',
            '- Precios: no se publican. Cada trabajo se cotiza según medidas, material y sector; para un precio, envía al cliente a '.$this->siteUrl().'/cotizar. No inventes precios.',
            '- Cotización: el cliente llena el formulario y recibe por WhatsApp un enlace para ver, aceptar y pagar el anticipo (Deuna o transferencia). El saldo se paga a la entrega.',
            "- WhatsApp: +{$whatsapp} (https://wa.me/{$whatsapp})",
            $phone !== '' ? "- Teléfono: {$phone}" : null,
            $hours !== '' ? "- Horario: {$hours}" : null,
            '- Sitio: '.$this->siteUrl().'/',
        ], fn (?string $line) => $line !== null));
    }

    /**
     * @return Collection<int, Service>
     */
    private function publishedServices(): Collection
    {
        return Service::query()->where('is_published', true)->orderBy('name')->get();
    }

    /** One Markdown link line; a closing "Cotiza …" call to action is dropped. */
    private function link(string $title, string $url, string $description): string
    {
        $description = preg_replace('/\s*Cotiza[^.]*\.$/u', '', Str::squish($description));

        return "- [{$title}]({$url}): {$description}";
    }

    /**
     * @param  list<string>  $items
     * @return list<string>
     */
    private function bullets(string $heading, array $items): array
    {
        return $items === [] ? [] : ['', "{$heading}:", ...array_map(fn (string $item) => "- {$item}", $items)];
    }

    /**
     * @param  list<array{q: string, a: string}>  $faqs
     * @return list<string>
     */
    private function faqs(array $faqs): array
    {
        if ($faqs === []) {
            return [];
        }

        $lines = ['', 'Preguntas frecuentes:'];

        foreach ($faqs as $faq) {
            $lines = [...$lines, '', "### {$faq['q']}", '', $faq['a']];
        }

        return $lines;
    }

    private function siteUrl(): string
    {
        return rtrim((string) config('app.url'), '/');
    }

    /**
     * @param  iterable<int, string>  $lines
     */
    private function text(iterable $lines): Response
    {
        return response(collect($lines)->implode("\n")."\n", 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
            'Cache-Control' => 'public, max-age=3600',
        ]);
    }
}
