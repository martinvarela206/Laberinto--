import { Entity } from '../core/Entity.js';

export class Player extends Entity {
    constructor(x = 0, y = 0) {
        super({ id: 'player', name: 'Jugador', icon: '🤖', x, y, type: 'player' });
    }
}
