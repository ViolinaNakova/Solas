import { Locator, Page } from '@playwright/test';

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

    get declinatureReasonTrigger(): Locator {
        return this.page
            .getByRole('dialog', { name: 'Decline Program' })
            .getByRole('button', { name: 'Select an option' });
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
        await this.declinedButton.click();

        await this.declinatureReasonTrigger.click();
        const reasons = this.page.getByRole('option');
        // eslint-disable-next-line playwright/no-nth-methods -- any reason is acceptable for cleanup; first is fine.
        await reasons.first().click();

        await this.declinatureRationaleInput.fill(
            'Test cleanup - automated E2E test'
        );
        await this.rationaleInput.fill('Test cleanup');

        await this.declineConfirmButton.click();
    }
}
