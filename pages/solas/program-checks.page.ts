import { expect, Locator, Page } from '@playwright/test';
import { escapeRegExp } from '../../helpers/util/util';
import { Timeouts } from '../../enums/util/timeouts';
import { ApiEndpoints } from '../../enums/solas/api-endpoints';
import { SummarySectionComponent } from '../components/summary-section.component';

// Check icons are identified by a data-ref suffix. The Underwriting Checklist
// spells them "-cheked-icon" / "-uncheked-icon" (sic), while Program Checks,
// Layer Checks and Perils use "-checked-icon" / "-unchecked-icon", so both
// spellings are matched.
const UNCHECKED_ICON =
    '[data-ref$="-unchecked-icon"], [data-ref$="-uncheked-icon"]';
const CHECKED_ICON = '[data-ref$="-checked-icon"], [data-ref$="-cheked-icon"]';

export class ProgramChecksPage {
    /** Collapsible summary sections (Contract Review can render collapsed). */
    readonly sections: SummarySectionComponent;

    constructor(private readonly page: Page) {
        this.sections = new SummarySectionComponent(page);
    }

    // ==================== Locators: Contract Tab ====================

    get contractTab(): Locator {
        return this.page.getByRole('tab', { name: /^Contract/ });
    }

    get editContractReviewButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- several sections render an "Edit" button; data-ref is the only distinguishing attribute.
        return this.page.locator('[data-ref="summary-edit-contractReview"]');
    }

    get saveContractReviewButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- several sections render a "Save" button; data-ref is the only distinguishing attribute.
        return this.page.locator('[data-ref="summary-save-contractReview"]');
    }

    get contractTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the Contract combobox has no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="contract-input-trigger"]');
    }

    get contractReviewStatusTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the Contract Review Status combobox has no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator(
            '[data-ref="contractReviewStatus-input-trigger"]'
        );
    }

    get contractValue(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- read-only summary value has no role/label/testid, only data-ref.
        return this.page.locator('[data-ref="contract-value"]');
    }

    get contractReviewStatusValue(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- read-only summary value has no role/label/testid, only data-ref.
        return this.page.locator('[data-ref="contractReviewStatus-value"]');
    }

    // ==================== Locators: Checks Tab ====================

    get checksTab(): Locator {
        return this.page.getByRole('tab', { name: /^Checks/ });
    }

    get checkPerilsButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the Perils section's "Check" button keeps the same name once checked; only its data-ref changes.
        return this.page.locator('[data-ref="perils-checks-button-uncheck"]');
    }

    get perilsCheckedButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the Perils section's "Check" button keeps the same name once checked; only its data-ref changes.
        return this.page.locator('[data-ref="perils-checks-button-check"]');
    }

    get uncheckedItems(): Locator {
        // Check icons have no role/label/testid; the data-ref suffix is the
        // only stable attribute (see UNCHECKED_ICON).
        return this.page.locator(UNCHECKED_ICON);
    }

    get uncheckedEnabledItems(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- check buttons are icon-only with no accessible name; the data-ref is the only stable attribute.
        const buttons = this.page.locator('button[data-ref]:not([disabled])');
        return buttons.filter({ has: this.uncheckedItems });
    }

    checkItem(dataRef: string): Locator {
        // Check buttons are icon-only with no accessible name; the data-ref is
        // the only stable attribute.
        return this.page.locator(`[data-ref="${dataRef}"]`);
    }

    // ==================== Locators: Layer Checks (visibility) ====================
    // The Layer Checks grid's row headers are divs with a `<field>-label`
    // data-ref; other Checks sections use the same pattern, so the headers are
    // scoped to the section holding the "Layer Checks" heading.

    get layerChecksSection(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the section container has no role/label/testid; it is identified by the heading it holds.
        const sections = this.page
            .locator('div')
            .filter({
                has: this.page.getByRole('heading', {
                    name: 'Layer Checks',
                    exact: true,
                }),
            })
            .filter({
                // eslint-disable-next-line playwright/no-raw-locators -- the grid's ID row header has no role/label/testid; data-ref is the only stable attribute.
                has: this.page.locator('[data-ref="id-label"]'),
            });
        // eslint-disable-next-line playwright/no-nth-methods -- every ancestor holding both the heading and the grid matches; the innermost (last in document order) is the section itself.
        return sections.last();
    }

    layerChecksFieldLabel(label: string): Locator {
        const caption = new RegExp(`^${escapeRegExp(label)}\\s*\\*?$`);
        // eslint-disable-next-line playwright/no-raw-locators -- grid row headers have no role/label/testid; data-ref is the only stable attribute.
        const rowHeaders = this.layerChecksSection.locator(
            '[data-ref$="-label"]'
        );
        return rowHeaders.filter({ hasText: caption });
    }

    // ==================== Actions ====================

    /**
     * Records the contract review on the Contract tab, which resolves the
     * "Contract Review completed or not required" checklist item.
     * @param {string} contract - Exact Contract option text (e.g. "Draft Received").
     * @param {string} reviewStatus - Exact Contract Review Status option text.
     * @returns {Promise<void>}
     */
    async completeContractReview(
        contract: string,
        reviewStatus: string
    ): Promise<void> {
        await this.contractTab.click();
        await this.sections.expand('contractReview');
        await this.editContractReviewButton.click();

        await this.contractTrigger.click();
        await this.page
            .getByRole('option', { name: contract, exact: true })
            .click();
        // Review Status stays disabled until a Contract is chosen.
        await expect(this.contractReviewStatusTrigger).toBeEnabled();
        await this.contractReviewStatusTrigger.click();
        await this.page
            .getByRole('option', { name: reviewStatus, exact: true })
            .click();

        await this.saveContractReviewButton.click();
        await expect(this.contractValue).toHaveText(contract, {
            timeout: Timeouts.STATUS_CHANGE,
        });
        await expect(this.contractReviewStatusValue).toHaveText(reviewStatus);
    }

    /**
     * Opens the Checks tab with every section expanded. Collapsed sections
     * unmount their check buttons, so unrendered checks would otherwise be
     * silently skipped (and Pre Sign-Off stays disabled).
     * @returns {Promise<void>}
     */
    async openChecks(): Promise<void> {
        await this.checksTab.click();
        await this.sections.expand('programChecks');
        await this.sections.expand('selectPerils');
        await this.sections.expandByIcons(
            'open-layer-checks',
            'hide-layer-checks'
        );
        await this.sections.expand('underwritingChecklist');
        await expect(
            this.checkPerilsButton.or(this.perilsCheckedButton)
        ).toBeVisible();
    }

    /**
     * Clicks a check and waits for its save to complete. Every check saves
     * through the same request, and the icon flips before that request
     * finishes; clicking the next check while a save is in flight lets the
     * saves overwrite each other, losing checks on reload.
     * @param {Locator} check - The check button to click.
     * @returns {Promise<void>}
     */
    async clickCheckAndWaitForSave(check: Locator): Promise<void> {
        const saved = this.page.waitForResponse(
            (response) =>
                response.url().includes(ApiEndpoints.UPSERT_PROGRAM_CHECKS) &&
                response.ok(),
            { timeout: Timeouts.STATUS_CHANGE }
        );
        await check.click();
        await saved;
    }

    /**
     * Opens the Checks tab and marks every enabled check green: the Perils
     * section's own "Check" button, then each Program Check, Layer Check and
     * Underwriting Checklist item, waiting for each one's save. Items gated
     * by other tabs (Broker Contact, Contract Review, Final Slip) must be
     * unlocked first.
     * @returns {Promise<void>}
     */
    async checkAll(): Promise<void> {
        await this.openChecks();

        if (await this.checkPerilsButton.isVisible()) {
            await this.clickCheckAndWaitForSave(this.checkPerilsButton);
            await expect(this.perilsCheckedButton).toBeVisible();
        }

        // Checking an item disables its button, so the targets are collected by
        // data-ref up front instead of re-resolving a shrinking filtered list.
        // Passes repeat until nothing enabled is left unchecked.
        await expect(async () => {
            const dataRefs = await this.uncheckedEnabledItems.evaluateAll(
                (buttons) =>
                    buttons.map(
                        (button) => button.getAttribute('data-ref') ?? ''
                    )
            );
            for (const dataRef of dataRefs) {
                const item = this.checkItem(dataRef);
                await this.clickCheckAndWaitForSave(item);
                await expect(item.locator(CHECKED_ICON)).toBeVisible({
                    timeout: Timeouts.STATUS_CHANGE,
                });
            }
            await expect(this.uncheckedEnabledItems).toHaveCount(0);
        }).toPass({ timeout: Timeouts.TASK_APPEAR });
    }
}
