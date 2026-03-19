// Estado del juego
let state = {
    sequence: [],
    position: { x: 0, y: 0 },
    playing: false,
    isGameOver: false,
    timer: 60,
    intervalId: null,
    level: JSON.parse(JSON.stringify(LEVEL_1)),
    levelNumber: 1,
    pathTaken: [],
    commandsUsed: 0
};

// Referencias del DOM
const els = {
    commandsBank: document.getElementById('commands-bank'),
    sequenceContainer: document.getElementById('sequence-container'),
    gridContainer: document.getElementById('grid-container'),
    btnUndo: document.getElementById('btn-undo'),
    btnRun: document.getElementById('btn-run'),
    btnReset: document.getElementById('btn-reset'),
    timeCount: document.getElementById('time-count'),
    commandsCount: document.getElementById('commands-count'),
    modal: document.getElementById('modal-overlay'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    modalScore: document.getElementById('modal-score'),
    finalScore: document.getElementById('final-score'),
    nameInputGroup: document.getElementById('name-input-group'),
    playerName: document.getElementById('player-name'),
    btnSaveScore: document.getElementById('btn-save-score'),
    rankingList: document.getElementById('ranking-list'),
    btnPlayAgain: document.getElementById('btn-play-again'),
    btnNextLevel: document.getElementById('btn-next-level'),
    btnRetry: document.getElementById('btn-retry'),
    levelDisplay: document.getElementById('level-display')
};

// Inicialización
function init() {
    renderCommands();
    resetState();
    loadRanking();
    
    els.btnUndo.addEventListener('click', undoCommand);
    els.btnRun.addEventListener('click', startRun);
    els.btnReset.addEventListener('click', resetLevel);
    els.btnPlayAgain.addEventListener('click', playAgain);
    els.btnNextLevel.addEventListener('click', nextLevel);
    els.btnRetry.addEventListener('click', retryLevel);
    els.btnSaveScore.addEventListener('click', saveScore);
    
    // Window resize handler to reposition player if window resizes
    window.addEventListener('resize', updatePlayerPosition);
}

function resetState() {
    state.sequence = [];
    state.position = { ...state.level.playerStart };
    state.playing = false;
    state.isGameOver = false;
    state.timer = 60;
    state.commandsUsed = 0;
    state.pathTaken = [];
    
    stopTimer();
    els.timeCount.innerText = state.timer;
    
    // Restaurar botón Play
    els.btnRun.disabled = false;
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');
    
    els.btnUndo.disabled = false;
    els.commandsBank.style.pointerEvents = 'auto'; // Enable clicks
    
    renderGrid();
    updateSequenceUI();
    startTimer();
}

function startTimer() {
    stopTimer();
    state.intervalId = setInterval(() => {
        if(!state.playing && !state.isGameOver) {
            state.timer--;
            els.timeCount.innerText = state.timer;
            if(state.timer <= 0) {
                stopTimer();
                gameOver(false, "¡Se acabó el tiempo!");
            }
        }
    }, 1000);
}

function stopTimer() {
    if(state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
    }
}

// Renderizado de UI básica
function renderCommands() {
    els.commandsBank.innerHTML = '';
    COMMANDS.forEach(cmd => {
        const btn = document.createElement('button');
        btn.className = 'cmd-btn';
        btn.innerText = cmd.icon;
        btn.title = cmd.name;
        btn.onclick = () => addCommand(cmd);
        els.commandsBank.appendChild(btn);
    });
}

function renderGrid() {
    els.gridContainer.innerHTML = '';
    
    for(let y=0; y < state.level.height; y++) {
        for(let x=0; x < state.level.width; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell path';
            cell.dataset.x = x;
            cell.dataset.y = y;
            els.gridContainer.appendChild(cell);
        }
    }
    
    // Meta
    const goalCell = getCell(state.level.goal.x, state.level.goal.y);
    if(goalCell) {
        const goalEl = document.createElement('div');
        goalEl.className = 'goal';
        goalEl.innerText = COMPONENTS.goal.icon;
        goalCell.appendChild(goalEl);
    }
    
    // Paredes
    if(state.level.walls) {
        state.level.walls.forEach(w => {
            const cell = getCell(w.x, w.y);
            if(cell) {
                const wallEl = document.createElement('div');
                wallEl.className = 'wall';
                wallEl.innerText = '🧱';
                cell.appendChild(wallEl);
            }
        });
    }
    
    // Jugador inicial
    let playerEl = document.createElement('div');
    playerEl.id = 'player';
    playerEl.className = 'player';
    playerEl.innerText = '🤖';
    els.gridContainer.appendChild(playerEl);
    updatePlayerPosition();
}

const COMPONENTS = {
    goal: ELEMENTS.find(e => e.id === 'goal')
};

function getCell(x, y) {
    if(x < 0 || x >= state.level.width || y < 0 || y >= state.level.height) return null;
    return els.gridContainer.children[y * state.level.width + x];
}

function updatePlayerPosition() {
    const playerEl = document.getElementById('player');
    if(!playerEl) return;
    playerEl.style.transform = `translate(${state.position.x * 100}%, ${state.position.y * 100}%)`;
}

// Lógica de Comandos
function addCommand(cmd) {
    if(state.playing) return;
    state.sequence.push(cmd);
    state.commandsUsed++;
    updateSequenceUI();
}

function undoCommand() {
    if(state.playing || state.sequence.length === 0) return;
    state.sequence.pop();
    state.commandsUsed--;
    updateSequenceUI();
}

function removeCommand(idx) {
    if(state.playing || els.btnRun.classList.contains('retry-mode')) return;
    state.sequence.splice(idx, 1);
    state.commandsUsed--;
    updateSequenceUI();
}

function updateSequenceUI() {
    els.sequenceContainer.innerHTML = '';
    els.commandsCount.innerText = state.commandsUsed;
    
    state.sequence.forEach((cmd, idx) => {
        const el = document.createElement('div');
        el.className = 'seq-item';
        el.innerText = cmd.icon;
        el.title = `${cmd.name} (Quitar)`;
        el.id = `seq-${idx}`;
        el.style.cursor = 'pointer';
        el.onclick = () => removeCommand(idx);
        els.sequenceContainer.appendChild(el);
    });
    
    // Scroll to bottom
    els.sequenceContainer.scrollTop = els.sequenceContainer.scrollHeight;
}

// Ejecución posfija
function evaluateSequence(commands) {
    let finalResult = [];
    let currentBlockResult = [];
    for(let cmd of commands) {
        if(cmd.id === 'enter') {
            finalResult = finalResult.concat(currentBlockResult);
            currentBlockResult = [];
        } else if(cmd.id === 'repeat') {
            // Duplica todo lo del bloque actual
            currentBlockResult = currentBlockResult.concat(currentBlockResult);
        } else {
            currentBlockResult.push(cmd);
        }
    }
    finalResult = finalResult.concat(currentBlockResult);
    return finalResult;
}

async function startRun() {
    if(state.sequence.length === 0) return;
    
    state.playing = true;
    els.btnRun.disabled = true;
    els.btnUndo.disabled = true;
    els.commandsBank.style.pointerEvents = 'none';
    
    // Guardar estado original por si reinicia
    let originalPosition = { ...state.position };
    
    const executionPlan = evaluateSequence(state.sequence);
    
    for(let i=0; i < executionPlan.length; i++) {
        await delay(300);
        
        if(!state.playing) break; // User hit reset
        
        const action = executionPlan[i];
        if(action.action) {
            state.position = action.action(state.position);
            
            const check = checkCollisions();
            
            if(check === 'lose_bounds' || check === 'lose_wall') {
                const playerEl = document.getElementById('player');
                if(playerEl) playerEl.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)'; // Slow motion
                updatePlayerPosition();
                
                await delay(1500); // Esperar a que vea la colisión dramática
                
                if(playerEl) playerEl.style.transition = ''; // Restaurar transition
                
                if(!state.playing) return; // Si el usuario reinició a mitad de la caída
                
                if(check === 'lose_bounds') {
                    gameOver(false, "Oh no! Te caíste del laberinto.");
                } else {
                    gameOver(false, "¡Ouch! Chocaste con un obstáculo.");
                }
                return;
            }
            
            updatePlayerPosition();
            
            if(!state.pathTaken.some(p => p.x === state.position.x && p.y === state.position.y)) {
                state.pathTaken.push({ ...state.position });
            }
            // Si check === 'win', continuamos la secuencia para que roce la meta exacto.
        }
    }
    
    // Si terminó la secuencia sin interrupciones fatales
    if(state.playing) {
        state.playing = false;
        
        const check = checkCollisions();
        if(check === 'win') {
            stopTimer();
            await delay(300);
            gameOver(true, "¡Excelente lógica!");
        } else {
            gameOver(false, "La secuencia terminó, pero no alcanzaste la meta.");
        }
    }
}

