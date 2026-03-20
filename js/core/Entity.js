/**
 * Entity - Clase base para todas las entidades del juego.
 * Player, Goal, Wall, Trap heredan de esta clase.
 */
export class Entity {
    constructor({ id, name, icon, x = 0, y = 0, type = 'entity' }) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.x = x;
        this.y = y;
        this.type = type;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    toJSON() {
        return { id: this.id, x: this.x, y: this.y };
    }
}
