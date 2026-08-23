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
