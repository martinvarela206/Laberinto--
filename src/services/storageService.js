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

const LORE_SEEN_KEY = 'laberintoLoreSeen';
const GAME_PROGRESS_KEY = 'laberintoGameProgress';

export function hasSeenLore() {
    return getJson(LORE_SEEN_KEY, false) === true;
}

export function markLoreSeen() {
    setJson(LORE_SEEN_KEY, true);
}

export function loadGameProgress() {
    return getJson(GAME_PROGRESS_KEY, { lastCompletedLevelId: null });
}

export function saveLastCompletedLevel(levelId) {
    setJson(GAME_PROGRESS_KEY, { lastCompletedLevelId: levelId || null });
}
