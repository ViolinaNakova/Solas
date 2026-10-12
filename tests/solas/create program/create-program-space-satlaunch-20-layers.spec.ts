import { expect, test } from '../../../fixtures/pom/test-options';
import { generateSatelliteLaunchLayer } from '../../../test-data/factories/solas/program.factory';
import { Timeouts } from '../../../enums/util/timeouts';

test.describe('create Program - Space Satellite Launch with 20 Financial Layers', () => {
    // NOTE: intentionally no cleanup here -- created programs are meant to stay
    // active (Opportunity) in the pipeline, consistent with the other
    // create-program tests.

    test(
        'should create a new Specialty / Space / Africa / Satellite Launch program with 20 financial layers',
        { tag: '@e2e' },
        async ({ submissionsPage, addProgramPage, programDetailPage }) => {
            // 20 layers x ~15 field interactions against a known-flaky live app
            // (see Solas_AddProgram_Workflow.md) takes far longer than a
            // two-layer program.
            test.setTimeout(Timeouts.TWENTY_LAYER_PROGRAM_TEST);

            const layerCount = 20;
            const lloydsLeader = 'Beazley';
            // Odd layers reuse the documented Layer 1 sample data, even layers
            // Layer 2's, each with its matching launch vehicle.
            const layers = Array.from({ length: layerCount }, (_, index) => {
                const sample = index % 2 === 0 ? 1 : 2;
                return {
                    data: {
                        ...generateSatelliteLaunchLayer(sample),
                        description: `Layer ${index + 1}`,
                    },
                    launchVehicle:
                        sample === 1
                            ? 'FALCON 9 - SPACEX'
                            : 'ARIANE 5 ECA - ARIANESPACE',
                };
            });

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

            // Each layer is filled and saved before the next is added: adding a
            // layer while another is unsaved prompts an "Unsaved Changes" dialog
            // and renumbers the unsaved layers.
            const [firstLayer, ...laterLayers] = layers;

            await test.step('AND Financial Layer 1 is filled and saved', async () => {
                await addProgramPage.fillFinancialLayer(
                    0,
                    firstLayer.data,
                    firstLayer.launchVehicle,
                    'Launch Only',
                    lloydsLeader,
                    'Sat Launch'
                );
                await addProgramPage.saveLayerChanges();
            });

            for (const [offset, layer] of laterLayers.entries()) {
                const index = offset + 1;

                await test.step(`AND Financial Layer ${index + 1} is added, filled and saved`, async () => {
                    await addProgramPage.addFinancialLayer(index + 1);
                    await addProgramPage.fillFinancialLayer(
                        index,
                        layer.data,
                        layer.launchVehicle,
                        'Launch Only',
                        lloydsLeader,
                        'Sat Launch'
                    );
                    await addProgramPage.saveLayerChanges();
                });
            }

            await test.step(`AND all ${layerCount} Financial Layers are present`, async () => {
                await expect(addProgramPage.currencyFields).toHaveCount(
                    layerCount
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
