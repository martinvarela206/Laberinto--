/**
 * Command - Clase base para todos los comandos del juego.
 * Los comandos de movimiento tienen action !== null.
 * Los comandos estructurales (repeat, enter) tienen action === null.
 */
export class Command {
    constructor(id, name, icon) {
        this.id = id;
        this.name = name;
        this.icon = icon;
    }

    /** @returns {Function|null} función (pos) => newPos, o null si es estructural */
    get action() {
        return null;
    }
}
