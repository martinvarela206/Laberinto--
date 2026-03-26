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
            btn.type = 'button';
            btn.dataset.cmdId = cmd.id;
            btn.title = cmd.name;

            const icon = document.createElement('span');
            icon.className = 'cmd-icon';
            icon.innerText = cmd.icon;

            const countBadge = document.createElement('span');
            countBadge.className = 'cmd-count-badge';

            btn.appendChild(icon);
            btn.appendChild(countBadge);

            btn.onclick = () => {
                if (gameState.playing) return;
                if (this.getRemainingForCommand(cmd.id) <= 0) return;
                gameState.sequence.push(cmd);
                gameState.commandsUsed++;
                this.updateSequenceUI();
            };
            els.commandsBank.appendChild(btn);
        });

        this.updateCommandAvailability();
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

        this.updateCommandAvailability();
    },

    getLimitForCommand(commandId) {
        const rawLimit = gameState.commandLimits?.[commandId];
        return Number.isFinite(rawLimit) ? rawLimit : Infinity;
    },

    getUsedForCommand(commandId) {
        return gameState.sequence.reduce((total, cmd) => {
            return total + (cmd.id === commandId ? 1 : 0);
        }, 0);
    },

    getRemainingForCommand(commandId) {
        const limit = this.getLimitForCommand(commandId);
        if (!Number.isFinite(limit)) return Infinity;
        return Math.max(0, limit - this.getUsedForCommand(commandId));
    },

    updateCommandAvailability() {
        const els = getDOMRefs();
        const buttons = els.commandsBank.querySelectorAll('.cmd-btn');

        buttons.forEach((btn) => {
            const commandId = btn.dataset.cmdId;
            const remaining = this.getRemainingForCommand(commandId);
            const badge = btn.querySelector('.cmd-count-badge');

            if (badge) {
                badge.textContent = Number.isFinite(remaining) ? String(remaining) : '∞';
            }

            btn.disabled = Number.isFinite(remaining) && remaining <= 0;
        });
    }
};
