import { Entity } from '../core/Entity.js';

export class Wall extends Entity {
    static getDefaultVisual() {
        return {
            type: 'emoji',
            value: '🧱',
            alt: 'Pared',
            size: {
                emoji: '1em',
                image: '84%'
            }
        };
    }

    constructor(x, y) {
        super({ id: 'wall', name: 'Pared', x, y, type: 'solid' });
        this.isSolid = true;
    }
}
