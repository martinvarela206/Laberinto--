/**
 * CollisionSystem - Detección de colisiones del jugador.
 * Evalúa límites, paredes y meta.
 */
export function checkCollisions(position, level) {
    const p = position;

    // Fuera de la grilla
    if (p.x < 0 || p.x >= level.width || p.y < 0 || p.y >= level.height) {
        return 'lose_bounds';
    }

    // Llegó a la meta
    if (p.x === level.goal.x && p.y === level.goal.y) {
        return 'win';
    }

    // Choque con pared
    if (level.walls && level.walls.some(w => w.x === p.x && w.y === p.y)) {
        return 'lose_wall';
    }

    return 'safe';
}
