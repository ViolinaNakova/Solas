import { expect, test } from '../../../../fixtures/pom/test-options';
import { Timeouts } from '../../../../enums/util/timeouts';
import { generateSpaceProgramType } from '../../../../test-data/factories/solas/program.factory';
import { lifecycleReferenceData as ref } from '../../../../test-data/static/solas/reference-data';
import {
    spaceDefaultZone,
    spaceFinancialLayerHiddenFields,
    spaceFinancialLayerProgramTypeFields,
    spaceFinancialLayerVisibleFields,
} from '../../../../test-data/static/solas/space-visibility';

// NGUI-2105 -- Solas Financial Layers Visibility Conditions for Specialty /
// Space. Reaching the Financial Layers step saves the program (as an
// Opportunity).
// NOTE: intentionally no cleanup -- consistent with the other program
// creation specs, and the Decline dialog currently rejects automated
// cleanup rationales with an HTTP 400 ("Appears to be an automated test
// comment"), so the existing decline() cleanup no longer works on QA.
test.describe('visibility conditions - Space - Financial Layers', () => {
    test(
        'should show only the Space-relevant Financial Layer fields for the Program Type',
        { tag: '@regression' },
        async ({ submissionsPage, addProgramPage }) => {
            test.setTimeout(Timeouts.ADD_PROGRAM_WIZARD_TEST);

            const programType = generateSpaceProgramType();
            test.info().annotations.push({
                type: 'Program Type',
                description: programType,
            });

            const programTypeFields = Object.entries(
                spaceFinancialLayerProgramTypeFields
            );
            const shownForProgramType = programTypeFields
                .filter(([, programTypes]) =>
                    programTypes.includes(programType)
                )
                .map(([label]) => label);
            const hiddenForProgramType = programTypeFields
                .filter(
                    ([, programTypes]) => !programTypes.includes(programType)
                )
                .map(([label]) => label);

            await test.step(`GIVEN a Specialty / Space / ${programType} program is created`, async () => {
                await submissionsPage.open();
                await submissionsPage.openAddProgramDialog();
                await addProgramPage.createProgram(
                    'Space',
                    spaceDefaultZone,
                    programType
                );
                await addProgramPage.fillInitialDetails(
                    ref.client,
                    ref.broker,
                    ref.lawJurisdiction,
                    ref.placingOffice,
                    ref.underwriter
                );
                await addProgramPage.skipPerils();
            });

            await test.step('WHEN the Financial Layers step is shown', async () => {
                await addProgramPage.waitForLayerGrid();
            });

            await test.step('THEN every always-visible Space field is shown', async () => {
                for (const label of spaceFinancialLayerVisibleFields) {
                    await expect(
                        addProgramPage.financialLayerFieldLabel(label),
                        `"${label}" should be visible`
                    ).toBeVisible();
                }
            });

            await test.step(`AND the fields for ${programType} are shown`, async () => {
                for (const label of shownForProgramType) {
                    await expect(
                        addProgramPage.financialLayerFieldLabel(label),
                        `"${label}" should be visible for ${programType}`
                    ).toBeVisible();
                }
            });

            await test.step(`AND the fields for other Program Types are hidden`, async () => {
                for (const label of hiddenForProgramType) {
                    await expect(
                        addProgramPage.financialLayerFieldLabel(label),
                        `"${label}" should be hidden for ${programType}`
                    ).toBeHidden();
                }
            });

            await test.step('AND fields not used by Space are hidden', async () => {
                for (const label of spaceFinancialLayerHiddenFields) {
                    await expect(
                        addProgramPage.financialLayerFieldLabel(label),
                        `"${label}" should not be visible for Space`
                    ).toBeHidden();
                }
            });
        }
    );
});
