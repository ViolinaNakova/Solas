import { expect, Locator, Page } from '@playwright/test';
import { Routes } from '../../enums/solas/routes';
import {
    LifecycleMessage,
    StatusButton,
    UnderwritingStatus,
} from '../../enums/solas/program-lifecycle';
import { Timeouts } from '../../enums/util/timeouts';
import { SummarySectionComponent } from '../components/summary-section.component';

export class ProgramDetailPage {
    /** Collapsible summary sections (Details and its sub-sections can render collapsed). */
    readonly sections: SummarySectionComponent;

    constructor(private readonly page: Page) {
        this.sections = new SummarySectionComponent(page);
    }

    // ==================== Locators ====================

    get heading(): Locator {
        return this.page.getByRole('heading', { level: 3 });
    }

    get programTypeBadge(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- header badge has no role/label/testid, only data-ref; the same text also appears in the Details panel.
        return this.page.locator(
            '[data-ref="ProgramPageHeader-program-type-badge"]'
        );
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

    get belongsToPoolValue(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- read-only summary value has no role/label/testid, only data-ref.
        return this.page.locator('[data-ref="belongsToPool-value"]');
    }

    get poolValue(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- read-only summary value has no role/label/testid, only data-ref.
        return this.page.locator('[data-ref="terrorPoolId-value"]');
    }

    // ==================== Locators: Lifecycle Header ====================

    get underwritingStatusBadge(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- header badge has no role/label/testid, only data-ref; the same text also appears in the Details panel.
        return this.page.locator(
            '[data-ref="ProgramPageHeader-underwriting-status-badge"]'
        );
    }

    statusButton(button: StatusButton): Locator {
        // Scoped to the desktop header: every header button is duplicated in a
        // hidden mobile header with the same accessible name.
        // eslint-disable-next-line playwright/no-raw-locators -- header button group has no role/label/testid, only data-ref.
        const header = this.page.locator('[data-ref="header-buttons"]');
        return header.getByRole('button', { name: button, exact: true });
    }

    tab(name: string): Locator {
        // Tabs append a pending-field count badge (e.g. "Financial Layers 4")
        // while a status change is blocked, so match the name as a prefix.
        return this.page.getByRole('tab', { name: new RegExp(`^${name}`) });
    }

    // ==================== Locators: Change of Risk Status Dialog ====================

    get changeOfRiskStatusDialog(): Locator {
        return this.page.getByRole('alertdialog', {
            name: LifecycleMessage.CHANGE_OF_RISK_STATUS,
        });
    }

    get statusChangeProceedButton(): Locator {
        return this.changeOfRiskStatusDialog.getByRole('button', {
            name: 'Proceed',
        });
    }

    get confirmStatusChangeButton(): Locator {
        return this.changeOfRiskStatusDialog.getByRole('button', {
            name: 'Change Status',
        });
    }

    // ==================== Locators: Details Edit ====================

    get editDetailsButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the Details and Perils sections both render an "Edit" button; data-ref is the only distinguishing attribute.
        return this.page.locator('[data-ref="program-details-summary-edit"]');
    }

