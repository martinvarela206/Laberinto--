export function evaluateSequence(commandIds) {
    const finalResult = [];
    let currentBlock = [];

    for (const id of commandIds) {
        if (id === 'enter') {
            finalResult.push(...currentBlock);
            currentBlock = [];
            continue;
        }

        if (id === 'repeat') {
            currentBlock = currentBlock.concat(currentBlock);
            continue;
        }

        currentBlock.push(id);
    }

    finalResult.push(...currentBlock);
    return finalResult;
}

export function evaluateSequenceWithOrigin(commandIds) {
    const finalResult = [];
    let currentBlock = [];
    let currentBlockOrigin = [];

    for (let idx = 0; idx < commandIds.length; idx++) {
        const id = commandIds[idx];
        
        if (id === 'enter') {
            for (let i = 0; i < currentBlock.length; i++) {
                finalResult.push({ command: currentBlock[i], originIdx: currentBlockOrigin[i] });
            }
            currentBlock = [];
            currentBlockOrigin = [];
            continue;
        }

        if (id === 'repeat') {
            const originalLength = currentBlock.length;
            // Duplicar comandos y marcar los duplicados con el índice del repeat
            for (let i = 0; i < originalLength; i++) {
                currentBlock.push(currentBlock[i]);
                // Si originIdx ya es un array, agregar repeat al array
                // Si no, crear un array con el original y repeat
                const original = currentBlockOrigin[i];
                if (Array.isArray(original)) {
                    currentBlockOrigin.push([...original, idx]);
                } else {
                    currentBlockOrigin.push([original, idx]);
                }
            }
            continue;
        }

        currentBlock.push(id);
        currentBlockOrigin.push(idx);
    }

    for (let i = 0; i < currentBlock.length; i++) {
        finalResult.push({ command: currentBlock[i], originIdx: currentBlockOrigin[i] });
    }

    return finalResult;
}
