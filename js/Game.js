/**
 * Game.js - Orquestador principal del juego.
 * Coordina todos los módulos: estado, sistemas, UI.
 * Contiene la lógica de flujo del juego (ejecutar, reiniciar, reintentar, etc.)
 * 
 * Integra: Sistema de Lore, Tutorial, Persistencia de progreso
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

// Sistemas educativos
import LoreSystem from './lore/LoreSystem.js';
import TutorialSystem from './tutorials/TutorialSystem.js';
import StorageSystem from './systems/StorageSystem.js';
import { getLevelMetadata, getAllLevelIds } from './config/levelMetadata.js';

// Instancias globales de sistemas educativos
let loreSystem = null;
let tutorialSystem = null;

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
    const metadata = getLevelMetadata(gameState.currentLevelId);
    const initialSequence = Array.isArray(metadata?.initialSequence)
        ? metadata.initialSequence
            .map((cmdId) => commandRegistry.getById(cmdId))
            .filter(Boolean)
        : [];

    gameState.sequence = initialSequence;
    gameState.position = { ...gameState.level.playerStart };
    gameState.playing = false;
    gameState.isGameOver = false;
    gameState.timer = gameState.level?.timeLimit || 60;
    gameState.commandsUsed = gameState.sequence.length;
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
    setLevelById('level-001');
    renderCommandsForCurrentLevel();
    resetState();
    loadRanking();
    showTutorialIfNeeded();
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

    const nextLevelId = getNextLevelId(gameState.currentLevelId);
    if (!nextLevelId) {
        resetState();
        loadRanking();
        return;
    }

    StorageSystem.saveLastCompletedLevel(gameState.currentLevelId);
    setLevelById(nextLevelId);
    renderCommandsForCurrentLevel();

    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');
    resetState();
    loadRanking();
    showTutorialIfNeeded();
}

/** Inicialización del juego */
export async function init() {
    const els = getDOMRefs();

    // Inicializar sistemas educativos
    loreSystem = new LoreSystem(els);
    tutorialSystem = new TutorialSystem(els);

    // Determinar nivel inicial
    let firstLevelId = 'level-001';
    let startFromBeginning = true;

    // Intentar retomar progreso guardado
    try {
        const lastCompletedLevel = await StorageSystem.getLastCompletedLevel();
        if (lastCompletedLevel) {
            // Obtener siguiente nivel después del completado
            const nextLevel = levelRegistry.getNextLevel(lastCompletedLevel);
            if (nextLevel) {
                firstLevelId = getNextLevelId(lastCompletedLevel);
                startFromBeginning = false;
            }
        }
    } catch (e) {
        console.warn('Error reading progress:', e);
    }

    // Cargar nivel inicial por ID
    setLevelById(firstLevelId);

    // Renderizar comandos permitidos para el nivel actual
    renderCommandsForCurrentLevel();
    resetState();
    loadRanking();

    // Mostrar Lore si es primera vez
    if (startFromBeginning) {
        const loreInit = await loreSystem.initialize();
        if (loreInit.shouldShow) {
            loreSystem.show();
            
            // Configurar botones de lore
            if (els.btnLoreNext) {
                els.btnLoreNext.addEventListener('click', () => {
                    if (loreSystem.currentStep < loreSystem.maxSteps - 1) {
                        loreSystem.nextStep();
                    } else {
                        loreSystem.complete();
                        showTutorialIfNeeded();
                    }
                });
            }
        } else {
            showTutorialIfNeeded();
        }
    } else {
        showTutorialIfNeeded();
    }

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

/**
 * Mostrar tutorial si el nivel actual es un tutorial
 */
function showTutorialIfNeeded() {
    if (tutorialSystem && gameState.level) {
        const levelId = getCurrentLevelId();
        const metadata = getLevelMetadata(levelId);
        
        if (metadata && metadata.isTutorial && !tutorialSystem.hasBeenSeen(levelId)) {
            if (tutorialSystem.show(metadata)) {
                tutorialSystem.markAsSeen(levelId);
                const els = getDOMRefs();
                if (els.btnTutorialContinue) {
                    els.btnTutorialContinue.addEventListener('click', () => {
                        tutorialSystem.hide();
                    });
                }
            }
        }
    }
}

/**
 * Obtener ID del nivel actual
 */
function getCurrentLevelId() {
    return gameState.currentLevelId || 'level-001';
}

/**
 * Obtener ID del siguiente nivel
 */
function getNextLevelId(currentLevelId) {
    const allIds = getAllLevelIds();
    const currentIndex = allIds.indexOf(currentLevelId);
    if (currentIndex >= 0 && currentIndex < allIds.length - 1) {
        return allIds[currentIndex + 1];
    }
    return null;
}

/**
 * Cargar nivel por ID y sincronizar estado global
 */
function setLevelById(levelId) {
    const level = levelRegistry.getLevelById(levelId);
    if (!level) {
        return false;
    }

    gameState.currentLevelId = levelId;
    gameState.level = level.clone();

    const allIds = getAllLevelIds();
    const idx = allIds.indexOf(levelId);
    gameState.levelNumber = idx >= 0 ? idx + 1 : 1;
    hudUI.updateLevel(gameState.levelNumber);

    gameState.sequence = [];

    return true;
}

/**
 * Renderizar solo comandos permitidos para el nivel actual.
 */
function renderCommandsForCurrentLevel() {
    const metadata = getLevelMetadata(gameState.currentLevelId);
    const allCommands = commandRegistry.getAll();

    if (!metadata?.allowedCommands?.length) {
        commandPanelUI.renderCommands(allCommands);
        return;
    }

    const allowed = allCommands.filter((cmd) => metadata.allowedCommands.includes(cmd.id));
    commandPanelUI.renderCommands(allowed);
}
