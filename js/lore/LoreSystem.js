/**
 * Lore System
 * Manages narrative introduction overlay and progression
 * 
 * Responsibility: Show narrative content to new players
 * Independent module that doesn't affect core game logic
 */

import { LORE_STEPS, LORE_CONFIG } from '../config/loreConfig.js';
import { hasSeenLore, markLoreSeen } from '../systems/StorageSystem.js';

class LoreSystem {
    constructor(domRefs) {
        this.domRefs = domRefs;
        this.currentStep = 0;
        this.isVisible = false;
        this.hasBeenSeen = false;
        this.maxSteps = LORE_STEPS.length;
    }

    /**
     * Initialize lore system - check if user should see lore
     */
    async initialize() {
        this.hasBeenSeen = await hasSeenLore();
        if (this.hasBeenSeen) {
            return { shouldShow: false };
        }
        return { shouldShow: LORE_CONFIG.showOnFirstVisit };
    }

    /**
     * Show lore overlay for first time
     */
    show() {
        if (this.isVisible) return;
        
        this.isVisible = true;
        this.currentStep = 0;
        this.renderStep();
        
        if (this.domRefs.loreOverlay) {
            this.domRefs.loreOverlay.classList.remove('hidden');
        }
    }

    /**
     * Hide lore overlay
     */
    hide() {
        this.isVisible = false;
        if (this.domRefs.loreOverlay) {
            this.domRefs.loreOverlay.classList.add('hidden');
        }
    }

    /**
     * Advance to next lore step
     */
    nextStep() {
        if (this.currentStep < this.maxSteps - 1) {
            this.currentStep++;
            this.renderStep();
        } else {
            this.complete();
        }
    }

    /**
     * Mark lore as seen and hide
     */
    async complete() {
        await markLoreSeen();
        this.hide();
    }

    /**
     * Render current lore step
     */
    renderStep() {
        const step = LORE_STEPS[this.currentStep];
        if (!step) return;

        if (this.domRefs.loreKicker) {
            this.domRefs.loreKicker.textContent = step.kicker;
        }
        if (this.domRefs.loreTitle) {
            this.domRefs.loreTitle.textContent = step.title;
        }
        if (this.domRefs.loreDescription) {
            this.domRefs.loreDescription.textContent = step.description;
        }
        if (this.domRefs.loreStory) {
            this.domRefs.loreStory.textContent = step.story;
        }
        if (this.domRefs.loreObjective) {
            this.domRefs.loreObjective.textContent = step.objective;
        }

        // Update progress indicator
        const progress = ((this.currentStep + 1) / this.maxSteps) * 100;
        if (this.domRefs.loreProgress) {
            this.domRefs.loreProgress.style.width = `${progress}%`;
        }
    }

    /**
     * Get current step number (1-indexed)
     */
    getCurrentStepNumber() {
        return this.currentStep + 1;
    }

    /**
     * Get total steps
     */
    getTotalSteps() {
        return this.maxSteps;
    }
}

export default LoreSystem;
