import { expect, test } from '../../../fixtures/pom/test-options';
import {
    generateProgramLifecycleData,
    generateSatelliteLaunchLayer,
} from '../../../test-data/factories/solas/program.factory';
import { lifecycleReferenceData as ref } from '../../../test-data/static/solas/reference-data';
import {
    DropSpot,
    LifecycleOption,
    StatusButton,
    UnderwritingStatus,
} from '../../../enums/solas/program-lifecycle';
import { Timeouts } from '../../../enums/util/timeouts';
import { viewports } from '../../../config/util/viewport';

test.describe('program lifecycle E2E scenario - Space / Satellite Launch', () => {
    // A desktop-sized window keeps header buttons, check items and section
    // content on-screen and out from under the sticky tab bar and toasts.
    test.use({ viewport: viewports.desktopFullHd });

    // NOTE: intentionally no cleanup -- a Bound (Signed Off) program cannot be
    // declined, and created programs are kept, consistent with the
    // create-program tests.

    test(
        'should take a Specialty / Space / Africa / Satellite Launch program from creation to Bound (Signed Off)',
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

            const layers = [
                generateSatelliteLaunchLayer(1),
                generateSatelliteLaunchLayer(2),
            ];
            const lifecycle = generateProgramLifecycleData();
            const estGrossPremiumShares = layers.map(
                (layer) => layer.estGrossPremiumShare
            );
            // Notes show the author's login name, i.e. the account's email
            // local part.
            const noteAuthor = process.env.APP_EMAIL!.split('@')[0];

            await test.step('GIVEN a new Space / Satellite Launch program is created and finalized', async () => {
                await submissionsPage.open();
                await submissionsPage.openAddProgramDialog();
                await addProgramPage.createProgram(
                    'Space',
                    'Africa',
                    'Satellite Launch'
                );
                await addProgramPage.fillInitialDetails(
                    ref.client,
                    ref.broker,
                    ref.lawJurisdiction,
                    ref.placingOffice,
                    ref.underwriter
                );
                await addProgramPage.skipPerils();
                await addProgramPage.fillFinancialLayer(
                    0,
                    layers[0],
                    'FALCON 9 - SPACEX',
                    'Launch Only',
                    ref.lloydsLeader,
                    'Sat Launch'
                );
                await addProgramPage.addFinancialLayer();
                await addProgramPage.fillFinancialLayer(
                    1,
                    layers[1],
                    'ARIANE 5 ECA - ARIANESPACE',
                    'Launch Only',
                    ref.lloydsLeader,
                    'Sat Launch'
                );
                // Adding a layer can scramble the earlier layer's numeric
                // fields (see Solas_AddProgram_Workflow.md); re-fill them.
                await addProgramPage.fillFinancialLayerNumericFields(
                    0,
                    layers[0]
                );
                await addProgramPage.saveFinancialLayers();
                await addProgramPage.finalize();
                await expect(programDetailPage.heading).toContainText(
                    ref.client
                );
                await expect(
                    programDetailPage.underwritingStatusBadge
                ).toHaveText(UnderwritingStatus.OPPORTUNITY);
            });

            await test.step('WHEN a file is uploaded to the Submission drop spot', async () => {
                await programFilesPage.uploadFile(
                    lifecycle.submissionFileName,
                    DropSpot.SUBMISSION
                );
            });

            await test.step('THEN the program moves to Partial Submission', async () => {
                await expect(
                    programDetailPage.underwritingStatusBadge
                ).toHaveText(UnderwritingStatus.PARTIAL_SUBMISSION, {
                    timeout: Timeouts.STATUS_CHANGE,
                });
            });

            await test.step('WHEN the Compliance License, Pricing and Referral tasks are completed', async () => {
                await programTasksPage.resolveComplianceLicenseCheck(
                    LifecycleOption.COMPLIANCE_RESOLUTION
                );
                await programTasksPage.completePricing();
                await programTasksPage.completeReferral(
                    LifecycleOption.REFERRAL_APPROVED
                );
            });

            await test.step('AND the UMCC note is added from the Risk Card task', async () => {
                await programTasksPage.openRiskCardNotesTask();
                await riskCardPage.saveTemplateNote(
                    LifecycleOption.NOTE_TEMPLATE_UMCC
                );
                await expect(riskCardPage.savedNote(noteAuthor)).toBeVisible();
                await riskCardPage.close();
            });

            await test.step('AND the Hotline outcome is populated from the Tasks panel', async () => {
                await programTasksPage.populateHotlineOutcome(
                    LifecycleOption.HOTLINE_PROCEED
                );
            });

            await test.step('AND the program is moved to Submission Ready after filling Quoted RPI and ULR', async () => {
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

            await test.step('AND the UMCC outcome is recorded as Reviewed', async () => {
                await programTasksPage.openUmccOutcomeOptions();
                await expect(programTasksPage.umccOutcomeOptions).toHaveText([
                    LifecycleOption.UMCC_REVIEWED,
                    LifecycleOption.UMCC_DECLINED,
                    LifecycleOption.UMCC_BRING_BACK,
                ]);
                await programTasksPage.completeUmccOutcome(
                    LifecycleOption.UMCC_REVIEWED,
                    layers.map((layer) => layer.writtenLine)
                );
            });

            await test.step('AND a quote is uploaded and the program moved to Quoted/Awaiting FOT', async () => {
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

            await test.step('THEN FOT Received is optional: FOT Received and Bound are offered together', async () => {
                await programDetailPage.waitForStatusButton(StatusButton.BOUND);
                await expect(
                    programDetailPage.statusButton(StatusButton.FOT_RECEIVED)
                ).toBeVisible();
            });

            await test.step('WHEN the program is bound directly, skipping FOT Received', async () => {
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

            await test.step('AND the broker contact, contract review, final slip and all checks are completed', async () => {
                // Pre Sign-Off requires a broker contact; the selection saves
                // immediately, so edit mode is simply left by reloading. Start
                // from a fresh load so the page has settled after the Bound
                // status change.
                await programDetailPage.reloadProgram();
                await programDetailPage.editDetails();
                await programDetailPage.addBrokerContact(ref.brokerContact);
                await programDetailPage.reloadProgram();
                await programDetailPage.openTab('Details');
                await programDetailPage.sections.expand('programDetails');
                await programDetailPage.sections.expand('initialDetails');
                await expect(
                    programDetailPage.brokerContactsValue
                ).toContainText(ref.brokerContact);

                await programChecksPage.completeContractReview(
                    LifecycleOption.CONTRACT_DRAFT_RECEIVED,
                    LifecycleOption.CONTRACT_NO_REVIEW_REQUIRED
                );
                await programFilesPage.uploadFile(
                    lifecycle.signingFileName,
                    DropSpot.SIGNING
                );
                await programChecksPage.checkAll();

                // The checks must survive a reload, i.e. really be saved.
                await programDetailPage.reloadProgram();
                await programChecksPage.openChecks();
                await expect(programChecksPage.uncheckedItems).toHaveCount(0);
            });

            await test.step('AND the program is moved to Pre Sign-Off', async () => {
                await programDetailPage.changeStatus(
                    StatusButton.PRE_SIGN_OFF,
                    UnderwritingStatus.BOUND_PRE_SIGN_OFF
                );
            });

            await test.step('THEN the program can be signed off', async () => {
                await programDetailPage.changeStatus(
                    StatusButton.SIGN_OFF,
                    UnderwritingStatus.BOUND_SIGNED_OFF
                );
                await expect(
                    programDetailPage.underwritingStatusBadge
                ).toHaveText(UnderwritingStatus.BOUND_SIGNED_OFF);
            });
        }
    );
});
