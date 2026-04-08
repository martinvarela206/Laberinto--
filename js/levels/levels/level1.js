import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 1 - Primeros pasos
 * Mapa corto 3x1 para aprender el comando right.
 */
const level1 = new Level({
    id: 'level-001',
    name: 'Primeros pasos',
    width: 3,
    height: 1,
    playerStart: { x: 0, y: 0 },
    goal: { x: 2, y: 0 },
    walls: [],
    traps: [],
    timeLimit: 60,
    allowedCommands: ['right'],
    defaultCommandLimit: 20,
    tutorialPages: [
        {
            title: 'Tutorial 1: Mover a la derecha',
            command: 'right',
            description: 'Este nivel te enseña el comando right. Cada vez que lo uses, el robot avanzará una celda hacia la derecha.',
            objective: 'Llega hasta la meta avanzando en línea recta con solo dos comandos right.'
        }
    ]
});

levelRegistry.register(level1);

export { level1 };
