import { Entity } from '../core/Entity.js';

export class Goal extends Entity {
    static getDefaultVisual() {
        return {
            type: 'emoji',
            value: '🏁',
            alt: 'Meta',
            size: {
                emoji: '1em',
                image: '84%'
            }
        };
    }

    constructor(x = 0, y = 0) {
        super({ id: 'goal', name: 'Meta', x, y, type: 'goal' });
    }
}
