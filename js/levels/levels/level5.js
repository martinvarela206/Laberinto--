import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 5 - Tutorial: Repetir bloques
 * Introducen el comando repeat y enter
 */
const level5 = new Level({
    id: 'level-005',
    name: 'Tutorial: Repetir bloques',
    width: 3,
    height: 3,
    playerStart: { x: 0, y: 0 },
    goal: { x: 2, y: 2 },
    walls: [],
    traps: [],
    timeLimit: 60,
    allowedCommands: ['right', 'down', 'repeat', 'enter'],
    defaultCommandLimit: 20,
    tutorialPages: [
        {
            title: 'Tutorial 5: Repetir bloques',
            command: 'repeat + enter',
            description: 'En este nivel aprenderás a repetir una secuencia. Usa enter para separar bloques y repeat para duplicar el bloque actual.',
            objective: 'Construye una ruta corta y usa repeat para duplicar el bloque de movimientos hasta llegar a la meta.'
        }
    ]
});

levelRegistry.register(level5);

export { level5 };
