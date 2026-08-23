import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { getPublicAppName, sanitizePublicTitle } from '@/lib/site';

const appName = getPublicAppName(import.meta.env.VITE_APP_NAME);

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
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
        setup: ({ App, props }) => {
            return <App {...props} />;
        },
    }),
);
