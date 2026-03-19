const COMMANDS = [
    { id: 'up', name: 'Arriba', icon: '⬆️', action: (pos) => ({ x: pos.x, y: pos.y - 1 }) },
    { id: 'down', name: 'Abajo', icon: '⬇️', action: (pos) => ({ x: pos.x, y: pos.y + 1 }) },
    { id: 'left', name: 'Izquierda', icon: '⬅️', action: (pos) => ({ x: pos.x - 1, y: pos.y }) },
    { id: 'right', name: 'Derecha', icon: '➡️', action: (pos) => ({ x: pos.x + 1, y: pos.y }) },
    { id: 'repeat', name: 'Repetir', icon: '🔁', action: null }, // Repeat duplicates the sequence dynamically
    { id: 'enter', name: 'Siguiente Bloque', icon: '↵', action: null } // Enter ends current block
];

const ELEMENTS = [
    { id: 'wall', type: 'solid', icon: '' },
    { id: 'trap', type: 'trap', icon: '🔥' },
    { id: 'goal', type: 'goal', icon: '🏁' }
];

const LEVEL_1 = {
    width: 10,
    height: 10,
    playerStart: { x: 0, y: 0 },
    goal: { x: 9, y: 9 },
    walls: [], // Array of {x, y}
    traps: [] // Array of {x, y}
};
