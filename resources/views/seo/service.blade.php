<!DOCTYPE html>
<html lang="es-EC">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $page['title'] }}</title>
        <meta name="description" content="{{ $page['metaDescription'] }}">
        <meta name="robots" content="index,follow,max-image-preview:large">
        <link rel="canonical" href="{{ $canonicalUrl }}">
        <meta property="og:title" content="{{ $page['title'] }}">
        <meta property="og:description" content="{{ $page['metaDescription'] }}">
        <meta property="og:url" content="{{ $canonicalUrl }}">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="es_EC">
        <meta property="og:site_name" content="{{ str_replace('-', ' ', config('app.name', 'Punto Madera')) }}">
        <meta property="og:image" content="{{ $siteUrl }}{{ $page['heroImage'] }}">
        <meta property="og:image:alt" content="{{ $page['serviceName'] }} en Guayaquil">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $page['title'] }}">
        <meta name="twitter:description" content="{{ $page['metaDescription'] }}">
        <meta name="twitter:image" content="{{ $siteUrl }}{{ $page['heroImage'] }}">
        <link rel="sitemap" type="application/xml" href="{{ $siteUrl }}/sitemap.xml">
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=poppins:300,400,500,600" rel="stylesheet">
        @foreach ($schemas as $schema)
            <script type="application/ld+json">
                {!! json_encode($schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
            </script>
        @endforeach
        @vite(['resources/css/app.css'])
    </head>
    <body class="bg-background font-sans text-foreground antialiased">
        @include('components.public-header', ['whatsappHref' => $whatsappHref])

        <main>
            <section class="border-b border-border/60 bg-card">
                <div class="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:px-8 lg:py-24">
                <div>
                    <div class="text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
                        {{ $page['eyebrow'] }}
                    </div>
                    <h1 class="mt-6 text-4xl leading-[1.08] font-medium tracking-tight text-balance text-primary sm:text-5xl lg:text-6xl">
                        {{ $page['h1'] }}
                    </h1>
                    <p class="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                        {{ $page['intro'] }}
                    </p>
                    <p class="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
                        {{ $page['intent'] }}
                    </p>
                    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a href="{{ $whatsappHref }}" target="_blank" rel="noreferrer" class="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                            {{ $page['primaryCta'] }}
                        </a>
                        <a href="/contacto" class="inline-flex h-11 items-center justify-center rounded-md border border-input px-6 text-sm font-medium text-primary transition-colors hover:bg-muted">
                            Enviar detalles
                        </a>
                    </div>
                </div>

                <div class="relative min-h-[320px] overflow-hidden rounded-2xl border border-border/70 bg-muted sm:min-h-[430px]">
                    <img src="{{ $page['heroImage'] }}" alt="{{ $page['serviceName'] }}" class="absolute inset-0 h-full w-full object-cover" width="1200" height="900" fetchpriority="high">
                    <div class="absolute inset-0 bg-primary/20"></div>
                    <div class="absolute right-4 bottom-4 left-4 rounded-lg border border-white/35 bg-background/90 p-4 backdrop-blur">
                        <div class="text-sm font-medium text-primary">Servicio local en Guayaquil</div>
                        <div class="mt-1 text-xs leading-5 text-muted-foreground">
                            Medición, fabricación, reparación e instalación con comunicación directa por WhatsApp.
                        </div>
                    </div>
                </div>
                </div>
            </section>

            <section class="border-y border-border/60 bg-background py-20 sm:py-28">
                <div class="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
                    @foreach ([['Qué hacemos', $page['services']], ['Problemas que resolvemos', $page['problems']], ['Materiales y detalles', $page['materials']]] as [$title, $items])
                        <article class="rounded-2xl border border-border/70 bg-card p-6 shadow-none">
                            <h2 class="text-xl font-medium tracking-tight text-primary">{{ $title }}</h2>
                            <div class="mt-5 grid gap-3">
                                @foreach ($items as $item)
                                    <div class="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                                        <span class="mt-2 size-2 shrink-0 rounded-full bg-primary"></span>
                                        <span>{{ $item }}</span>
                                    </div>
                                @endforeach
                            </div>
                        </article>
                    @endforeach
                </div>
            </section>

            <section class="bg-card py-20 sm:py-28">
                <div class="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:px-8">
                    <div>
                        <div class="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">Proceso</div>
                        <h2 class="mt-4 text-3xl font-medium tracking-tight text-primary sm:text-4xl">Cómo trabajamos el servicio</h2>
                        <p class="mt-4 text-sm leading-7 text-muted-foreground">
                            Definimos alcance, medidas, materiales y acabado antes de fabricar o instalar. Atendemos Guayaquil y zonas cercanas con comunicación directa para que el proyecto avance con expectativas claras.
                        </p>
                        <div class="mt-6 flex flex-wrap gap-2">
                            @foreach ($areasServed as $area)
                                <span class="rounded-full bg-muted px-3 py-1 text-xs font-medium text-primary">{{ $area }}</span>
                            @endforeach
                        </div>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                        @foreach ($page['process'] as $step)
                            <article class="rounded-xl border border-border/70 bg-background p-5 shadow-none">
                                <div class="text-xs font-medium text-muted-foreground">Paso {{ $loop->iteration }}</div>
                                <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ $step }}</p>
                            </article>
                        @endforeach
                    </div>
                </div>
            </section>

            <section class="border-y border-border/60 bg-background py-20 sm:py-28">
                <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div class="max-w-3xl">
                        <div class="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">Preguntas frecuentes</div>
                        <h2 class="mt-4 text-3xl font-medium tracking-tight text-primary sm:text-4xl">Respuestas rápidas antes de cotizar</h2>
                    </div>
                    <div class="mt-8 grid gap-4 md:grid-cols-3">
                        @foreach ($page['faqs'] as $faq)
                            <article class="rounded-xl border border-border/70 bg-card p-6 shadow-none">
                                <h3 class="text-base font-medium text-primary">{{ $faq['q'] }}</h3>
                                <p class="mt-3 text-sm leading-6 text-muted-foreground">{{ $faq['a'] }}</p>
                            </article>
                        @endforeach
                    </div>
                </div>
            </section>

            <section class="bg-card py-20 sm:py-28">
                <div class="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.8fr] lg:items-center lg:px-8">
                    <div>
                        <h2 class="text-3xl font-medium tracking-tight text-primary sm:text-4xl">Cotiza con contexto claro</h2>
                        <p class="mt-4 text-sm leading-7 text-muted-foreground">
                            Envía fotos, medidas aproximadas, ubicación y una descripción corta. Con eso podemos orientar mejor el alcance del trabajo, materiales y tiempos.
                        </p>
                        <div class="mt-7 flex flex-col gap-3 sm:flex-row">
                            <a href="{{ $whatsappHref }}" target="_blank" rel="noreferrer" class="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">WhatsApp</a>
                            <a href="/trabajos" class="inline-flex h-11 items-center justify-center rounded-md border border-input px-6 text-sm font-medium text-primary transition-colors hover:bg-muted">Ver trabajos</a>
                        </div>
                    </div>
                    <aside class="rounded-2xl border border-border/70 bg-background p-6 shadow-none">
                        <div class="text-sm font-medium text-primary">Servicios relacionados</div>
                        <div class="mt-4 grid gap-2">
                            @foreach ($page['relatedLinks'] as $link)
                                <a href="{{ $link['href'] }}" class="flex h-11 items-center justify-between rounded-md border border-input px-4 text-sm font-medium text-primary transition-colors hover:bg-muted">
                                    {{ $link['label'] }}
                                    <span>→</span>
                                </a>
                            @endforeach
                        </div>
                    </aside>
                </div>
            </section>
        </main>

        @include('components.tracking')
    </body>
</html>
