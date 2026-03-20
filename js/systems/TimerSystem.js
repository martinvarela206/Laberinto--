import { gameState } from '../core/GameState.js';

/**
 * TimerSystem - Gestión del temporizador de 60 segundos.
 */
export const timerSystem = {
    start(onTick, onExpired) {
        this.stop();
        gameState.intervalId = setInterval(() => {
            if (!gameState.playing && !gameState.isGameOver) {
                gameState.timer--;
                if (onTick) onTick(gameState.timer);
                if (gameState.timer <= 0) {
                    this.stop();
                    if (onExpired) onExpired();
                }
            }
        }, 1000);
    },

    stop() {
        if (gameState.intervalId) {
            clearInterval(gameState.intervalId);
            gameState.intervalId = null;
        }
    }
};
