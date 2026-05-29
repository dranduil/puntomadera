<!DOCTYPE html>
<html lang="es-EC">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $page['title'] }}</title>
        <meta name="description" content="{{ $page['metaDescription'] }}">
        <link rel="canonical" href="{{ $canonicalUrl }}">
        <meta property="og:title" content="{{ $page['title'] }}">
        <meta property="og:description" content="{{ $page['metaDescription'] }}">
        <meta property="og:url" content="{{ $canonicalUrl }}">
        <meta property="og:type" content="website">
        <meta property="og:locale" content="es_EC">
        <meta property="og:image" content="{{ $siteUrl }}{{ $page['heroImage'] }}">
        <meta name="twitter:card" content="summary_large_image">
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
        <header class="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur">
            <div class="mx-auto flex h-20 max-w-6xl items-center justify-between px-4">
                <a href="/" class="flex items-center gap-3 text-primary" aria-label="punto madera">
                    <span class="relative inline-flex size-11 items-center justify-center rounded-full border border-[#8B6F4E]/45 bg-[#F2EDE6] text-[0.68rem] font-semibold tracking-[0.16em]">
                        PM
                        <span class="absolute inset-2 rounded-full border border-[#CDBAA2]/70"></span>
                    </span>
                    <span class="hidden leading-none sm:block">
                        <span class="block text-sm font-light tracking-[0.38em] lowercase">punto madera</span>
                        <span class="mt-1 block text-[0.58rem] tracking-[0.32em] text-muted-foreground uppercase">Guayaquil · Ecuador</span>
                    </span>
                </a>
                <nav class="hidden items-center gap-6 text-sm font-medium md:flex">
                    <a href="/" class="text-muted-foreground transition-colors hover:text-primary">Inicio</a>
                    <a href="/servicios" class="text-muted-foreground transition-colors hover:text-primary">Servicios</a>
                    <a href="/trabajos" class="text-muted-foreground transition-colors hover:text-primary">Trabajos</a>
                    <a href="/contacto" class="text-muted-foreground transition-colors hover:text-primary">Contacto</a>
                </nav>
                <a href="{{ $whatsappHref }}" target="_blank" rel="noreferrer" class="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-[#8B6F4E]">
                    WhatsApp
                </a>
            </div>
        </header>

        <main>
            <section class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:py-16 lg:grid-cols-[1fr_0.95fr] lg:items-center">
                <div>
                    <div class="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/70 px-3 py-1 text-xs text-muted-foreground">
                        {{ $page['eyebrow'] }}
                    </div>
                    <h1 class="mt-5 text-4xl leading-tight font-semibold text-balance text-primary sm:text-5xl">
                        {{ $page['h1'] }}
                    </h1>
                    <p class="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
                        {{ $page['intro'] }}
                    </p>
                    <p class="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
                        {{ $page['intent'] }}
                    </p>
                    <div class="mt-8 flex flex-col gap-3 sm:flex-row">
                        <a href="{{ $whatsappHref }}" target="_blank" rel="noreferrer" class="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-[#8B6F4E]">
                            {{ $page['primaryCta'] }}
                        </a>
                        <a href="/contacto" class="inline-flex h-11 items-center justify-center rounded-md border border-[#8B6F4E] px-6 text-sm font-medium text-primary transition-all duration-200 hover:bg-secondary">
                            Enviar detalles
                        </a>
                    </div>
                </div>

                <div class="relative min-h-[320px] overflow-hidden rounded-lg border border-border/80 bg-muted sm:min-h-[430px]">
                    <img src="{{ $page['heroImage'] }}" alt="{{ $page['serviceName'] }}" class="absolute inset-0 h-full w-full object-cover">
                    <div class="absolute inset-0 bg-[#3B2C20]/25"></div>
                    <div class="absolute right-4 bottom-4 left-4 rounded-md border border-white/35 bg-background/90 p-4 backdrop-blur">
                        <div class="text-sm font-medium text-primary">Servicio local en Guayaquil</div>
                        <div class="mt-1 text-xs leading-5 text-muted-foreground">
                            Medición, fabricación, reparación e instalación con comunicación directa por WhatsApp.
                        </div>
                    </div>
                </div>
            </section>

            <section class="border-y border-border/70 bg-secondary/45 py-12 sm:py-16">
                <div class="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-3">
                    @foreach ([['Qué hacemos', $page['services']], ['Problemas que resolvemos', $page['problems']], ['Materiales y detalles', $page['materials']]] as [$title, $items])
                        <article class="rounded-lg border border-border/80 bg-card p-6 shadow-[0_10px_30px_rgba(59,44,32,0.05)]">
                            <h2 class="text-xl font-medium text-primary">{{ $title }}</h2>
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

            <section class="py-12 sm:py-16">
                <div class="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
                    <div>
                        <div class="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">Proceso</div>
                        <h2 class="mt-3 text-3xl font-medium text-primary">Cómo trabajamos el servicio</h2>
                        <p class="mt-4 text-sm leading-7 text-muted-foreground">
                            Una página útil para personas y para buscadores debe explicar el servicio con claridad: alcance, zona, materiales, proceso y forma de contacto. Esa misma información está visible aquí y también organizada en datos estructurados.
                        </p>
                        <div class="mt-6 flex flex-wrap gap-2">
                            @foreach ($areasServed as $area)
                                <span class="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">{{ $area }}</span>
                            @endforeach
                        </div>
                    </div>

                    <div class="grid gap-4 sm:grid-cols-2">
                        @foreach ($page['process'] as $step)
                            <article class="rounded-lg border border-border/80 bg-card p-5 shadow-[0_10px_30px_rgba(59,44,32,0.05)]">
                                <div class="text-xs font-medium text-muted-foreground">Paso {{ $loop->iteration }}</div>
                                <p class="mt-2 text-sm leading-6 text-muted-foreground">{{ $step }}</p>
                            </article>
                        @endforeach
                    </div>
                </div>
            </section>

            <section class="bg-secondary/35 py-12 sm:py-16">
                <div class="mx-auto max-w-6xl px-4">
                    <div class="max-w-3xl">
                        <div class="text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">Preguntas frecuentes</div>
                        <h2 class="mt-3 text-3xl font-medium text-primary">Respuestas rápidas antes de cotizar</h2>
                    </div>
                    <div class="mt-8 grid gap-4 md:grid-cols-3">
                        @foreach ($page['faqs'] as $faq)
                            <article class="rounded-lg border border-border/80 bg-card p-6 shadow-[0_10px_30px_rgba(59,44,32,0.05)]">
                                <h3 class="text-base font-medium text-primary">{{ $faq['q'] }}</h3>
                                <p class="mt-3 text-sm leading-6 text-muted-foreground">{{ $faq['a'] }}</p>
                            </article>
                        @endforeach
                    </div>
                </div>
            </section>

            <section class="py-12 sm:py-16">
                <div class="mx-auto grid max-w-6xl gap-8 px-4 lg:grid-cols-[1fr_0.8fr] lg:items-center">
                    <div>
                        <h2 class="text-3xl font-medium text-primary">Cotiza con contexto claro</h2>
                        <p class="mt-4 text-sm leading-7 text-muted-foreground">
                            Envía fotos, medidas aproximadas, ubicación y una descripción corta. Con eso podemos orientar mejor el alcance del trabajo, materiales y tiempos.
                        </p>
                        <div class="mt-7 flex flex-col gap-3 sm:flex-row">
                            <a href="{{ $whatsappHref }}" target="_blank" rel="noreferrer" class="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-[#8B6F4E]">WhatsApp</a>
                            <a href="/trabajos" class="inline-flex h-11 items-center justify-center rounded-md border border-[#8B6F4E] px-6 text-sm font-medium text-primary transition-all duration-200 hover:bg-secondary">Ver trabajos</a>
                        </div>
                    </div>
                    <aside class="rounded-lg border border-border/80 bg-card p-6 shadow-[0_10px_30px_rgba(59,44,32,0.05)]">
                        <div class="text-sm font-medium text-primary">Servicios relacionados</div>
                        <div class="mt-4 grid gap-2">
                            @foreach ($page['relatedLinks'] as $link)
                                <a href="{{ $link['href'] }}" class="flex h-11 items-center justify-between rounded-md border border-[#8B6F4E] px-4 text-sm font-medium text-primary transition-all duration-200 hover:bg-secondary">
                                    {{ $link['label'] }}
                                    <span>→</span>
                                </a>
                            @endforeach
                        </div>
                    </aside>
                </div>
            </section>
        </main>
    </body>
</html>
