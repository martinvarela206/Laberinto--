import { Entity } from '../core/Entity.js';

export class Goal extends Entity {
    constructor(x = 0, y = 0) {
        super({ id: 'goal', name: 'Meta', icon: '🏁', x, y, type: 'goal' });
    }
}
