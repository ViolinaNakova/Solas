import { expect, Locator, Page } from '@playwright/test';
import { Routes } from '../../enums/solas/routes';

export class SubmissionsPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    get addNewProgramButton(): Locator {
        return this.page
            .getByRole('main')
            .getByRole('button', { name: 'Add a New Program' });
    }

    // ==================== Actions ====================

    /**
     * Navigates to the Submissions page.
     * @returns {Promise<void>}
     */
    async open(): Promise<void> {
        await this.page.goto(Routes.SUBMISSIONS);
        await expect(this.addNewProgramButton).toBeVisible();
    }

    /**
     * Opens the "Add a New Program" characteristics dialog.
     * @returns {Promise<void>}
     */
    async openAddProgramDialog(): Promise<void> {
        await this.addNewProgramButton.click();
    }
}
