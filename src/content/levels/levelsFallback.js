export const LEVEL_INDEX_FALLBACK = {
    levels: [
        { id: 'level-001', file: 'level-001.json' },
        { id: 'level-002', file: 'level-002.json' },
        { id: 'level-003', file: 'level-003.json' },
        { id: 'level-004', file: 'level-004.json' },
        { id: 'level-005', file: 'level-005.json' },
        { id: 'level-008', file: 'level-008.json' },
        { id: 'level-006', file: 'level-006.json' },
        { id: 'level-007', file: 'level-007.json' }
    ]
};

export const LEVELS_FALLBACK = {
    'level-001': {
        id: 'level-001',
        name: 'Primeros pasos',
        isTutorial: true,
        tutorialIntro: {
            title: 'Tutorial 1: Mover a la derecha',
            command: 'right',
            description: 'Este nivel te enseña el comando right. Cada vez que lo uses, el robot avanzara una celda hacia la derecha.',
            objective: 'Llega hasta la meta avanzando en linea recta usando solamente right.'
        },
        size: { width: 5, height: 1 },
        player: { start: { x: 0, y: 0 } },
        goal: { x: 4, y: 0 },
        tiles: [],
        rules: { timeLimit: 60, requireExactFinish: true },
        allowedCommands: ['right']
    },
    'level-002': {
        id: 'level-002',
        name: 'Tutorial: Giro simple',
        isTutorial: true,
        tutorialIntro: {
            title: 'Tutorial 2: Bajar',
            command: 'down',
            description: 'Ahora aprenderas el comando down. Sirve para mover al robot una celda hacia abajo y combinarlo con right.',
            objective: 'Avanza hacia la derecha y luego baja para alcanzar la meta.'
        },
        size: { width: 6, height: 2 },
        player: { start: { x: 0, y: 0 } },
        goal: { x: 5, y: 1 },
        tiles: [],
        rules: { timeLimit: 60, requireExactFinish: true },
        allowedCommands: ['right', 'down']
    },
    'level-003': {
        id: 'level-003',
        name: 'Tutorial: Subir',
        isTutorial: true,
        tutorialIntro: {
            title: 'Tutorial 3: Arriba',
            command: 'up',
            description: 'Este nivel te ensena el comando up. Sirve para mover al robot una celda hacia arriba.',
            objective: 'Combina right y up para llegar a la meta ubicada en la fila superior.'
        },
        size: { width: 6, height: 3 },
        player: { start: { x: 0, y: 2 } },
        goal: { x: 5, y: 0 },
        tiles: [],
        rules: { timeLimit: 60, requireExactFinish: true },
        allowedCommands: ['right', 'up']
    },
    'level-004': {
        id: 'level-004',
        name: 'Tutorial: Izquierda',
        isTutorial: true,
        tutorialIntro: {
            title: 'Tutorial 4: Izquierda',
            command: 'left',
            description: 'En este nivel aprenderas el comando left para desplazarte una celda hacia la izquierda.',
            objective: 'Comienza desde la derecha y usa left junto con down para alcanzar la meta.'
        },
        size: { width: 7, height: 3 },
        player: { start: { x: 6, y: 0 } },
        goal: { x: 0, y: 2 },
        tiles: [],
        rules: { timeLimit: 60, requireExactFinish: true },
        allowedCommands: ['left', 'down']
    },
    'level-005': {
        id: 'level-005',
        name: 'Tutorial: Ruta larga',
        isTutorial: true,
        tutorialIntro: {
            title: 'Tutorial 5: Repetir bloques',
            command: 'repeat + enter',
            description: 'En este nivel aprenderas a repetir una secuencia. Usa enter para separar bloques y repeat para duplicar el bloque actual.',
            objective: 'Construye una ruta mas larga combinando movimientos con repeat y enter para llegar a la meta.'
        },
        size: { width: 7, height: 3 },
        player: { start: { x: 0, y: 0 } },
        goal: { x: 6, y: 2 },
        tiles: [
            { x: 3, y: 1, type: 'wall' }
        ],
        rules: { timeLimit: 60, requireExactFinish: true },
        allowedCommands: ['right', 'down', 'repeat', 'enter']
    },
    'level-008': {
        id: 'level-008',
        name: 'Tutorial: Borrar comandos',
        isTutorial: true,
        tutorialIntro: {
            title: 'Tutorial 6: Corregir un programa',
            command: 'clic',
            description: 'El robot recibio un programa con un error: tiene un comando de mas que lo hace caer del camino. Para eliminar un comando de la secuencia, haz clic sobre el.',
            objective: 'Encuentra el comando incorrecto en la secuencia, eliminalo con un clic, y luego ejecuta el programa corregido para que el robot llegue a la meta.'
        },
        size: { width: 4, height: 1 },
        player: { start: { x: 0, y: 0 } },
        goal: { x: 3, y: 0 },
        tiles: [],
        initialSequence: ['right', 'right', 'right', 'right'],
        rules: { timeLimit: 90, requireExactFinish: true },
        allowedCommands: ['right']
    },
    'level-006': {
        id: 'level-006',
        name: 'Barrera central',
        isTutorial: false,
        size: { width: 10, height: 10 },
        player: { start: { x: 0, y: 0 } },
        goal: { x: 9, y: 9 },
        tiles: [
            { x: 4, y: 4, type: 'wall' },
            { x: 5, y: 4, type: 'wall' },
            { x: 4, y: 5, type: 'wall' }
        ],
        rules: { timeLimit: 60, requireExactFinish: true },
        allowedCommands: ['up', 'down', 'left', 'right', 'repeat', 'enter']
    },
    'level-007': {
        id: 'level-007',
        name: 'Corredor zig-zag',
        isTutorial: false,
        size: { width: 10, height: 10 },
        player: { start: { x: 0, y: 0 } },
        goal: { x: 9, y: 9 },
        tiles: [
            { x: 2, y: 2, type: 'wall' },
            { x: 2, y: 3, type: 'wall' },
            { x: 3, y: 3, type: 'wall' },
            { x: 6, y: 6, type: 'wall' }
        ],
        rules: { timeLimit: 60, requireExactFinish: true },
        allowedCommands: ['up', 'down', 'left', 'right', 'repeat', 'enter']
    }
};
