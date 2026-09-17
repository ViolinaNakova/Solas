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
 * Generates sample data for Layer 1 of a Specialty/Space/Satellite Launch financial layer,
 * following the documented sample-data pattern in Solas_AddProgram_Workflow.md.
 * Free-text fields are randomized per run to avoid colliding with prior test data.
 * @returns {SatelliteLaunchLayerData} Layer 1 sample data.
 */
export function generateSatelliteLaunchLayerOne(): SatelliteLaunchLayerData {
    return {
        description: 'Layer 1',
        policyLimit: 20_000_000,
        excess: 500_000,
        minimumSigning: 15,
        writtenLine: 20,
        signedLine: 20,
        boundPremiumShare: 500_000,
        estGrossPremiumShare: 2_000_000,
        launchAttempts: 1,
        satelliteName: `test satellite ${faker.string.alphanumeric(6)}`,
        satelliteNameAlternative: faker.string.alphanumeric(6),
        lvServiceProvider: faker.string.alphanumeric(6),
        satelliteUsage: faker.string.alphanumeric(6),
        umr: `UMR-TEST-${faker.string.numeric(6)}`,
    };
}
