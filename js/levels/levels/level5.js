import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 5 - Tutorial: Ruta larga con repeat
 * Introducen el comando repeat y enter
 */
const level5 = new Level({
    width: 7,
    height: 3,
    playerStart: { x: 0, y: 0 },
    goal: { x: 6, y: 2 },
    walls: [{ x: 3, y: 1 }],
    traps: [],
    timeLimit: 60
});

levelRegistry.register(level5);

export { level5 };
