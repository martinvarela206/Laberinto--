/**
 * Levels Initialization Module
 * Imports all levels and makes them available
 * 
 * This file ensures all levels are loaded and registered
 * when the application starts
 */

import { level1 } from './levels/level1.js';
import { level2 } from './levels/level2.js';
import { level3 } from './levels/level3.js';
import { level4 } from './levels/level4.js';
import { level5 } from './levels/level5.js';
import { level6 } from './levels/level6.js';
import { level7 } from './levels/level7.js';
import { levelRegistry } from './LevelRegistry.js';

const levelsArray = [level1, level2, level3, level4, level5, level6, level7];
levelsArray.forEach((level) => {
    if (level.id) {
        levelRegistry.registerById(level.id, level);
    }
});

export const allLevels = levelsArray;
export { levelRegistry };
