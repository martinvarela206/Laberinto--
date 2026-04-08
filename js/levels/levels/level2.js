import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 2 - Tutorial: Giro simple
 * Aprenden a combinar right y down
 */
const level2 = new Level({
    id: 'level-002',
    name: 'Tutorial: Giro simple',
    width: 6,
    height: 2,
    playerStart: { x: 0, y: 0 },
    goal: { x: 5, y: 1 },
    walls: [],
    traps: [],
    timeLimit: 60,
    allowedCommands: ['right', 'down'],
    defaultCommandLimit: 20,
    tutorialPages: [
        {
            title: 'Tutorial 2: Bajar',
            command: 'down',
            description: 'Ahora aprenderás el comando down. Sirve para mover al robot una celda hacia abajo y combinarlo con right.',
            objective: 'Avanza hacia la derecha y luego baja para alcanzar la meta.'
        }
    ]
});

levelRegistry.register(level2);

export { level2 };
