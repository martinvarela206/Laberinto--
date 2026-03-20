import { Command } from './Command.js';

/**
 * MoveCommand - Comando de movimiento (arriba, abajo, izquierda, derecha).
 * Cada instancia define su dirección con dx/dy.
 */
export class MoveCommand extends Command {
    constructor(id, name, icon, dx, dy) {
        super(id, name, icon);
        this.dx = dx;
        this.dy = dy;
        this._action = (pos) => ({ x: pos.x + this.dx, y: pos.y + this.dy });
    }

    get action() {
        return this._action;
    }
}
