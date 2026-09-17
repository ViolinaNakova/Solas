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

    // ==================== Locators: Financial Layers (first/default layer) ====================

    get policyLimitInput(): Locator {
        return this.page.getByTestId('layers.0.PrimaryLimit-input');
    }

    get excessInput(): Locator {
        return this.page.getByTestId('layers.0.PrimaryXs-input');
    }

    get minimumSigningInput(): Locator {
        return this.page.getByTestId('layers.0.MinimumSigningLine-input');
    }

    get writtenLineInput(): Locator {
        return this.page.getByTestId('layers.0.WrittenLine-input');
    }

    get signedLineInput(): Locator {
        return this.page.getByTestId('layers.0.SignedLine-input');
    }

    get boundPremiumInput(): Locator {
        return this.page.getByTestId('layers.0.PremiumOverride-input');
    }

    get estGrossPremiumShareInput(): Locator {
        return this.page.getByTestId(
            'layers.0.estimatedGrossPremiumShare-input'
        );
    }

    get launchAttemptsInput(): Locator {
        return this.page.getByTestId('layers.0.launchAttempts-input');
    }

    // These fields are keyed by the layer's backend-assigned ID (which can change
    // mid-flow -- see the "layer ID can change under a temp -1 layer" gotcha in
    // Solas_AddProgram_Workflow.md). Since this page object only ever drives a
    // single layer, a prefix match is used instead of threading a captured ID
    // through every call, so these stay valid even if the real ID changes underneath.

    get descriptionInput(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-ref^="financial-layer-form-LayerDescription-"]'
        );
    }

    get rpiTypeTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-testid^="financial-layer-form-RpiTypeId-"]'
        );
    }

    get placingBasisTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-testid^="financial-layer-form-PlacingBasisId-"]'
        );
    }

    get leaderSyndicateTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-testid^="financial-layer-form-LeaderSyndicateId-"]'
        );
    }

    get launchVehicleTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-testid^="financial-layer-form-LaunchVehicleId-"]'
        );
    }

    get coverRequiredTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-testid^="financial-layer-form-CoverRequired-"]'
        );
    }

    get earningPatternTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-testid^="financial-layer-form-EarningPatternId-"]'
        );
    }

    get satelliteNameInput(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-ref^="financial-layer-form-satelliteName-"]'
        );
    }

    get satelliteNameAlternativeInput(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-ref^="financial-layer-form-satelliteNameAlternative-"]'
        );
    }

    get lvServiceProviderInput(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-ref^="financial-layer-form-launchServiceProvider-"]'
        );
    }

    get satelliteUsageInput(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-ref^="financial-layer-form-satelliteUsage-"]'
        );
    }

    get umrInput(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator('[data-ref^="financial-layer-form-Umr-"]');
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
            await this.nextStepButton.click();

            try {
                await expect(currentStepMarker).not.toBeVisible({
                    timeout: 5000,
                });
                return;
            } catch {
                if (attempt === attempts) {
                    throw new Error(
                        `Wizard did not advance past the current step after ${attempts} "Next step" clicks.`
                    );
                }
            }
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
        await trigger.click();
        await this.page.keyboard.type(typeText);

        const matches = this.page.getByRole('option', {
            name: typeText,
            exact,
        });
        // eslint-disable-next-line playwright/no-nth-methods -- typed filter text can surface multiple partial matches; first is always intended.
        const match = matches.first();
        await expect(match).toBeVisible({ timeout: 15000 });

        // The option list is virtualized and can detach/reflow mid-click (see
        // Solas_AddProgram_Workflow.md's Earning Pattern gotcha). Pressing Enter
        // relies on the combobox's own fuzzy-highlight, which can select a
        // *different* similarly-named option than the one just confirmed visible
        // (e.g. "Sat in Orbit" instead of "Satellite Launch") -- force-clicking
        // the exact match we already verified is more reliable than trusting Enter.
        // eslint-disable-next-line playwright/no-force-option -- the virtualized list can report the option as unstable mid-reflow even though it's the correct, already-visible target.
        await match.click({ force: true });
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
     * Fills the default financial layer with the given sample data using the
     * stable (non-modal) fields documented in Solas_AddProgram_Workflow.md for
     * the Specialty/Space/Satellite Launch template. Earning Pattern is set
     * last, since setting it earlier can be silently reset by later field changes.
     * @param {SatelliteLaunchLayerData} data - Sample layer data from the program factory.
     * @param {string} launchVehicle - Exact Launch Vehicle option text.
     * @param {string} coverRequired - Exact Cover Required option text.
     * @param {string} lloydsLeader - Text to filter the Lloyd's Leader option by (picks the first match).
     * @param {string} earningPattern - Text to filter the Earning Pattern option by (picks the first match).
     * @returns {Promise<void>}
     */
    async fillFirstFinancialLayer(
        data: SatelliteLaunchLayerData,
        launchVehicle: string,
        coverRequired: string,
        lloydsLeader: string,
        earningPattern: string
    ): Promise<void> {
        await this.descriptionInput.fill(data.description);
        await this.policyLimitInput.fill(String(data.policyLimit));
        await this.policyLimitInput.press('Tab');
        await this.excessInput.fill(String(data.excess));
        await this.minimumSigningInput.fill(String(data.minimumSigning));
        await this.writtenLineInput.fill(String(data.writtenLine));
        await this.signedLineInput.fill(String(data.signedLine));
        await this.boundPremiumInput.fill(String(data.boundPremiumShare));
        await this.estGrossPremiumShareInput.fill(
            String(data.estGrossPremiumShare)
        );

        await this.selectSearchableOption(
            this.rpiTypeTrigger,
            'New to Fidelis'
        );
        await this.selectSearchableOption(
            this.placingBasisTrigger,
            'Direct Open Market'
        );

        await this.selectSearchableOption(
            this.leaderSyndicateTrigger,
            lloydsLeader,
            false
        );
        await this.selectSearchableOption(
            this.launchVehicleTrigger,
            launchVehicle
        );

        await this.selectSearchableOption(
            this.coverRequiredTrigger,
            coverRequired
        );

        await this.launchAttemptsInput.fill(String(data.launchAttempts));
        await this.satelliteNameInput.fill(data.satelliteName);
        await this.satelliteNameAlternativeInput.fill(
            data.satelliteNameAlternative
        );
        await this.lvServiceProviderInput.fill(data.lvServiceProvider);
        await this.satelliteUsageInput.fill(data.satelliteUsage);
        await this.umrInput.fill(data.umr);

        await this.selectSearchableOption(
            this.earningPatternTrigger,
            earningPattern,
            false
        );
    }

    /**
     * Advances past the Financial Layers step, persisting the layer to the backend.
     * @returns {Promise<void>}
     */
    async saveFinancialLayers(): Promise<void> {
        await this.advancePastStep(this.policyLimitInput);
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
