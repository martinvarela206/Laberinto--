import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 2 - Tutorial: Giro simple
 * Aprenden a combinar right y down
 */
const level2 = new Level({
    width: 6,
    height: 2,
    playerStart: { x: 0, y: 0 },
    goal: { x: 5, y: 1 },
    walls: [],
    traps: [],
    timeLimit: 60
});

levelRegistry.register(level2);

export { level2 };
