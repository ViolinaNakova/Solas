import { expect, test } from '../../../fixtures/pom/test-options';
import { generateSatelliteLaunchLayerOne } from '../../../test-data/factories/solas/program.factory';

test.describe('create Program', () => {
    test.afterEach(async ({ programDetailPage }) => {
        // REQUIRED: revert state -- decline the created program so it does not
        // remain in the active/opportunity pipeline other users read from.
        const canDecline = await programDetailPage.declinedButton
            .isVisible()
            .catch(() => false);

        if (canDecline) {
            await programDetailPage.decline();
        }
    });

    test(
        'should create a new Specialty / Space / Africa / Satellite Launch program',
        { tag: '@e2e' },
        async ({ submissionsPage, addProgramPage, programDetailPage }) => {
            const layer = generateSatelliteLaunchLayerOne();

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

            await test.step('AND the first Financial Layer is filled and saved', async () => {
                await addProgramPage.fillFirstFinancialLayer(
                    layer,
                    'FALCON 9 - SPACEX',
                    'Launch Only',
                    'Beazley',
                    'Sat Launch'
                );
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
