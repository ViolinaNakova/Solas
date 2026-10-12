// Existing QA1 reference records picked (not created) by the program lifecycle
// E2E scenarios. They must already exist in the environment: tests select
// them from searchable dropdowns rather than creating shared master data.
export const lifecycleReferenceData = {
    client: 'HELIOS KLINIKEN GMBH',
    broker: 'LINK BROKER UK LTD',
    // Broker contacts are a global list; selecting an existing one avoids
    // adding contacts to the broker on every run.
    brokerContact: 'Toby Oldham',
    lawJurisdiction: 'Other',
    placingOffice: 'London',
    underwriter: 'Aaron',
    lloydsLeader: 'Beazley',
} as const;
