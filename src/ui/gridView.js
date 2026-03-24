export function renderGrid(gridContainerEl, level, goalIcon) {
    gridContainerEl.innerHTML = '';
    gridContainerEl.classList.remove('trail-success', 'trail-failure');
    gridContainerEl.style.gridTemplateColumns = `repeat(${level.width}, var(--cell-size))`;
    gridContainerEl.style.gridTemplateRows = `repeat(${level.height}, var(--cell-size))`;

    for (let y = 0; y < level.height; y++) {
        for (let x = 0; x < level.width; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell path';
            cell.dataset.x = String(x);
            cell.dataset.y = String(y);
            gridContainerEl.appendChild(cell);
        }
    }

    const goalCell = getCell(gridContainerEl, level.width, level.height, level.goal.x, level.goal.y);
    if (goalCell) {
        const goalEl = document.createElement('div');
        goalEl.className = 'goal';
        goalEl.innerText = goalIcon;
        goalCell.appendChild(goalEl);
    }

    if (Array.isArray(level.walls)) {
        level.walls.forEach((wall) => {
            const cell = getCell(gridContainerEl, level.width, level.height, wall.x, wall.y);
            if (!cell) {
                return;
            }

            const wallEl = document.createElement('div');
            wallEl.className = 'wall';
            wallEl.innerText = '🧱';
            cell.appendChild(wallEl);
        });
    }

    const playerEl = document.createElement('div');
    playerEl.id = 'player';
    playerEl.className = 'player';
    playerEl.innerText = '🤖';
    gridContainerEl.appendChild(playerEl);
}

export function updatePlayerPosition(position) {
    const playerEl = document.getElementById('player');
    if (!playerEl) {
        return;
    }

    playerEl.style.transform = `translate(${position.x * 100}%, ${position.y * 100}%)`;
}

export function markTrailCell(gridContainerEl, level, position) {
    const cell = getCell(gridContainerEl, level.width, level.height, position.x, position.y);
    if (!cell) {
        return;
    }

    cell.classList.add('trail-cell');
    cell.classList.add('trail-node');
    cell.classList.add('trail-animate');
    ensureTrailVars(cell);
}

export function connectTrailCells(gridContainerEl, level, from, to) {
    const fromCell = getCell(gridContainerEl, level.width, level.height, from.x, from.y);
    if (!fromCell) {
        return;
    }

    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;

    if (deltaX === 1 && deltaY === 0) {
        applyTrailConnection(fromCell, 'right');
        applyTrailConnection(getCell(gridContainerEl, level.width, level.height, to.x, to.y), 'left');
        return;
    }

    if (deltaX === -1 && deltaY === 0) {
        applyTrailConnection(fromCell, 'left');
        applyTrailConnection(getCell(gridContainerEl, level.width, level.height, to.x, to.y), 'right');
        return;
    }

    if (deltaX === 0 && deltaY === 1) {
        applyTrailConnection(fromCell, 'down');
        applyTrailConnection(getCell(gridContainerEl, level.width, level.height, to.x, to.y), 'up');
        return;
    }

    if (deltaX === 0 && deltaY === -1) {
        applyTrailConnection(fromCell, 'up');
        applyTrailConnection(getCell(gridContainerEl, level.width, level.height, to.x, to.y), 'down');
    }
}

export function setTrailState(gridContainerEl, trailState) {
    gridContainerEl.classList.remove('trail-success', 'trail-failure');

    if (trailState === 'success') {
        gridContainerEl.classList.add('trail-success');
        return;
    }

    if (trailState === 'failure') {
        gridContainerEl.classList.add('trail-failure');
    }
}

export function setTrailExit(gridContainerEl, level, from, to) {
    const fromCell = getCell(gridContainerEl, level.width, level.height, from.x, from.y);
    if (!fromCell) {
        return;
    }

    fromCell.classList.add('trail-exit');
    fromCell.classList.remove('trail-exit-up', 'trail-exit-right', 'trail-exit-down', 'trail-exit-left');

    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;

    if (deltaX === 1 && deltaY === 0) {
        fromCell.classList.add('trail-exit-right');
        return;
    }

    if (deltaX === -1 && deltaY === 0) {
        fromCell.classList.add('trail-exit-left');
        return;
    }

    if (deltaX === 0 && deltaY === 1) {
        fromCell.classList.add('trail-exit-down');
        return;
    }

    if (deltaX === 0 && deltaY === -1) {
        fromCell.classList.add('trail-exit-up');
    }
}

function getCell(gridContainerEl, width, height, x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
        return null;
    }

    return gridContainerEl.children[y * width + x] || null;
}

function applyTrailConnection(cell, direction) {
    if (!cell) {
        return;
    }

    cell.classList.add('trail-cell');
    cell.classList.add('trail-node');
    cell.classList.add('trail-animate');
    ensureTrailVars(cell);
    cell.style.setProperty(`--trail-${direction}`, '1');
}

function ensureTrailVars(cell) {
    if (!cell.style.getPropertyValue('--trail-up')) {
        cell.style.setProperty('--trail-up', '0');
        cell.style.setProperty('--trail-right', '0');
        cell.style.setProperty('--trail-down', '0');
        cell.style.setProperty('--trail-left', '0');
    }
}
