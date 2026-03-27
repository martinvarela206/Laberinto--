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
import { timerSystem } from './systems/TimerSystem.js';
import { animationSystem } from './systems/AnimationSystem.js';
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
    animationSystem.clearInfiniteAnimations();

    if (isWin) {
        modalUI.showWin(msg);
        
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
    animationSystem.clearInfiniteAnimations();

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
            const targetPosition = action.action(gameState.position);
            const check = checkCollisions(targetPosition, gameState.level);
            const destiny = mapCollisionToDestiny(check);

            let movementApplied = false;
            const applyMovement = () => {
                if (movementApplied) return;
                gameState.position = targetPosition;
                gridRenderer.updatePlayerPosition();
                gridRenderer.markTrailStep(previousPosition, targetPosition);
                movementApplied = true;
            };

            const states = typeof action.getExecutionStates === 'function'
                ? action.getExecutionStates({
                    from: previousPosition,
                    to: targetPosition,
                    destiny,
                    collision: check
                })
                : {
                    preState: { animations: [] },
                    inState: { animations: [['move', 0.25, 1]] },
                    postState: { animations: [] }
                };

            await animationSystem.runCommandStates({
                states,
                executeMovement: applyMovement,
                canContinue: () => gameState.playing
            });

            if (!movementApplied) {
                applyMovement();
            }

            if (!gameState.playing) return;

            if (check === 'lose_bounds' || check === 'lose_wall') {
                if (check === 'lose_bounds') {
                    // Para outOfBounds, la X debe mostrarse en la casilla de borde virtual.
                    gameState.failureMarkerPosition = { ...targetPosition };
                    gameOver(false, "Oh no! Te caíste del laberinto.");
                } else {
                    gameOver(false, "¡Ouch! Chocaste con un obstáculo.");
                }
                return;
            }
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

function mapCollisionToDestiny(collision) {
    if (collision === 'lose_bounds') return 'outOfBounds';
    if (collision === 'lose_wall') return 'wall';
    if (collision === 'win') return 'goal';
    return 'safe';
}

function resetLevel() {
    gameState.playing = false;
    const currentLevelId = getCurrentLevelId();
    setLevelById(currentLevelId);
    renderCommandsForCurrentLevel();
    resetState();
    showTutorialIfNeeded(true);
}

async function fullResetGame() {
    const confirmReset = window.confirm(
        'Esto borrará todo el progreso guardado, lore visto y configuración. ¿Deseas continuar?'
    );
    if (!confirmReset) return;

    try {
        await StorageSystem.clearAll();
        window.location.reload();
    } catch (e) {
        console.error('Error al reiniciar por completo el juego:', e);
    }
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

function nextLevel() {
    const els = getDOMRefs();

    modalUI.hide();
    modalUI.hideNextLevel();

    const nextLevelId = getNextLevelId(gameState.currentLevelId);
    if (!nextLevelId) {
        resetState();
        return;
    }

    StorageSystem.saveLastCompletedLevel(gameState.currentLevelId);
    setLevelById(nextLevelId);
    renderCommandsForCurrentLevel();

    els.btnRun.innerHTML = '▶️ Ejecutar';
    els.btnRun.classList.remove('secondary-btn', 'retry-mode');
    els.btnRun.classList.add('primary-btn');
    resetState();
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
    els.btnResetAll?.addEventListener('click', fullResetGame);
    els.btnPlayAgain.addEventListener('click', playAgain);
    els.btnNextLevel.addEventListener('click', nextLevel);
    els.btnRetry.addEventListener('click', retryLevel);
    els.btnTutorialContinue.addEventListener('click', () => {
        tutorialSystem.nextPage();
    });

    window.addEventListener('resize', () => gridRenderer.updatePlayerPosition());
}

/**
 * Mostrar tutorial si el nivel actual es un tutorial
 */
function showTutorialIfNeeded(force = false) {
    if (tutorialSystem && gameState.level) {
        const levelId = getCurrentLevelId();

        if (force) {
            tutorialSystem.hide();
            tutorialSystem.show(gameState.level);
            return;
        }

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
