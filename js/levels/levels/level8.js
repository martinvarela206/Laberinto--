import { Level } from '../Level.js';
import { levelRegistry } from '../LevelRegistry.js';

/**
 * Nivel 8 - Tutorial: Borrar comandos (Debugging)
 * Aprenden a corregir errores eliminando comandos
 */
const level8 = new Level({
    width: 4,
    height: 1,
    playerStart: { x: 0, y: 0 },
    goal: { x: 3, y: 0 },
    walls: [],
    traps: [],
    timeLimit: 90
});

// Metadata adicional para este nivel (manejo de secuencia inicial)
level8.initialSequence = ['right', 'right', 'right', 'right'];
level8.allowExactlyThreeRights = true; // Solo 3 son correctos

levelRegistry.register(level8);

export { level8 };
