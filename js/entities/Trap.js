import { Entity } from '../core/Entity.js';

/**
 * Trap - Trampa que provoca derrota instantánea al pisarla.
 * Preparado para uso futuro.
 */
export class Trap extends Entity {
    static getDefaultVisual() {
        return {
            type: 'emoji',
            value: '🔥',
            alt: 'Trampa',
            size: {
                emoji: '1em',
                image: '84%'
            }
        };
    }

    constructor(x, y) {
        super({ id: 'trap', name: 'Trampa', x, y, type: 'trap' });
    }
}
