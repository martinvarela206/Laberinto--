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
    commandLimits: {},
    currentLevelId: 'level-001',
    levelNumber: 1,
    commandsUsed: 0,
    failureMarkerPosition: null  // Tracks position where player failed
};
