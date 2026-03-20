/**
 * GameState - Estado centralizado del juego.
 * Singleton exportado que todos los módulos pueden importar.
 */
export const gameState = {
    sequence: [],
    position: { x: 0, y: 0 },
    playing: false,
    isGameOver: false,
    timer: 60,
    intervalId: null,
    level: null,
    levelNumber: 1,
    pathTaken: [],
    commandsUsed: 0
};
