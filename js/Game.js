/**
 * Game.js - Orquestador principal del juego.
 * Coordina todos los módulos: estado, sistemas, UI.
 * Contiene la lógica de flujo del juego (ejecutar, reiniciar, reintentar, etc.)
 */
import { gameState } from './core/GameState.js';
import { getDOMRefs } from './ui/DOMRefs.js';
import { commandRegistry } from './commands/CommandRegistry.js';
import { evaluateSequence } from './commands/CommandEvaluator.js';
import { levelRegistry } from './levels/LevelRegistry.js';
import { checkCollisions } from './systems/CollisionSystem.js';
import { calculateScore } from './systems/ScoreSystem.js';
import { timerSystem } from './systems/TimerSystem.js';
import { rankingSystem } from './systems/RankingSystem.js';
import { gridRenderer } from './ui/GridRenderer.js';
import { commandPanelUI } from './ui/CommandPanelUI.js';
import { modalUI } from './ui/ModalUI.js';
import { hudUI } from './ui/HudUI.js';

function delay(ms) {
    return new Promise(res => setTimeout(res, ms));
}

function startTimer() {
    timerSystem.start(
        (time) => hudUI.updateTimer(time),
        () => gameOver(false, "¡Se acabó el tiempo!")
    );
}

function loadRanking() {
    const els = getDOMRefs();
    const ranking = rankingSystem.load(gameState.levelNumber);
    els.rankingList.innerHTML = '';

    if (ranking.length === 0) {
        els.rankingList.innerHTML = '<li><i>No hay récords aún</i></li>';
        return;
    }

    ranking.forEach((r, idx) => {
        const li = document.createElement('li');
        const pos = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
        li.innerHTML = `<span>${pos} ${r.name}</span> <span style="color:var(--primary); font-weight:bold;">${r.score}</span>`;
        els.rankingList.appendChild(li);
    });
}

function resetState() {
    const els = getDOMRefs();

    gameState.sequence = [];
    gameState.position = { ...gameState.level.playerStart };
    gameState.playing = false;
    gameState.isGameOver = false;
    gameState.timer = 60;
    gameState.commandsUsed = 0;
    gameState.pathTaken = [];

    timerSystem.stop();
    hudUI.updateTimer(gameState.timer);

    // Restaurar botón Play
    els.btnRun.disabled = false;
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');

    els.btnUndo.disabled = false;
    els.commandsBank.style.pointerEvents = 'auto';

    gridRenderer.render(gameState.level);
    commandPanelUI.updateSequenceUI();
    startTimer();
}

function gameOver(isWin, msg) {
    gameState.playing = false;
    gameState.isGameOver = true;
    timerSystem.stop();

    if (isWin) {
        const score = calculateScore(gameState.commandsUsed, gameState.timer);
        modalUI.showWin(msg, score);
    } else {
        modalUI.showLose(msg);
    }
}

async function startRun() {
    const els = getDOMRefs();
    if (gameState.sequence.length === 0) return;

    gameState.playing = true;
    els.btnRun.disabled = true;
    els.btnUndo.disabled = true;
    els.commandsBank.style.pointerEvents = 'none';

    const executionPlan = evaluateSequence(gameState.sequence);

    for (let i = 0; i < executionPlan.length; i++) {
        await delay(300);

        if (!gameState.playing) break;

        const action = executionPlan[i];
        if (action.action) {
            gameState.position = action.action(gameState.position);

            const check = checkCollisions(gameState.position, gameState.level);

            if (check === 'lose_bounds' || check === 'lose_wall') {
                const playerEl = document.getElementById('player');
                if (playerEl) playerEl.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
                gridRenderer.updatePlayerPosition();

                await delay(1500);

                if (playerEl) playerEl.style.transition = '';

                if (!gameState.playing) return;

                if (check === 'lose_bounds') {
                    gameOver(false, "Oh no! Te caíste del laberinto.");
                } else {
                    gameOver(false, "¡Ouch! Chocaste con un obstáculo.");
                }
                return;
            }

            gridRenderer.updatePlayerPosition();

            if (!gameState.pathTaken.some(p => p.x === gameState.position.x && p.y === gameState.position.y)) {
                gameState.pathTaken.push({ ...gameState.position });
            }
        }
    }

    // Secuencia terminó sin interrupciones fatales
    if (gameState.playing) {
        gameState.playing = false;

        const check = checkCollisions(gameState.position, gameState.level);
        if (check === 'win') {
            timerSystem.stop();
            await delay(300);
            gameOver(true, "¡Excelente lógica!");
        } else {
            gameOver(false, "La secuencia terminó, pero no alcanzaste la meta.");
        }
    }
}

function resetLevel() {
    gameState.playing = false;
    gameState.levelNumber = 1;

    const baseLevel = levelRegistry.getLevel(0);
    gameState.level = baseLevel.clone();

    hudUI.updateLevel(gameState.levelNumber);
    resetState();
    loadRanking();
}

function retryLevel() {
    const els = getDOMRefs();
    modalUI.hide();

    gameState.position = { ...gameState.level.playerStart };
    gameState.playing = false;
    gameState.isGameOver = false;
    gameState.timer = 60;
    gameState.pathTaken = [];

    timerSystem.stop();
    hudUI.updateTimer(gameState.timer);

    els.btnRun.disabled = false;
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');

    els.btnUndo.disabled = false;
    els.commandsBank.style.pointerEvents = 'auto';

    gridRenderer.render(gameState.level);
    startTimer();
}

function playAgain() {
    modalUI.hide();
    modalUI.hideNextLevel();
    resetState();
}

function saveScore() {
    const els = getDOMRefs();
    const name = els.playerName.value.trim() || 'Anónimo';
    const score = parseInt(els.finalScore.dataset.score, 10);

    const isTop1 = rankingSystem.save(gameState.levelNumber, name, score);

    modalUI.hideNameInput();
    loadRanking();

    if (isTop1) {
        modalUI.showNextLevel();
    }
}

function nextLevel() {
    const els = getDOMRefs();

    modalUI.hide();
    modalUI.hideNextLevel();

    gameState.levelNumber++;
    hudUI.updateLevel(gameState.levelNumber);

    // Añadir obstáculo basado en la ruta tomada
    const validPath = gameState.pathTaken.filter(p =>
        !(p.x === gameState.level.goal.x && p.y === gameState.level.goal.y) &&
        !(p.x === gameState.level.playerStart.x && p.y === gameState.level.playerStart.y)
    );

    if (validPath.length > 0) {
        const randomIndex = Math.floor(Math.random() * validPath.length);
        const obstacle = validPath[randomIndex];
        gameState.level.addObstacle(obstacle);
    }

    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');
    resetState();
    loadRanking();
}

/** Inicialización del juego */
export function init() {
    const els = getDOMRefs();

    // Establecer nivel inicial
    const baseLevel = levelRegistry.getLevel(0);
    gameState.level = baseLevel.clone();

    // Renderizar comandos del registro
    commandPanelUI.renderCommands(commandRegistry.getAll());
    resetState();
    loadRanking();

    // Event listeners
    els.btnUndo.addEventListener('click', () => commandPanelUI.undoCommand());
    els.btnRun.addEventListener('click', startRun);
    els.btnReset.addEventListener('click', resetLevel);
    els.btnPlayAgain.addEventListener('click', playAgain);
    els.btnNextLevel.addEventListener('click', nextLevel);
    els.btnRetry.addEventListener('click', retryLevel);
    els.btnSaveScore.addEventListener('click', saveScore);

    window.addEventListener('resize', () => gridRenderer.updatePlayerPosition());
}
