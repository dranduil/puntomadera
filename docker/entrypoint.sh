#!/bin/sh

set -eu

mkdir -p \
    storage/app/private \
    storage/app/public \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    bootstrap/cache

chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

if [ -z "${APP_KEY:-}" ]; then
    if [ "${APP_ENV:-production}" = "production" ]; then
        echo "APP_KEY must be set when APP_ENV=production" >&2
        exit 1
    fi

    export APP_KEY="$(php artisan key:generate --show --no-interaction)"
fi

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    php artisan migrate --force --no-interaction
fi

# Serve pre-rendered HTML to crawlers: keep the Inertia SSR server running next to Apache.
# If it is down, Inertia falls back to client-side rendering, so restart it instead of failing the container.
if [ "${1:-}" = "apache2-foreground" ] \
    && [ "${INERTIA_SSR_ENABLED:-true}" = "true" ] \
    && { [ -f bootstrap/ssr/ssr.js ] || [ -f bootstrap/ssr/ssr.mjs ]; }; then
    (
        while true; do
            runuser -u www-data -- php artisan inertia:start-ssr || true
            echo "Inertia SSR server exited; restarting in 2s" >&2
            sleep 2
        done
    ) &
fi

exec "$@"
