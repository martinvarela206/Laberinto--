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
        this.pages = [];
        this.pageIndex = 0;
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
    show(level) {
        if (!level || !Array.isArray(level.tutorialPages) || level.tutorialPages.length === 0) {
            return false;
        }

        this.pages = level.tutorialPages.map((page) => ({ ...page }));
        this.pageIndex = 0;
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
        this.pages = [];
        this.pageIndex = 0;
        if (this.domRefs.tutorialOverlay) {
            this.domRefs.tutorialOverlay.classList.add('hidden');
        }
    }

    nextPage() {
        if (!this.isVisible) return { done: true };

        if (this.pageIndex < this.pages.length - 1) {
            this.pageIndex += 1;
            this.render();
            return { done: false };
        }

        this.hide();
        return { done: true };
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
        if (!this.pages.length) return;

        const tutorial = this.pages[this.pageIndex];

        if (this.domRefs.tutorialTitle) {
            this.domRefs.tutorialTitle.textContent = tutorial.title || '';
        }
        if (this.domRefs.tutorialCommand) {
            this.domRefs.tutorialCommand.textContent = tutorial.command || '';
            this.domRefs.tutorialCommand.classList.toggle('hidden', !tutorial.command);
        }
        if (this.domRefs.tutorialDescription) {
            this.domRefs.tutorialDescription.textContent = tutorial.description || '';
        }
        if (this.domRefs.tutorialObjective) {
            this.domRefs.tutorialObjective.textContent = tutorial.objective || '';
        }

        if (this.domRefs.btnTutorialContinue) {
            const isLastPage = this.pageIndex >= this.pages.length - 1;
            this.domRefs.btnTutorialContinue.textContent = isLastPage ? 'Comenzar nivel' : 'Siguiente página';
        }
    }

    /**
     * Get active tutorial data
     */
    getActiveTutorial() {
        return this.pages[this.pageIndex] || null;
    }

    /**
     * Check if tutorial is visible
     */
    isActive() {
        return this.isVisible;
    }
}

export default TutorialSystem;
