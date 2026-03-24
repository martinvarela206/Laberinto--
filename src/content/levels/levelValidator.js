export function validateLevel(level) {
    const errors = [];

    if (!level || typeof level !== 'object') {
        errors.push('El nivel debe ser un objeto.');
        return errors;
    }

    if (!level.id) {
        errors.push('Falta id de nivel.');
    }

    if (!level.size || typeof level.size.width !== 'number' || typeof level.size.height !== 'number') {
        errors.push('Falta size.width/size.height numérico.');
    }

    if (!level.player || !level.player.start) {
        errors.push('Falta player.start.');
    }

    if (!level.goal) {
        errors.push('Falta goal.');
    }

    return errors;
}
