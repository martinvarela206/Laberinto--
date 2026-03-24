export function renderSequence(sequenceContainerEl, commandsCountEl, sequenceIds, getCommandById, onRemove) {
    sequenceContainerEl.innerHTML = '';
    commandsCountEl.innerText = sequenceIds.length;

    sequenceIds.forEach((commandId, idx) => {
        const command = getCommandById(commandId);
        if (!command) {
            return;
        }

        const el = document.createElement('div');
        el.className = 'seq-item';
        el.innerText = command.icon;
        el.title = `${command.name} (Quitar)`;
        el.id = `seq-${idx}`;
        el.style.cursor = 'pointer';
        el.onclick = () => onRemove(idx);
        sequenceContainerEl.appendChild(el);
    });

    sequenceContainerEl.scrollTop = sequenceContainerEl.scrollHeight;
}
