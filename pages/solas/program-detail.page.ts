import { expect, Locator, Page } from '@playwright/test';

export class ProgramDetailPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators ====================

    get heading(): Locator {
        return this.page.getByRole('heading', { level: 3 });
    }

    get detailsTab(): Locator {
        return this.page.getByRole('tab', { name: 'Details' });
    }

    get financialLayersTab(): Locator {
        return this.page.getByRole('tab', { name: 'Financial Layers' });
    }

    get declinedButton(): Locator {
        return this.page.getByRole('button', { name: 'Declined' });
    }

    get declineDialog(): Locator {
        return this.page.getByRole('dialog', { name: 'Decline Program' });
    }

    get declinatureReasonTrigger(): Locator {
        return this.declineDialog.getByRole('button', {
            name: 'Select an option',
        });
    }

    get declinatureRationaleInput(): Locator {
        return this.page.getByRole('textbox', {
            name: 'Declinature/NTU Rationale',
        });
    }

    get rationaleInput(): Locator {
        return this.page.getByRole('textbox', {
            name: 'Rationale',
            exact: true,
        });
    }

    get declineConfirmButton(): Locator {
        return this.page
            .getByRole('dialog', { name: 'Decline Program' })
            .getByRole('button', { name: 'Confirm' });
    }

    // ==================== Actions ====================

    /**
     * Extracts the numeric program ID from the page heading (e.g. "448590 - CLIENT NAME").
     * @returns {Promise<string>} The program's ID.
     */
    async getProgramId(): Promise<string> {
        const text = await this.heading.innerText();
        const match = text.match(/^(\d+)/);

        if (!match) {
            throw new Error(
                `Could not extract a program ID from heading text: "${text}"`
            );
        }

        return match[1];
    }

    /**
     * Marks the program as Declined, used as test cleanup so created programs
     * do not remain in the active/opportunity pipeline the platform's users work from.
     * @returns {Promise<void>}
     */
    async decline(): Promise<void> {
        // Each step below checks whether it's already done before acting, so this
        // is safe to call after a partial prior failure (e.g. the dialog already
        // open, or a reason already selected) instead of blindly restarting --
        // re-clicking "Declined" while its dialog is already open would just fail,
        // since the dialog overlay covers that button.
        const dialogAlreadyOpen = await this.declineDialog
            .isVisible()
            .catch(() => false);

        if (!dialogAlreadyOpen) {
            await this.declinedButton.click();
            await expect(this.declineDialog).toBeVisible({ timeout: 10000 });
        }

        // Once a reason is picked, the trigger's accessible name changes from
        // "Select an option" to the picked reason, so this naturally becomes false.
        const reasonNotYetSelected = await this.declinatureReasonTrigger
            .isVisible()
            .catch(() => false);

        if (reasonNotYetSelected) {
            await this.declinatureReasonTrigger.click({ timeout: 5000 });

            const reasons = this.page.getByRole('option');
            // eslint-disable-next-line playwright/no-nth-methods -- any reason is acceptable for cleanup; first is fine.
            const firstReason = reasons.first();

            await expect(firstReason).toBeVisible({ timeout: 5000 });
            await firstReason.click({ timeout: 5000 });
            // The reason dropdown's own popover overlays the dialog and
            // intercepts clicks on Confirm until it fully closes.
            await expect(firstReason).not.toBeVisible({ timeout: 5000 });
        }

        await this.declinatureRationaleInput.fill(
            'Test cleanup - automated E2E test',
            { timeout: 5000 }
        );
        await this.rationaleInput.fill('Test cleanup', { timeout: 5000 });

        await this.declineConfirmButton.click({ timeout: 5000 });
    }
}
