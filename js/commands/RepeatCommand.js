import { Command } from './Command.js';

/**
 * RepeatCommand - Duplica los comandos del bloque actual.
 * Comando estructural (action === null).
 */
export class RepeatCommand extends Command {
    constructor() {
        super('repeat', 'Repetir', '🔁');
    }
}
