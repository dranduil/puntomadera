@php
    $appName = str_replace('-', ' ', config('app.name', 'punto madera'));
    $exploreItems = [
        ['label' => 'Servicios', 'href' => '/servicios'],
        [
            'label' => 'Instalación de puertas',
            'href' => '/instalacion-puertas-guayaquil',
        ],
        [
            'label' => 'Reparación de puertas',
            'href' => '/reparacion-puertas-guayaquil',
        ],
        [
            'label' => 'Carpintería a medida',
            'href' => '/carpinteria-a-medida-guayaquil',
        ],
        ['label' => 'Trabajos', 'href' => '/trabajos'],
        ['label' => 'Agendar', 'href' => '/#booking'],
        ['label' => 'Proceso', 'href' => '/#proceso'],
        ['label' => 'FAQ', 'href' => '/#faq'],
        ['label' => 'Contacto', 'href' => '/contacto'],
    ];
@endphp

<header class="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
    <div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
        <a href="/" class="flex items-center gap-3 text-primary" aria-label="punto madera">
            <span class="relative inline-flex size-11 items-center justify-center rounded-full border border-[#8B6F4E]/45 bg-[#F2EDE6] text-[0.68rem] font-semibold tracking-[0.16em]">
                PM
                <span class="absolute inset-2 rounded-full border border-[#CDBAA2]/70"></span>
            </span>
            <span class="hidden leading-none sm:block">
                <span class="block text-sm font-light tracking-[0.38em] lowercase">{{ $appName }}</span>
                <span class="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">Guayaquil · Ecuador</span>
            </span>
        </a>

        <nav class="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="/" class="text-muted-foreground transition-colors hover:text-primary">Inicio</a>
            <details class="group relative">
                <summary class="inline-flex cursor-pointer list-none items-center gap-1 text-muted-foreground transition-colors hover:text-primary">
                    Navegar
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="m6 9 6 6 6-6"></path>
                    </svg>
                </summary>
                <div class="absolute top-full left-0 z-50 mt-3 min-w-52 rounded-md border border-border/80 bg-background p-2 shadow-lg">
                    @foreach ($exploreItems as $item)
                        <a href="{{ $item['href'] }}" class="block rounded-sm px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary">
                            {{ $item['label'] }}
                        </a>
                    @endforeach
                </div>
            </details>
        </nav>

        <div class="flex items-center gap-2">
            <div class="hidden items-center gap-1 lg:flex">
                <a href="/tienda" class="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary" title="Buscar" aria-label="Buscar">
                    <svg class="size-4 text-[#8B6F4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>
                </a>
            </div>

            <div class="md:hidden">
                <details class="group relative">
                    <summary class="inline-flex size-9 cursor-pointer list-none items-center justify-center rounded-md border border-input bg-background shadow-xs">
                        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-label="Abrir menú">
                            <path d="M4 6h16"></path>
                            <path d="M4 12h16"></path>
                            <path d="M4 18h16"></path>
                        </svg>
                    </summary>
                    <div class="absolute top-full right-0 z-50 mt-3 w-80 rounded-md border border-border/80 bg-background p-4 shadow-lg">
                        <div class="grid gap-2 text-sm">
                            <a href="/" class="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary">Inicio</a>
                            <details class="rounded-md border border-border/60 p-2">
                                <summary class="cursor-pointer list-none px-1 text-sm font-medium">Navegar</summary>
                                <div class="mt-2 grid gap-1">
                                    @foreach ($exploreItems as $item)
                                        <a href="{{ $item['href'] }}" class="rounded-sm px-2 py-1.5 text-muted-foreground transition-colors hover:bg-muted/70 hover:text-primary">
                                            {{ $item['label'] }}
                                        </a>
                                    @endforeach
                                </div>
                            </details>
                            <div class="mt-4 grid gap-2">
                                <a href="{{ $whatsappHref }}" target="_blank" rel="noreferrer" class="inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-[#8B6F4E]">WhatsApp</a>
                                <a href="/contacto" class="inline-flex h-10 items-center justify-center rounded-md border border-[#8B6F4E] px-5 text-sm font-medium text-primary transition-all duration-200 hover:bg-secondary">Contacto</a>
                            </div>
                        </div>
                    </div>
                </details>
            </div>

            <a href="{{ $whatsappHref }}" target="_blank" rel="noreferrer" class="hidden h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-[#8B6F4E] sm:inline-flex">Cotizar por WhatsApp</a>
            <a href="/contacto" class="hidden h-10 items-center justify-center rounded-md border border-[#8B6F4E] px-5 text-sm font-medium text-primary transition-all duration-200 hover:bg-secondary sm:inline-flex">Contacto</a>
        </div>
    </div>
</header>
