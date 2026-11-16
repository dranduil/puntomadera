const fallbackAppName = 'Punto Madera';

export function getPublicAppName(configuredName?: string | null): string {
    const normalizedName = configuredName?.trim().replace(/[-_]+/g, ' ');

    if (!normalizedName || normalizedName.toLowerCase().includes('laravel')) {
        return fallbackAppName;
    }

    return normalizedName;
}

export function sanitizePublicTitle(title?: string | null): string {
    return (title?.trim() || fallbackAppName).replace(
        /\blaravel\b/gi,
        fallbackAppName,
    );
}

/**
 * Document title shared by the browser and SSR entry points. Adds the brand
 * suffix only when the page title does not already name the brand, so SEO
 * titles like "… | Punto Madera" are not rendered as "… | Punto Madera - Punto Madera".
 */
export function formatDocumentTitle(
    title: string | null | undefined,
    appName: string,
): string {
    const safeTitle = title ? sanitizePublicTitle(title) : appName;

    return safeTitle.toLowerCase().includes(appName.toLowerCase())
        ? safeTitle
        : `${safeTitle} - ${appName}`;
}
