import { getDOMRefs } from './DOMRefs.js';

/**
 * HudUI - Actualización de los contadores del HUD (comandos, timer, nivel).
 */
export const hudUI = {
    updateTimer(value) {
        getDOMRefs().timeCount.innerText = value;
    },

    updateCommandsCount(value) {
        getDOMRefs().commandsCount.innerText = value;
    },

    updateLevel(levelNumber) {
        getDOMRefs().levelDisplay.innerText = `Nivel ${levelNumber}`;
    }
};
