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
import { getAllLevelIds } from './config/levelMetadata.js';

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
    const initialSequence = Array.isArray(gameState.level?.initialSequence)
        ? gameState.level.initialSequence
            .map((cmdId) => commandRegistry.getById(cmdId))
            .filter(Boolean)
        : [];

    gameState.sequence = initialSequence;
    gameState.position = { ...gameState.level.playerStart };
    gameState.playing = false;
    gameState.isGameOver = false;
    gameState.timer = gameState.level?.timeLimit || 60;
    gameState.commandsUsed = gameState.sequence.length;

    timerSystem.stop();
    hudUI.updateTimer(gameState.timer);

    // Restaurar botón Play
    els.btnRun.disabled = false;
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');
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
        
        // Mostrar botón "Siguiente nivel" si hay nivel siguiente
        const nextLevelId = getNextLevelId(gameState.currentLevelId);
        if (nextLevelId) {
            modalUI.showNextLevel();
        }
    } else {
        const isNonCriticalFailure =
            msg.includes('no alcanzaste') ||
            msg.includes('caíste') ||
            msg.includes('Chocaste');

        if (isNonCriticalFailure) {
            const els = getDOMRefs();
            if (!gameState.failureMarkerPosition) {
                gameState.failureMarkerPosition = { ...gameState.position };
            }
            gridRenderer.setTrailState('failure');

            // En caída al vacío, recuperar inmediatamente tras desaparecer.
            const recoveryDelayMs = msg.includes('caíste') ? 0 : 2000;

            // Vista previa breve y regreso al tablero con la X de fallo.
            setTimeout(() => {
                gridRenderer.clearTrailState();
                gameState.position = { ...gameState.level.playerStart };
                gridRenderer.updatePlayerPosition();
                markFailurePosition(gameState.failureMarkerPosition);
                enableGamePanel();
                els.modal.classList.add('hidden');
            }, recoveryDelayMs);
            return;
        }

        modalUI.showLose(msg);
    }
}

