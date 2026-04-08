import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 7 - Aventura libre
 * Mapa ampliado con varias rutas y una solución óptima con bloques repeat.
 */
const level7 = new Level({
    id: 'level-007',
    name: 'Aventura libre',
    width: 8,
    height: 8,
    playerStart: { x: 0, y: 0 },
    goal: { x: 7, y: 7 },
    walls: [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
        { x: 3, y: 1 },
        { x: 6, y: 1 },
        { x: 5, y: 3 },
        { x: 6, y: 3 },
        { x: 4, y: 3 },
        { x: 3, y: 3 },
        { x: 1, y: 5 },
        { x: 3, y: 5 },
        { x: 4, y: 5 },
        { x: 6, y: 6 },
        { x: 7, y: 6 }
    ],
    traps: [],
    defaultCommandLimit: 30,
    allowedCommands: ['up', 'down', 'left', 'right', 'repeat', 'enter'],
    tutorialPages: [
        {
            title: 'Aventura libre',
            command: 'explora',
            description: 'Bienvenido a tu propia aventura, resuelve libremente el nivel y puntúa.',
            objective: 'La ruta más óptima mezcla comandos normales con dos bloques repeat: "derecha abajo repeat" y "abajo abajo repeat".'
        }
    ]
});

levelRegistry.register(level7);

export { level7 };
