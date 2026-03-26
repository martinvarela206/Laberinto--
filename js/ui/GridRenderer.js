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
    },

    /**
     * Marcar una celda individual como parte del camino recorrido
     */
    markTrailCell(position) {
        if (!this._isValidPosition(position)) return;
        
        const cell = this.getCell(position.x, position.y);
        if (!cell) return;
        
        cell.classList.add('trail-cell', 'trail-node', 'trail-animate');
        this._ensureTrailVars(cell);
    },

    /**
     * Conectar dos celdas del camino con una línea direccional
     */
    connectTrailCells(from, to) {
        const fromCell = this.getCell(from.x, from.y);
        if (!fromCell) return;

        const deltaX = to.x - from.x;
        const deltaY = to.y - from.y;

        if (deltaX === 1 && deltaY === 0) {
            this._applyTrailConnection(fromCell, 'right');
            this._applyTrailConnection(this.getCell(to.x, to.y), 'left');
        } else if (deltaX === -1 && deltaY === 0) {
            this._applyTrailConnection(fromCell, 'left');
            this._applyTrailConnection(this.getCell(to.x, to.y), 'right');
        } else if (deltaX === 0 && deltaY === 1) {
            this._applyTrailConnection(fromCell, 'down');
            this._applyTrailConnection(this.getCell(to.x, to.y), 'up');
        } else if (deltaX === 0 && deltaY === -1) {
            this._applyTrailConnection(fromCell, 'up');
            this._applyTrailConnection(this.getCell(to.x, to.y), 'down');
        }
    },

    /**
     * Marcar un paso del camino (celda + conexión)
     */
    markTrailStep(from, to) {
        this.markTrailCell(from);
        this.markTrailCell(to);
        this.connectTrailCells(from, to);
    },

    /**
     * Establecer estado del trail (success/failure)
     */
    setTrailState(state) {
        const els = getDOMRefs();
        els.gridContainer.classList.remove('trail-success', 'trail-failure');
        if (state === 'success') {
            els.gridContainer.classList.add('trail-success');
        } else if (state === 'failure') {
            els.gridContainer.classList.add('trail-failure');
        }
    },

    /**
     * Limpiar todo el estado visual del trail
     */
    clearTrailState() {
        const els = getDOMRefs();
        els.gridContainer.classList.remove('trail-success', 'trail-failure');
        
        const cells = els.gridContainer.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('trail-cell', 'trail-node', 'trail-animate', 'trail-exit', 
                                   'trail-exit-up', 'trail-exit-right', 'trail-exit-down', 'trail-exit-left');
            cell.style.removeProperty('--trail-up');
            cell.style.removeProperty('--trail-right');
            cell.style.removeProperty('--trail-down');
            cell.style.removeProperty('--trail-left');
        });
    },

    /**
     * Helpers privados
     */
    _isValidPosition(position) {
        return position && 
               position.x >= 0 && position.x < gameState.level.width &&
               position.y >= 0 && position.y < gameState.level.height;
    },

    _ensureTrailVars(cell) {
        if (!cell.style.getPropertyValue('--trail-up')) {
            cell.style.setProperty('--trail-up', '0');
            cell.style.setProperty('--trail-right', '0');
            cell.style.setProperty('--trail-down', '0');
            cell.style.setProperty('--trail-left', '0');
        }
    },

    _applyTrailConnection(cell, direction) {
        if (!cell) return;
        cell.classList.add('trail-cell', 'trail-node', 'trail-animate');
        this._ensureTrailVars(cell);
        cell.style.setProperty(`--trail-${direction}`, '1');
    }
};
