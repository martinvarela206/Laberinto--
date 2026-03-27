import { getDOMRefs } from './DOMRefs.js';
import { gameState } from '../core/GameState.js';
import { resolveVisualAssets } from '../config/visualAssets.js';

/**
 * GridRenderer - Renderizado de la grilla del laberinto y posición del jugador.
 */
export const gridRenderer = {
    render(level) {
        const els = getDOMRefs();
        const visuals = resolveVisualAssets(level?.visualAssets);

        els.gridContainer.innerHTML = '';
        this._applyGridVisualTheme(els.gridContainer, visuals);

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

        // Casillas de borde virtuales para representar visualmente el límite.
        this._renderEdgeCells(level, els.gridContainer, visuals);

        // Meta
        const goalCell = this.getCell(level.goal.x, level.goal.y);
        if (goalCell) {
            const goalEl = document.createElement('div');
            goalEl.className = 'goal';
            this._applyEntityAsset(goalEl, visuals.goal, 'goal-visual');
            goalCell.appendChild(goalEl);
        }

        // Paredes
        if (level.walls) {
            level.walls.forEach((w) => {
                const cell = this.getCell(w.x, w.y);
                if (cell) {
                    const wallEl = document.createElement('div');
                    wallEl.className = 'wall';
                    this._applyEntityAsset(wallEl, visuals.wall, 'wall-visual');
                    cell.appendChild(wallEl);
                }
            });
        }

        // Jugador
        const playerEl = document.createElement('div');
        playerEl.id = 'player';
        playerEl.className = 'player';

        const playerInner = document.createElement('span');
        playerInner.className = 'player-inner';
        this._applyEntityAsset(playerInner, visuals.player, 'player-visual');
        playerEl.appendChild(playerInner);

        els.gridContainer.appendChild(playerEl);
        this.updatePlayerPosition();
    },

    getCell(x, y) {
        const els = getDOMRefs();
        if (x < 0 || x >= gameState.level.width || y < 0 || y >= gameState.level.height) {
            return this._getEdgeCell(x, y);
        }
        return els.gridContainer.children[y * gameState.level.width + x] || null;
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

        const cells = els.gridContainer.querySelectorAll('.cell, .edge-cell');
        cells.forEach((cell) => {
            cell.classList.remove(
                'trail-cell',
                'trail-node',
                'trail-animate',
                'trail-exit',
                'trail-exit-up',
                'trail-exit-right',
                'trail-exit-down',
                'trail-exit-left'
            );
            cell.style.removeProperty('--trail-up');
            cell.style.removeProperty('--trail-right');
            cell.style.removeProperty('--trail-down');
            cell.style.removeProperty('--trail-left');
        });
    },

    _renderEdgeCells(level, container, visuals) {
        const makeEdgeCell = (edgeX, edgeY) => {
            const edgeCell = document.createElement('div');
            edgeCell.className = 'edge-cell';
            edgeCell.dataset.edgeX = String(edgeX);
            edgeCell.dataset.edgeY = String(edgeY);

            if (edgeY === -1) {
                edgeCell.style.left = `calc(var(--cell-size) * ${edgeX})`;
                edgeCell.style.top = 'calc(-1 * var(--cell-size))';
            } else if (edgeY === level.height) {
                edgeCell.style.left = `calc(var(--cell-size) * ${edgeX})`;
                edgeCell.style.top = `calc(var(--cell-size) * ${level.height})`;
            } else if (edgeX === -1) {
                edgeCell.style.left = 'calc(-1 * var(--cell-size))';
                edgeCell.style.top = `calc(var(--cell-size) * ${edgeY})`;
            } else if (edgeX === level.width) {
                edgeCell.style.left = `calc(var(--cell-size) * ${level.width})`;
                edgeCell.style.top = `calc(var(--cell-size) * ${edgeY})`;
            }

            this._applyEntityAsset(edgeCell, visuals?.edge, 'edge-visual');
            container.appendChild(edgeCell);
        };

        for (let x = 0; x < level.width; x++) {
            makeEdgeCell(x, -1);
            makeEdgeCell(x, level.height);
        }

        for (let y = 0; y < level.height; y++) {
            makeEdgeCell(-1, y);
            makeEdgeCell(level.width, y);
        }
    },

    _getEdgeCell(x, y) {
        const level = gameState.level;
        if (!level) return null;

        const clampedX = Math.max(0, Math.min(x, level.width - 1));
        const clampedY = Math.max(0, Math.min(y, level.height - 1));

        let edgeX = clampedX;
        let edgeY = clampedY;

        if (x < 0) edgeX = -1;
        if (x >= level.width) edgeX = level.width;
        if (y < 0) edgeY = -1;
        if (y >= level.height) edgeY = level.height;

        const els = getDOMRefs();
        return els.gridContainer.querySelector(`.edge-cell[data-edge-x="${edgeX}"][data-edge-y="${edgeY}"]`);
    },

    _applyGridVisualTheme(container, visuals) {
        const map = visuals?.map || {};
        const edge = visuals?.edgeStyle || {};

        container.style.setProperty('--map-bg', map.backgroundColor || 'var(--grid-bg)');
        container.style.setProperty('--map-border', map.borderColor || 'var(--maze-border)');
        container.style.setProperty('--map-outline', map.outlineColor || 'rgba(239, 68, 68, 0.5)');

        container.style.setProperty('--edge-border-color', edge.borderColor || 'rgba(148, 163, 184, 0.55)');
        container.style.setProperty('--edge-bg-start', edge.backgroundStart || 'rgba(15, 23, 42, 0.45)');
        container.style.setProperty('--edge-bg-end', edge.backgroundEnd || 'rgba(30, 41, 59, 0.7)');
    },

    _applyEntityAsset(targetEl, asset, className) {
        const safeAsset = asset || { type: 'emoji', value: '' };
        const type = safeAsset.type || 'emoji';

        targetEl.classList.add('entity-asset-host');
        if (className) {
            targetEl.classList.add(className);
        }

        if (type === 'image' && safeAsset.src) {
            const img = document.createElement('img');
            img.className = 'entity-asset entity-asset-image';
            img.src = safeAsset.src;
            img.alt = safeAsset.alt || '';
            targetEl.appendChild(img);
            return;
        }

        const span = document.createElement('span');
        span.className = 'entity-asset entity-asset-emoji';
        span.textContent = safeAsset.value || '';
        targetEl.appendChild(span);
    },

    _isValidPosition(position) {
        return (
            position &&
            position.x >= 0 &&
            position.x < gameState.level.width &&
            position.y >= 0 &&
            position.y < gameState.level.height
        );
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
