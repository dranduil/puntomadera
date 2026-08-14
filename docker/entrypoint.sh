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

exec "$@"
