import { expect, test } from '../../../../fixtures/pom/test-options';
import {
    generateProgramLifecycleData,
    generateSatelliteLaunchLayer,
    generateSpaceTaskLifecycleProgramType,
} from '../../../../test-data/factories/solas/program.factory';
import { lifecycleReferenceData as ref } from '../../../../test-data/static/solas/reference-data';
import {
    spaceDefaultZone,
    spaceEarningPatternByProgramType,
    spaceLayerChecksHiddenFields,
    spaceLayerChecksProgramTypeFields,
    spaceLayerChecksVisibleFields,
} from '../../../../test-data/static/solas/space-visibility';
import {
    DropSpot,
    LifecycleOption,
    StatusButton,
    UnderwritingStatus,
} from '../../../../enums/solas/program-lifecycle';
import { Timeouts } from '../../../../enums/util/timeouts';
import { viewports } from '../../../../config/util/viewport';

// NGUI-2107 -- Solas Layer Checks Visibility Conditions for Specialty / Space.
// The Checks tab (and its Layer Checks section) only exists once the program
// is Bound, so the program is taken through the lifecycle first.
// Space Reinsurance is not picked: it generates no lifecycle tasks and stops
// at NBI, so it cannot be bound through this flow (see the NGUI-2107 report).
// NOTE: intentionally no cleanup -- a Bound program cannot be declined, and
// created programs are kept, consistent with the other lifecycle tests.
test.describe('visibility conditions - Space - Layer Checks', () => {
    // A desktop-sized window keeps header buttons, check items and section
    // content on-screen and out from under the sticky tab bar and toasts.
    test.use({ viewport: viewports.desktopFullHd });

    test(
        'should show only the Space-relevant Layer Checks fields for the Program Type once Bound',
        { tag: '@e2e' },
        async ({
            submissionsPage,
            addProgramPage,
            programDetailPage,
            programFilesPage,
            programTasksPage,
            programLayersPage,
            programChecksPage,
            riskCardPage,
        }) => {
            test.setTimeout(Timeouts.PROGRAM_LIFECYCLE_TEST);

            const programType = generateSpaceTaskLifecycleProgramType();
            test.info().annotations.push({
                type: 'Program Type',
                description: programType,
            });
            const earningPattern =
                spaceEarningPatternByProgramType[programType];
            const layer = generateSatelliteLaunchLayer(1);
            const lifecycle = generateProgramLifecycleData();
            const estGrossPremiumShares = [layer.estGrossPremiumShare];
            // Notes show the author's login name, i.e. the account's email
            // local part.
            const noteAuthor = process.env.APP_EMAIL!.split('@')[0];

            const programTypeFields = Object.entries(
                spaceLayerChecksProgramTypeFields
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

            await test.step(`GIVEN a Specialty / Space / ${programType} program is created and finalized`, async () => {
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
                await addProgramPage.fillRequiredSpaceFinancialLayer(
                    0,
                    layer,
                    LifecycleOption.RPI_TYPE_NEW_TO_FIDELIS,
                    LifecycleOption.PLACING_BASIS_DIRECT_OPEN_MARKET,
                    earningPattern
                );
                await addProgramPage.saveFinancialLayers();
                await addProgramPage.finalize();
                await expect(
                    programDetailPage.underwritingStatusBadge
                ).toHaveText(UnderwritingStatus.OPPORTUNITY);
                test.info().annotations.push({
                    type: 'Program ID',
                    description: await programDetailPage.getProgramId(),
                });
            });

            await test.step('AND a submission file is uploaded (Partial Submission)', async () => {
                await programFilesPage.uploadFile(
                    lifecycle.submissionFileName,
                    DropSpot.SUBMISSION
                );
                await expect(
                    programDetailPage.underwritingStatusBadge
                ).toHaveText(UnderwritingStatus.PARTIAL_SUBMISSION, {
                    timeout: Timeouts.STATUS_CHANGE,
                });
            });

            await test.step('AND the Compliance, Pricing, Referral, UMCC note and Hotline tasks are completed', async () => {
                await programTasksPage.resolveComplianceLicenseCheck(
                    LifecycleOption.COMPLIANCE_RESOLUTION
                );
                await programTasksPage.completePricing();
                await programTasksPage.completeReferral(
                    LifecycleOption.REFERRAL_APPROVED
                );
                await programTasksPage.openRiskCardNotesTask();
                await riskCardPage.saveTemplateNote(
                    LifecycleOption.NOTE_TEMPLATE_UMCC
                );
                await expect(riskCardPage.savedNote(noteAuthor)).toBeVisible();
                await riskCardPage.close();
                await programTasksPage.populateHotlineOutcome(
                    LifecycleOption.HOTLINE_PROCEED
                );
            });

            await test.step('AND the program is moved to Submission Ready', async () => {
                await programDetailPage.changeStatusWithRequiredFields(
                    StatusButton.SUBMISSION_READY,
                    UnderwritingStatus.SUBMISSION_READY,
                    () =>
                        programLayersPage.fillStatusGateFields(
                            UnderwritingStatus.SUBMISSION_READY,
                            estGrossPremiumShares,
                            lifecycle,
                            LifecycleOption.PLACEMENT_TYPE_NA
                        )
                );
            });

            await test.step('AND the UMCC outcome is Reviewed and a quote moves it to Quoted/Awaiting FOT', async () => {
                await programTasksPage.openUmccOutcomeOptions();
                await programTasksPage.completeUmccOutcome(
                    LifecycleOption.UMCC_REVIEWED,
                    [layer.writtenLine]
                );
                await programFilesPage.uploadFile(
                    lifecycle.quoteFileName,
                    DropSpot.QUOTE
                );
                await programDetailPage.changeStatusWithRequiredFields(
                    StatusButton.QUOTED_AWAITING_FOT,
                    UnderwritingStatus.QUOTED_AWAITING_FOT,
                    () =>
                        programLayersPage.fillStatusGateFields(
                            UnderwritingStatus.QUOTED_AWAITING_FOT,
                            estGrossPremiumShares,
                            lifecycle,
                            LifecycleOption.PLACEMENT_TYPE_NA
                        )
                );
            });

            await test.step('AND the program is Bound', async () => {
                await programDetailPage.changeStatusWithRequiredFields(
                    StatusButton.BOUND,
                    UnderwritingStatus.BOUND,
                    async () => {
                        await programLayersPage.fillStatusGateFields(
                            UnderwritingStatus.BOUND,
                            estGrossPremiumShares,
                            lifecycle,
                            LifecycleOption.PLACEMENT_TYPE_NA
                        );
                        await programDetailPage.editDetails();
                        await programDetailPage.selectClientSize(
                            LifecycleOption.CLIENT_SIZE_LARGE_RISK
                        );
                        await programDetailPage.saveDetails();
                    }
                );
            });

            await test.step('WHEN the Checks tab is opened', async () => {
                await programDetailPage.reloadProgram();
                await programChecksPage.openChecks();
                await expect(
                    programChecksPage.layerChecksFieldLabel('ID')
                ).toBeVisible();
            });

            await test.step('THEN every always-visible Layer Checks field is shown', async () => {
                for (const label of spaceLayerChecksVisibleFields) {
                    await expect(
                        programChecksPage.layerChecksFieldLabel(label),
                        `"${label}" should be visible`
                    ).toBeVisible();
                }
            });

            await test.step(`AND the fields for ${programType} are shown`, async () => {
                for (const label of shownForProgramType) {
                    await expect(
                        programChecksPage.layerChecksFieldLabel(label),
                        `"${label}" should be visible for ${programType}`
                    ).toBeVisible();
                }
            });

            await test.step('AND the fields for other Program Types are hidden', async () => {
                for (const label of hiddenForProgramType) {
                    await expect(
                        programChecksPage.layerChecksFieldLabel(label),
                        `"${label}" should be hidden for ${programType}`
                    ).toBeHidden();
                }
            });

            await test.step('AND fields not used by Space Layer Checks are hidden', async () => {
                for (const label of spaceLayerChecksHiddenFields) {
                    await expect(
                        programChecksPage.layerChecksFieldLabel(label),
                        `"${label}" should not be visible in Layer Checks`
                    ).toBeHidden();
                }
            });
        }
    );
});
