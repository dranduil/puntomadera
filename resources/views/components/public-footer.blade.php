@php
    $appName = str_replace('-', ' ', config('app.name', 'punto madera'));
    $currentYear = now()->year;
@endphp

<footer class="border-t border-border/60 bg-card py-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-10 md:grid-cols-12">
            <div class="md:col-span-5">
                <a href="/" class="flex items-center gap-3 text-primary" aria-label="punto madera">
                    <img src="/favicon.svg" alt="" class="size-11 shrink-0" width="44" height="44">
                    <span>
                        <span class="block text-sm font-light tracking-[0.38em] lowercase">{{ $appName }}</span>
                        <span class="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">Guayaquil, Ecuador</span>
                    </span>
                </a>
                <p class="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
                    Muebles a medida, closets empotrados, cocinas, puertas y reparaciones. Trabajo limpio, tiempos realistas y cotización clara.
                </p>

                <div class="mt-6 flex flex-wrap gap-2">
                    <a href="{{ $whatsappHref }}" target="_blank" rel="noopener noreferrer" class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                        WhatsApp <span aria-hidden="true">↗</span>
                    </a>
                    <a href="/contacto" class="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                        Contacto <span aria-hidden="true">↗</span>
                    </a>
                </div>
            </div>

            <div class="md:col-span-3">
                <div class="text-sm font-semibold">Navegación</div>
                <div class="mt-4 grid gap-2 text-sm">
                    <a href="/" class="text-muted-foreground transition-colors hover:text-foreground">Inicio</a>
                    <a href="/servicios" class="text-muted-foreground transition-colors hover:text-foreground">Servicios</a>
                    <a href="/trabajos" class="text-muted-foreground transition-colors hover:text-foreground">Trabajos</a>
                    <a href="/resenas" class="text-muted-foreground transition-colors hover:text-foreground">Opiniones</a>
                </div>
            </div>

            <div class="md:col-span-2">
                <div class="text-sm font-semibold">Páginas</div>
                <div class="mt-4 grid gap-2 text-sm">
                    <a href="/instalacion-puertas-guayaquil" class="text-muted-foreground transition-colors hover:text-foreground">Instalación de puertas</a>
                    <a href="/reparacion-puertas-guayaquil" class="text-muted-foreground transition-colors hover:text-foreground">Reparación de puertas</a>
                    <a href="/carpinteria-a-medida-guayaquil" class="text-muted-foreground transition-colors hover:text-foreground">Carpintería a medida</a>
                </div>
            </div>

            <div class="md:col-span-2">
                <div class="text-sm font-semibold">Contacto</div>
                <div class="mt-4 grid gap-3 text-sm text-muted-foreground">
                    @if (!empty($landing['contact_phone']))
                        <a href="tel:{{ preg_replace('/[^0-9+]/', '', $landing['contact_phone']) }}" class="transition-colors hover:text-foreground">{{ $landing['contact_phone'] }}</a>
                    @endif
                    <span>Guayaquil, Ecuador</span>
                    <a href="{{ $whatsappHref }}" target="_blank" rel="noopener noreferrer" class="transition-colors hover:text-foreground">Cotizar por WhatsApp</a>
                </div>
            </div>
        </div>

        <div class="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
            <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>© {{ $currentYear }} {{ $appName }}. Todos los derechos reservados.</div>
                <div>Ecuador · Muebles a medida · Closets · Puertas · Reparaciones</div>
            </div>
        </div>
    </div>
</footer>
