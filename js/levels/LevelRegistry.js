/**
 * LevelRegistry - Catálogo central de niveles.
 * Para agregar un nivel nuevo, solo hay que registrarlo aquí.
 */
class LevelRegistry {
    constructor() {
        this._levels = [];
    }

    register(level) {
        this._levels.push(level);
    }

    getLevel(index) {
        return this._levels[index] || null;
    }

    getLevelCount() {
        return this._levels.length;
    }
}

export const levelRegistry = new LevelRegistry();
