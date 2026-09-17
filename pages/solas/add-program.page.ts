import { expect, Locator, Page } from '@playwright/test';
import { SatelliteLaunchLayerData } from '../../test-data/factories/solas/program.factory';

export class AddProgramPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators: Characteristics Dialog ====================
    // Class of Business, Line of Business, Program Type and Placing Office triggers
    // expose neither a role/label/placeholder nor a data-testid in this app -- data-ref
    // is the only stable identifier available, used here as the sanctioned last resort.

    get lineOfBusinessTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- no role/label/placeholder/testid exists; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="lineOfBusiness-input-trigger"]');
    }

    get zoneInput(): Locator {
        return this.page.getByTestId('zone-input');
    }

    get programTypeTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- no role/label/placeholder/testid exists; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="programType-input-trigger"]');
    }

    get addDialogSubmitButton(): Locator {
        return this.page.getByRole('button', { name: 'Add', exact: true });
    }

    // ==================== Locators: Initial Details ====================

    get clientInput(): Locator {
        return this.page.getByTestId('client-input');
    }

    get brokerInput(): Locator {
        return this.page.getByTestId('broker-input');
    }

    get lawJurisdictionInput(): Locator {
        return this.page.getByTestId('lawJurisdiction-input');
    }

    get placingOfficeTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- no role/label/placeholder/testid exists; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="placingOffice-input-trigger"]');
    }

    get underwriterInput(): Locator {
        return this.page.getByTestId('underwriter-input');
    }

    get nextStepButton(): Locator {
        return this.page.getByRole('button', { name: 'Next step' });
    }

    // ==================== Locators: Financial Layers ====================
    // Plain numeric fields are keyed by array index (layers.N.*), which stays
    // stable across layers. Dropdown/free-text fields are keyed by the layer's
    // backend-assigned ID instead, which is dynamic and can change mid-flow (see
    // Solas_AddProgram_Workflow.md); since DOM order matches layer index (verified
    // live), positional (.nth) matching on the ID-agnostic attribute prefix is
    // used for those instead of threading a captured ID through every call.

    get addLayerButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- no role/label/placeholder/testid exists; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="add-layer-button"]');
    }

    get currencyFields(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-testid^="financial-layer-form-Currency-"]'
        );
    }

    policyLimitInput(layerIndex: number): Locator {
        return this.page.getByTestId(`layers.${layerIndex}.PrimaryLimit-input`);
    }

    excessInput(layerIndex: number): Locator {
        return this.page.getByTestId(`layers.${layerIndex}.PrimaryXs-input`);
    }

    minimumSigningInput(layerIndex: number): Locator {
        return this.page.getByTestId(
            `layers.${layerIndex}.MinimumSigningLine-input`
        );
    }

    writtenLineInput(layerIndex: number): Locator {
        return this.page.getByTestId(`layers.${layerIndex}.WrittenLine-input`);
    }

    signedLineInput(layerIndex: number): Locator {
        return this.page.getByTestId(`layers.${layerIndex}.SignedLine-input`);
    }

    boundPremiumInput(layerIndex: number): Locator {
        return this.page.getByTestId(
            `layers.${layerIndex}.PremiumOverride-input`
        );
    }

    estGrossPremium100Input(layerIndex: number): Locator {
        return this.page.getByTestId(
            `layers.${layerIndex}.estimatedGrossPremium100-input`
        );
    }

    estGrossPremiumShareInput(layerIndex: number): Locator {
        return this.page.getByTestId(
            `layers.${layerIndex}.estimatedGrossPremiumShare-input`
        );
    }

    launchAttemptsInput(layerIndex: number): Locator {
        return this.page.getByTestId(
            `layers.${layerIndex}.launchAttempts-input`
        );
    }

    /**
     * Resolves the layerIndex-th element matching an ID-agnostic attribute-prefix
     * selector, since DOM order matches layer index for these dynamically-ID'd fields.
     * @param {string} prefixSelector - A `[data-testid^="..."]` or `[data-ref^="..."]` CSS selector.
     * @param {number} layerIndex - The 0-based layer index.
     * @returns {Locator} The matching field for that layer.
     */
    nthLayerField(prefixSelector: string, layerIndex: number): Locator {
        const matches = this.page.locator(prefixSelector);
        // eslint-disable-next-line playwright/no-nth-methods -- DOM order matches layer index for these ID-agnostic fields.
        return matches.nth(layerIndex);
    }

    descriptionInput(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-ref^="financial-layer-form-LayerDescription-"]',
            layerIndex
        );
    }

    rpiTypeTrigger(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-testid^="financial-layer-form-RpiTypeId-"]',
            layerIndex
        );
    }

    placingBasisTrigger(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-testid^="financial-layer-form-PlacingBasisId-"]',
            layerIndex
        );
    }

    leaderSyndicateTrigger(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-testid^="financial-layer-form-LeaderSyndicateId-"]',
            layerIndex
        );
    }

    launchVehicleTrigger(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-testid^="financial-layer-form-LaunchVehicleId-"]',
            layerIndex
        );
    }

    coverRequiredTrigger(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-testid^="financial-layer-form-CoverRequired-"]',
            layerIndex
        );
    }

    earningPatternTrigger(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-testid^="financial-layer-form-EarningPatternId-"]',
            layerIndex
        );
    }

    satelliteNameInput(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-ref^="financial-layer-form-satelliteName-"]',
            layerIndex
        );
    }

    satelliteNameAlternativeInput(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-ref^="financial-layer-form-satelliteNameAlternative-"]',
            layerIndex
        );
    }

    lvServiceProviderInput(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-ref^="financial-layer-form-launchServiceProvider-"]',
            layerIndex
        );
    }

    satelliteUsageInput(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-ref^="financial-layer-form-satelliteUsage-"]',
            layerIndex
        );
    }

    umrInput(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-ref^="financial-layer-form-Umr-"]',
            layerIndex
        );
    }

    get finalizeButton(): Locator {
        return this.page.getByRole('button', { name: 'Finalize' });
    }

    // ==================== Feedback Locators ====================

    get complianceBanner(): Locator {
        return this.page.getByText(/Compliance License Check/);
    }

    get programHeading(): Locator {
        return this.page.getByRole('heading', { level: 3 });
    }

    // ==================== Actions ====================

    /**
     * Clicks "Next step" and waits for the given marker of the current step to
     * disappear, retrying the click if the wizard does not advance -- the
     * Financial Layers wizard can occasionally swallow a "Next step" click when
     * fired while the previous step's save is still in flight (see the
     * "beforeunload discards unsaved data" gotcha family in Solas_AddProgram_Workflow.md).
     * @param {Locator} currentStepMarker - An element unique to the step being left.
     * @param {number} attempts - Maximum number of click attempts (default 3).
     * @returns {Promise<void>}
     */
    async advancePastStep(
        currentStepMarker: Locator,
        attempts = 3
    ): Promise<void> {
        for (let attempt = 1; attempt <= attempts; attempt++) {
            // Check before clicking: a prior attempt may have already advanced
            // the wizard even if its own post-click check raced and errored --
            // in that case "Next step" may have already relabeled to "Finalize"
            // (a single shared button), so clicking it again would hang.
            const stillOnStep = await currentStepMarker
                .isVisible()
                .catch(() => false);
            if (!stillOnStep) {
                return;
            }

            await this.nextStepButton.click();
            await currentStepMarker
                .waitFor({ state: 'hidden', timeout: 5000 })
                .catch(() => undefined);
        }

        const stillOnStep = await currentStepMarker
            .isVisible()
            .catch(() => false);
        if (stillOnStep) {
            throw new Error(
                `Wizard did not advance past the current step after ${attempts} "Next step" clicks.`
            );
        }
    }

    /**
     * Opens a searchable combobox dropdown, types the given text to filter its
     * options, and selects the first option whose accessible name matches.
     * @param {Locator} trigger - The combobox trigger to open.
     * @param {string} typeText - The text to type into the filter box.
     * @param {boolean} exact - Whether the option name must match `typeText` exactly (default true).
     * @returns {Promise<void>}
     */
    async selectSearchableOption(
        trigger: Locator,
        typeText: string,
        exact = true
    ): Promise<void> {
        // The option list is virtualized and can detach/reflow mid-click (see
        // Solas_AddProgram_Workflow.md's Earning Pattern gotcha), and pressing
        // Enter relies on the combobox's own fuzzy-highlight, which can select a
        // *different* similarly-named option than intended (e.g. "Sat in Orbit"
        // instead of "Satellite Launch"). A forced click avoids that but risks
        // clicking stale coordinates after a reflow, hitting the wrong option
        // entirely. Re-querying the locator fresh on each retry and using a real
        // (non-forced) click is the reliable middle ground.
        //
        // Selections have also been observed to silently revert to "Select an
        // option" moments after a correct click (confirmed live on Broker and
        // Law & Jurisdiction, not just Financial Layer fields), so the whole
        // selection is verified against the trigger's own displayed text
        // afterward, and retried from scratch if it did not stick.
        const attempts = 3;
        let lastError: unknown;

        for (let attempt = 1; attempt <= attempts; attempt++) {
            try {
                await trigger.click();
                await this.page.keyboard.type(typeText);

                const matches = this.page.getByRole('option', {
                    name: typeText,
                    exact,
                });
                // eslint-disable-next-line playwright/no-nth-methods -- typed filter text can surface multiple partial matches; first is always intended.
                const match = matches.first();
                await expect(match).toBeVisible({ timeout: 10000 });
                await match.click({ timeout: 5000 });

                // Selections have also been observed to silently revert to "Select
                // an option" moments after a correct click (confirmed live on
                // Broker and Law & Jurisdiction, not just Financial Layer fields).
                await expect(trigger).toContainText(typeText, {
                    timeout: 3000,
                });
                return;
            } catch (error) {
                lastError = error;
            }
        }

        throw new Error(
            `Could not select "${typeText}" after ${attempts} attempts: ${String(lastError)}`
        );
    }

    /**
     * Fills a text/number input, tabs out to blur it, and verifies the value
     * actually stuck, retrying if not -- plain fields have also been observed
     * to silently revert or hold a stale/incorrect value after a fill (see
     * Solas_AddProgram_Workflow.md). Commas from number formatting are
     * stripped before comparing, since e.g. "20000000" renders as "20,000,000".
     * @param {Locator} field - The input to fill.
     * @param {string} value - The value to fill in.
     * @returns {Promise<void>}
     */
    async fillAndVerify(field: Locator, value: string): Promise<void> {
        const attempts = 3;

        for (let attempt = 1; attempt <= attempts; attempt++) {
            await field.fill(value);
            await field.press('Tab');

            const current = (await field.inputValue()).replace(/,/g, '');
            if (current === value) {
                return;
            }

            if (attempt === attempts) {
                throw new Error(
                    `Value "${value}" did not stick after ${attempts} attempts (field held "${current}").`
                );
            }
        }
    }

    /**
     * Fills the "Add a New Program" characteristics dialog and submits it.
     * Class of Business defaults to "Specialty" and is left untouched.
     * @param {string} lineOfBusiness - Exact Line of Business option text (e.g. "Space").
     * @param {string} zone - Exact Zone option text (e.g. "Africa").
     * @param {string} programType - Exact Program Type option text (e.g. "Satellite Launch").
     * @returns {Promise<void>}
     */
    async createProgram(
        lineOfBusiness: string,
        zone: string,
        programType: string
    ): Promise<void> {
        await this.selectSearchableOption(
            this.lineOfBusinessTrigger,
            lineOfBusiness
        );
        await this.selectSearchableOption(this.zoneInput, zone);
        await this.selectSearchableOption(this.programTypeTrigger, programType);
        await this.addDialogSubmitButton.click();
        await expect(this.clientInput).toBeVisible();
    }

    /**
     * Fills the required Initial Details fields (Client, Broker, Law & Jurisdiction,
     * Placing Office, Underwriter) and advances to the next step.
     * @param {string} client - Text to search the Client combobox by (partial match).
     * @param {string} broker - Text to search the Broker combobox by (partial match).
     * @param {string} lawJurisdiction - Text to filter the Law & Jurisdiction option by.
     * @param {string} placingOffice - Exact Placing Office option text.
     * @param {string} underwriter - Text to filter the Underwriter option by (picks the first match).
     * @returns {Promise<void>}
     */
    async fillInitialDetails(
        client: string,
        broker: string,
        lawJurisdiction: string,
        placingOffice: string,
        underwriter: string
    ): Promise<void> {
        await this.selectSearchableOption(this.clientInput, client, false);
        await this.selectSearchableOption(this.brokerInput, broker, false);
        await this.selectSearchableOption(
            this.lawJurisdictionInput,
            lawJurisdiction,
            false
        );
        await this.selectSearchableOption(
            this.placingOfficeTrigger,
            placingOffice
        );
        await this.selectSearchableOption(
            this.underwriterInput,
            underwriter,
            false
        );

        await this.advancePastStep(this.clientInput);
    }

    /**
     * Skips the optional Select Perils step.
     * @returns {Promise<void>}
     */
    async skipPerils(): Promise<void> {
        const perilsHeading = this.page.getByRole('heading', {
            name: 'Perils',
        });
        await expect(perilsHeading).toBeVisible();
        await this.advancePastStep(perilsHeading);
    }

    /**
     * Clicks the "+" button to add a new financial layer and waits for it to render.
     * @returns {Promise<void>}
     */
    async addFinancialLayer(): Promise<void> {
        const countBefore = await this.currencyFields.count();
        await this.addLayerButton.click();
        await expect(this.currencyFields).toHaveCount(countBefore + 1);
    }

    /**
     * Fills only the plain numeric fields of a financial layer (Policy Limit,
     * Excess, Minimum Signing, Written/Signed Line, Bound Premium, Est Gross
     * Premium Share). Exposed separately from fillFinancialLayer so an earlier
     * layer's numeric fields can be re-filled after adding a later layer, which
     * can silently scramble them (see Solas_AddProgram_Workflow.md's layer-swap
     * gotcha).
     * @param {number} layerIndex - The 0-based layer index.
     * @param {SatelliteLaunchLayerData} data - Sample layer data from the program factory.
     * @returns {Promise<void>}
     */
    async fillFinancialLayerNumericFields(
        layerIndex: number,
        data: SatelliteLaunchLayerData
    ): Promise<void> {
        await this.fillAndVerify(
            this.policyLimitInput(layerIndex),
            String(data.policyLimit)
        );
        await this.fillAndVerify(
            this.excessInput(layerIndex),
            String(data.excess)
        );
        await this.fillAndVerify(
            this.minimumSigningInput(layerIndex),
            String(data.minimumSigning)
        );
        await this.fillAndVerify(
            this.writtenLineInput(layerIndex),
            String(data.writtenLine)
        );
        await this.fillAndVerify(
            this.signedLineInput(layerIndex),
            String(data.signedLine)
        );
        await this.fillAndVerify(
            this.boundPremiumInput(layerIndex),
            String(data.boundPremiumShare)
        );
        await this.fillAndVerify(
            this.estGrossPremiumShareInput(layerIndex),
            String(data.estGrossPremiumShare)
        );

        // Est Gross Premium (100%) auto-calculates from the Share value above,
        // but a large auto-computed 100% figure has been linked to the created
        // program getting flagged "Marquee Client" -- pinning it to a nominal
        // value avoids that (see Solas_AddProgram_Workflow.md).
        await this.fillAndVerify(this.estGrossPremium100Input(layerIndex), '1');
    }

    /**
     * Fills a financial layer with the given sample data using the stable
     * (non-modal) fields documented in Solas_AddProgram_Workflow.md for the
     * Specialty/Space/Satellite Launch template. Earning Pattern is set last,
     * since setting it earlier can be silently reset by later field changes.
     * @param {number} layerIndex - The 0-based layer index.
     * @param {SatelliteLaunchLayerData} data - Sample layer data from the program factory.
     * @param {string} launchVehicle - Exact Launch Vehicle option text.
     * @param {string} coverRequired - Exact Cover Required option text.
     * @param {string} lloydsLeader - Text to filter the Lloyd's Leader option by (picks the first match).
     * @param {string} earningPattern - Text to filter the Earning Pattern option by (picks the first match).
     * @returns {Promise<void>}
     */
    async fillFinancialLayer(
        layerIndex: number,
        data: SatelliteLaunchLayerData,
        launchVehicle: string,
        coverRequired: string,
        lloydsLeader: string,
        earningPattern: string
    ): Promise<void> {
        await this.fillAndVerify(
            this.descriptionInput(layerIndex),
            data.description
        );
        await this.fillFinancialLayerNumericFields(layerIndex, data);

        await this.selectSearchableOption(
            this.rpiTypeTrigger(layerIndex),
            'New to Fidelis'
        );
        await this.selectSearchableOption(
            this.placingBasisTrigger(layerIndex),
            'Direct Open Market'
        );

        await this.selectSearchableOption(
            this.leaderSyndicateTrigger(layerIndex),
            lloydsLeader,
            false
        );
        await this.selectSearchableOption(
            this.launchVehicleTrigger(layerIndex),
            launchVehicle
        );

        await this.selectSearchableOption(
            this.coverRequiredTrigger(layerIndex),
            coverRequired
        );

        await this.fillAndVerify(
            this.launchAttemptsInput(layerIndex),
            String(data.launchAttempts)
        );
        await this.fillAndVerify(
            this.satelliteNameInput(layerIndex),
            data.satelliteName
        );
        await this.fillAndVerify(
            this.satelliteNameAlternativeInput(layerIndex),
            data.satelliteNameAlternative
        );
        await this.fillAndVerify(
            this.lvServiceProviderInput(layerIndex),
            data.lvServiceProvider
        );
        await this.fillAndVerify(
            this.satelliteUsageInput(layerIndex),
            data.satelliteUsage
        );
        await this.fillAndVerify(this.umrInput(layerIndex), data.umr);

        await this.selectSearchableOption(
            this.earningPatternTrigger(layerIndex),
            earningPattern,
            false
        );
    }

    /**
     * Advances past the Financial Layers step, persisting the layers to the
     * backend. The "Next step"/"Finalize" action can be the same underlying
     * button that relabels mid-transition, so this waits directly for the
     * Finalize button (an unambiguous arrival signal) rather than for the old
     * step's marker to hide.
     * @returns {Promise<void>}
     */
    async saveFinancialLayers(): Promise<void> {
        const attempts = 3;

        for (let attempt = 1; attempt <= attempts; attempt++) {
            const alreadyOnFiles = await this.finalizeButton
                .isVisible()
                .catch(() => false);
            if (alreadyOnFiles) {
                return;
            }

            await this.nextStepButton.click();
            await this.finalizeButton
                .waitFor({ state: 'visible', timeout: 5000 })
                .catch(() => undefined);
        }

        const arrived = await this.finalizeButton
            .isVisible()
            .catch(() => false);
        if (!arrived) {
            throw new Error(
                'Wizard did not advance to the Files step after clicking "Next step".'
            );
        }
    }

    /**
     * Finalizes the program, moving it out of the wizard into the standard
     * tabbed program view. This is a one-way action.
     * @returns {Promise<void>}
     */
    async finalize(): Promise<void> {
        await this.finalizeButton.click();
        await expect(this.programHeading).toBeVisible();
    }
}
