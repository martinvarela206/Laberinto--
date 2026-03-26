/**
 * DOMRefs - Referencias centralizadas a elementos del DOM.
 * Se cachean en la primera llamada.
 * 
 * Design: Centralizar referencias previene búsquedas repetidas del DOM
 * y facilita el mantenimiento y refactorización.
 */
let _refs = null;

export function getDOMRefs() {
    if (!_refs) {
        _refs = {
            // Controles principales
            commandsBank: document.getElementById('commands-bank'),
            sequenceContainer: document.getElementById('sequence-container'),
            gridContainer: document.getElementById('grid-container'),
            btnUndo: document.getElementById('btn-undo'),
            btnRun: document.getElementById('btn-run'),
            btnReset: document.getElementById('btn-reset'),
            timeCount: document.getElementById('time-count'),
            commandsCount: document.getElementById('commands-count'),
            
            // Modal de resultados
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
            levelDisplay: document.getElementById('level-display'),
            
            // Lore Overlay
            loreOverlay: document.getElementById('lore-overlay'),
            loreKicker: document.getElementById('lore-kicker'),
            loreTitle: document.getElementById('lore-title'),
            loreDescription: document.getElementById('lore-description'),
            loreStory: document.getElementById('lore-story'),
            loreObjective: document.getElementById('lore-objective'),
            loreProgress: document.getElementById('lore-progress'),
            btnLoreNext: document.getElementById('btn-lore-next'),
            btnLoreStart: document.getElementById('btn-lore-start'),
            btnLoreContinue: document.getElementById('btn-lore-continue'),
            btnLoreReset: document.getElementById('btn-lore-reset'),
            
            // Tutorial Overlay
            tutorialOverlay: document.getElementById('tutorial-overlay'),
            tutorialTitle: document.getElementById('tutorial-title'),
            tutorialCommand: document.getElementById('tutorial-command'),
            tutorialDescription: document.getElementById('tutorial-description'),
            tutorialObjective: document.getElementById('tutorial-objective'),
            btnTutorialContinue: document.getElementById('btn-tutorial-continue')
        };
    }
    return _refs;
}
