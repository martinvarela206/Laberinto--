import { getDOMRefs } from './DOMRefs.js';
import { gameState } from '../core/GameState.js';

/**
 * CommandPanelUI - Gestión del panel de comandos y la secuencia del usuario.
 */
export const commandPanelUI = {
    renderCommands(commands) {
        const els = getDOMRefs();
        els.commandsBank.innerHTML = '';

        commands.forEach(cmd => {
            const btn = document.createElement('button');
            btn.className = 'cmd-btn';
            btn.innerText = cmd.icon;
            btn.title = cmd.name;
            btn.onclick = () => {
                if (gameState.playing) return;
                gameState.sequence.push(cmd);
                gameState.commandsUsed++;
                this.updateSequenceUI();
            };
            els.commandsBank.appendChild(btn);
        });
    },

    undoCommand() {
        if (gameState.playing || gameState.sequence.length === 0) return;
        gameState.sequence.pop();
        gameState.commandsUsed--;
        this.updateSequenceUI();
    },

    removeCommand(idx) {
        const els = getDOMRefs();
        if (gameState.playing || els.btnRun.classList.contains('retry-mode')) return;
        gameState.sequence.splice(idx, 1);
        gameState.commandsUsed--;
        this.updateSequenceUI();
    },

    updateSequenceUI() {
        const els = getDOMRefs();
        els.sequenceContainer.innerHTML = '';
        els.commandsCount.innerText = gameState.commandsUsed;

        gameState.sequence.forEach((cmd, idx) => {
            const el = document.createElement('div');
            el.className = 'seq-item';
            el.innerText = cmd.icon;
            el.title = `${cmd.name} (Quitar)`;
            el.id = `seq-${idx}`;
            el.style.cursor = 'pointer';
            el.onclick = () => this.removeCommand(idx);
            els.sequenceContainer.appendChild(el);
        });

        // Scroll al final
        els.sequenceContainer.scrollTop = els.sequenceContainer.scrollHeight;
    }
};
