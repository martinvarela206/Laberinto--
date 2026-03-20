import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 1 - Grilla 10x10, sin obstáculos.
 * Inicio en (0,0), meta en (9,9).
 */
const level1 = new Level({
    width: 10,
    height: 10,
    playerStart: { x: 0, y: 0 },
    goal: { x: 9, y: 9 },
    walls: [],
    traps: []
});

levelRegistry.register(level1);

export { level1 };
