import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 6 - Tutorial: Separar bloques con enter
 * Usa dos repeat separados por enter para resolver un camino único.
 */
const level6 = new Level({
    id: 'level-006',
    name: 'Tutorial: Enter y bloques',
    width: 5,
    height: 5,
    playerStart: { x: 4, y: 0 },
    goal: { x: 0, y: 4 },
    walls: [
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 4, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 4, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
        { x: 4, y: 3 },
        { x: 1, y: 4 },
        { x: 2, y: 4 },
        { x: 3, y: 4 },
        { x: 4, y: 4 }
    ],
    traps: [],
    timeLimit: 60,
    defaultCommandLimit: 12,
    allowedCommands: ['left', 'down', 'repeat', 'enter'],
    tutorialPages: [
        {
            title: 'Tutorial 6: Separar secuencias',
            command: 'enter',
            description: 'Enter cierra el bloque actual y comienza otro. Esto evita que repeat duplique toda la secuencia.',
            objective: 'Resuelve con: izquierda, izquierda, repeat, enter, abajo, abajo, repeat.'
        }
    ]
});

levelRegistry.register(level6);

export { level6 };