    get saveDetailsButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the Details and Perils sections both render a "Save" button; data-ref is the only distinguishing attribute.
        return this.page.locator('[data-ref="program-details-summary-save"]');
    }

    get clientSizeTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- no role/label/placeholder/testid exists; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="clientSize-input-trigger"]');
    }

    get brokerContactModalTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- icon-only button with no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="broker-contact-modal-trigger"]');
    }

    get brokerContactDialog(): Locator {
        return this.page.getByRole('dialog', { name: /Broker Contact/ });
    }

    get brokerContactSelect(): Locator {
        return this.brokerContactDialog.getByRole('button', {
            name: 'Please select or add broker contact',
        });
    }

    get brokerContactSearchInput(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the dropdown's search box has no role/label/placeholder/testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="broker-contact-input-search"]');
    }

    get brokerContactCloseButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the dialog renders two "Close" buttons (footer and corner X); data-ref is the only distinguishing attribute.
        return this.page.locator('[data-ref="broker-contact-modal-cancel"]');
    }

    brokerContactRow(contactName: string): Locator {
        return this.brokerContactDialog
            .getByRole('row')
            .filter({ hasText: contactName });
    }

    get brokerContactsValue(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- read-only summary value has no role/label/testid, only data-ref.
        return this.page.locator('[data-ref="brokerContacts-value"]');
    }

    // ==================== Feedback Locators ====================

    get brokerContactRequiredMessage(): Locator {
        return this.page.getByText(LifecycleMessage.BROKER_CONTACT_REQUIRED);
    }

    get clientSizeRequiredMessage(): Locator {
        return this.page.getByText(LifecycleMessage.CLIENT_SIZE_REQUIRED);
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
     * Navigates to a fresh page load of the given program's Details tab,
     * bypassing any in-memory wizard/finalize state -- required to verify a
     * value actually persisted server-side rather than just rendering from
     * client state (see NGUI-3388 verification in Solas_AddProgram_Workflow.md).
     * @param {string} programId - The program's numeric ID.
     * @returns {Promise<void>}
     */
    async reloadDetails(programId: string): Promise<void> {
        await this.page.goto(
            `${Routes.PROGRAM_EDIT}/${programId}/edit?tab=details`
        );
        await expect(this.belongsToPoolValue).toBeVisible();
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

    /**
     * Reloads the current program page and waits for its header to render.
     * Tasks, the task counter and some header buttons (e.g. "Submission Ready",
     * "Bound", "Sign-Off") only refresh after a reload.
     * @returns {Promise<void>}
     */
    async reloadProgram(): Promise<void> {
        await this.page.reload();
        await expect(this.underwritingStatusBadge).toBeVisible({
            timeout: Timeouts.STATUS_CHANGE,
        });
    }

    /**
     * Opens one of the program's tabs (Details, Financial Layers, Files, ...).
     * @param {string} name - The tab's name, without any pending-field badge.
     * @returns {Promise<void>}
     */
    async openTab(name: string): Promise<void> {
        await this.tab(name).click();
        await expect(this.tab(name)).toHaveAttribute('aria-selected', 'true');
    }

    /**
     * Waits for a header status button to be offered, reloading the program
     * between checks since newly unlocked buttons only render after a reload.
     * @param {StatusButton} button - The header status button to wait for.
     * @returns {Promise<void>}
     */
    async waitForStatusButton(button: StatusButton): Promise<void> {
        await expect(async () => {
            await this.reloadProgram();
            await expect(this.statusButton(button)).toBeVisible();
        }).toPass({ timeout: Timeouts.TASK_APPEAR });
    }

    /**
     * Moves the program to the next status through a header button gated by
     * required fields. When the "Change of Risk Status" popup lists fields to
     * fix, it is dismissed with "Proceed", the given callback fills and saves
     * them, and the popup reopens to confirm. When nothing is missing (fields
     * can already hold valid values), the popup asks for confirmation straight
     * away and the callback is skipped.
     * @param {StatusButton} button - The header status button to click.
     * @param {UnderwritingStatus} expectedStatus - The status the program should move to.
     * @param {() => Promise<void>} fillRequiredFields - Fills and saves the fields the popup reports as missing.
     * @returns {Promise<void>}
     */
    async changeStatusWithRequiredFields(
        button: StatusButton,
        expectedStatus: UnderwritingStatus,
        fillRequiredFields: () => Promise<void>
    ): Promise<void> {
        await this.waitForStatusButton(button);
        await this.statusButton(button).click();
        await expect(
            this.statusChangeProceedButton.or(this.confirmStatusChangeButton)
        ).toBeVisible({ timeout: Timeouts.STATUS_CHANGE });

        if (await this.statusChangeProceedButton.isVisible()) {
            await this.statusChangeProceedButton.click();
            await expect(this.changeOfRiskStatusDialog).toBeHidden();
            await fillRequiredFields();
        }

        await this.confirmStatusChange(expectedStatus);
    }

    /**
     * Confirms the pending status change in the "Change of Risk Status" popup,
     * which reopens once every required field has been fixed and saved.
     * @param {UnderwritingStatus} expectedStatus - The status the program should move to.
     * @returns {Promise<void>}
     */
    async confirmStatusChange(
        expectedStatus: UnderwritingStatus
    ): Promise<void> {
        await expect(this.confirmStatusChangeButton).toBeVisible({
            timeout: Timeouts.STATUS_CHANGE,
        });
        await expect(this.changeOfRiskStatusDialog).toContainText(
            expectedStatus
        );
        await this.confirmStatusChangeButton.click();
        await expect(this.underwritingStatusBadge).toHaveText(expectedStatus, {
            timeout: Timeouts.STATUS_CHANGE,
        });
    }

    /**
     * Clicks a header status button that needs no extra input (e.g. "Pre
     * Sign-Off", "Sign-Off") and waits for the resulting status.
     * @param {StatusButton} button - The header status button to click.
     * @param {UnderwritingStatus} expectedStatus - The status the program should move to.
     * @returns {Promise<void>}
     */
    async changeStatus(
        button: StatusButton,
        expectedStatus: UnderwritingStatus
    ): Promise<void> {
        await this.waitForStatusButton(button);
        await this.statusButton(button).click();
        await expect(this.underwritingStatusBadge).toHaveText(expectedStatus, {
            timeout: Timeouts.STATUS_CHANGE,
        });
    }

    /**
     * Switches the Details tab into edit mode.
     * @returns {Promise<void>}
     */
    async editDetails(): Promise<void> {
        await this.openTab('Details');
        await this.editDetailsButton.click();
        await expect(this.saveDetailsButton).toBeVisible();
        // The Details section can render collapsed. (Its Initial Details
        // block only has its own collapse toggle in view mode, not in edit.)
        await this.sections.expand('programDetails');
        await expect(this.clientSizeTrigger).toBeVisible();
    }

    /**
     * Selects the Client Size (Details must be in edit mode).
     * @param {string} clientSize - Exact Client Size option text.
     * @returns {Promise<void>}
     */
    async selectClientSize(clientSize: string): Promise<void> {
        await this.clientSizeTrigger.click();
        await this.page
            .getByRole('option', { name: clientSize, exact: true })
            .click();
        await expect(this.clientSizeTrigger).toContainText(clientSize);
    }

    /**
     * Adds an existing broker contact as the program's lead contact (Details
     * must be in edit mode). The contact list is global and only loads once
     * the search box has text; the selection is saved immediately, without the
     * Details "Save" button.
     * @param {string} contactName - Exact name of an existing broker contact.
     * @returns {Promise<void>}
     */
    async addBrokerContact(contactName: string): Promise<void> {
        await this.brokerContactModalTrigger.click();
        await this.brokerContactSelect.click();
        // The search runs server-side and can be slow, or miss an early
        // keystroke while the dropdown is still mounting; retype until the
        // contact shows up.
        const contactOption = this.page.getByRole('option', {
            name: contactName,
            exact: true,
        });
        await expect(async () => {
            await this.brokerContactSearchInput.clear();
            await this.brokerContactSearchInput.fill(contactName);
            await expect(contactOption).toBeVisible({
                timeout: Timeouts.STATUS_CHANGE,
            });
        }).toPass({ timeout: Timeouts.TASK_APPEAR });
        await contactOption.click();
        await expect(this.brokerContactRow(contactName)).toBeVisible();
        await this.brokerContactCloseButton.click();
        await expect(this.brokerContactDialog).toBeHidden();
    }

    /**
     * Saves the Details tab while it is in edit mode.
     * @returns {Promise<void>}
     */
    async saveDetails(): Promise<void> {
        await expect(this.saveDetailsButton).toBeEnabled();
        await this.saveDetailsButton.click();
    }
}
