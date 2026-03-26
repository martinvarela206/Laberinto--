import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 6 - Desafío: Barrera central
 * Primer desafío sin tutorial - evitar una barrera central
 */
const level6 = new Level({
    width: 10,
    height: 10,
    playerStart: { x: 0, y: 0 },
    goal: { x: 9, y: 9 },
    walls: [
        { x: 4, y: 4 },
        { x: 5, y: 4 },
        { x: 4, y: 5 }
    ],
    traps: [],
    timeLimit: 60
});

levelRegistry.register(level6);

export { level6 };
