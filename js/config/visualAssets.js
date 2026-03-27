/**
 * Visual Assets configuration
 * Permite personalizar entidades con emoji o imagen y estilos del mapa/borde.
 *
 * Estructura de assets de entidad:
 * - { type: 'emoji', value: '🤖' }
 * - { type: 'image', src: '/assets/player.svg', alt: 'Player' }
 */
export const DEFAULT_VISUAL_ASSETS = {
    player: { type: 'emoji', value: '🤖', alt: 'Player' },
    goal: { type: 'emoji', value: '🏁', alt: 'Goal' },
    wall: { type: 'emoji', value: '🧱', alt: 'Wall' },
    edge: { type: 'emoji', value: '', alt: 'Edge' },
    map: {
        backgroundColor: 'var(--grid-bg)',
        borderColor: 'var(--maze-border)',
        outlineColor: 'rgba(239, 68, 68, 0.5)'
    },
    edgeStyle: {
        borderColor: 'rgba(148, 163, 184, 0.55)',
        backgroundStart: 'rgba(15, 23, 42, 0.45)',
        backgroundEnd: 'rgba(30, 41, 59, 0.7)'
    }
};

function isObject(value) {
    return value && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base, override) {
    if (!isObject(override)) {
        return { ...base };
    }

    const result = { ...base };

    Object.keys(override).forEach((key) => {
        const baseValue = result[key];
        const overrideValue = override[key];

        if (isObject(baseValue) && isObject(overrideValue)) {
            result[key] = deepMerge(baseValue, overrideValue);
        } else {
            result[key] = overrideValue;
        }
    });

    return result;
}

export function resolveVisualAssets(levelVisualAssets = {}) {
    return deepMerge(DEFAULT_VISUAL_ASSETS, levelVisualAssets || {});
}