function checkCollisions() {
    const p = state.position;
    
    // Bounds check
    if(p.x < 0 || p.x >= state.level.width || p.y < 0 || p.y >= state.level.height) {
        return 'lose_bounds';
    }
    
    // Goal check
    if(p.x === state.level.goal.x && p.y === state.level.goal.y) {
        return 'win';
    }
    
    // Wall check
    if(state.level.walls && state.level.walls.some(w => w.x === p.x && w.y === p.y)) {
        return 'lose_wall';
    }
    
    return 'safe';
}

function resetLevel() {
    state.playing = false;
    state.levelNumber = 1;
    state.level = JSON.parse(JSON.stringify(LEVEL_1));
    els.levelDisplay.innerText = `Nivel ${state.levelNumber}`;
    resetState();
    loadRanking();
}

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

// Modal & Puntuaciones
function gameOver(isWin, msg) {
    state.playing = false;
    state.isGameOver = true;
    stopTimer();
    
    els.modal.classList.remove('hidden');
    els.modalTitle.innerText = isWin ? '¡Nivel Completado! 🌟' : '¡Derrota! 💀';
    els.modalTitle.style.color = isWin ? '#4ade80' : '#ef4444';
    els.modalMessage.innerText = msg;
    
    if(isWin) {
        els.modalScore.classList.remove('hidden');
        els.nameInputGroup.classList.remove('hidden');
        els.btnRetry.classList.add('hidden'); // Ocultar retry si ganó
        
        // Puntuación: base 1000 - (comandos * 50) + (tiempo restante * 10)
        // Menos comandos = Mayor puntuación
        // Menor comandos usados es recompensado altamente
        const score = Math.max(10, 1000 - (state.commandsUsed * 50) + (state.timer * 10));
        els.finalScore.innerText = score;
        els.finalScore.dataset.score = score;
    } else {
        els.modalScore.classList.add('hidden');
        els.nameInputGroup.classList.add('hidden');
        els.btnRetry.classList.remove('hidden'); // Mostrar retry si perdió
    }
}

