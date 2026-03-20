/**
 * RankingSystem - Gestión del ranking en localStorage.
 * Cada nivel tiene su propio ranking independiente.
 */
export const rankingSystem = {
    getKey(levelNumber) {
        return levelNumber === 1 ? 'laberintoRanking' : `laberintoRanking_nivel_${levelNumber}`;
    },

    save(levelNumber, name, score) {
        const key = this.getKey(levelNumber);
        let ranking = JSON.parse(localStorage.getItem(key) || '[]');
        const isTop1 = ranking.length === 0 || score >= ranking[0].score;

        ranking.push({ name, score, date: new Date().toISOString() });
        ranking.sort((a, b) => b.score - a.score);
        ranking = ranking.slice(0, 10);

        localStorage.setItem(key, JSON.stringify(ranking));
        return isTop1;
    },

    load(levelNumber) {
        const key = this.getKey(levelNumber);
        return JSON.parse(localStorage.getItem(key) || '[]');
    }
};
