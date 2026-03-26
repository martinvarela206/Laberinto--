import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 6 - Desafío: Barrera central
 * Primer desafío sin tutorial - evitar una barrera central
 */
const level6 = new Level({
    id: 'level-006',
    name: 'Barrera central',
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
    timeLimit: 60,
    defaultCommandLimit: 20,
    allowedCommands: ['up', 'down', 'left', 'right', 'repeat', 'enter']
});

levelRegistry.register(level6);

export { level6 };
