export function addBlockingObstacleFromPath(level, pathTaken) {
    const validPath = pathTaken.filter(
        (point) =>
            !(point.x === level.goal.x && point.y === level.goal.y) &&
            !(point.x === level.playerStart.x && point.y === level.playerStart.y)
    );

    if (validPath.length === 0) {
        return level;
    }

    const randomIndex = Math.floor(Math.random() * validPath.length);
    const obstacle = validPath[randomIndex];

    if (!level.walls.some((wall) => wall.x === obstacle.x && wall.y === obstacle.y)) {
        level.walls.push({ x: obstacle.x, y: obstacle.y });
    }

    return level;
}
