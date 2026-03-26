import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 1 - Primeros pasos
 * Mapa manual 5x1 para aprender el comando right.
 */
const level1 = new Level({
    width: 5,
    height: 1,
    playerStart: { x: 0, y: 0 },
    goal: { x: 4, y: 0 },
    walls: [],
    traps: [],
    timeLimit: 60
});

levelRegistry.register(level1);

export { level1 };
