import { LEVEL_METADATA, getAllLevelIds } from '../config/levelMetadata.js';

/**
 * LevelRegistry - Catálogo central de niveles.
 * Proporciona acceso a niveles por índice, ID, o secuencia ordenada.
 * 
 * Design: Los niveles se registran automáticamente en su módulo,
 * el registry los organiza aquí.
 */
class LevelRegistry {
    constructor() {
        this._levels = [];
        this._levelsById = new Map();
    }

    /**
     * Registrar un nivel
     */
    register(level) {
        this._levels.push(level);
    }

    /**
     * Guardar referencia por ID (para búsqueda rápida)
     */
    registerById(levelId, level) {
        this._levelsById.set(levelId, level);
    }

    /**
     * Obtener nivel por índice (posición en array)
     */
    getLevel(index) {
        return this._levels[index] || null;
    }

    /**
     * Obtener nivel por ID
     */
    getLevelById(levelId) {
        return this._levelsById.get(levelId) || null;
    }

    /**
     * Obtener nivel siguiente al especificado
     */
    getNextLevel(currentLevelId) {
        const allIds = getAllLevelIds();
        const currentIndex = allIds.indexOf(currentLevelId);
        if (currentIndex === -1 || currentIndex >= allIds.length - 1) {
            return null;
        }
        const nextId = allIds[currentIndex + 1];
        return this.getLevelById(nextId);
    }

    /**
     * Obtener nivel anterior al especificado
     */
    getPreviousLevel(currentLevelId) {
        const allIds = getAllLevelIds();
        const currentIndex = allIds.indexOf(currentLevelId);
        if (currentIndex <= 0) {
            return null;
        }
        const prevId = allIds[currentIndex - 1];
        return this.getLevelById(prevId);
    }

    /**
     * Total de niveles
     */
    getLevelCount() {
        return this._levels.length;
    }

    /**
     * Obtener metadatos de un nivel
     */
    getMetadata(levelId) {
        return LEVEL_METADATA[levelId] || null;
    }
}

export const levelRegistry = new LevelRegistry();
