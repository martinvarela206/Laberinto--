export function calculateScore(commandsUsed, timer) {
    return Math.max(10, 1000 - commandsUsed * 50 + timer * 10);
}
