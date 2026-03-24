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
import { connectTrailCells, markTrailCell, renderGrid, setTrailExit, setTrailState, updatePlayerPosition } from './ui/gridView.js';
import { renderRanking } from './ui/rankingView.js';
import { delay } from './utils/delay.js';
import { loadRanking, saveRanking } from './services/storageService.js';

let state;
let levelOrder = ['level-001'];
let tutorialFlagsByLevelId = new Map();
let tutorialOverlayVisible = false;
const els = getElements();
const PREVIEW_DELAY_VICTORY = 1400;
const PREVIEW_DELAY_DEFEAT = 1500;
const PREVIEW_DELAY_NO_GOAL = 1100;

async function init() {
    const levelIndex = await loadLevelIndex();
    levelOrder = levelIndex.levels.map((item) => item.id);

    tutorialFlagsByLevelId = new Map();
    for (const levelId of levelOrder) {
        try {
            const levelData = await loadLevelById(levelId);
            tutorialFlagsByLevelId.set(levelId, levelData.isTutorial === true);
        } catch {
            tutorialFlagsByLevelId.set(levelId, false);
        }
    }

    const levelData = await loadLevelById(levelOrder[0]);
    tutorialFlagsByLevelId.set(levelData.id, levelData.isTutorial === true);
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
    els.btnTutorialContinue.addEventListener('click', hideTutorialIntro);
}

