import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 7 - Desafío: Corredor zig-zag
 * Intermedio - navegación compleja sin guía
 */
const level7 = new Level({
    width: 10,
    height: 10,
    playerStart: { x: 0, y: 0 },
    goal: { x: 9, y: 9 },
    walls: [
        { x: 2, y: 2 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 6, y: 6 }
    ],
    traps: [],
    timeLimit: 60
});

levelRegistry.register(level7);

export { level7 };
