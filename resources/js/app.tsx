import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import { initializeTheme } from '@/hooks/use-appearance';
import { getPublicAppName, sanitizePublicTitle } from '@/lib/site';

const appName = getPublicAppName(import.meta.env.VITE_APP_NAME);

createInertiaApp({
    title: (title) => {
        const safeTitle = title ? sanitizePublicTitle(title) : appName;

        return safeTitle.toLowerCase() === appName.toLowerCase()
            ? appName
            : `${safeTitle} - ${appName}`;
    },
    resolve: (name) =>
        resolvePageComponent(
            `./pages/${name}.tsx`,
            import.meta.glob('./pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <StrictMode>
                <App {...props} />
            </StrictMode>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
