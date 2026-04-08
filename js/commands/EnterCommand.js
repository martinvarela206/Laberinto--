import { Command } from './Command.js';

/**
 * EnterCommand - Finaliza el bloque actual de secuencia.
 * Comando estructural (action === null).
 */
export class EnterCommand extends Command {
    constructor() {
        super('enter', 'Siguiente bloque', '↵');
    }

    getExecutionStates() {
        return {
            preState: { animations: [] },
            inState: { animations: [] },
            postState: { animations: [] }
        };
    }
}
