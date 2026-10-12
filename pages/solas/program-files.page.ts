import { expect, Locator, Page } from '@playwright/test';
import {
    DropSpot,
    LifecycleMessage,
} from '../../enums/solas/program-lifecycle';
import { Timeouts } from '../../enums/util/timeouts';
import { minimalPdf } from '../../test-data/static/solas/upload-files';
import { SummarySectionComponent } from '../components/summary-section.component';

export class ProgramFilesPage {
    /** Collapsible summary sections (the Files section can render collapsed). */
    readonly sections: SummarySectionComponent;

    constructor(private readonly page: Page) {
        this.sections = new SummarySectionComponent(page);
    }

    // ==================== Locators ====================

    get filesTab(): Locator {
        return this.page.getByRole('tab', { name: /^Files/ });
    }

    get addFilesButton(): Locator {
        return this.page.getByRole('button', { name: 'Add Files' });
    }

    get filePropertiesDialog(): Locator {
        return this.page.getByRole('dialog', { name: /Edit File Properties/ });
    }

    get dropSpotTrigger(): Locator {
        return this.page.getByTestId('dropSpot-input');
    }

    get applyButton(): Locator {
        return this.filePropertiesDialog.getByRole('button', {
            name: 'Apply',
        });
    }

    fileRow(fileName: string): Locator {
        return this.page.getByRole('row').filter({ hasText: fileName });
    }

    // ==================== Feedback Locators ====================

    get fileNameExistsMessage(): Locator {
        return this.page.getByText(LifecycleMessage.FILE_NAME_EXISTS);
    }

    // ==================== Actions ====================

    /**
     * Uploads a placeholder PDF to the given drop spot from the Files tab. A
     * Submission upload moves an Opportunity to Partial Submission; Quote and
     * Signing uploads unlock later lifecycle steps and checks.
     * @param {string} fileName - Unique file name (a duplicate is rejected).
     * @param {DropSpot} dropSpot - The drop spot to file it under.
     * @returns {Promise<void>}
     */
    async uploadFile(fileName: string, dropSpot: DropSpot): Promise<void> {
        await this.filesTab.click();
        await this.sections.expand('files');

        // "Add Files" opens the native file picker directly.
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.addFilesButton.click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles({
            name: fileName,
            mimeType: minimalPdf.mimeType,
            buffer: Buffer.from(minimalPdf.content),
        });

        await expect(this.filePropertiesDialog).toBeVisible();
        // The first upload pre-selects "Submission"; re-picking an already
        // selected option is avoided in case it toggles the selection off.
        const currentDropSpot = await this.dropSpotTrigger.innerText();
        if (!currentDropSpot.includes(dropSpot)) {
            await this.dropSpotTrigger.click();
            await this.page
                .getByRole('option', { name: dropSpot, exact: true })
                .click();
        }
        await expect(this.dropSpotTrigger).toContainText(dropSpot);

        await this.applyButton.click();
        await expect(this.filePropertiesDialog).toBeHidden({
            timeout: Timeouts.STATUS_CHANGE,
        });
        await expect(this.fileRow(fileName)).toBeVisible({
            timeout: Timeouts.STATUS_CHANGE,
        });
    }
}
