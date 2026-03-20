import { getDOMRefs } from './DOMRefs.js';

/**
 * ModalUI - Gestión del modal de victoria/derrota.
 */
export const modalUI = {
    showWin(message, score) {
        const els = getDOMRefs();
        els.modal.classList.remove('hidden');
        els.modalTitle.innerText = '¡Nivel Completado! 🌟';
        els.modalTitle.style.color = '#4ade80';
        els.modalMessage.innerText = message;

        els.modalScore.classList.remove('hidden');
        els.nameInputGroup.classList.remove('hidden');
        els.btnRetry.classList.add('hidden');

        els.finalScore.innerText = score;
        els.finalScore.dataset.score = score;
    },

    showLose(message) {
        const els = getDOMRefs();
        els.modal.classList.remove('hidden');
        els.modalTitle.innerText = '¡Derrota! 💀';
        els.modalTitle.style.color = '#ef4444';
        els.modalMessage.innerText = message;

        els.modalScore.classList.add('hidden');
        els.nameInputGroup.classList.add('hidden');
        els.btnRetry.classList.remove('hidden');
    },

    hide() {
        const els = getDOMRefs();
        els.modal.classList.add('hidden');
    },

    hideNameInput() {
        const els = getDOMRefs();
        els.nameInputGroup.classList.add('hidden');
        els.playerName.value = '';
    },

    showNextLevel() {
        getDOMRefs().btnNextLevel.classList.remove('hidden');
    },

    hideNextLevel() {
        getDOMRefs().btnNextLevel.classList.add('hidden');
    }
};
