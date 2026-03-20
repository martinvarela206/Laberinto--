/**
 * DOMRefs - Referencias centralizadas a elementos del DOM.
 * Se cachean en la primera llamada.
 */
let _refs = null;

export function getDOMRefs() {
    if (!_refs) {
        _refs = {
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
    }
    return _refs;
}
