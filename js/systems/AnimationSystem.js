/**
 * AnimationSystem - Ejecuta secuencias de animaciones por estado (pre/in/post).
 * Formato de animación: [name, durationSeconds, loops]
 * loops = 0 se interpreta como infinito (solo para animaciones visuales no bloqueantes).
 */
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function camelToKebab(value) {
    return String(value || '')
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .toLowerCase();
}

function normalizeAnimation(definition) {
    if (!Array.isArray(definition) || definition.length === 0) {
        return null;
    }

    const name = String(definition[0] || '').trim();
    const durationSeconds = Number(definition[1]);
    const loops = Number(definition[2]);

    return {
        name,
        durationSeconds: Number.isFinite(durationSeconds) && durationSeconds > 0 ? durationSeconds : 0,
        loops: Number.isFinite(loops) && loops >= 0 ? loops : 1
    };
}

class AnimationSystem {
    constructor() {
        this._infiniteCleanups = [];
    }

    async runCommandStates({ states, executeMovement, canContinue }) {
        await this._runState(states?.preState, { executeMovement, canContinue, allowMovement: false });
        await this._runState(states?.inState, { executeMovement, canContinue, allowMovement: true });
        await this._runState(states?.postState, { executeMovement, canContinue, allowMovement: false });
    }

    clearInfiniteAnimations() {
        while (this._infiniteCleanups.length) {
            const cleanup = this._infiniteCleanups.pop();
            cleanup();
        }
    }

    async _runState(state, context) {
        const list = Array.isArray(state?.animations) ? state.animations : [];
        for (const rawDef of list) {
            if (context.canContinue && !context.canContinue()) {
                return;
            }
            const def = normalizeAnimation(rawDef);
            if (!def || !def.name) continue;
            await this._runAnimation(def, context);
        }
    }

    async _runAnimation(def, context) {
        if (def.name === 'move' || def.name === 'moveSlow') {
            if (context.allowMovement && context.executeMovement) {
                const playerEl = document.getElementById('player');
                if (playerEl) {
                    const easing = def.name === 'moveSlow'
                        ? 'cubic-bezier(0.25, 0.1, 0.25, 1)'
                        : 'cubic-bezier(0.1, 0.9, 0.2, 1)';
                    playerEl.style.transition = `transform ${def.durationSeconds}s ${easing}`;
                }

                context.executeMovement();
                await delay(def.durationSeconds * 1000 * Math.max(1, def.loops));

                if (playerEl) {
                    playerEl.style.transition = '';
                }
            }
            return;
        }

        const playerInner = document.querySelector('#player .player-inner');
        if (!playerInner) {
            await delay(def.durationSeconds * 1000 * Math.max(1, def.loops));
            return;
        }

        const className = `anim-${camelToKebab(def.name)}`;

        // loops=0: animación infinita no bloqueante hasta limpiar explícitamente.
        if (def.loops === 0) {
            playerInner.classList.add(className);
            playerInner.style.animationDuration = `${def.durationSeconds}s`;
            playerInner.style.animationIterationCount = 'infinite';
            const cleanup = () => {
                playerInner.classList.remove(className);
                playerInner.style.animationDuration = '';
                playerInner.style.animationIterationCount = '';
            };
            this._infiniteCleanups.push(cleanup);
            return;
        }

        playerInner.classList.add(className);
        playerInner.style.animationDuration = `${def.durationSeconds}s`;
        playerInner.style.animationIterationCount = String(def.loops);
        await delay(def.durationSeconds * 1000 * def.loops);
        playerInner.classList.remove(className);
        playerInner.style.animationDuration = '';
        playerInner.style.animationIterationCount = '';
    }
}

export const animationSystem = new AnimationSystem();
