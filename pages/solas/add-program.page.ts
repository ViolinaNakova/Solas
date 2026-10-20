import { expect, Locator, Page } from '@playwright/test';
import {
    ReinsuranceTreatyLayerData,
    SatelliteLaunchLayerData,
} from '../../test-data/factories/solas/program.factory';
import { escapeRegExp, formatShortDate } from '../../helpers/util/util';
import { Timeouts } from '../../enums/util/timeouts';

export class AddProgramPage {
    constructor(private readonly page: Page) {}

    // ==================== Locators: Characteristics Dialog ====================
    // Class of Business, Line of Business, Program Type and Placing Office triggers
    // expose neither a role/label/placeholder nor a data-testid in this app -- data-ref
    // is the only stable identifier available, used here as the sanctioned last resort.

    get classOfBusinessTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- no role/label/placeholder/testid exists; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="classOfBusiness-input-trigger"]');
    }

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

    get inceptionInput(): Locator {
        return this.page.getByTestId('inception-input');
    }

    get expiryInput(): Locator {
        return this.page.getByTestId('expiry-input');
    }

    get inceptionValidationMessage(): Locator {
        return this.page.getByText('Please select inception date');
    }

    get expiryValidationMessage(): Locator {
        return this.page.getByText('Please select expiry date');
    }

    get nextStepButton(): Locator {
        return this.page.getByRole('button', { name: 'Next step' });
    }

    // ==================== Locators: Initial Details (Terror-specific) ====================
    // Political Violence War & Terror Re (and similar Terror Line of Business
    // templates) add these fields to Initial Details -- see
    // Solas_AddProgram_Workflow.md "Run 8".

    get terrorTivInput(): Locator {
        return this.page.getByTestId('terrorTiv-input');
    }

    get biTivInput(): Locator {
        return this.page.getByTestId('biTiv-input');
    }

    get airOccCodeTrigger(): Locator {
        return this.page.getByTestId('airCode-input');
    }

    get cessionConsiderationTrigger(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- no role/label/placeholder/testid exists; data-ref is the only stable attribute.
        return this.page.locator(
            '[data-ref="cessionConsideration-input-trigger"]'
        );
    }

    get belongsToPoolToggle(): Locator {
        return this.page.getByTestId('belongsToPool-input');
    }

    get poolTrigger(): Locator {
        return this.page.getByTestId('terrorPoolId-input');
    }

    // ==================== Locators: Initial Details (visibility) ====================
    // Each wizard section renders its fields in a `wizard-step-content`
    // container; the Initial Details one is the only one holding Client.

    get initialDetailsSection(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- section container has no role/label/testid; data-ref is the only stable attribute.
        return this.page
            .locator('[data-ref="wizard-step-content"]')
            .filter({ has: this.clientInput });
    }

    initialDetailsFieldLabel(label: string): Locator {
        // Matched on <label> elements only: getByText would also hit dropdown
        // placeholders that repeat the field name (e.g. "MGA Code"). Required
        // fields render a separate "*" marker after the label text.
        const caption = new RegExp(`^${escapeRegExp(label)}\\s*\\*?$`);
        // eslint-disable-next-line playwright/no-raw-locators -- field captions are <label> elements without a for= target, so getByLabel cannot reach them.
        const labels = this.initialDetailsSection.locator('label');
        return labels.filter({ hasText: caption });
    }

    get reinsuranceSwitch(): Locator {
        return this.initialDetailsSection.getByRole('switch', {
            name: 'Re',
            exact: true,
        });
    }

    get hasSurplusLineBrokerSwitch(): Locator {
        return this.initialDetailsSection.getByRole('switch', {
            name: 'Has Surplus Line Broker',
        });
    }

    get binderLineSlipSwitch(): Locator {
        return this.initialDetailsSection.getByRole('switch', {
            name: 'Binder / Line Slip',
        });
    }

    get triaEligibleSwitch(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- switch has no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="tria-eligible-switch"]');
    }

    get addClientButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- icon-only button with no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="client-add-client-button"]');
    }

    get addLocalBrokerButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- icon-only button with no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="add-local-broker-button"]');
    }

    // ==================== Locators: Select Perils ====================

    get perilsHeading(): Locator {
        return this.page.getByRole('heading', { name: 'Perils' });
    }

    get perilsRequiredMessage(): Locator {
        return this.page.getByText('One or more perils must be selected');
    }

    perilButton(perilCode: string): Locator {
        // Button names are "<code> <description>" (e.g. "EQ Earthquake"); older
        // builds rendered the code alone, so match the code as the first word.
        return this.page.getByRole('button', {
            name: new RegExp(`^${perilCode}(\\s|$)`),
        });
    }

    // ==================== Locators: Financial Layers (visibility) ====================
    // Row headers of the layer grid are divs with a `<field>-label` data-ref.
    // Some data-refs do not match their caption (e.g. "carrier-label" reads
    // "Carrier Binder"), so they are matched by caption; the program header's
    // own "-label" captions ("Insured:") and the grid's floating sticky copy
    // of the header column ("floating-header-*") are excluded.

    financialLayerFieldLabel(label: string): Locator {
        const caption = new RegExp(`^${escapeRegExp(label)}\\s*\\*?$`);
        // eslint-disable-next-line playwright/no-raw-locators -- grid row headers have no role/label/testid; data-ref is the only stable attribute.
        const rowHeaders = this.page.locator(
            '[data-ref$="-label"]:not([data-ref^="page-header-"]):not([data-ref^="floating-header-"])'
        );
        return rowHeaders.filter({ hasText: caption });
    }

    // ==================== Locators: Financial Layers ====================
    // Fields are located by on-screen column position (DOM order), not by the
    // `layers.N.*` array index or the backend layer ID: a newly added unsaved
    // layer takes index 0 and shifts saved layers' indices up (verified live on
    // program 411639), and its ID is a temporary -1 until saved. Positional
    // (.nth) matching on the ID-agnostic attribute suffix/prefix is stable.

    get addLayerButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- no role/label/placeholder/testid exists; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="add-layer-button"]');
    }

    get saveLayersButton(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- icon-only button with no accessible name or testid; data-ref is the only stable attribute.
        return this.page.locator('[data-ref="summary-save-financialLayers"]');
    }

    get layersSavedMessage(): Locator {
        return this.page.getByText('Financial layers saved');
    }

    get unsavedChangesDialog(): Locator {
        return this.page.getByRole('alertdialog', { name: 'Unsaved Changes' });
    }

    get currencyFields(): Locator {
        // eslint-disable-next-line playwright/no-raw-locators -- attribute-prefix match has no getByTestId equivalent.
        return this.page.locator(
            '[data-testid^="financial-layer-form-Currency-"]'
        );
    }

    policyLimitInput(layerIndex: number): Locator {
        return this.treatyColumnInput('PrimaryLimit', layerIndex);
    }

    excessInput(layerIndex: number): Locator {
        return this.treatyColumnInput('PrimaryXs', layerIndex);
    }

    minimumSigningInput(layerIndex: number): Locator {
        return this.treatyColumnInput('MinimumSigningLine', layerIndex);
    }

    writtenLineInput(layerIndex: number): Locator {
        return this.treatyColumnInput('WrittenLine', layerIndex);
    }

    signedLineInput(layerIndex: number): Locator {
        return this.treatyColumnInput('SignedLine', layerIndex);
    }

    boundPremiumInput(layerIndex: number): Locator {
        return this.treatyColumnInput('PremiumOverride', layerIndex);
    }

    estGrossPremium100Input(layerIndex: number): Locator {
        return this.treatyColumnInput('estimatedGrossPremium100', layerIndex);
    }

    estGrossPremiumShareInput(layerIndex: number): Locator {
        return this.treatyColumnInput('estimatedGrossPremiumShare', layerIndex);
    }

    launchAttemptsInput(layerIndex: number): Locator {
        return this.treatyColumnInput('launchAttempts', layerIndex);
    }

    // ==================== Locators: Financial Layers (Treaty template) ====================
    // PV Treaty/Terrorism Treaty Program Types use a distinct spreadsheet-style
    // layer grid with its own field set (see Solas_AddProgram_Workflow.md "Run 8"),
    // sharing only Placing Basis with the Satellite Launch template.

    treatyPolicyLimitInput(layerIndex: number): Locator {
        return this.page.getByTestId(
            `layers.${layerIndex}.aggregateLimit-input`
        );
    }

    // Reinsurance treaty templates (e.g. Marine / Retro Agg) are located by
    // on-screen column position instead of the `layers.N.*` index: clicking "+"
    // gives the NEW layer index 0 while it renders as the last column (verified
    // live on program 410199), so the index does not identify a column once a
    // second layer exists.

    treatyColumnInput(fieldName: string, columnIndex: number): Locator {
        return this.nthLayerField(
            `input[data-testid$=".${fieldName}-input"]`,
            columnIndex
        );
    }

    // Limit/Excess field names vary by template: aggregate-based (e.g. Marine /
    // Retro Agg: aggregateLimit/aggregateExcess) vs per-occurrence (e.g.
    // Personal Accident / Excess of Loss: PrimaryLimit/PrimaryXs). A template
    // renders only one pair, so either name is matched.

    treatyLimitInput(columnIndex: number): Locator {
        return this.nthLayerField(
            'input[data-testid$=".aggregateLimit-input"], input[data-testid$=".PrimaryLimit-input"]',
            columnIndex
        );
    }

    treatyExcessInput(columnIndex: number): Locator {
        return this.nthLayerField(
            'input[data-testid$=".aggregateExcess-input"], input[data-testid$=".PrimaryXs-input"]',
            columnIndex
        );
    }

    periodBasisTrigger(layerIndex: number): Locator {
        return this.nthLayerField(
            '[data-testid^="financial-layer-form-PeriodBasisId-"]',
            layerIndex
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
     * Selects an option in a searchable dropdown only when it is not already
     * the displayed value -- templates pre-fill some dropdowns (e.g. Placing
     * Basis, and Period Basis on a layer added via "+"), and re-picking an
     * already-selected option is unnecessary churn on a flaky control.
     * @param {Locator} trigger - The combobox trigger to check/open.
     * @param {string} optionText - Exact option text expected to be selected.
     * @returns {Promise<void>}
     */
    async ensureOptionSelected(
        trigger: Locator,
        optionText: string
    ): Promise<void> {
        const current = (await trigger.innerText()).trim();
        if (current === optionText) {
            return;
        }

        await this.selectSearchableOption(trigger, optionText);
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
            // Some layer text fields (e.g. Description) render readonly until
            // clicked (click-to-edit), so focus the field before filling. A
            // grid re-render (e.g. right after a dropdown selection in the same
            // layer) can drop the edit state, leaving the field readonly; click
            // again on the next attempt instead of hanging in fill().
            await field.click();
            // fill() auto-waits for the field to become editable.
            const filled = await field
                .fill(value, { timeout: Timeouts.FIELD_EDITABLE })
                .then(() => true)
                .catch(() => false);
            if (!filled) {
                if (attempt === attempts) {
                    throw new Error(
                        `Field stayed readonly after ${attempts} click attempts; could not fill "${value}".`
                    );
                }
                continue;
            }
            await field.press('Tab');

            // Percentage fields re-render with padded decimals (e.g. "15" ->
            // "15.0000000"), so numeric values are compared numerically.
            const current = (await field.inputValue()).replace(/,/g, '');
            const sameNumber =
                value.trim() !== '' &&
                current.trim() !== '' &&
                Number(current) === Number(value);
            if (current === value || sameNumber) {
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
     * Class of Business defaults to "Specialty" and is left untouched unless
     * a different value is passed.
     * @param {string} lineOfBusiness - Exact Line of Business option text (e.g. "Space").
     * @param {string} zone - Exact Zone option text (e.g. "Africa").
     * @param {string} programType - Exact Program Type option text (e.g. "Satellite Launch").
     * @param {string} classOfBusiness - Optional exact Class of Business option text (e.g. "Reinsurance").
     * @returns {Promise<void>}
     */
    async createProgram(
        lineOfBusiness: string,
        zone: string,
        programType: string,
        classOfBusiness?: string
    ): Promise<void> {
        if (classOfBusiness) {
            await this.ensureOptionSelected(
                this.classOfBusinessTrigger,
                classOfBusiness
            );
        }
        await this.selectSearchableOption(
            this.lineOfBusinessTrigger,
            lineOfBusiness
        );
        // Some Lines of Business pre-select a Zone (Space -> "Worldwide").
        // Clicking an already-selected Zone option deselects it, and an "Add"
        // following that deselect/reselect intermittently never opens the
        // wizard -- so a pre-selected Zone is left untouched.
        await this.ensureOptionSelected(this.zoneInput, zone);
        await this.selectSearchableOption(this.programTypeTrigger, programType);
        await this.addDialogSubmitButton.click();
        await expect(this.clientInput).toBeVisible({
            timeout: Timeouts.APP_RENDER,
        });
    }

    /**
     * Fills the required Initial Details fields (Client, Broker, Law & Jurisdiction,
     * Placing Office, Underwriter, Inception = today) and advances to the next step.
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
        await this.setInceptionDate();

        await this.advancePastStep(this.clientInput);
    }

    /**
     * Sets the Inception date (DD-MMM-YYYY). The app no longer pre-fills
     * Inception/Expiry, but it auto-derives Expiry (Inception + 1 year - 1 day)
     * once Inception is set, so only Inception is filled here.
     * @param {Date} date - Inception date (defaults to today).
     * @returns {Promise<void>}
     */
    async setInceptionDate(date: Date = new Date()): Promise<void> {
        await this.fillAndVerify(this.inceptionInput, formatShortDate(date));
        await expect(this.expiryInput).not.toHaveValue('');
    }

    /**
     * Fills the Terror-specific Initial Details fields (Terror TIV, B.I. TIV,
     * AIR Occ. Code, Cession Consideration) required by Political Violence War
     * & Terror Re and similar Terror Line of Business templates.
     * @param {string} terrorTiv - Terror TIV numeric value.
     * @param {string} biTiv - B.I. TIV numeric value.
     * @returns {Promise<void>}
     */
    async fillTerrorFields(terrorTiv: string, biTiv: string): Promise<void> {
        await this.fillAndVerify(this.terrorTivInput, terrorTiv);
        await this.fillAndVerify(this.biTivInput, biTiv);
        await this.selectSearchableOption(
            this.airOccCodeTrigger,
            '301 - Residential - General residential'
        );

        // Cession Consideration has no required-field marker in the UI, but the
        // backend rejects a null CessionOpportunityTypeId with an HTTP 400 on
        // create (see Solas_AddProgram_Workflow.md "Run 8") -- always set it,
        // even to the semantically-empty "N/A" option.
        await this.selectSearchableOption(
            this.cessionConsiderationTrigger,
            'N/A'
        );
    }

    /**
     * Clicks an Initial Details switch and waits until its checked state
     * flips, so fields that depend on it have had the chance to re-render.
     * @param {Locator} toggle - The switch to click.
     * @returns {Promise<void>}
     */
    async flipSwitch(toggle: Locator): Promise<void> {
        const wasChecked =
            (await toggle.getAttribute('aria-checked')) === 'true';
        await toggle.click();
        await expect(toggle).toHaveAttribute(
            'aria-checked',
            String(!wasChecked)
        );
    }

    /**
     * Changes the Zone of the program being created in Initial Details.
     * @param {string} zone - Exact Zone option text (e.g. "US Nationwide").
     * @returns {Promise<void>}
     */
    async changeZone(zone: string): Promise<void> {
        await this.selectSearchableOption(this.zoneInput, zone);
    }

    /**
     * Selects the Placing Office of the program being created.
     * @param {string} placingOffice - Exact Placing Office option text (e.g. "Dublin").
     * @returns {Promise<void>}
     */
    async selectPlacingOffice(placingOffice: string): Promise<void> {
        await this.selectSearchableOption(
            this.placingOfficeTrigger,
            placingOffice
        );
    }

    /**
     * Toggles "Belongs to pool" on and selects a Pool value, which reveals the
     * Pool dropdown. Used to exercise the NGUI-3388 pool-persistence check.
     * @param {string} pool - Exact Pool option text (e.g. "Domestic").
     * @returns {Promise<void>}
     */
    async setBelongsToPool(pool: string): Promise<void> {
        await this.belongsToPoolToggle.click();
        await this.selectSearchableOption(this.poolTrigger, pool);
    }

    /**
     * Fills the Initial Details required for Political Violence War & Terror Re
     * (and similar Terror Line of Business) templates: Client, Broker, Law &
     * Jurisdiction, Terror fields, Belongs to Pool/Pool, Placing Office, and
     * Underwriter -- then advances to the next step.
     * @param {string} client - Text to search the Client combobox by (partial match).
     * @param {string} broker - Text to search the Broker combobox by (partial match).
     * @param {string} lawJurisdiction - Text to filter the Law & Jurisdiction option by (this template uses a country/state picker, e.g. "England").
     * @param {string} terrorTiv - Terror TIV numeric value.
     * @param {string} biTiv - B.I. TIV numeric value.
     * @param {string} placingOffice - Exact Placing Office option text.
     * @param {string} underwriter - Text to filter the Underwriter option by (picks the first match).
     * @param {string} pool - Exact Pool option text to select after toggling Belongs to Pool on.
     * @returns {Promise<void>}
     */
    async fillInitialDetailsForTerrorProgram(
        client: string,
        broker: string,
        lawJurisdiction: string,
        terrorTiv: string,
        biTiv: string,
        placingOffice: string,
        underwriter: string,
        pool: string
    ): Promise<void> {
        await this.selectSearchableOption(this.clientInput, client, false);
        await this.selectSearchableOption(this.brokerInput, broker, false);
        await this.selectSearchableOption(
            this.lawJurisdictionInput,
            lawJurisdiction,
            false
        );
        await this.fillTerrorFields(terrorTiv, biTiv);
        await this.setBelongsToPool(pool);
        await this.selectSearchableOption(
            this.placingOfficeTrigger,
            placingOffice
        );
        await this.selectSearchableOption(
            this.underwriterInput,
            underwriter,
            false
        );
        await this.setInceptionDate();

        await this.advancePastStep(this.clientInput);
    }

    /**
     * Fills the Initial Details required by Reinsurance templates (Client,
     * Broker, Cession Consideration, Placing Office, Underwriter) and advances
     * to the next step. Law & Jurisdiction is not required on these templates;
     * Cession Consideration is always set because the backend rejects a null
     * value on create (see Solas_AddProgram_Workflow.md "Run 8").
     * @param {string} client - Text to search the Client combobox by (partial match).
     * @param {string} broker - Text to search the Broker combobox by (partial match).
     * @param {string} cessionConsideration - Exact Cession Consideration option text (e.g. "N/A").
     * @param {string} placingOffice - Exact Placing Office option text.
     * @param {string} underwriter - Text to filter the Underwriter option by (picks the first match).
     * @returns {Promise<void>}
     */
    async fillInitialDetailsForReinsuranceProgram(
        client: string,
        broker: string,
        cessionConsideration: string,
        placingOffice: string,
        underwriter: string
    ): Promise<void> {
        await this.selectSearchableOption(this.clientInput, client, false);
        await this.selectSearchableOption(this.brokerInput, broker, false);
        await this.selectSearchableOption(
            this.cessionConsiderationTrigger,
            cessionConsideration
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
        await this.setInceptionDate();

        await this.advancePastStep(this.clientInput);
    }

    /**
     * Selects the given perils on the Select Perils step and advances to the
     * next step. Required on templates where at least one peril must be
     * selected before "Next step" is enabled (e.g. Reinsurance / Marine).
     * @param {string[]} perilCodes - Peril codes to select, as shown on the buttons (e.g. "TC").
     * @returns {Promise<void>}
     */
    async selectPerils(perilCodes: string[]): Promise<void> {
        await expect(this.perilsHeading).toBeVisible();

        for (const perilCode of perilCodes) {
            await this.perilButton(perilCode).click();
        }

        await expect(this.nextStepButton).toBeEnabled();
        await this.advancePastStep(this.perilsHeading);
    }

    /**
     * On the Select Perils step, keeps any peril the template pre-selects and
     * goes straight to "Next step"; only when none is selected (the "One or
     * more perils must be selected" message is shown) is the given peril
     * clicked first.
     * @param {string} perilCode - Peril code to select when none is pre-selected (e.g. "TC").
     * @returns {Promise<void>}
     */
    async selectPerilIfNoneSelected(perilCode: string): Promise<void> {
        await expect(this.perilsHeading).toBeVisible();

        if (await this.perilsRequiredMessage.isVisible()) {
            await this.perilButton(perilCode).click();
            await expect(this.perilsRequiredMessage).toBeHidden();
        }

        await expect(this.nextStepButton).toBeEnabled();
        await this.advancePastStep(this.perilsHeading);
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
     * Waits for the Financial Layers grid to render at least one layer, which
     * can be slow after entering the step or after a save.
     * @returns {Promise<void>}
     */
    async waitForLayerGrid(): Promise<void> {
        // eslint-disable-next-line playwright/no-nth-methods -- any rendered layer proves the grid has loaded.
        await expect(this.currencyFields.first()).toBeVisible({
            timeout: Timeouts.LAYER_GRID_LOAD,
        });
    }

    /**
     * Saves any pending layer changes, then clicks the "+" button to add a new
     * financial layer and waits for it to render. Saving first avoids the
     * "Unsaved Changes" dialog, which renumbers unsaved layers on confirm.
     * @param {number} expectedCount - Optional layer count expected after the add; when given, the grid is first awaited at one fewer, since it briefly re-renders with fewer columns after a save.
     * @returns {Promise<void>}
     */
    async addFinancialLayer(expectedCount?: number): Promise<void> {
        await this.waitForLayerGrid();
        if (await this.saveLayersButton.isEnabled()) {
            await this.saveLayerChanges();
        }
        if (expectedCount !== undefined) {
            await expect(this.currencyFields).toHaveCount(expectedCount - 1, {
                timeout: Timeouts.LAYER_GRID_LOAD,
            });
        }
        const countBefore = await this.currencyFields.count();
        await this.addLayerButton.click();
        await expect(this.currencyFields).toHaveCount(
            expectedCount ?? countBefore + 1
        );
    }

    /**
     * Saves the Financial Layers grid in place (the grid's own "Save" button,
     * without leaving the step). Adding a layer while another is unsaved
     * prompts an "Unsaved Changes" dialog and renumbers the unsaved layers, so
     * multi-layer flows save each filled layer before adding the next one.
     * @returns {Promise<void>}
     */
    async saveLayerChanges(): Promise<void> {
        await expect(this.saveLayersButton).toBeEnabled();
        await this.saveLayersButton.click();
        // eslint-disable-next-line playwright/no-nth-methods -- earlier saves' toasts can still be stacked; any one confirms this save.
        await expect(this.layersSavedMessage.first()).toBeVisible();
        await expect(this.saveLayersButton).toBeDisabled();
        await expect(this.unsavedChangesDialog).toBeHidden();
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
     * Fills only the financial layer fields every Space Program Type needs to
     * save the layer and pass the Bound status gate (Description, the plain
     * numeric fields, RPI Type, Placing Basis -- Period Basis then defaults
     * to "LOD" -- and Earning Pattern, which Bound requires). Program Type
     * specific fields (Launch Vehicle, Satellite Name, Orbit Type, ...) are
     * optional and left empty, so this works for any Space Program Type.
     * Earning Pattern is set last, since later field changes can reset it.
     * @param {number} layerIndex - The 0-based layer index.
     * @param {SatelliteLaunchLayerData} data - Sample layer data from the program factory (only its description and numeric values are used).
     * @param {string} rpiType - Exact RPI Type option text.
     * @param {string} placingBasis - Exact Placing Basis option text.
     * @param {string} earningPattern - Exact Earning Pattern option text.
     * @returns {Promise<void>}
     */
    async fillRequiredSpaceFinancialLayer(
        layerIndex: number,
        data: SatelliteLaunchLayerData,
        rpiType: string,
        placingBasis: string,
        earningPattern: string
    ): Promise<void> {
        await this.waitForLayerGrid();
        await this.fillAndVerify(
            this.descriptionInput(layerIndex),
            data.description
        );
        await this.fillFinancialLayerNumericFields(layerIndex, data);
        await this.selectSearchableOption(
            this.rpiTypeTrigger(layerIndex),
            rpiType
        );
        await this.selectSearchableOption(
            this.placingBasisTrigger(layerIndex),
            placingBasis
        );
        await this.selectSearchableOption(
            this.earningPatternTrigger(layerIndex),
            earningPattern
        );
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
        await this.waitForLayerGrid();
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
     * Fills a Treaty-template financial layer's minimal required fields (Policy
     * Limit, Placing Basis, Period Basis) -- the spreadsheet-style grid used by
     * PV Treaty/Terrorism Treaty Program Types, distinct from the Satellite
     * Launch modal-driven template (see Solas_AddProgram_Workflow.md "Run 8").
     * @param {number} layerIndex - The 0-based layer index.
     * @param {string} policyLimit - Policy Limit numeric value.
     * @param {string} placingBasis - Exact Placing Basis option text.
     * @param {string} periodBasis - Exact Period Basis option text.
     * @returns {Promise<void>}
     */
    async fillTreatyFinancialLayer(
        layerIndex: number,
        policyLimit: string,
        placingBasis: string,
        periodBasis: string
    ): Promise<void> {
        await this.fillAndVerify(
            this.treatyPolicyLimitInput(layerIndex),
            policyLimit
        );
        await this.selectSearchableOption(
            this.placingBasisTrigger(layerIndex),
            placingBasis
        );
        await this.selectSearchableOption(
            this.periodBasisTrigger(layerIndex),
            periodBasis
        );
    }

    /**
     * Fills only the plain numeric fields of a Reinsurance treaty layer (Policy
     * Limit, Excess -- aggregate or per-occurrence, per template -- Minimum Signing, Written/Signed Line, Bound Premium).
     * Exposed separately so an earlier layer can be re-filled after adding a
     * later one, which can silently scramble them (see
     * Solas_AddProgram_Workflow.md's layer-swap gotcha).
     * @param {number} columnIndex - The 0-based on-screen layer column.
     * @param {ReinsuranceTreatyLayerData} data - Sample layer data from the program factory.
     * @returns {Promise<void>}
     */
    async fillReinsuranceTreatyLayerNumericFields(
        columnIndex: number,
        data: ReinsuranceTreatyLayerData
    ): Promise<void> {
        await this.fillAndVerify(
            this.treatyLimitInput(columnIndex),
            String(data.policyLimit)
        );
        await this.fillAndVerify(
            this.treatyExcessInput(columnIndex),
            String(data.excess)
        );
        await this.fillAndVerify(
            this.treatyColumnInput('MinimumSigningLine', columnIndex),
            String(data.minimumSigning)
        );
        await this.fillAndVerify(
            this.treatyColumnInput('WrittenLine', columnIndex),
            String(data.writtenLine)
        );
        await this.fillAndVerify(
            this.treatyColumnInput('SignedLine', columnIndex),
            String(data.signedLine)
        );
        await this.fillAndVerify(
            this.treatyColumnInput('PremiumOverride', columnIndex),
            String(data.boundPremiumShare)
        );
    }

    /**
     * Fills a Reinsurance treaty financial layer (e.g. Marine / Retro Agg,
     * Personal Accident / Excess of Loss) with
     * the stable non-modal fields: Description, the plain numeric fields, UMR,
     * RPI Type, Period Basis and Earning Pattern. Placing Basis is pre-filled by
     * the template and left as-is. Earning Pattern is set last, since setting
     * it earlier can be silently reset by later field changes.
     * @param {number} columnIndex - The 0-based on-screen layer column.
     * @param {ReinsuranceTreatyLayerData} data - Sample layer data from the program factory.
     * @param {string} rpiType - Exact RPI Type option text.
     * @param {string} periodBasis - Exact Period Basis option text.
     * @param {string} earningPattern - Exact Earning Pattern option text.
     * @returns {Promise<void>}
     */
    async fillReinsuranceTreatyLayer(
        columnIndex: number,
        data: ReinsuranceTreatyLayerData,
        rpiType: string,
        periodBasis: string,
        earningPattern: string
    ): Promise<void> {
        await this.fillAndVerify(
            this.descriptionInput(columnIndex),
            data.description
        );
        await this.fillReinsuranceTreatyLayerNumericFields(columnIndex, data);
        await this.fillAndVerify(this.umrInput(columnIndex), data.umr);

        await this.ensureOptionSelected(
            this.rpiTypeTrigger(columnIndex),
            rpiType
        );
        await this.ensureOptionSelected(
            this.periodBasisTrigger(columnIndex),
            periodBasis
        );
        await this.ensureOptionSelected(
            this.earningPatternTrigger(columnIndex),
            earningPattern
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

            // While a prior click's save is in flight, "Next step" stays disabled
            // and then relabels to "Finalize" (detaching), so a retry click can
            // time out even though the wizard advanced -- fall through to the
            // Finalize check instead of failing.
            await this.nextStepButton
                .click({ timeout: 5000 })
                .catch(() => undefined);
            await this.finalizeButton
                .waitFor({ state: 'visible', timeout: 10000 })
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
