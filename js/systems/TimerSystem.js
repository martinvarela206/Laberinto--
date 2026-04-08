import { gameState } from '../core/GameState.js';

/**
 * TimerSystem - Gestión del temporizador ascendente en segundos.
 */
export const timerSystem = {
    start(onTick) {
        this.stop();
        gameState.intervalId = setInterval(() => {
            if (!gameState.isGameOver) {
                gameState.timer++;
                if (onTick) onTick(gameState.timer);
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
