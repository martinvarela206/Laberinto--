import { getDOMRefs } from './DOMRefs.js';
import { gameState } from '../core/GameState.js';

/**
 * GridRenderer - Renderizado de la grilla del laberinto y posición del jugador.
 */
export const gridRenderer = {
    render(level) {
        const els = getDOMRefs();
        els.gridContainer.innerHTML = '';

        // Ajustar grid dinámicamente al tamaño del nivel
        els.gridContainer.style.gridTemplateColumns = `repeat(${level.width}, var(--cell-size))`;
        els.gridContainer.style.gridTemplateRows = `repeat(${level.height}, var(--cell-size))`;

        // Celdas
        for (let y = 0; y < level.height; y++) {
            for (let x = 0; x < level.width; x++) {
                const cell = document.createElement('div');
                cell.className = 'cell path';
                cell.dataset.x = x;
                cell.dataset.y = y;
                els.gridContainer.appendChild(cell);
            }
        }

        // Meta
        const goalCell = this.getCell(level.goal.x, level.goal.y);
        if (goalCell) {
            const goalEl = document.createElement('div');
            goalEl.className = 'goal';
            goalEl.innerText = '🏁';
            goalCell.appendChild(goalEl);
        }

        // Paredes
        if (level.walls) {
            level.walls.forEach(w => {
                const cell = this.getCell(w.x, w.y);
                if (cell) {
                    const wallEl = document.createElement('div');
                    wallEl.className = 'wall';
                    wallEl.innerText = '🧱';
                    cell.appendChild(wallEl);
                }
            });
        }

        // Jugador
        const playerEl = document.createElement('div');
        playerEl.id = 'player';
        playerEl.className = 'player';
        playerEl.innerText = '🤖';
        els.gridContainer.appendChild(playerEl);
        this.updatePlayerPosition();
    },

    getCell(x, y) {
        const els = getDOMRefs();
        if (x < 0 || x >= gameState.level.width || y < 0 || y >= gameState.level.height) return null;
        return els.gridContainer.children[y * gameState.level.width + x];
    },

    updatePlayerPosition() {
        const playerEl = document.getElementById('player');
        if (!playerEl) return;
        playerEl.style.transform = `translate(${gameState.position.x * 100}%, ${gameState.position.y * 100}%)`;
    }
};
