import { expect, Locator, Page } from '@playwright/test';
import { Timeouts } from '../../enums/util/timeouts';

export class RiskCardPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    get presentationModeButton(): Locator {
        return this.page.getByRole('button', { name: 'Presentation Mode' });
    }

    get closeRiskCardButton(): Locator {
        return this.page.getByRole('button', { name: 'Close Risk Card' });
    }

    get umccOutcomeButton(): Locator {
        return this.page.getByRole('button', { name: 'UMCC Outcome' });
    }

    get noteTemplateTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the note template combobox has no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="groupId-input-trigger"]');
    }

    get noteEditor(): Locator {
        return this.page.getByRole('textbox', { name: 'Rich Text Editor' });
    }

    get saveNoteButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- icon-only button with no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="edit-note-save"]');
    }

    // ==================== Feedback Locators ====================

    savedNote(createdBy: string): Locator {
        // A saved note shows a "Created by: <user> on <date>" byline; the
        // editor (and its save button) is gone once the note is saved.
        return this.page.getByText(new RegExp(`Created by:\\s*${createdBy}`));
    }

    // ==================== Actions ====================

    /**
     * Saves the note opened from the "Risk Card - Add UMCC Notes" task, which
     * arrives pre-filled with the given template's tables.
     * @param {string} template - The note template expected to be pre-selected (e.g. "UMCC").
     * @returns {Promise<void>}
     */
    async saveTemplateNote(template: string): Promise<void> {
        await expect(this.noteTemplateTrigger).toContainText(template, {
            timeout: Timeouts.STATUS_CHANGE,
        });
        await expect(this.noteEditor).toBeVisible();
        await this.saveNoteButton.click();
        await expect(this.saveNoteButton).toBeHidden();
    }

    /**
     * Closes the Risk Card and returns to the program view.
     * @returns {Promise<void>}
     */
    async close(): Promise<void> {
        await this.closeRiskCardButton.click();
        await expect(this.closeRiskCardButton).toBeHidden();
    }
}
