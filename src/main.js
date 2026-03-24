import { createInitialState, resetRoundState, setLevel } from './core/gameState.js';
import { evaluateSequence } from './core/commandEvaluator.js';
import { checkCollisions } from './core/collisionSystem.js';
import { calculateScore } from './core/scoringSystem.js';
import { getCommands, getCommandById, getExecutableCommandById } from './content/commands/commandRegistry.js';
import { getElementById } from './content/elements/elementRegistry.js';
import { loadLevelById, loadLevelIndex } from './content/levels/levelLoader.js';
import { getElements } from './ui/domRefs.js';
import { renderCommandPalette } from './ui/commandPalette.js';
import { renderSequence } from './ui/sequenceView.js';
import { renderGrid, updatePlayerPosition } from './ui/gridView.js';
import { renderRanking } from './ui/rankingView.js';
import { delay } from './utils/delay.js';
import { loadRanking, saveRanking } from './services/storageService.js';

let state;
let levelOrder = ['level-001'];
const els = getElements();

async function init() {
    const levelIndex = await loadLevelIndex();
    levelOrder = levelIndex.levels.map((item) => item.id);

    const levelData = await loadLevelById(levelOrder[0]);
    state = createInitialState(levelData);

    bindEvents();
    resetState();
    loadAndRenderRanking();

    window.addEventListener('resize', () => updatePlayerPosition(state.position));
}

function bindEvents() {
    els.btnUndo.addEventListener('click', undoCommand);
    els.btnRun.addEventListener('click', startRun);
    els.btnReset.addEventListener('click', resetLevel);
    els.btnPlayAgain.addEventListener('click', playAgain);
    els.btnNextLevel.addEventListener('click', nextLevel);
    els.btnRetry.addEventListener('click', retryLevel);
    els.btnSaveScore.addEventListener('click', saveScoreHandler);
}

function resetState() {
    resetRoundState(state);

    stopTimer();
    els.timeCount.innerText = String(state.timer);
    els.levelDisplay.innerText = `Nivel ${state.levelNumber}`;

    els.btnRun.disabled = false;
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');

    els.btnUndo.disabled = false;
    els.commandsBank.style.pointerEvents = 'auto';
    renderCommandPalette(els.commandsBank, getAvailableCommands(), addCommand);

    const goal = getElementById('goal');
    renderGrid(els.gridContainer, state.level, goal ? goal.icon : '🏁');
    updatePlayerPosition(state.position);
    updateSequenceUI();
    startTimer();
}

function getAvailableCommands() {
    if (!Array.isArray(state.level.allowedCommands) || state.level.allowedCommands.length === 0) {
        return getCommands();
    }

    return getCommands().filter((command) => state.level.allowedCommands.includes(command.id));
}

function startTimer() {
    stopTimer();
    state.intervalId = setInterval(() => {
        if (!state.playing && !state.isGameOver) {
            state.timer--;
            els.timeCount.innerText = String(state.timer);
            if (state.timer <= 0) {
                stopTimer();
                gameOver(false, '¡Se acabó el tiempo!');
            }
        }
    }, 1000);
}

function stopTimer() {
    if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = null;
    }
}

function addCommand(commandId) {
    if (state.playing) {
        return;
    }

    if (!getAvailableCommands().some((command) => command.id === commandId)) {
        return;
    }

    state.sequence.push(commandId);
    state.commandsUsed = state.sequence.length;
    updateSequenceUI();
}

function undoCommand() {
    if (state.playing || state.sequence.length === 0) {
        return;
    }

    state.sequence.pop();
    state.commandsUsed = state.sequence.length;
    updateSequenceUI();
}

function removeCommand(index) {
    if (state.playing || els.btnRun.classList.contains('retry-mode')) {
        return;
    }

    state.sequence.splice(index, 1);
    state.commandsUsed = state.sequence.length;
    updateSequenceUI();
}

function updateSequenceUI() {
    renderSequence(els.sequenceContainer, els.commandsCount, state.sequence, getCommandById, removeCommand);
}

