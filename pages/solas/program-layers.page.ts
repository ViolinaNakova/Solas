import { expect, Locator, Page } from '@playwright/test';
import { AddProgramPage } from './add-program.page';
import {
    LifecycleMessage,
    UnderwritingStatus,
} from '../../enums/solas/program-lifecycle';
import { ProgramLifecycleData } from '../../test-data/factories/solas/program.factory';
import { Timeouts } from '../../enums/util/timeouts';
import { SummarySectionComponent } from '../components/summary-section.component';

export class ProgramLayersPage {
    /** Shared financial-layer field helpers (click-to-edit fill + verify). */
    private readonly layerFields: AddProgramPage;

    /** Collapsible summary sections (the grid's section can render collapsed). */
    readonly sections: SummarySectionComponent;

    constructor(private readonly page: Page) {
        this.layerFields = new AddProgramPage(page);
        this.sections = new SummarySectionComponent(page);
    }

    // ==================== Locators ====================
    // Fields are matched by on-screen column position on an ID-agnostic
    // attribute prefix/suffix, as in AddProgramPage: the backend layer ID is
    // embedded in each data-ref and differs per program.

    get financialLayersTab(): Locator {
        return this.page.getByRole('tab', { name: /^Financial Layers/ });
    }

    get saveLayersButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- icon-only button with no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="summary-save-financialLayers"]');
    }

    rpiTrigger(layerIndex: number): Locator {
        return this.layerFields.nthLayerField(
            '[data-ref^="financial-layer-"][data-ref$="-rpi-trigger"]',
            layerIndex
        );
    }

    gelrTrigger(layerIndex: number): Locator {
        return this.layerFields.nthLayerField(
            '[data-ref^="financial-layer-"][data-ref$="-gelr-trigger"]',
            layerIndex
        );
    }

    leaderTrigger(layerIndex: number): Locator {
        return this.layerFields.nthLayerField(
            '[data-ref^="financial-layer-"][data-ref$="-leader-trigger"]',
            layerIndex
        );
    }

    placementTypeTrigger(layerIndex: number): Locator {
        return this.layerFields.nthLayerField(
            '[data-testid^="financial-layer-form-PlacementTypeId-"]',
            layerIndex
        );
    }

    quotedUlrInput(layerIndex: number): Locator {
        return this.layerFields.treatyColumnInput('QuotedUlr', layerIndex);
    }

    rpiValueInput(layerIndex: number): Locator {
        return this.layerFields.treatyColumnInput('rpiPlaceholder', layerIndex);
    }

    gelrTotalInput(layerIndex: number): Locator {
        return this.layerFields.treatyColumnInput('GelrTotal', layerIndex);
    }

    estGrossPremiumShareInput(layerIndex: number): Locator {
        return this.layerFields.estGrossPremiumShareInput(layerIndex);
    }

    get rpiDialog(): Locator {
        return this.page.getByRole('dialog', { name: /RPI & RARC/ });
    }

    get gelrDialog(): Locator {
        return this.page.getByRole('dialog', { name: /^GELR/ });
    }

    get leaderDialog(): Locator {
        return this.page.getByRole('dialog', { name: /^Leader/ });
    }

    // ==================== Feedback Locators ====================

    get layersSavedMessage(): Locator {
        return this.page.getByText(LifecycleMessage.FINANCIAL_LAYERS_SAVED);
    }

    get fieldErrorMarkers(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- the per-field error tooltip icons have no role/label/testid; the data-ref prefix is the only stable attribute.
        return this.page.locator('[data-ref^="form-error-tooltip-trigger"]');
    }

    // ==================== Actions ====================

    /**
     * Opens the Financial Layers tab and waits for its grid.
     * @returns {Promise<void>}
     */
    async open(): Promise<void> {
        await this.financialLayersTab.click();
        await this.sections.expand('financialLayers');
        await expect(this.rpiTrigger(0)).toBeVisible({
            timeout: Timeouts.LAYER_GRID_LOAD,
        });
    }

    /**
     * Fills the fields "Submission Ready" requires on a layer: Quoted RPI (via
     * the RPI & RARC dialog) and Quoted ULR.
     * @param {number} layerIndex - The 0-based layer column.
     * @param {number} quotedRpi - Quoted RPI value (must be greater than 0).
     * @param {number} quotedUlr - Quoted ULR value.
     * @returns {Promise<void>}
     */
    async fillSubmissionReadyFields(
        layerIndex: number,
        quotedRpi: number,
        quotedUlr: number
    ): Promise<void> {
        await this.rpiTrigger(layerIndex).click();
        await this.rpiDialog
            .getByRole('spinbutton', { name: 'Quoted RPI', exact: true })
            .fill(String(quotedRpi));
        await this.rpiDialog.getByRole('button', { name: 'Apply' }).click();
        await expect(this.rpiDialog).toBeHidden();
        await expect(this.rpiValueInput(layerIndex)).not.toHaveValue('');

        await this.layerFields.fillAndVerify(
            this.quotedUlrInput(layerIndex),
            String(quotedUlr)
        );
    }

    /**
     * Fills the field "Quoted/Awaiting FOT" requires on a layer: Est Gross
     * Premium (Share), which the creation wizard's Est Gross Premium (100%)
     * pin resets to 0.
     * @param {number} layerIndex - The 0-based layer column.
     * @param {number} estGrossPremiumShare - Est Gross Premium (Share) value.
     * @returns {Promise<void>}
     */
    async fillQuotedFields(
        layerIndex: number,
        estGrossPremiumShare: number
    ): Promise<void> {
        await this.layerFields.fillAndVerify(
            this.estGrossPremiumShareInput(layerIndex),
            String(estGrossPremiumShare)
        );
    }

    /**
     * Fills the fields "Bound" requires on a layer: GELR (via the GELR dialog),
     * Leader (via the Leader dialog) and Placement Type.
     * @param {number} layerIndex - The 0-based layer column.
     * @param {object} values - The values to enter.
     * @param {number} values.gelrNonCat - GELR (non-CAT) %.
     * @param {number} values.gelrCat - GELR (CAT) %.
     * @param {string} values.leaderName - Free-text Leader name.
     * @param {string} values.placementType - Exact Placement Type option text.
     * @returns {Promise<void>}
     */
    async fillBoundFields(
        layerIndex: number,
        values: {
            gelrNonCat: number;
            gelrCat: number;
            leaderName: string;
            placementType: string;
        }
    ): Promise<void> {
        await this.gelrTrigger(layerIndex).click();
        await this.gelrDialog
            .getByRole('spinbutton', { name: 'GELR (non-CAT)' })
            .fill(String(values.gelrNonCat));
        await this.gelrDialog
            .getByRole('spinbutton', { name: 'GELR (CAT)' })
            .fill(String(values.gelrCat));
        await this.gelrDialog.getByRole('button', { name: 'Apply' }).click();
        await expect(this.gelrDialog).toBeHidden();
        await expect(this.gelrTotalInput(layerIndex)).toHaveValue(
            (values.gelrNonCat + values.gelrCat).toFixed(2)
        );

        await this.leaderTrigger(layerIndex).click();
        await this.leaderDialog
            .getByRole('textbox', { name: 'Leader', exact: true })
            .fill(values.leaderName);
        await this.leaderDialog.getByRole('button', { name: 'Apply' }).click();
        await expect(this.leaderDialog).toBeHidden();

        const placementType = this.placementTypeTrigger(layerIndex);
        const currentPlacementType = await placementType.innerText();
        if (currentPlacementType.trim() !== values.placementType) {
            await placementType.click();
            await this.page
                .getByRole('option', {
                    name: values.placementType,
                    exact: true,
                })
                .click();
        }
        await expect(placementType).toHaveText(values.placementType);
    }

    /**
     * Saves the Financial Layers grid in place.
     * @returns {Promise<void>}
     */
    async save(): Promise<void> {
        await expect(this.saveLayersButton).toBeEnabled();
        await this.saveLayersButton.click();
        // eslint-disable-next-line playwright/no-nth-methods -- earlier saves' toasts can still be stacked; any one confirms this save.
        await expect(this.layersSavedMessage.first()).toBeVisible({
            timeout: Timeouts.STATUS_CHANGE,
        });
        await expect(this.fieldErrorMarkers).toHaveCount(0);
    }

    /**
     * Fills and saves every layer field a status change can require, up to
     * and including the target status. Which fields the "Change of Risk
     * Status" popup reports varies between runs (a gate can be skipped when
     * its fields already look valid, and then resurface at the next status),
     * so each gate fills its own fields plus all earlier gates' fields.
     * Re-filling an already valid field is harmless.
     * @param {UnderwritingStatus} targetStatus - Submission Ready, Quoted/Awaiting FOT or Bound.
     * @param {number[]} estGrossPremiumShares - Est Gross Premium (Share) per layer, in layer order.
     * @param {ProgramLifecycleData} values - Lifecycle values from the program factory.
     * @param {string} placementType - Exact Placement Type option text (Bound only).
     * @returns {Promise<void>}
     */
    async fillStatusGateFields(
        targetStatus: UnderwritingStatus,
        estGrossPremiumShares: number[],
        values: ProgramLifecycleData,
        placementType: string
    ): Promise<void> {
        const gates = [
            UnderwritingStatus.SUBMISSION_READY,
            UnderwritingStatus.QUOTED_AWAITING_FOT,
            UnderwritingStatus.BOUND,
        ];
        const reached = gates.slice(0, gates.indexOf(targetStatus) + 1);

        await this.open();
        for (const [index, share] of estGrossPremiumShares.entries()) {
            await this.fillSubmissionReadyFields(
                index,
                values.quotedRpi,
                values.quotedUlr
            );
            if (reached.includes(UnderwritingStatus.QUOTED_AWAITING_FOT)) {
                await this.fillQuotedFields(index, share);
            }
            if (reached.includes(UnderwritingStatus.BOUND)) {
                await this.fillBoundFields(index, {
                    gelrNonCat: values.gelrNonCat,
                    gelrCat: values.gelrCat,
                    leaderName: values.leaderName,
                    placementType,
                });
            }
        }
        await this.save();
    }
}
