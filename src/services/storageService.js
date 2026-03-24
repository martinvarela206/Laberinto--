export function getJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
}

export function setJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getRankingKey(levelNumber) {
    return levelNumber === 1 ? 'laberintoRanking' : `laberintoRanking_nivel_${levelNumber}`;
}

export function loadRanking(levelNumber) {
    return getJson(getRankingKey(levelNumber), []);
}

export function saveRanking(levelNumber, ranking) {
    setJson(getRankingKey(levelNumber), ranking);
}
