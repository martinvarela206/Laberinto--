/**
 * CommandEvaluator - Evaluador de secuencias en notación posfija.
 * Procesa bloques separados por Enter, y Repeat duplica el bloque actual.
 */
export function evaluateSequence(commands) {
    let finalResult = [];
    let currentBlockResult = [];

    for (let cmd of commands) {
        if (cmd.id === 'enter') {
            finalResult = finalResult.concat(currentBlockResult);
            currentBlockResult = [];
        } else if (cmd.id === 'repeat') {
            // Duplica todo lo del bloque actual
            currentBlockResult = currentBlockResult.concat(currentBlockResult);
        } else {
            currentBlockResult.push(cmd);
        }
    }

    finalResult = finalResult.concat(currentBlockResult);
    return finalResult;
}
