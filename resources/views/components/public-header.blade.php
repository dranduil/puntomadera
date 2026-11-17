@php
    $appName = str_replace('-', ' ', config('app.name', 'punto madera'));
    $navItems = \App\Support\SiteLinks::header();
@endphp

<header class="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
    <div class="mx-auto flex h-24 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <a href="/" class="flex shrink-0 items-center gap-3 text-primary" aria-label="punto madera">
            <img src="/favicon.svg" alt="" class="size-11" width="44" height="44">
            <span class="hidden leading-none sm:block">
                <span class="block text-sm font-light tracking-[0.38em] lowercase">{{ $appName }}</span>
                <span class="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">Guayaquil, Ecuador</span>
            </span>
        </a>

        <nav aria-label="Navegación principal" class="hidden items-center gap-7 text-sm font-medium lg:flex">
            @foreach ($navItems as $item)
                <a href="{{ $item['href'] }}" class="text-muted-foreground transition-colors hover:text-primary">{{ $item['label'] }}</a>
            @endforeach
        </nav>

        <div class="flex items-center gap-2">
            <details class="relative lg:hidden">
                <summary class="inline-flex size-10 cursor-pointer list-none items-center justify-center rounded-md border border-input bg-background shadow-xs" aria-label="Abrir menú">
                    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M4 6h16"></path>
                        <path d="M4 12h16"></path>
                        <path d="M4 18h16"></path>
                    </svg>
                </summary>
                <div class="absolute top-full right-0 z-50 mt-3 w-80 rounded-xl border border-border/70 bg-card p-4 shadow-lg">
                    <nav aria-label="Navegación móvil" class="grid gap-1 text-sm">
                        @foreach ($navItems as $item)
                            <a href="{{ $item['href'] }}" class="rounded-md px-3 py-2.5 text-muted-foreground transition-colors hover:bg-muted hover:text-primary">{{ $item['label'] }}</a>
                        @endforeach
                        <a href="/cotizar" class="mt-3 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">Pedir cotización</a>
                        <a href="{{ $whatsappHref }}" target="_blank" rel="noreferrer" class="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-md border border-input px-5 text-sm font-medium text-primary transition-colors hover:bg-muted">Escribir por WhatsApp <span aria-hidden="true">↗</span></a>
                    </nav>
                </div>
            </details>

            <a href="/cotizar" class="hidden h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:inline-flex">Pedir cotización</a>
        </div>
    </div>
</header>
