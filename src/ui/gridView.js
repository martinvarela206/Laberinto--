export function renderGrid(gridContainerEl, level, goalIcon) {
    gridContainerEl.innerHTML = '';
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

function getCell(gridContainerEl, width, height, x, y) {
    if (x < 0 || x >= width || y < 0 || y >= height) {
        return null;
    }

    return gridContainerEl.children[y * width + x] || null;
}
