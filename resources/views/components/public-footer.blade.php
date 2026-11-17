@php
    $appName = str_replace('-', ' ', config('app.name', 'punto madera'));
@endphp

{{-- Same markup as resources/js/components/public-footer.tsx; links come from App\Support\SiteLinks. --}}
<footer class="border-t border-border/60 bg-card">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div>
                <a href="/" class="flex items-center gap-3 text-primary" aria-label="{{ $appName }}, inicio">
                    <img src="/favicon.svg" alt="" class="size-11 shrink-0" width="44" height="44">
                    <span>
                        <span class="block text-sm font-light tracking-[0.38em] lowercase">{{ $appName }}</span>
                        <span class="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">Guayaquil, Ecuador</span>
                    </span>
                </a>
                <p class="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
                    Muebles a medida, closets, cocinas, puertas y reparaciones en Guayaquil. Cotización clara antes de empezar.
                </p>
                <div class="mt-6 flex flex-wrap gap-2">
                    <a href="/cotizar" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Pedir cotización</a>
                    <a href="{{ $whatsappHref }}" target="_blank" rel="noopener noreferrer" class="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">WhatsApp</a>
                </div>
            </div>

            <nav aria-label="Páginas del sitio" class="grid grid-cols-2 gap-8 sm:grid-cols-4">
                @foreach (\App\Support\SiteLinks::footer() as $group)
                    <div>
                        <p class="text-sm font-semibold text-foreground">{{ $group['title'] }}</p>
                        <ul class="mt-4 grid gap-2 text-sm">
                            @foreach ($group['links'] as $link)
                                <li><a href="{{ $link['href'] }}" class="text-muted-foreground transition-colors hover:text-foreground">{{ $link['label'] }}</a></li>
                            @endforeach
                        </ul>
                    </div>
                @endforeach
            </nav>
        </div>

        <div class="mt-10 flex flex-col gap-2 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <p>© {{ now()->year }} {{ $appName }} · Guayaquil, Ecuador</p>
            @if (!empty($landing['contact_phone']))
                <a href="tel:{{ preg_replace('/[^0-9+]/', '', $landing['contact_phone']) }}" class="transition-colors hover:text-foreground">{{ $landing['contact_phone'] }}</a>
            @endif
        </div>
    </div>
</footer>