async function startRun() {
    if (state.sequence.length === 0) {
        return;
    }

    state.playing = true;
    els.btnRun.disabled = true;
    els.btnUndo.disabled = true;
    els.commandsBank.style.pointerEvents = 'none';

    const executionPlan = evaluateSequence(state.sequence);

    for (let i = 0; i < executionPlan.length; i++) {
        await delay(300);

        if (!state.playing) {
            break;
        }

        const command = getExecutableCommandById(executionPlan[i]);
        if (!command) {
            continue;
        }

        state.position = command.action(state.position);
        const check = checkCollisions(state.position, state.level);

        if (check === 'lose_bounds' || check === 'lose_wall') {
            const playerEl = document.getElementById('player');
            if (playerEl) {
                playerEl.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
            }

            updatePlayerPosition(state.position);
            await delay(1500);

            if (playerEl) {
                playerEl.style.transition = '';
            }

            if (!state.playing) {
                return;
            }

            gameOver(false, check === 'lose_bounds' ? 'Oh no! Te caíste del laberinto.' : '¡Ouch! Chocaste con un obstáculo.');
            return;
        }

        updatePlayerPosition(state.position);

        if (!state.pathTaken.some((point) => point.x === state.position.x && point.y === state.position.y)) {
            state.pathTaken.push({ ...state.position });
        }
    }

    if (state.playing) {
        state.playing = false;
        const check = checkCollisions(state.position, state.level);

        if (check === 'win') {
            stopTimer();
            await delay(300);
            gameOver(true, '¡Excelente lógica!');
            return;
        }

        gameOver(false, 'La secuencia terminó, pero no alcanzaste la meta.');
    }
}

async function resetLevel() {
    state.playing = false;

    const levelData = await loadLevelById(levelOrder[0]);
    setLevel(state, levelData, 1);

    resetState();
    loadAndRenderRanking();
}

function gameOver(isWin, message) {
    state.playing = false;
    state.isGameOver = true;
    stopTimer();

    els.modal.classList.remove('hidden');
    els.modalTitle.innerText = isWin ? '¡Nivel Completado! 🌟' : '¡Derrota! 💀';
    els.modalTitle.style.color = isWin ? '#4ade80' : '#ef4444';
    els.modalMessage.innerText = message;

    if (isWin) {
        const score = calculateScore(state.commandsUsed, state.timer);
        els.modalScore.classList.remove('hidden');
        els.nameInputGroup.classList.remove('hidden');
        els.btnRetry.classList.add('hidden');
        els.finalScore.innerText = String(score);
        els.finalScore.dataset.score = String(score);
    } else {
        els.modalScore.classList.add('hidden');
        els.nameInputGroup.classList.add('hidden');
        els.btnRetry.classList.remove('hidden');
    }
}

function retryLevel() {
    els.modal.classList.add('hidden');
    els.btnRetry.classList.add('hidden');

    state.position = { ...state.level.playerStart };
    state.playing = false;
    state.isGameOver = false;
    state.timer = state.level.rules.timeLimit || 60;
    state.pathTaken = [];

    stopTimer();
    els.timeCount.innerText = String(state.timer);

    els.btnRun.disabled = false;
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');

    els.btnUndo.disabled = false;
    els.commandsBank.style.pointerEvents = 'auto';

    const goal = getElementById('goal');
    renderGrid(els.gridContainer, state.level, goal ? goal.icon : '🏁');
    updatePlayerPosition(state.position);
    startTimer();
}

function playAgain() {
    els.modal.classList.add('hidden');
    els.btnNextLevel.classList.add('hidden');
    resetState();
}

function saveScoreHandler() {
    const name = els.playerName.value.trim() || 'Anónimo';
    const score = Number.parseInt(els.finalScore.dataset.score || '0', 10);
    const ranking = loadRanking(state.levelNumber);
    const isTop1 = ranking.length === 0 || score >= ranking[0].score;

    ranking.push({ name, score, date: new Date().toISOString() });
    ranking.sort((a, b) => b.score - a.score);

    saveRanking(state.levelNumber, ranking.slice(0, 10));

    els.nameInputGroup.classList.add('hidden');
    els.playerName.value = '';

    loadAndRenderRanking();

    if (isTop1) {
        els.btnNextLevel.classList.remove('hidden');
    }
}

function loadAndRenderRanking() {
    const ranking = loadRanking(state.levelNumber);
    renderRanking(els.rankingList, ranking);
}

async function nextLevel() {
    els.modal.classList.add('hidden');
    els.btnNextLevel.classList.add('hidden');

    const nextLevelNumber = state.levelNumber >= levelOrder.length ? 1 : state.levelNumber + 1;
    const nextLevelId = levelOrder[nextLevelNumber - 1];
    const levelData = await loadLevelById(nextLevelId);

    setLevel(state, levelData, nextLevelNumber);
    resetState();
    loadAndRenderRanking();
}

init();
