export function checkCollisions(position, level) {
    if (position.x < 0 || position.x >= level.width || position.y < 0 || position.y >= level.height) {
        return 'lose_bounds';
    }

    if (position.x === level.goal.x && position.y === level.goal.y) {
        return 'win';
    }

    if (Array.isArray(level.walls) && level.walls.some((wall) => wall.x === position.x && wall.y === position.y)) {
        return 'lose_wall';
    }

    return 'safe';
}