function retryLevel() {
    els.modal.classList.add('hidden');
    els.btnRetry.classList.add('hidden');
    
    state.position = { ...state.level.playerStart };
    state.playing = false;
    state.isGameOver = false;
    state.timer = 60;
    state.pathTaken = [];
    
    stopTimer();
    els.timeCount.innerText = state.timer;
    
    els.btnRun.disabled = false;
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');
    
    els.btnUndo.disabled = false;
    els.commandsBank.style.pointerEvents = 'auto'; // Habilitar clics nativos
    
    renderGrid();
    startTimer();
}

function playAgain() {
    els.modal.classList.add('hidden');
    els.btnNextLevel.classList.add('hidden');
    resetState();
}

function saveScore() {
    const name = els.playerName.value.trim() || 'Anónimo';
    const score = parseInt(els.finalScore.dataset.score, 10);
    
    // Fallback al key original para el nivel 1, nuevo patrón para niveles superiores
    const rankingKey = state.levelNumber === 1 ? 'laberintoRanking' : `laberintoRanking_nivel_${state.levelNumber}`;
    
    let ranking = JSON.parse(localStorage.getItem(rankingKey) || '[]');
    const isTop1 = ranking.length === 0 || score >= ranking[0].score;
    
    ranking.push({ name, score, date: new Date().toISOString() });
    
    // Ordenar de mayor a menor y mantener top 10
    ranking.sort((a,b) => b.score - a.score);
    ranking = ranking.slice(0, 10);
    
    localStorage.setItem(rankingKey, JSON.stringify(ranking));
    
    els.nameInputGroup.classList.add('hidden');
    els.playerName.value = '';
    loadRanking();
    
    if(isTop1) {
        els.btnNextLevel.classList.remove('hidden');
    }
}

function loadRanking() {
    // Fallback al key original para el nivel 1
    const rankingKey = state.levelNumber === 1 ? 'laberintoRanking' : `laberintoRanking_nivel_${state.levelNumber}`;
    let ranking = JSON.parse(localStorage.getItem(rankingKey) || '[]');
    els.rankingList.innerHTML = '';
    
    if(ranking.length === 0) {
        els.rankingList.innerHTML = '<li><i>No hay récords aún</i></li>';
        return;
    }
    
    ranking.forEach((r, idx) => {
        const li = document.createElement('li');
        const pos = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx+1}.`;
        li.innerHTML = `<span>${pos} ${r.name}</span> <span style="color:var(--primary); font-weight:bold;">${r.score}</span>`;
        els.rankingList.appendChild(li);
    });
}

function nextLevel() {
    els.modal.classList.add('hidden');
    els.btnNextLevel.classList.add('hidden');
    
    state.levelNumber++;
    els.levelDisplay.innerText = `Nivel ${state.levelNumber}`;
    
    // Elegir obstáculo de la ruta tomada, excluyendo inicio y meta
    const validPath = state.pathTaken.filter(p => !(p.x === state.level.goal.x && p.y === state.level.goal.y) && !(p.x === state.level.playerStart.x && p.y === state.level.playerStart.y));
    
    if(validPath.length > 0) {
        const randomIndex = Math.floor(Math.random() * validPath.length);
        const obstacle = validPath[randomIndex];
        if(!state.level.walls.some(w => w.x === obstacle.x && w.y === obstacle.y)) {
            state.level.walls.push(obstacle);
        }
    }
    
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');
    resetState();
    loadRanking();
}

// Arrancar
init();
