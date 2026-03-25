import { deepClone } from '../utils/deepClone.js';

function normalizeLevel(levelData) {
    const size = levelData.size || {};
    const player = levelData.player || {};

    return {
        id: levelData.id,
        name: levelData.name,
        isTutorial: levelData.isTutorial === true || levelData.tutorial === true,
        width: size.width,
        height: size.height,
        playerStart: deepClone(player.start),
        goal: deepClone(levelData.goal),
        walls: deepClone((levelData.tiles || []).filter((tile) => tile.type === 'wall').map((tile) => ({ x: tile.x, y: tile.y }))),
        rules: deepClone(levelData.rules || { timeLimit: 60 }),
        allowedCommands: deepClone(levelData.allowedCommands || []),
        tutorialIntro: deepClone(levelData.tutorialIntro || null),
        initialSequence: deepClone(levelData.initialSequence || null),
        raw: deepClone(levelData)
    };
}

export function createInitialState(levelData) {
    const level = normalizeLevel(levelData);

    const initialSequence = deepClone(level.initialSequence) || [];

    return {
        sequence: initialSequence,
        position: deepClone(level.playerStart),
        playing: false,
        isGameOver: false,
        timer: level.rules.timeLimit || 60,
        intervalId: null,
        level,
        levelNumber: 1,
        pathTaken: [],
        commandsUsed: initialSequence.length
    };
}

export function setLevel(state, levelData, levelNumber) {
    state.level = normalizeLevel(levelData);
    state.levelNumber = levelNumber;
    state.position = deepClone(state.level.playerStart);
    state.timer = state.level.rules.timeLimit || 60;
    state.pathTaken = [];
    state.sequence = deepClone(state.level.initialSequence) || [];
    state.commandsUsed = state.sequence.length;
    state.playing = false;
    state.isGameOver = false;
}

export function resetRoundState(state) {
    state.position = deepClone(state.level.playerStart);
    state.playing = false;
    state.isGameOver = false;
    state.timer = state.level.rules.timeLimit || 60;
    state.pathTaken = [];
    state.sequence = deepClone(state.level.initialSequence) || [];
    state.commandsUsed = state.sequence.length;
}
