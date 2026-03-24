export const LEVEL_INDEX_FALLBACK = {
    levels: [
        { id: 'level-001', file: 'level-001.json' },
        { id: 'level-002', file: 'level-002.json' },
        { id: 'level-003', file: 'level-003.json' }
    ]
};

export const LEVELS_FALLBACK = {
    'level-001': {
        id: 'level-001',
        name: 'Primeros pasos',
        size: { width: 10, height: 10 },
        player: { start: { x: 0, y: 0 } },
        goal: { x: 9, y: 9 },
        tiles: [],
        rules: { timeLimit: 60, requireExactFinish: true },
        allowedCommands: ['up', 'down', 'left', 'right', 'repeat', 'enter']
    },
    'level-002': {
        id: 'level-002',
        name: 'Barrera central',
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
    'level-003': {
        id: 'level-003',
        name: 'Corredor zig-zag',
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
