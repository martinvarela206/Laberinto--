/**
 * Level - Define la estructura de un nivel del juego.
 * Incluye dimensiones, posición inicial, meta, obstáculos y configuración.
 */
export class Level {
    constructor({
        id,
        name,
        width,
        height,
        playerStart,
        goal,
        walls = [],
        traps = [],
        timeLimit = 60,
        allowedCommands = [],
        tutorialPages = [],
        initialSequence = []
    }) {
        this.id = id;
        this.name = name || id;
        this.width = width;
        this.height = height;
        this.playerStart = { ...playerStart };
        this.goal = { ...goal };
        this.walls = walls.map(w => ({ ...w }));
        this.traps = traps.map(t => ({ ...t }));
        this.timeLimit = timeLimit;
        this.allowedCommands = [...allowedCommands];
        this.tutorialPages = tutorialPages.map((page) => ({ ...page }));
        this.initialSequence = [...initialSequence];
    }

    addObstacle(pos) {
        if (!this.walls.some(w => w.x === pos.x && w.y === pos.y)) {
            this.walls.push({ ...pos });
        }
    }

    clone() {
        return new Level({
            id: this.id,
            name: this.name,
            width: this.width,
            height: this.height,
            playerStart: { ...this.playerStart },
            goal: { ...this.goal },
            walls: this.walls.map(w => ({ ...w })),
            traps: this.traps.map(t => ({ ...t })),
            timeLimit: this.timeLimit,
            allowedCommands: [...this.allowedCommands],
            tutorialPages: this.tutorialPages.map((page) => ({ ...page })),
            initialSequence: [...this.initialSequence]
        });
    }
}
