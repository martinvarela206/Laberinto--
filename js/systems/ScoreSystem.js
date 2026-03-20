/**
 * ScoreSystem - Cálculo de puntuación.
 * Fórmula: max(10, 1000 - comandos*50 + tiempoRestante*10)
 */
export function calculateScore(commandsUsed, timeRemaining) {
    return Math.max(10, 1000 - (commandsUsed * 50) + (timeRemaining * 10));
}
