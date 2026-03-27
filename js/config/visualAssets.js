/**
 * Visual Assets configuration
 * Permite personalizar entidades con emoji o imagen y estilos del mapa/borde.
 *
 * Nota: los defaults de entidades viven en sus clases (Entity/Player/Goal/Wall/Trap).
 * Este modulo aplica defaults de tema (mapa/borde) y mergea overrides por nivel.
 *
 * Estructura de assets de entidad:
 * - { type: 'emoji', value: '🤖' }
 * - { type: 'image', src: '/assets/player.svg', alt: 'Player' }
 */
export const DEFAULT_VISUAL_ASSETS = {
    edge: { type: 'emoji', value: '', alt: 'Edge', size: { emoji: '1em', image: '84%' } },
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

export function resolveVisualAssetsWithEntityDefaults(entityDefaults = {}, levelVisualAssets = {}) {
    const base = deepMerge(DEFAULT_VISUAL_ASSETS, entityDefaults || {});
    return deepMerge(base, levelVisualAssets || {});
}
