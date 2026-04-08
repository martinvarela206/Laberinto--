import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 5 - Tutorial: Repetir bloques
 * Introducen el comando repeat
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
    allowedCommands: ['right', 'down', 'repeat'],
    defaultCommandLimit: 20,
    tutorialPages: [
        {
            title: 'Tutorial 5: Repetir bloques',
            command: 'repeat',
            description: 'En este nivel aprenderás a repetir movimientos con el comando repeat. Este comando duplica la secuencia que ya escribiste.',
            objective: 'Escribe una ruta corta y usa repeat para repetirla y llegar a la meta.'
        }
    ]
});

levelRegistry.register(level5);

export { level5 };
