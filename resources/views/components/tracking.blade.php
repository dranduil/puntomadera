@php
    $googleAnalyticsId = trim((string) config('services.google_analytics.measurement_id'));
    $metaPixelId = trim((string) config('services.meta_pixel.id'));
@endphp

@if ($googleAnalyticsId)
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ urlencode($googleAnalyticsId) }}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', @json($googleAnalyticsId));
    </script>
@endif

@if ($metaPixelId)
    <script>
        !function (f, b, e, v, n, t, s) {
            if (f.fbq) return;
            n = f.fbq = function () {
                n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = true;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = true;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', @json($metaPixelId));
        window.fbq('track', 'PageView');
    </script>
    <noscript>
        <img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id={{ urlencode($metaPixelId) }}&ev=PageView&noscript=1" alt="">
    </noscript>
@endif

@if ($googleAnalyticsId || $metaPixelId)
    <script>
        document.addEventListener('inertia:navigate', function (event) {
            const pageUrl = new URL(
                event.detail?.page?.url || window.location.href,
                window.location.origin,
            );
            const pagePath = pageUrl.pathname + pageUrl.search;

            if (typeof window.gtag === 'function') {
                window.gtag('event', 'page_view', {
                    page_location: pageUrl.href,
                    page_path: pagePath,
                });
            }

            if (typeof window.fbq === 'function') {
                window.fbq('track', 'PageView');
            }
        });
    </script>
@endif
