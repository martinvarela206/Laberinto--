export function renderCommandPalette(commandsBankEl, commands, onSelect) {
    commandsBankEl.innerHTML = '';

    commands.forEach((command) => {
        const btn = document.createElement('button');
        btn.className = 'cmd-btn';
        btn.innerText = command.icon;
        btn.title = command.name;
        btn.onclick = () => onSelect(command.id);
        commandsBankEl.appendChild(btn);
    });
}
