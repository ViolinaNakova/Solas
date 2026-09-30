import { faker } from '@faker-js/faker';

export type SatelliteLaunchLayerData = {
    description: string;
    policyLimit: number;
    excess: number;
    minimumSigning: number;
    writtenLine: number;
    signedLine: number;
    boundPremiumShare: number;
    estGrossPremiumShare: number;
    launchAttempts: number;
    satelliteName: string;
    satelliteNameAlternative: string;
    lvServiceProvider: string;
    satelliteUsage: string;
    umr: string;
};

/**
 * Generates sample data for a Specialty/Space/Satellite Launch financial layer,
 * following the documented sample-data pattern in Solas_AddProgram_Workflow.md.
 * Free-text fields are randomized per run to avoid colliding with prior test data.
 * @param {1 | 2} layerNumber - Which documented layer's sample values to use.
 * @returns {SatelliteLaunchLayerData} Sample data for that layer.
 */
export function generateSatelliteLaunchLayer(
    layerNumber: 1 | 2
): SatelliteLaunchLayerData {
    const base =
        layerNumber === 1
            ? {
                  description: 'Layer 1',
                  policyLimit: 20_000_000,
                  excess: 500_000,
                  minimumSigning: 15,
                  writtenLine: 20,
                  signedLine: 20,
                  boundPremiumShare: 500_000,
                  estGrossPremiumShare: 2_000_000,
                  launchAttempts: 1,
              }
            : {
                  description: 'Layer 2',
                  policyLimit: 35_000_000,
                  excess: 1_000_000,
                  minimumSigning: 10,
                  writtenLine: 25,
                  signedLine: 25,
                  boundPremiumShare: 875_000,
                  estGrossPremiumShare: 3_500_000,
                  launchAttempts: 2,
              };

    return {
        ...base,
        satelliteName: `test satellite ${faker.string.alphanumeric(6)}`,
        satelliteNameAlternative: faker.string.alphanumeric(6),
        lvServiceProvider: faker.string.alphanumeric(6),
        satelliteUsage: faker.string.alphanumeric(6),
        umr: `UMR-TEST-${faker.string.numeric(6)}`,
    };
}

export type PVWarTerrorReProgramData = {
    terrorTiv: number;
    biTiv: number;
    policyLimit: number;
};

/**
 * Generates sample data for a Specialty/Political Violence War & Terror Re
 * program's Terror TIV/B.I. TIV (Initial Details) and Policy Limit (Financial
 * Layer) fields, per Solas_AddProgram_Workflow.md's "Run 8" template.
 * @returns {PVWarTerrorReProgramData} Sample data for the program.
 */
export function generatePVWarTerrorReProgramData(): PVWarTerrorReProgramData {
    return {
        terrorTiv: faker.number.int({ min: 5_000_000, max: 20_000_000 }),
        biTiv: faker.number.int({ min: 500_000, max: 2_000_000 }),
        policyLimit: faker.number.int({ min: 5_000_000, max: 20_000_000 }),
    };
}
