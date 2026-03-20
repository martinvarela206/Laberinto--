import { Entity } from '../core/Entity.js';

/**
 * Trap - Trampa que provoca derrota instantánea al pisarla.
 * Preparado para uso futuro.
 */
export class Trap extends Entity {
    constructor(x, y) {
        super({ id: 'trap', name: 'Trampa', icon: '🔥', x, y, type: 'trap' });
    }
}
