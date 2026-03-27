import { Entity } from '../core/Entity.js';

export class Player extends Entity {
    static getDefaultVisual() {
        return {
            type: 'emoji',
            value: '🤖',
            alt: 'Jugador',
            size: {
                emoji: '1em',
                image: '86%'
            }
        };
    }

    constructor(x = 0, y = 0) {
        super({ id: 'player', name: 'Jugador', x, y, type: 'player' });
    }
}
