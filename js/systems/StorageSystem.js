/**
 * Storage System
 * Centralized persistence layer for game state
 * 
 * Manages:
 * - Player progress (last completed level)
 * - Lore viewing state
 * - Ranking history
 * - Game settings
 * 
 * Design: Single module prevents merge conflicts - only this file handles I/O
 */

class StorageSystem {
    static KEYS = {
        LAST_COMPLETED_LEVEL: 'laberinto_last_completed_level',
        LORE_SEEN: 'laberinto_lore_seen',
        RANKING: 'laberinto_ranking',
        GAME_SETTINGS: 'laberinto_settings'
    };

    /**
     * Save last completed level
     */
    static async saveLastCompletedLevel(levelId) {
        try {
            localStorage.setItem(this.KEYS.LAST_COMPLETED_LEVEL, levelId);
            return { success: true };
        } catch (e) {
            console.error('Error saving completed level:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Get last completed level
     */
    static async getLastCompletedLevel() {
        try {
            const level = localStorage.getItem(this.KEYS.LAST_COMPLETED_LEVEL);
            return level || null;
        } catch (e) {
            console.error('Error reading completed level:', e);
            return null;
        }
    }

    /**
     * Clear last completed level
     */
    static async clearLastCompletedLevel() {
        try {
            localStorage.removeItem(this.KEYS.LAST_COMPLETED_LEVEL);
            return { success: true };
        } catch (e) {
            console.error('Error clearing completed level:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Mark lore as seen
     */
    static async markLoreSeen() {
        try {
            localStorage.setItem(this.KEYS.LORE_SEEN, 'true');
            return { success: true };
        } catch (e) {
            console.error('Error marking lore as seen:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Check if lore has been seen
     */
    static async hasSeenLore() {
        try {
            const seen = localStorage.getItem(this.KEYS.LORE_SEEN);
            return seen === 'true';
        } catch (e) {
            console.error('Error reading lore state:', e);
            return false;
        }
    }

    /**
     * Save ranking entry (player score)
     */
    static async saveRankingEntry(entry) {
        try {
            let ranking = await this.getRanking();
            ranking.push({
                ...entry,
                timestamp: Date.now()
            });
            // Keep only last 50 scores
            ranking = ranking.slice(-50);
            localStorage.setItem(this.KEYS.RANKING, JSON.stringify(ranking));
            return { success: true, ranking };
        } catch (e) {
            console.error('Error saving ranking:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Get all ranking entries
     */
    static async getRanking() {
        try {
            const data = localStorage.getItem(this.KEYS.RANKING);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error reading ranking:', e);
            return [];
        }
    }

    /**
     * Clear all ranking data
     */
    static async clearRanking() {
        try {
            localStorage.removeItem(this.KEYS.RANKING);
            return { success: true };
        } catch (e) {
            console.error('Error clearing ranking:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Save game setting
     */
    static async saveSetting(key, value) {
        try {
            let settings = await this.getSettings();
            settings[key] = value;
            localStorage.setItem(this.KEYS.GAME_SETTINGS, JSON.stringify(settings));
            return { success: true };
        } catch (e) {
            console.error('Error saving setting:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Get all settings
     */
    static async getSettings() {
        try {
            const data = localStorage.getItem(this.KEYS.GAME_SETTINGS);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            console.error('Error reading settings:', e);
            return {};
        }
    }

    /**
     * Clear all persistent data
     */
    static async clearAll() {
        try {
            localStorage.removeItem(this.KEYS.LAST_COMPLETED_LEVEL);
            localStorage.removeItem(this.KEYS.LORE_SEEN);
            localStorage.removeItem(this.KEYS.RANKING);
            localStorage.removeItem(this.KEYS.GAME_SETTINGS);
            return { success: true };
        } catch (e) {
            console.error('Error clearing all storage:', e);
            return { success: false, error: e.message };
        }
    }

    /**
     * Export all game data (for backup)
     */
    static async exportData() {
        try {
            return {
                lastCompletedLevel: await this.getLastCompletedLevel(),
                loreSeenState: await this.hasSeenLore(),
                ranking: await this.getRanking(),
                settings: await this.getSettings(),
                exportedAt: new Date().toISOString()
            };
        } catch (e) {
            console.error('Error exporting data:', e);
            return null;
        }
    }
}

// Export functions for compatibility
export const hasSeenLore = () => StorageSystem.hasSeenLore();
export const markLoreSeen = () => StorageSystem.markLoreSeen();
export const saveLastCompletedLevel = (levelId) => StorageSystem.saveLastCompletedLevel(levelId);
export const getLastCompletedLevel = () => StorageSystem.getLastCompletedLevel();
export const clearLastCompletedLevel = () => StorageSystem.clearLastCompletedLevel();
export const saveRankingEntry = (entry) => StorageSystem.saveRankingEntry(entry);
export const getRanking = () => StorageSystem.getRanking();
export const clearRanking = () => StorageSystem.clearRanking();

export default StorageSystem;
