/**
 * Entity - Clase base para todas las entidades del juego.
 * Player, Goal, Wall, Trap heredan de esta clase.
 */
export class Entity {
    static getDefaultVisual() {
        return {
            type: 'emoji',
            value: '▭',
            alt: 'Entity',
            size: {
                emoji: '1em',
                image: '84%'
            }
        };
    }

    static normalizeVisual(rawVisual) {
        const base = Entity.getDefaultVisual();
        const source = rawVisual && typeof rawVisual === 'object' ? rawVisual : {};
        const rawSize = source.size && typeof source.size === 'object' ? source.size : {};

        return {
            type: source.type || base.type,
            value: source.value ?? base.value,
            src: source.src || null,
            alt: source.alt || base.alt,
            size: {
                emoji: rawSize.emoji ?? source.emojiSize ?? base.size.emoji,
                image: rawSize.image ?? source.imageSize ?? base.size.image,
                width: rawSize.width ?? source.width ?? null,
                height: rawSize.height ?? source.height ?? null
            }
        };
    }

    constructor({ id, name, icon, visual, x = 0, y = 0, type = 'entity' }) {
        this.id = id;
        this.name = name;
        const inheritedVisual =
            typeof this.constructor.getDefaultVisual === 'function'
                ? this.constructor.getDefaultVisual()
                : Entity.getDefaultVisual();

        this.visual = Entity.normalizeVisual(visual || inheritedVisual);
        this.icon = icon || (this.visual.type === 'emoji' ? this.visual.value : '▭');
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
