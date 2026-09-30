import { expect, test } from '../../../fixtures/pom/test-options';
import { generateSatelliteLaunchLayer } from '../../../test-data/factories/solas/program.factory';

test.describe('create Program', () => {
    // NOTE: intentionally no cleanup here -- created programs are meant to stay
    // active (Opportunity) in the pipeline rather than being auto-declined.
    // This deviates from this scaffold's usual "revert state you mutate" rule,
    // by explicit choice for this test.

    test(
        'should create a new Specialty / Space / Africa / Satellite Launch program',
        { tag: '@e2e' },
        async ({ submissionsPage, addProgramPage, programDetailPage }) => {
            // This flow retries several dropdown/field interactions against a
            // known-flaky live app (see Solas_AddProgram_Workflow.md), which can
            // legitimately push a full run past the default 60s test timeout.
            test.setTimeout(180_000);

            const layerOne = generateSatelliteLaunchLayer(1);
            const layerTwo = generateSatelliteLaunchLayer(2);
            const lloydsLeader = 'Beazley';

            await test.step('GIVEN the user opens the Add a New Program dialog', async () => {
                await submissionsPage.open();
                await submissionsPage.openAddProgramDialog();
            });

            await test.step('WHEN the program characteristics are selected', async () => {
                await addProgramPage.createProgram(
                    'Space',
                    'Africa',
                    'Satellite Launch'
                );
            });

            await test.step('AND the Initial Details are filled', async () => {
                await addProgramPage.fillInitialDetails(
                    'HELIOS KLINIKEN GMBH',
                    'LINK BROKER UK LTD',
                    'Other',
                    'London',
                    'Aaron'
                );
            });

            await test.step('AND Select Perils is skipped', async () => {
                await addProgramPage.skipPerils();
            });

            await test.step('AND the first Financial Layer is filled', async () => {
                await addProgramPage.fillFinancialLayer(
                    0,
                    layerOne,
                    'FALCON 9 - SPACEX',
                    'Launch Only',
                    lloydsLeader,
                    'Sat Launch'
                );
            });

            await test.step('AND a second Financial Layer is added and filled', async () => {
                await addProgramPage.addFinancialLayer();
                await addProgramPage.fillFinancialLayer(
                    1,
                    layerTwo,
                    'ARIANE 5 ECA - ARIANESPACE',
                    'Launch Only',
                    lloydsLeader,
                    'Sat Launch'
                );

                // Adding a layer can silently scramble the earlier layer's plain
                // numeric fields (see Solas_AddProgram_Workflow.md); re-fill them.
                await addProgramPage.fillFinancialLayerNumericFields(
                    0,
                    layerOne
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
});
