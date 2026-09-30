import { expect, test } from '../../../fixtures/pom/test-options';
import { generatePVWarTerrorReProgramData } from '../../../test-data/factories/solas/program.factory';

test.describe('create Program - Political Violence War & Terror Re', () => {
    // NOTE: intentionally no cleanup here -- created programs are meant to stay
    // active (Opportunity) in the pipeline, consistent with the Satellite
    // Launch create-program test.

    test(
        'should create a new Specialty / Political Violence War & Terror Re program',
        { tag: '@e2e' },
        async ({ submissionsPage, addProgramPage, programDetailPage }) => {
            test.setTimeout(120_000);
            const data = generatePVWarTerrorReProgramData();

            await test.step('GIVEN the user opens the Add a New Program dialog', async () => {
                await submissionsPage.open();
                await submissionsPage.openAddProgramDialog();
            });

            await test.step('WHEN the program characteristics are selected', async () => {
                await addProgramPage.createProgram(
                    'Political Violence War & Terror Re',
                    'Africa',
                    'PV Treaty – Agg XL'
                );
            });

            await test.step('AND the Initial Details are filled, including Belongs to Pool', async () => {
                await addProgramPage.fillInitialDetailsForTerrorProgram(
                    'HELIOS KLINIKEN GMBH',
                    'LINK BROKER UK LTD',
                    'England',
                    String(data.terrorTiv),
                    String(data.biTiv),
                    'London',
                    'Aaron',
                    'Domestic'
                );
            });

            await test.step('AND Select Perils is skipped', async () => {
                await addProgramPage.skipPerils();
            });

            await test.step('AND the Financial Layer is filled', async () => {
                await addProgramPage.fillTreatyFinancialLayer(
                    0,
                    String(data.policyLimit),
                    'Aggregate Excess of Loss',
                    'LOD'
                );
            });

            await test.step('AND the Financial Layers are saved', async () => {
                await addProgramPage.saveFinancialLayers();
            });

            await test.step('AND the program is finalized', async () => {
                await addProgramPage.finalize();
            });

            await test.step('THEN the program is created for the expected client', async () => {
                await expect(programDetailPage.heading).toContainText(
                    'HELIOS KLINIKEN GMBH'
                );
            });
        }
    );

    // FIXME: NGUI-3388 -- "Belongs to Pool"/"Pool" values are not persisted by
    // the create flow. Confirmed still reproducing 2026-09-18 on program 449217:
    // the upsertprogram request correctly sends BelongsToPool/TerrorPoolId, but
    // getprograminfo returns both as null after finalize + a fresh page reload.
    // Unskip once the ticket is resolved.
    // eslint-disable-next-line playwright/no-skipped-test -- intentional, see FIXME above.
    test.skip(
        'belongs to Pool and Pool values persist after program creation (NGUI-3388)',
        { tag: '@regression' },
        async ({ submissionsPage, addProgramPage, programDetailPage }) => {
            test.setTimeout(120_000);
            const data = generatePVWarTerrorReProgramData();

            await test.step('GIVEN a program is created with Belongs to Pool set', async () => {
                await submissionsPage.open();
                await submissionsPage.openAddProgramDialog();
                await addProgramPage.createProgram(
                    'Political Violence War & Terror Re',
                    'Africa',
                    'PV Treaty – Agg XL'
                );
                await addProgramPage.fillInitialDetailsForTerrorProgram(
                    'HELIOS KLINIKEN GMBH',
                    'LINK BROKER UK LTD',
                    'England',
                    String(data.terrorTiv),
                    String(data.biTiv),
                    'London',
                    'Aaron',
                    'Domestic'
                );
                await addProgramPage.skipPerils();
                await addProgramPage.fillTreatyFinancialLayer(
                    0,
                    String(data.policyLimit),
                    'Aggregate Excess of Loss',
                    'LOD'
                );
                await addProgramPage.saveFinancialLayers();
                await addProgramPage.finalize();
            });

            await test.step('WHEN the program is reloaded from a fresh page load', async () => {
                const programId = await programDetailPage.getProgramId();
                await programDetailPage.reloadDetails(programId);
            });

            await test.step('THEN Belongs to Pool and Pool still show the values set at creation', async () => {
                await expect(programDetailPage.belongsToPoolValue).toHaveText(
                    'Yes'
                );
                await expect(programDetailPage.poolValue).toHaveText(
                    'Domestic'
                );
            });
        }
    );
});
