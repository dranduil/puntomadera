const fallbackAppName = 'Punto Madera';

export function getPublicAppName(configuredName?: string | null): string {
    const normalizedName = configuredName?.trim().replace(/[-_]+/g, ' ');

    if (!normalizedName || normalizedName.toLowerCase().includes('laravel')) {
        return fallbackAppName;
    }

    // APP_NAME is "punto-madera"; titles show the brand as "Punto Madera".
    return normalizedName.replace(/(^|\s)\p{Ll}/gu, (letter) =>
        letter.toUpperCase(),
    );
}

export function sanitizePublicTitle(title?: string | null): string {
    return (title?.trim() || fallbackAppName).replace(
        /\blaravel\b/gi,
        fallbackAppName,
    );
}

/**
 * Document title shared by the browser and SSR entry points. Public pages get
 * "… | Punto Madera" from the server; any other title gets the same suffix,
 * so every tab and search result reads the same way.
 */
export function formatDocumentTitle(
    title: string | null | undefined,
    appName: string,
): string {
    const safeTitle = title ? sanitizePublicTitle(title) : appName;

    return safeTitle.toLowerCase().includes(appName.toLowerCase())
        ? safeTitle
        : `${safeTitle} | ${appName}`;
}
