const defaultServiceAreas = [
    'Guayaquil (Norte y Sur)',
    'Urdesa',
    'Vía a la Costa',
    'Samborondón',
    'Daule',
];

export function resolveServiceAreas(
    configuredAreas: string[] | null | undefined,
): string[] {
    const areas = (configuredAreas ?? [])
        .map((area) => area.trim())
        .filter(Boolean);
    const uniqueAreas = [...new Set(areas)];

    return uniqueAreas.length > 0 ? uniqueAreas : [...defaultServiceAreas];
}

export function formatServiceAreas(
    configuredAreas: string[] | null | undefined,
): string {
    const areas = resolveServiceAreas(configuredAreas);

    if (areas.length < 2) {
        return areas[0] ?? '';
    }

    return `${areas.slice(0, -1).join(', ')} y ${areas[areas.length - 1]}`;
}
