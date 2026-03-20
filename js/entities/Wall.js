import { Entity } from '../core/Entity.js';

export class Wall extends Entity {
    constructor(x, y) {
        super({ id: 'wall', name: 'Pared', icon: '🧱', x, y, type: 'solid' });
        this.isSolid = true;
    }
}
