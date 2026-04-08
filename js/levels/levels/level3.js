import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 3 - Tutorial: Arriba
 * Aprenden el comando up combinado con right
 */
const level3 = new Level({
    id: 'level-003',
    name: 'Tutorial: Subir',
    width: 3,
    height: 2,
    playerStart: { x: 0, y: 1 },
    goal: { x: 2, y: 0 },
    walls: [],
    traps: [],
    timeLimit: 60,
    allowedCommands: ['right', 'up'],
    defaultCommandLimit: 20,
    tutorialPages: [
        {
            title: 'Tutorial 3: Arriba',
            command: 'up',
            description: 'Este nivel te enseña el comando up. Sirve para mover al robot una celda hacia arriba.',
            objective: 'Combina right y up para llegar a la meta en solo tres movimientos.'
        }
    ]
});

levelRegistry.register(level3);

export { level3 };
