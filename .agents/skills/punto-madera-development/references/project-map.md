# Punto Madera project map

This is a compact, fallible navigation aid. Confirm current state with codebase-memory MCP (`project: richardwebsite`) and source before changing code.

- Stack: Laravel 12, Inertia React 2, TypeScript, Vite, Wayfinder, Fortify, Pest 4, and shadcn/ui.
- Backend: `app/Http/Controllers/`, `app/Http/Requests/`, `app/Models/`, `app/Actions/`, `bootstrap/`, `routes/`, and `database/`.
- Frontend pages: `resources/js/pages/`; shared layouts/components: `resources/js/layouts/` and `resources/js/components/`; shadcn primitives: `resources/js/components/ui/`.
- Route/type generation: `php artisan wayfinder:generate --with-form`; the package script `npm run types:check` runs generation and `tsc --noEmit`.
- Frontend aliases and installed primitives are defined by `components.json`, `vite.config.ts`, and the existing imports. Do not assume a registry, icon library, or primitive API.
- Admin surfaces include contacts, bookings, services, works, and home landing pages. Trace each surface end to end before modifying it.
- Public/service/SEO surfaces include home, contact, services, works, shop, and local SEO pages. Preserve their route, metadata, and data contracts.
