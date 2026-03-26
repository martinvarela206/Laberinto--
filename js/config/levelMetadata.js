/**
 * Level Metadata Configuration
 * Centralized repository for level information
 * 
 * Design: Separating metadata from level implementation allows:
 * - Multiple team members to edit level configs without conflicts
 * - Easy addition of new levels by just adding entries here
 * - Tutorial and educational metadata in one place
 */

export const LEVEL_METADATA = {
    'level-001': {
        id: 'level-001',
        name: 'Primeros pasos',
        order: 1,
        isTutorial: true,
        allowedCommands: ['right'],
        tutorialIntro: {
            title: 'Tutorial 1: Mover a la derecha',
            command: 'right',
            description: 'Este nivel te ensena el comando right. Cada vez que lo uses, el robot avanzara una celda hacia la derecha.',
            objective: 'Llega hasta la meta avanzando en linea recta usando solamente right.'
        }
    },
    'level-002': {
        id: 'level-002',
        name: 'Tutorial: Giro simple',
        order: 2,
        isTutorial: true,
        allowedCommands: ['right', 'down'],
        tutorialIntro: {
            title: 'Tutorial 2: Bajar',
            command: 'down',
            description: 'Ahora aprenderas el comando down. Sirve para mover al robot una celda hacia abajo y combinarlo con right.',
            objective: 'Avanza hacia la derecha y luego baja para alcanzar la meta.'
        }
    },
    'level-003': {
        id: 'level-003',
        name: 'Tutorial: Subir',
        order: 3,
        isTutorial: true,
        allowedCommands: ['right', 'up'],
        tutorialIntro: {
            title: 'Tutorial 3: Arriba',
            command: 'up',
            description: 'Este nivel te ensena el comando up. Sirve para mover al robot una celda hacia arriba.',
            objective: 'Combina right y up para llegar a la meta ubicada en la fila superior.'
        }
    },
    'level-004': {
        id: 'level-004',
        name: 'Tutorial: Izquierda',
        order: 4,
        isTutorial: true,
        allowedCommands: ['left', 'down'],
        tutorialIntro: {
            title: 'Tutorial 4: Izquierda',
            command: 'left',
            description: 'En este nivel aprenderas el comando left para desplazarte una celda hacia la izquierda.',
            objective: 'Comienza desde la derecha y usa left junto con down para alcanzar la meta.'
        }
    },
    'level-005': {
        id: 'level-005',
        name: 'Tutorial: Ruta larga',
        order: 5,
        isTutorial: true,
        allowedCommands: ['right', 'down', 'repeat', 'enter'],
        tutorialIntro: {
            title: 'Tutorial 5: Repetir bloques',
            command: 'repeat + enter',
            description: 'En este nivel aprenderas a repetir una secuencia. Usa enter para separar bloques y repeat para duplicar el bloque actual.',
            objective: 'Construye una ruta mas larga combinando movimientos con repeat y enter para llegar a la meta.'
        }
    },
    'level-006': {
        id: 'level-006',
        name: 'Barrera central',
        order: 6,
        isTutorial: false,
        allowedCommands: ['up', 'down', 'left', 'right', 'repeat', 'enter']
    },
    'level-007': {
        id: 'level-007',
        name: 'Corredor zig-zag',
        order: 7,
        isTutorial: false,
        allowedCommands: ['up', 'down', 'left', 'right', 'repeat', 'enter']
    },
    'level-008': {
        id: 'level-008',
        name: 'Tutorial: Borrar comandos',
        order: 8,
        isTutorial: true,
        allowedCommands: ['right'],
        tutorialIntro: {
            title: 'Tutorial 6: Corregir un programa',
            command: 'clic',
            description: 'El robot recibio un programa con un error: tiene un comando de mas que lo hace caer del camino. Para eliminar un comando de la secuencia, haz clic sobre el.',
            objective: 'Encuentra el comando incorrecto en la secuencia, eliminalo con un clic, y luego ejecuta el programa corregido para que el robot llegue a la meta.'
        },
        initialSequence: ['right', 'right', 'right', 'right']
    }
};

/**
 * Get level metadata by ID
 */
export function getLevelMetadata(levelId) {
    return LEVEL_METADATA[levelId] || null;
}

/**
 * Get all level IDs in order
 */
export function getAllLevelIds() {
    return Object.values(LEVEL_METADATA)
        .sort((a, b) => a.order - b.order)
        .map(meta => meta.id);
}

/**
 * Get metadata for all levels
 */
export function getAllLevelMetadata() {
    return Object.values(LEVEL_METADATA)
        .sort((a, b) => a.order - b.order);
}
