import { expect, test } from '../../../fixtures/pom/test-options';
import {
    generateReinsuranceMarinePeril,
    generateReinsuranceTreatyLayer,
} from '../../../test-data/factories/solas/program.factory';

test.describe('create Program - Reinsurance Marine Retro Agg', () => {
    // NOTE: intentionally no cleanup here -- created programs are meant to stay
    // active (Opportunity) in the pipeline, consistent with the other
    // create-program tests.

    test(
        'should create a new Reinsurance / Marine / Africa / Retro Agg program',
        { tag: '@e2e' },
        async ({ submissionsPage, addProgramPage, programDetailPage }) => {
            // This flow retries several dropdown/field interactions against a
            // known-flaky live app (see Solas_AddProgram_Workflow.md), which can
            // legitimately push a full run past the default 60s test timeout.
            test.setTimeout(180_000);

            const layerOne = generateReinsuranceTreatyLayer(1);
            const layerTwo = generateReinsuranceTreatyLayer(2);
            const programType = 'Retro Agg';
            const rpiType = 'New to Fidelis';
            const periodBasis = 'LOD';
            const earningPattern = 'Standard';
            const peril = generateReinsuranceMarinePeril();

            await test.step('GIVEN the user opens the Add a New Program dialog', async () => {
                await submissionsPage.open();
                await submissionsPage.openAddProgramDialog();
            });

            await test.step('WHEN the program characteristics are selected', async () => {
                await addProgramPage.createProgram(
                    'Marine',
                    'Africa',
                    programType,
                    'Reinsurance'
                );
            });

            await test.step('AND the Initial Details are filled', async () => {
                await addProgramPage.fillInitialDetailsForReinsuranceProgram(
                    'HELIOS KLINIKEN GMBH',
                    'LINK BROKER UK LTD',
                    'N/A',
                    'London',
                    'Aaron'
                );
            });

            await test.step(`AND the default peril is kept, or a random one (${peril}) is selected, and Next step is clicked`, async () => {
                await addProgramPage.selectPerilIfNoneSelected(peril);
            });

            await test.step('AND the first Financial Layer is filled', async () => {
                await addProgramPage.fillReinsuranceTreatyLayer(
                    0,
                    layerOne,
                    rpiType,
                    periodBasis,
                    earningPattern
                );
            });

            await test.step('AND a second Financial Layer is added and filled', async () => {
                await addProgramPage.addFinancialLayer();
                await addProgramPage.fillReinsuranceTreatyLayer(
                    1,
                    layerTwo,
                    rpiType,
                    periodBasis,
                    earningPattern
                );

                // Adding a layer can silently scramble the earlier layer's plain
                // numeric fields (see Solas_AddProgram_Workflow.md); re-fill them.
                await addProgramPage.fillReinsuranceTreatyLayerNumericFields(
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

            await test.step('THEN the program is created for the expected client and program type', async () => {
                await expect(programDetailPage.heading).toContainText(
                    'HELIOS KLINIKEN GMBH'
                );
                await expect(programDetailPage.programTypeBadge).toContainText(
                    programType
                );
            });
        }
    );
});