function resetState() {
    resetRoundState(state);
    syncRankingVisibility();

    stopTimer();
    els.timeCount.innerText = String(state.timer);
    els.levelDisplay.innerText = `Nivel ${state.levelNumber}`;
    if (els.levelNameDisplay) {
        els.levelNameDisplay.innerText = state.level.name || 'Sin nombre';
    }

    els.btnRun.disabled = false;
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');

    els.btnUndo.disabled = false;
    els.commandsBank.style.pointerEvents = 'auto';
    renderCommandPalette(els.commandsBank, getAvailableCommands(), addCommand);

    const goal = getElementById('goal');
    renderGrid(els.gridContainer, state.level, goal ? goal.icon : '🏁');
    markTrailIfVisible(state.position);
    updatePlayerPosition(state.position);
    updateSequenceUI();
    startTimer();
    showTutorialIntroIfNeeded();
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

function markTrailIfVisible(position) {
    if (
        position.x < 0 ||
        position.x >= state.level.width ||
        position.y < 0 ||
        position.y >= state.level.height
    ) {
        return;
    }

    markTrailCell(els.gridContainer, state.level, position);
}

function markTrailStep(from, to) {
    markTrailIfVisible(from);
    markTrailIfVisible(to);
    connectTrailCells(els.gridContainer, state.level, from, to);
}

function isTutorialLevel() {
    return state.level.isTutorial === true;
}

function getCurrentLevelId() {
    return state.level.id || levelOrder[state.levelNumber - 1] || null;
}

function isTutorialMilestoneCompleted() {
    if (!isTutorialLevel()) {
        return false;
    }

    const currentId = getCurrentLevelId();
    const currentIdx = levelOrder.indexOf(currentId);
    if (currentIdx < 0) {
        return false;
    }

    let hasNonTutorialAfter = false;
    for (let i = currentIdx + 1; i < levelOrder.length; i++) {
        const nextId = levelOrder[i];
        const isTutorial = tutorialFlagsByLevelId.get(nextId);

        if (isTutorial === true) {
            return false;
        }

        if (isTutorial === false) {
            hasNonTutorialAfter = true;
        }
    }

    return hasNonTutorialAfter;
}

function findFirstNonTutorialLevelId() {
    for (const levelId of levelOrder) {
        if (tutorialFlagsByLevelId.get(levelId) === false) {
            return levelId;
        }
    }

    return null;
}

function resolveLevelNumber(levelId) {
    const indexInOrder = levelOrder.indexOf(levelId);
    if (indexInOrder >= 0) {
        return indexInOrder + 1;
    }

    const numericPart = Number.parseInt(String(levelId).replace('level-', ''), 10);
    return Number.isNaN(numericPart) ? state.levelNumber : numericPart;
}

function syncRankingVisibility() {
    if (!els.rankingSection) {
        return;
    }

    els.rankingSection.classList.toggle('hidden', isTutorialLevel());
}

function formatTutorialCommandLabel(commandText) {
    if (!commandText || typeof commandText !== 'string') {
        return 'Comando';
    }

    const segments = commandText
        .split(/[+,/]/)
        .map((segment) => segment.trim().toLowerCase())
        .filter(Boolean);

    if (segments.length === 0) {
        return commandText;
    }

    const mappedSegments = segments.map((segment) => {
        const command = getCommandById(segment);
        return command ? command.icon : segment;
    });

    return mappedSegments.join(' + ');
}

function showTutorialIntroIfNeeded() {
    if (!isTutorialLevel() || !state.level.tutorialIntro || !els.tutorialOverlay) {
        tutorialOverlayVisible = false;
        return;
    }

    const intro = state.level.tutorialIntro;
    tutorialOverlayVisible = true;
    els.tutorialTitle.innerText = intro.title || 'Tutorial';
    els.tutorialCommand.innerText = formatTutorialCommandLabel(intro.command || '');
    els.tutorialDescription.innerText = intro.description || 'Aprende el nuevo comando de este nivel.';
    els.tutorialObjective.innerText = intro.objective || 'Observa la consigna y luego intenta completar el nivel.';
    els.tutorialOverlay.classList.remove('hidden');
}

function hideTutorialIntro() {
    tutorialOverlayVisible = false;
    els.tutorialOverlay.classList.add('hidden');
}

function addCommand(commandId) {
    if (state.playing || tutorialOverlayVisible) {
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
    if (state.playing || tutorialOverlayVisible || state.sequence.length === 0) {
        return;
    }

    state.sequence.pop();
    state.commandsUsed = state.sequence.length;
    updateSequenceUI();
}

function removeCommand(index) {
    if (state.playing || tutorialOverlayVisible || els.btnRun.classList.contains('retry-mode')) {
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
    if (tutorialOverlayVisible || state.sequence.length === 0) {
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

        const previousPosition = { ...state.position };
        state.position = command.action(state.position);
        const check = checkCollisions(state.position, state.level);

        if (check === 'lose_bounds' || check === 'lose_wall') {
            const playerEl = document.getElementById('player');
            if (playerEl) {
                playerEl.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
            }

            markTrailStep(previousPosition, state.position);
            if (check === 'lose_bounds') {
                setTrailExit(els.gridContainer, state.level, previousPosition, state.position);
            }
            updatePlayerPosition(state.position);
            await delay(1500);

            if (playerEl) {
                playerEl.style.transition = '';
            }

            if (!state.playing) {
                return;
            }

            setTrailState(els.gridContainer, 'failure');
            await delay(PREVIEW_DELAY_DEFEAT);
            gameOver(false, check === 'lose_bounds' ? 'Oh no! Te caíste del laberinto.' : '¡Ouch! Chocaste con un obstáculo.');
            return;
        }

        updatePlayerPosition(state.position);
        markTrailStep(previousPosition, state.position);

        if (!state.pathTaken.some((point) => point.x === state.position.x && point.y === state.position.y)) {
            state.pathTaken.push({ ...state.position });
        }
    }

    if (state.playing) {
        state.playing = false;
        const check = checkCollisions(state.position, state.level);

        if (check === 'win') {
            stopTimer();
            setTrailState(els.gridContainer, 'success');
            await delay(PREVIEW_DELAY_VICTORY);
            gameOver(true, '¡Excelente lógica!');
            return;
        }

        setTrailState(els.gridContainer, 'failure');
        await delay(PREVIEW_DELAY_NO_GOAL);
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
    setTrailState(els.gridContainer, isWin ? 'success' : 'failure');
    syncRankingVisibility();

    els.modal.classList.remove('hidden');
    els.btnNextLevel.classList.add('hidden');
    els.modalTitle.innerText = isWin ? '¡Nivel Completado! 🌟' : '¡Derrota! 💀';
    els.modalTitle.style.color = isWin ? '#4ade80' : '#ef4444';
    els.modalMessage.innerText = message;

    if (isWin) {
        if (isTutorialLevel()) {
            if (isTutorialMilestoneCompleted()) {
                els.modalTitle.innerText = '¡Tutoriales Completados! 🎉';
                els.modalMessage.innerText = 'Felicitaciones completaste los tutoriales. Ahora juguemos por puntos.';
            } else {
                els.modalTitle.innerText = '¡Tutorial Completado! 🌟';
                els.modalMessage.innerText = '¡Excelente! Completaste el tutorial. Continúa al siguiente nivel.';
            }
            els.modalScore.classList.add('hidden');
            els.nameInputGroup.classList.add('hidden');
            els.btnRetry.classList.add('hidden');
            els.btnNextLevel.classList.remove('hidden');
            return;
        }

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
    if (isTutorialLevel()) {
        return;
    }

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
    if (isTutorialLevel()) {
        els.rankingList.innerHTML = '<li><i>El ranking se habilita desde los niveles no tutoriales.</i></li>';
        return;
    }

    const ranking = loadRanking(state.levelNumber);
    renderRanking(els.rankingList, ranking);
}

async function nextLevel() {
    els.modal.classList.add('hidden');
    els.btnNextLevel.classList.add('hidden');

    if (isTutorialMilestoneCompleted()) {
        const pointsLevelId = findFirstNonTutorialLevelId();

        if (!pointsLevelId) {
            return;
        }

        let pointsLevelData = await loadLevelById(pointsLevelId);

        tutorialFlagsByLevelId.set(pointsLevelId, pointsLevelData.isTutorial === true);

        if (!levelOrder.includes(pointsLevelId)) {
            levelOrder.push(pointsLevelId);
        }

        if (pointsLevelData.isTutorial === false) {
            setLevel(state, pointsLevelData, resolveLevelNumber(pointsLevelId));
            resetState();
            loadAndRenderRanking();
            return;
        }
    }

    const nextLevelNumber = state.levelNumber >= levelOrder.length ? 1 : state.levelNumber + 1;
    const nextLevelId = levelOrder[nextLevelNumber - 1];
    const levelData = await loadLevelById(nextLevelId);

    tutorialFlagsByLevelId.set(nextLevelId, levelData.isTutorial === true);

    setLevel(state, levelData, nextLevelNumber);
    resetState();
    loadAndRenderRanking();
}

init();
