import { expect, Locator, Page } from '@playwright/test';
import { TaskName } from '../../enums/solas/program-lifecycle';
import { Timeouts } from '../../enums/util/timeouts';
import { formatShortDate } from '../../helpers/util/util';

export class ProgramTasksPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators: Task Panel ====================

    get taskListButton(): Locator {
        return this.page.getByRole('button', { name: /Tasks TO DO/ });
    }

    taskCard(taskName: TaskName): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- task cards have no role/label/testid; the data-ref prefix (suffixed with a task ID) is the only stable attribute.
        const cards = this.page.locator('[data-ref^="task-card-"]');
        return cards.filter({
            has: this.page.getByRole('heading', {
                name: taskName,
                exact: true,
            }),
        });
    }

    taskActionButton(taskName: TaskName, label: string): Locator {
        return this.taskCard(taskName).getByRole('button', {
            name: label,
            exact: true,
        });
    }

    get closeTaskListButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- icon-only close button with no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="task-list-close-button"]');
    }

    // ==================== Locators: Task Dialogs ====================

    get complianceDialog(): Locator {
        return this.page.getByRole('dialog', {
            name: /Compliance License Check/,
        });
    }

    get complianceResolutionTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the Resolution combobox has no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="resolutionId-input-trigger"]');
    }

    get taskDetailsDialog(): Locator {
        return this.page.getByRole('dialog', { name: 'Task Details' });
    }

    get hotlineDialog(): Locator {
        return this.page.getByRole('dialog', { name: /Hotline Outcome/ });
    }

    get hotlineOutcomeTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the Hotline Outcome combobox has no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="hotlineOutcome-input-trigger"]');
    }

    get hotlineDateInput(): Locator {
        return this.page.getByTestId('hotlineDate-input');
    }

    get umccOutcomeDialog(): Locator {
        return this.page.getByRole('dialog', { name: /UMCC Outcome/ });
    }

    get umccOutcomeTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the UMCC Outcome combobox has no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="decision-input-trigger"]');
    }

    get umccOutcomeOptions(): Locator {
        return this.page.getByRole('option');
    }

    umccLineInput(layerIndex: number): Locator {
        return this.page.getByTestId(
            `layersUmccList.${layerIndex}.umccLine-input`
        );
    }

    // ==================== Actions ====================

    /**
     * Opens the Tasks panel and waits for the given task card. Tasks are
     * generated server-side after the action that triggers them, and the open
     * panel never refreshes, so the program is reloaded between checks.
     * @param {TaskName} taskName - The task to wait for.
     * @returns {Promise<void>}
     */
    async openTaskList(taskName: TaskName): Promise<void> {
        await expect(async () => {
            await this.page.reload();
            await this.taskListButton.click();
            await expect(this.taskCard(taskName)).toBeVisible();
        }).toPass({ timeout: Timeouts.TASK_APPEAR });
    }

    /**
     * Closes the Tasks panel, which otherwise stays open over the program tabs
     * after a task's dialog is completed. Escape is used because the panel's
     * own close button can render outside a small viewport.
     * @returns {Promise<void>}
     */
    async closeTaskList(): Promise<void> {
        await this.page.keyboard.press('Escape');
        await expect(this.closeTaskListButton).toBeHidden();
    }

    /**
     * Opens a task's own action (e.g. "View", "Add Note") from the Tasks panel.
     * @param {TaskName} taskName - The task to act on.
     * @param {string} label - The task card's action button label.
     * @returns {Promise<void>}
     */
    async openTask(taskName: TaskName, label = 'View'): Promise<void> {
        await this.openTaskList(taskName);
        await this.taskActionButton(taskName, label).click();
    }

    /**
     * Opens the "Risk Card - Add UMCC Notes" task, which opens the Risk Card
     * with a new note pre-filled from the UMCC template.
     * @returns {Promise<void>}
     */
    async openRiskCardNotesTask(): Promise<void> {
        await this.openTask(TaskName.RISK_CARD_UMCC_NOTES, 'Add Note');
    }

    /**
     * Resolves the "Compliance License check" task with the given resolution.
     * @param {string} resolution - Exact Resolution option text.
     * @returns {Promise<void>}
     */
    async resolveComplianceLicenseCheck(resolution: string): Promise<void> {
        await this.openTask(TaskName.COMPLIANCE_LICENSE_CHECK);
        await this.complianceResolutionTrigger.click();
        await this.page
            .getByRole('option', { name: resolution, exact: true })
            .click();
        await this.complianceDialog
            .getByRole('button', { name: 'Complete' })
            .click();
        await expect(this.complianceDialog).toBeHidden();
        await this.closeTaskList();
    }

    /**
     * Completes the "Pricing" task (a plain confirmation).
     * @returns {Promise<void>}
     */
    async completePricing(): Promise<void> {
        await this.openTask(TaskName.PRICING);
        await this.taskDetailsDialog
            .getByRole('button', { name: 'Complete' })
            .click();
        await expect(this.taskDetailsDialog).toBeHidden();
        await this.closeTaskList();
    }

    /**
     * Completes the "Referral to capacity providers" task with the given response.
     * @param {string} response - Exact referral response radio label (e.g. "Approved").
     * @returns {Promise<void>}
     */
    async completeReferral(response: string): Promise<void> {
        await this.openTask(TaskName.REFERRAL);
        await this.taskDetailsDialog
            .getByRole('radio', { name: response, exact: true })
            .check();
        await this.taskDetailsDialog
            .getByRole('button', { name: 'Complete' })
            .click();
        await expect(this.taskDetailsDialog).toBeHidden();
        await this.closeTaskList();
    }

    /**
     * Populates the hotline outcome via the Tasks panel (the header "Hotline"
     * button is legacy).
     * @param {string} outcome - Exact Hotline Outcome option text.
     * @param {Date} date - The hotline date (defaults to today).
     * @returns {Promise<void>}
     */
    async populateHotlineOutcome(
        outcome: string,
        date: Date = new Date()
    ): Promise<void> {
        await this.openTask(TaskName.HOTLINE);
        await this.hotlineOutcomeTrigger.click();
        await this.page
            .getByRole('option', { name: outcome, exact: true })
            .click();
        await expect(this.hotlineOutcomeTrigger).toContainText(outcome);
        await this.hotlineDateInput.click();
        await this.hotlineDateInput.fill(formatShortDate(date));
        await this.hotlineDateInput.press('Tab');
        await this.hotlineDialog
            .getByRole('button', { name: 'Confirm' })
            .click();
        await expect(this.hotlineDialog).toBeHidden();
        await this.closeTaskList();
    }

    /**
     * Opens the "Populate UMCC outcome" task and its outcome dropdown, leaving
     * the options listed so they can be asserted.
     * @returns {Promise<void>}
     */
    async openUmccOutcomeOptions(): Promise<void> {
        await this.openTask(TaskName.UMCC_OUTCOME);
        await this.umccOutcomeTrigger.click();
    }

    /**
     * Picks the UMCC outcome from the open dropdown, fills each layer's UMCC
     * Line and submits the outcome.
     * @param {string} outcome - Exact UMCC Outcome option text.
     * @param {number[]} umccLines - UMCC Line per layer, in layer order.
     * @returns {Promise<void>}
     */
    async completeUmccOutcome(
        outcome: string,
        umccLines: number[]
    ): Promise<void> {
        await this.page
            .getByRole('option', { name: outcome, exact: true })
            .click();
        await expect(this.umccOutcomeTrigger).toContainText(outcome);

        for (const [index, line] of umccLines.entries()) {
            await this.umccLineInput(index).fill(String(line));
        }
        // Tabbing out of a UMCC Line focuses the row's date field, whose
        // calendar popover then covers the "Add" button.
        await this.umccOutcomeDialog
            .getByRole('heading', { name: /UMCC Outcome/ })
            .click();

        await this.umccOutcomeDialog
            .getByRole('button', { name: 'Add', exact: true })
            .click();
        await expect(this.umccOutcomeDialog).toBeHidden();
        await this.closeTaskList();
    }
}
