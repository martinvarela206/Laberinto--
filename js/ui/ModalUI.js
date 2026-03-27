import { getDOMRefs } from './DOMRefs.js';

/**
 * ModalUI - Gestión del modal de victoria/derrota.
 */
export const modalUI = {
    showWin(message) {
        const els = getDOMRefs();
        els.modal.classList.remove('hidden');
        els.modalTitle.innerText = '¡Nivel Completado! 🌟';
        els.modalTitle.style.color = '#4ade80';
        els.modalMessage.innerText = message;

        els.btnRetry.classList.add('hidden');
        els.btnNextLevel.classList.add('hidden'); // Ocultado inicialmente, mostrado si hay siguiente nivel
    },

    showLose(message) {
        const els = getDOMRefs();
        els.modal.classList.remove('hidden');
        els.modalTitle.innerText = '¡Derrota! 💀';
        els.modalTitle.style.color = '#ef4444';
        els.modalMessage.innerText = message;

        els.btnRetry.classList.remove('hidden');
        els.btnNextLevel.classList.add('hidden'); // No mostrar siguiente nivel en derrota
    },

    hide() {
        const els = getDOMRefs();
        els.modal.classList.add('hidden');
    },

    showNextLevel() {
        getDOMRefs().btnNextLevel.classList.remove('hidden');
    },

    hideNextLevel() {
        getDOMRefs().btnNextLevel.classList.add('hidden');
    }
};
