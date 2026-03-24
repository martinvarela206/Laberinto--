export function renderRanking(rankingListEl, ranking) {
    rankingListEl.innerHTML = '';

    if (!ranking || ranking.length === 0) {
        rankingListEl.innerHTML = '<li><i>No hay récords aún</i></li>';
        return;
    }

    ranking.forEach((record, idx) => {
        const li = document.createElement('li');
        const pos = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`;
        li.innerHTML = `<span>${pos} ${record.name}</span> <span style="color:var(--primary); font-weight:bold;">${record.score}</span>`;
        rankingListEl.appendChild(li);
    });
}
