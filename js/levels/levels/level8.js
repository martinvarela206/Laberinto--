import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 8 - Tutorial: Borrar comandos (Debugging)
 * Aprenden a corregir errores eliminando comandos
 */
const level8 = new Level({
    id: 'level-008',
    name: 'Tutorial: Borrar comandos',
    width: 4,
    height: 1,
    playerStart: { x: 0, y: 0 },
    goal: { x: 3, y: 0 },
    walls: [],
    traps: [],
    timeLimit: 90,
    allowedCommands: ['right'],
    defaultCommandLimit: 20,
    initialSequence: ['right', 'right', 'right', 'right'],
    tutorialPages: [
        {
            title: 'Tutorial 6: Corregir un programa',
            command: 'clic',
            description: 'El robot recibió un programa con un error: tiene un comando de más que lo hace caer del camino.',
            objective: 'Haz clic sobre un comando para eliminarlo de la secuencia.'
        },
        {
            title: 'Detectar el comando extra',
            command: 'right x4',
            description: 'La secuencia inicial trae cuatro movimientos a la derecha, pero el mapa solo necesita tres.',
            objective: 'Elimina un right y luego ejecuta para llegar a la meta sin salir del mapa.'
        }
    ]
});

levelRegistry.register(level8);

export { level8 };
