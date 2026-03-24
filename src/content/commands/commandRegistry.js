const COMMANDS = [
    { id: 'up', name: 'Arriba', icon: '⬆️', action: (pos) => ({ x: pos.x, y: pos.y - 1 }) },
    { id: 'down', name: 'Abajo', icon: '⬇️', action: (pos) => ({ x: pos.x, y: pos.y + 1 }) },
    { id: 'left', name: 'Izquierda', icon: '⬅️', action: (pos) => ({ x: pos.x - 1, y: pos.y }) },
    { id: 'right', name: 'Derecha', icon: '➡️', action: (pos) => ({ x: pos.x + 1, y: pos.y }) },
    { id: 'repeat', name: 'Repetir', icon: '🔁', action: null },
    { id: 'enter', name: 'Siguiente Bloque', icon: '↵', action: null }
];

const commandMap = new Map(COMMANDS.map((command) => [command.id, command]));

export function getCommands() {
    return COMMANDS;
}

export function getCommandById(id) {
    return commandMap.get(id) || null;
}

export function getExecutableCommandById(id) {
    const command = getCommandById(id);
    return command && typeof command.action === 'function' ? command : null;
}
