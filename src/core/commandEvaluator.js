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
