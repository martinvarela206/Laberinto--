/**
 * Tutorial System
 * Manages in-game tutorials for educational levels
 * 
 * Responsibility: Display tutorial content for levels marked as tutorials
 * Works independently from main game logic
 */

class TutorialSystem {
    constructor(domRefs) {
        this.domRefs = domRefs;
        this.active = null;
        this.isVisible = false;
        this.seenTutorials = new Set();
    }

    /**
     * Initialize with level data
     */
    initialize() {
        return { initialized: true };
    }

    /**
     * Show tutorial if level has one
     */
    show(levelData) {
        if (!levelData || !levelData.tutorialIntro) return false;

        this.active = levelData.tutorialIntro;
        this.isVisible = true;
        this.render();

        if (this.domRefs.tutorialOverlay) {
            this.domRefs.tutorialOverlay.classList.remove('hidden');
        }

        return true;
    }

    /**
     * Hide tutorial overlay
     */
    hide() {
        this.isVisible = false;
        if (this.domRefs.tutorialOverlay) {
            this.domRefs.tutorialOverlay.classList.add('hidden');
        }
    }

    /**
     * Mark tutorial as seen
     */
    markAsSeen(levelId) {
        this.seenTutorials.add(levelId);
    }

    /**
     * Check if tutorial was already seen
     */
    hasBeenSeen(levelId) {
        return this.seenTutorials.has(levelId);
    }

    /**
     * Render tutorial content
     */
    render() {
        if (!this.active) return;

        const tutorial = this.active;

        if (this.domRefs.tutorialTitle) {
            this.domRefs.tutorialTitle.textContent = tutorial.title || '';
        }
        if (this.domRefs.tutorialCommand) {
            this.domRefs.tutorialCommand.textContent = tutorial.command || '';
        }
        if (this.domRefs.tutorialDescription) {
            this.domRefs.tutorialDescription.textContent = tutorial.description || '';
        }
        if (this.domRefs.tutorialObjective) {
            this.domRefs.tutorialObjective.textContent = tutorial.objective || '';
        }
    }

    /**
     * Get active tutorial data
     */
    getActiveTutorial() {
        return this.active;
    }

    /**
     * Check if tutorial is visible
     */
    isActive() {
        return this.isVisible;
    }
}

export default TutorialSystem;
