import { LEVEL_INDEX_FALLBACK, LEVELS_FALLBACK } from './levelsFallback.js';
import { validateLevel } from './levelValidator.js';

async function fetchJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`No se pudo cargar ${path}`);
    }
    return response.json();
}

export async function loadLevelIndex() {
    try {
        return await fetchJson('./src/content/levels/levelIndex.json');
    } catch {
        return LEVEL_INDEX_FALLBACK;
    }
}

export async function loadLevelById(levelId) {
    try {
        const index = await loadLevelIndex();
        const item = index.levels.find((level) => level.id === levelId);
        if (!item) {
            throw new Error(`Nivel no encontrado: ${levelId}`);
        }

        const level = await fetchJson(`./src/content/levels/${item.file}`);
        const validationErrors = validateLevel(level);

        if (validationErrors.length > 0) {
            throw new Error(`Nivel inválido: ${validationErrors.join(', ')}`);
        }

        return level;
    } catch {
        return LEVELS_FALLBACK[levelId] || LEVELS_FALLBACK['level-001'];
    }
}
