import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 4 - Tutorial: Izquierda
 * Aprenden el comando left combinado con down
 */
const level4 = new Level({
    width: 7,
    height: 3,
    playerStart: { x: 6, y: 0 },
    goal: { x: 0, y: 2 },
    walls: [],
    traps: [],
    timeLimit: 60
});

levelRegistry.register(level4);

export { level4 };
