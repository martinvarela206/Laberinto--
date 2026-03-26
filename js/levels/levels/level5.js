import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 5 - Tutorial: Ruta larga con repeat
 * Introducen el comando repeat y enter
 */
const level5 = new Level({
    id: 'level-005',
    name: 'Tutorial: Ruta larga',
    width: 7,
    height: 3,
    playerStart: { x: 0, y: 0 },
    goal: { x: 6, y: 2 },
    walls: [{ x: 3, y: 1 }],
    traps: [],
    timeLimit: 60,
    allowedCommands: ['right', 'down', 'repeat', 'enter'],
    tutorialPages: [
        {
            title: 'Tutorial 5: Repetir bloques',
            command: 'repeat + enter',
            description: 'En este nivel aprenderas a repetir una secuencia. Usa enter para separar bloques y repeat para duplicar el bloque actual.',
            objective: 'Construye una ruta mas larga combinando movimientos con repeat y enter para llegar a la meta.'
        }
    ]
});

levelRegistry.register(level5);

export { level5 };