async function startRun() {
    const els = getDOMRefs();
    if (gameState.sequence.length === 0) return;

    clearFailureMarker();
    gridRenderer.clearTrailState();

    gameState.playing = true;
    els.btnRun.disabled = true;
    els.commandsBank.style.pointerEvents = 'none';

    const executionPlan = evaluateSequence(gameState.sequence);

    for (let i = 0; i < executionPlan.length; i++) {
        await delay(300);

        if (!gameState.playing) break;

        const action = executionPlan[i];
        if (action.action) {
            const previousPosition = { ...gameState.position };
            gameState.position = action.action(gameState.position);

            const check = checkCollisions(gameState.position, gameState.level);

            if (check === 'lose_bounds' || check === 'lose_wall') {
                const playerEl = document.getElementById('player');
                if (playerEl) playerEl.style.transition = 'transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
                gridRenderer.updatePlayerPosition();

                await delay(1500);

                // En caída fuera del laberinto, simular profundidad con zoom out.
                if (check === 'lose_bounds' && playerEl) {
                    playerEl.classList.add('fall-void');
                    await delay(650);
                    playerEl.classList.remove('fall-void');
                }

                if (playerEl) playerEl.style.transition = '';

                if (!gameState.playing) return;

                if (check === 'lose_bounds') {
                    // La posición fuera de grilla no tiene celda; marcamos la última válida.
                    gameState.failureMarkerPosition = { ...previousPosition };
                    gameOver(false, "Oh no! Te caíste del laberinto.");
                } else {
                    gameOver(false, "¡Ouch! Chocaste con un obstáculo.");
                }
                return;
            }

            gridRenderer.updatePlayerPosition();
            // Dibujar trail después del movimiento para sincronización visual
            gridRenderer.markTrailStep(previousPosition, gameState.position);
        }
    }

    // Secuencia terminó sin interrupciones fatales
    if (gameState.playing) {
        gameState.playing = false;

        const check = checkCollisions(gameState.position, gameState.level);
        if (check === 'win') {
            timerSystem.stop();
            gridRenderer.setTrailState('success');
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

    // Limpiar marcador de fallo y trail visuals
    clearFailureMarker();
    gridRenderer.clearTrailState();

    gameState.position = { ...gameState.level.playerStart };
    gameState.playing = false;
    gameState.isGameOver = false;
    gameState.timer = gameState.level?.timeLimit || 60;

    timerSystem.stop();
    hudUI.updateTimer(gameState.timer);

    els.btnRun.disabled = false;
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');
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

/**
 * Marcar posición de fallo con X emoji
 */
function markFailurePosition(position) {
    if (!position) return;
    
    const cell = gridRenderer.getCell(position.x, position.y);
    if (!cell) return;
    
    const marker = document.createElement('div');
    marker.className = 'failure-marker';
    marker.id = `failure-marker-${position.x}-${position.y}`;
    marker.innerText = '❌';
    marker.style.position = 'absolute';
    marker.style.top = '0';
    marker.style.left = '0';
    marker.style.right = '0';
    marker.style.bottom = '0';
    marker.style.display = 'flex';
    marker.style.alignItems = 'center';
    marker.style.justifyContent = 'center';
    marker.style.fontSize = '1.5rem';
    marker.style.zIndex = '3';
    
    cell.appendChild(marker);
}

/**
 * Limpiar marcador de fallo
 */
function clearFailureMarker() {
    if (!gameState.failureMarkerPosition) return;
    
    const markerId = `failure-marker-${gameState.failureMarkerPosition.x}-${gameState.failureMarkerPosition.y}`;
    const marker = document.getElementById(markerId);
    if (marker) {
        marker.remove();
    }
    gameState.failureMarkerPosition = null;
}

/**
 * Habilitar el panel de juego tras una derrota no crítica.
 */
function enableGamePanel() {
    const els = getDOMRefs();
    gameState.isGameOver = false;
    els.btnRun.disabled = false;
    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');
    els.commandsBank.style.pointerEvents = 'auto';
    startTimer();
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
    commandPanelUI.bindEditorControls();
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
    els.btnRun.addEventListener('click', startRun);
    els.btnReset.addEventListener('click', resetLevel);
    els.btnPlayAgain.addEventListener('click', playAgain);
    els.btnNextLevel.addEventListener('click', nextLevel);
    els.btnRetry.addEventListener('click', retryLevel);
    els.btnSaveScore.addEventListener('click', saveScore);
    els.btnTutorialContinue.addEventListener('click', () => {
        tutorialSystem.nextPage();
    });

    window.addEventListener('resize', () => gridRenderer.updatePlayerPosition());
}

/**
 * Mostrar tutorial si el nivel actual es un tutorial
 */
function showTutorialIfNeeded() {
    if (tutorialSystem && gameState.level) {
        const levelId = getCurrentLevelId();

        if (!tutorialSystem.hasBeenSeen(levelId) && tutorialSystem.show(gameState.level)) {
            tutorialSystem.markAsSeen(levelId);
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
    gameState.commandLimits = buildEffectiveCommandLimits(gameState.level);

    const allIds = getAllLevelIds();
    const idx = allIds.indexOf(levelId);
    gameState.levelNumber = idx >= 0 ? idx + 1 : 1;
    hudUI.updateLevel(gameState.levelNumber);

    gameState.sequence = [];

    return true;
}

function buildEffectiveCommandLimits(level) {
    const limits = {};
    const allowed = Array.isArray(level?.allowedCommands) ? level.allowedCommands : [];
    const defaultLimit = Number.isFinite(level?.defaultCommandLimit)
        ? level.defaultCommandLimit
        : Infinity;

    allowed.forEach((commandId) => {
        const override = level?.commandLimits?.[commandId];
        limits[commandId] = Number.isFinite(override) ? override : defaultLimit;
    });

    return limits;
}

/**
 * Renderizar solo comandos permitidos para el nivel actual.
 */
function renderCommandsForCurrentLevel() {
    const allCommands = commandRegistry.getAll();
    const allowedCommands = gameState.level?.allowedCommands || [];

    if (!allowedCommands.length) {
        commandPanelUI.renderCommands(allCommands);
        return;
    }

    const allowed = allCommands.filter((cmd) => allowedCommands.includes(cmd.id));
    commandPanelUI.renderCommands(allowed);
}
