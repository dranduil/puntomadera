<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: #FAF8F5;
            }

            html.dark {
                background-color: #2A211A;
            }
        </style>

        @php
            $appName = trim((string) config('app.name', 'Punto Madera'));
            $appName = $appName === '' || str_contains(strtolower($appName), 'laravel')
                ? 'Punto Madera'
                : $appName;
        @endphp
        @php($seo = $page['props']['seo'] ?? null)
        @php($isAuthPage = str_starts_with((string) ($page['component'] ?? ''), 'auth/'))
        <title inertia>{{ is_array($seo) ? ($seo['title'] ?? $appName) : $appName }}</title>

        @if (is_array($seo))
            <meta inertia="description" name="description" content="{{ $seo['description'] }}">
            <meta inertia="robots" name="robots" content="index,follow,max-image-preview:large">
            <link inertia="canonical" rel="canonical" href="{{ $seo['canonical'] }}">
            <meta inertia="og:title" property="og:title" content="{{ $seo['title'] }}">
            <meta inertia="og:description" property="og:description" content="{{ $seo['description'] }}">
            <meta inertia="og:url" property="og:url" content="{{ $seo['canonical'] }}">
            <meta inertia="og:type" property="og:type" content="website">
            <meta inertia="og:locale" property="og:locale" content="es_EC">
            <meta inertia="og:site_name" property="og:site_name" content="{{ $appName }}">
            @if (!empty($seo['image']))
                <meta inertia="og:image" property="og:image" content="{{ $seo['image'] }}">
                <meta inertia="og:image:alt" property="og:image:alt" content="{{ $seo['imageAlt'] ?? $seo['title'] }}">
            @endif
            <meta inertia="twitter:card" name="twitter:card" content="summary_large_image">
            <meta inertia="twitter:title" name="twitter:title" content="{{ $seo['title'] }}">
            <meta inertia="twitter:description" name="twitter:description" content="{{ $seo['description'] }}">
            @if (!empty($seo['image']))
                <meta inertia="twitter:image" name="twitter:image" content="{{ $seo['image'] }}">
            @endif
            <link inertia="sitemap" rel="sitemap" type="application/xml" href="{{ rtrim((string) config('app.url', 'http://localhost'), '/') }}/sitemap.xml">
            @if (!empty($seo['jsonLd']))
                <script inertia="schema" type="application/ld+json">{!! json_encode($seo['jsonLd'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT) !!}</script>
            @endif
        @elseif ($isAuthPage)
            <meta inertia="robots" name="robots" content="noindex,follow">
        @endif

        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=poppins:300,400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        @include('components.tracking')
    </body>
</html>
