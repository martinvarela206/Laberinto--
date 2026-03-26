import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 3 - Tutorial: Arriba
 * Aprenden el comando up combinado con right
 */
const level3 = new Level({
    width: 6,
    height: 3,
    playerStart: { x: 0, y: 2 },
    goal: { x: 5, y: 0 },
    walls: [],
    traps: [],
    timeLimit: 60
});

levelRegistry.register(level3);

export { level3 };
