/**
 * CommandRegistry - Registro central de comandos disponibles.
 * Para agregar un nuevo comando, solo hay que registrarlo aquí.
 */
class CommandRegistry {
    constructor() {
        this._commands = [];
    }

    register(command) {
        this._commands.push(command);
    }

    getAll() {
        return [...this._commands];
    }

    getById(id) {
        return this._commands.find(cmd => cmd.id === id) || null;
    }
}

export const commandRegistry = new CommandRegistry();
