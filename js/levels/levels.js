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
import { level8 } from './levels/level8.js';
import { levelRegistry } from './LevelRegistry.js';

// Map each level to its metadata using ID
const levelsArray = [level1, level2, level3, level4, level5, level6, level7, level8];
const levelMetadataIds = ['level-001', 'level-002', 'level-003', 'level-004', 'level-005', 'level-006', 'level-007', 'level-008'];

levelsArray.forEach((level, index) => {
    const levelId = levelMetadataIds[index];
    levelRegistry.registerById(levelId, level);
});

export const allLevels = levelsArray;
export { levelRegistry };
