import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 4 - Tutorial: Izquierda
 * Aprenden el comando left combinado con down
 */
const level4 = new Level({
    id: 'level-004',
    name: 'Tutorial: Izquierda',
    width: 3,
    height: 2,
    playerStart: { x: 2, y: 0 },
    goal: { x: 0, y: 1 },
    walls: [],
    traps: [],
    timeLimit: 60,
    allowedCommands: ['left', 'down'],
    defaultCommandLimit: 20,
    tutorialPages: [
        {
            title: 'Tutorial 4: Izquierda',
            command: 'left',
            description: 'En este nivel aprenderás el comando left para desplazarte una celda hacia la izquierda.',
            objective: 'Comienza desde la derecha y usa left junto con down para alcanzar la meta rápidamente.'
        }
    ]
});

levelRegistry.register(level4);

export { level4 };
