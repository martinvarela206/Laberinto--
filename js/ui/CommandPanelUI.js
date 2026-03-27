import { getDOMRefs } from './DOMRefs.js';
import { gameState } from '../core/GameState.js';
import { commandRegistry } from '../commands/CommandRegistry.js';

/**
 * CommandPanelUI - Gestión del panel de comandos y la secuencia del usuario.
 */
export const commandPanelUI = {
    selectedIndices: new Set(),
    anchorIndex: null,
    cursorIndex: null,
    clipboard: [],
    controlsBound: false,

    bindEditorControls() {
        if (this.controlsBound) return;
        const els = getDOMRefs();

        els.btnSeqCopy?.addEventListener('click', () => this.copySelection());
        els.btnSeqCut?.addEventListener('click', () => this.cutSelection());
        els.btnSeqPaste?.addEventListener('click', () => this.pasteClipboard());
        els.btnSeqDelete?.addEventListener('click', () => this.deleteSelection());

        els.sequenceContainer?.addEventListener('click', (event) => {
            if (event.target === els.sequenceContainer) {
                this.clearSelection();
                this.cursorIndex = gameState.sequence.length - 1;
                this.updateSequenceUI();
            }
        });

        this.controlsBound = true;
    },

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
                this.insertCommandAtCursor(cmd);
                this.updateSequenceUI();
            };
            els.commandsBank.appendChild(btn);
        });

        this.updateCommandAvailability();
    },

    insertCommandAtCursor(command) {
        const insertionPos = this.cursorIndex === null
            ? gameState.sequence.length
            : Math.min(this.cursorIndex + 1, gameState.sequence.length);

        gameState.sequence.splice(insertionPos, 0, command);
        this.cursorIndex = insertionPos;
        this.clearSelection();
        gameState.commandsUsed = gameState.sequence.length;
    },

    clearSelection() {
        this.selectedIndices.clear();
        this.anchorIndex = null;
    },

    getSortedSelectedIndices() {
        return [...this.selectedIndices].sort((a, b) => a - b);
    },

    selectIndex(index, event) {
        if (event.shiftKey && this.anchorIndex !== null) {
            const start = Math.min(this.anchorIndex, index);
            const end = Math.max(this.anchorIndex, index);
            this.selectedIndices.clear();
            for (let i = start; i <= end; i++) {
                this.selectedIndices.add(i);
            }
        } else if (event.ctrlKey || event.metaKey) {
            if (this.selectedIndices.has(index)) {
                this.selectedIndices.delete(index);
            } else {
                this.selectedIndices.add(index);
            }
            this.anchorIndex = index;
        } else {
            this.selectedIndices.clear();
            this.selectedIndices.add(index);
            this.anchorIndex = index;
        }
        this.cursorIndex = index;
    },

    copySelection() {
        if (gameState.playing) return;
        const selected = this.getSortedSelectedIndices();
        if (!selected.length) return;

        this.clipboard = selected
            .map((idx) => gameState.sequence[idx])
            .filter(Boolean)
            .map((cmd) => cmd.id);

        this.updateEditorButtons();
    },

    cutSelection() {
        if (gameState.playing) return;
        if (!this.selectedIndices.size) return;
        this.copySelection();
        this.deleteSelection();
    },

    pasteClipboard() {
        if (gameState.playing || !this.clipboard.length) return;

        const insertionPos = this.cursorIndex === null
            ? gameState.sequence.length
            : Math.min(this.cursorIndex + 1, gameState.sequence.length);

        const commands = this.clipboard
            .map((id) => commandRegistry.getById(id))
            .filter(Boolean);

        if (!commands.length) return;

        gameState.sequence.splice(insertionPos, 0, ...commands);
        gameState.commandsUsed = gameState.sequence.length;
        this.clearSelection();
        this.cursorIndex = insertionPos + commands.length - 1;
        this.updateSequenceUI();
    },

    deleteSelection() {
        if (gameState.playing) return;

        if (this.selectedIndices.size) {
            const selected = this.getSortedSelectedIndices();
            const firstSelected = selected[0];

            for (let i = selected.length - 1; i >= 0; i--) {
                gameState.sequence.splice(selected[i], 1);
            }

            this.clearSelection();
            this.cursorIndex = Math.min(firstSelected - 1, gameState.sequence.length - 1);
            gameState.commandsUsed = gameState.sequence.length;
            this.updateSequenceUI();
            return;
        }

        const hasCursorTarget =
            this.cursorIndex !== null &&
            this.cursorIndex >= 0 &&
            this.cursorIndex < gameState.sequence.length;

        if (!hasCursorTarget) return;

        const removeIndex = this.cursorIndex;
        gameState.sequence.splice(removeIndex, 1);
        this.clearSelection();
        this.cursorIndex = gameState.sequence.length
            ? Math.min(removeIndex, gameState.sequence.length - 1)
            : null;
        gameState.commandsUsed = gameState.sequence.length;
        this.updateSequenceUI();
    },

    updateEditorButtons() {
        const els = getDOMRefs();
        const hasSelection = this.selectedIndices.size > 0;
        const hasCursorTarget =
            this.cursorIndex !== null &&
            this.cursorIndex >= 0 &&
            this.cursorIndex < gameState.sequence.length;

        if (els.btnSeqCopy) els.btnSeqCopy.disabled = !hasSelection || gameState.playing;
        if (els.btnSeqCut) els.btnSeqCut.disabled = !hasSelection || gameState.playing;
        if (els.btnSeqDelete) els.btnSeqDelete.disabled = (!hasSelection && !hasCursorTarget) || gameState.playing;
        if (els.btnSeqPaste) els.btnSeqPaste.disabled = !this.clipboard.length || gameState.playing;
    },

    updateSequenceUI() {
        const els = getDOMRefs();
        els.sequenceContainer.innerHTML = '';
        els.commandsCount.innerText = gameState.sequence.length;

        this.selectedIndices = new Set(
            [...this.selectedIndices].filter((idx) => idx >= 0 && idx < gameState.sequence.length)
        );

        if (gameState.sequence.length === 0) {
            this.cursorIndex = null;
        } else if (this.cursorIndex === null) {
            this.cursorIndex = gameState.sequence.length - 1;
        } else {
            this.cursorIndex = Math.max(-1, Math.min(this.cursorIndex, gameState.sequence.length - 1));
        }

        gameState.sequence.forEach((cmd, idx) => {
            const el = document.createElement('div');
            el.className = 'seq-item';
            el.innerText = cmd.icon;
            el.title = cmd.name;
            el.id = `seq-${idx}`;
            if (this.selectedIndices.has(idx)) {
                el.classList.add('selected');
            }
            if (idx === this.cursorIndex) {
                el.classList.add('cursor-anchor');
            }
            el.onclick = (event) => {
                if (gameState.playing) return;
                this.selectIndex(idx, event);
                this.updateSequenceUI();
            };
            els.sequenceContainer.appendChild(el);
        });

        // Scroll al final
        els.sequenceContainer.scrollTop = els.sequenceContainer.scrollHeight;

        gameState.commandsUsed = gameState.sequence.length;
        this.updateCommandAvailability();
        this.updateEditorButtons();
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
