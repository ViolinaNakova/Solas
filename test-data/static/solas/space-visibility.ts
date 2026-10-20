// Visibility rules for the Initial Details section of a Specialty / Space
// program (NGUI-2019). Label texts were captured live from QA via
// playwright-cli and are matched without the trailing required "*" marker.

// Space Program Types offered by the Add a New Program dialog. All four render
// the same Initial Details field set.
export const spaceProgramTypes = [
    'Sat Launch & Orbit',
    'Satellite in Orbit',
    'Satellite Launch',
    'Space Reinsurance',
] as const;

export type SpaceProgramType = (typeof spaceProgramTypes)[number];

// Space Program Types that follow the task-driven lifecycle (Partial
// Submission -> Submission Ready -> Quoted/Awaiting FOT -> Bound). Space
// Reinsurance generates no lifecycle tasks and moves Partial Submission ->
// NBI with no further status button, so it cannot be bound the same way.
export const spaceProgramTypesWithTaskLifecycle = [
    'Sat Launch & Orbit',
    'Satellite in Orbit',
    'Satellite Launch',
] as const satisfies readonly SpaceProgramType[];

export type SpaceTaskLifecycleProgramType =
    (typeof spaceProgramTypesWithTaskLifecycle)[number];

// Earning Pattern a financial layer needs to pass the Bound status gate,
// which rejects patterns that do not fit the Program Type ("Earning Pattern
// is not valid"); verified live on QA.
export const spaceEarningPatternByProgramType: Readonly<
    Record<SpaceTaskLifecycleProgramType, string>
> = {
    'Satellite in Orbit': 'Standard',
    'Sat Launch & Orbit': 'Sat Launch (Orbital/Non-Orbital)',
    'Satellite Launch': 'Sat Launch (Orbital/Non-Orbital)',
};

// Zone the Add a New Program dialog pre-selects for Space (not a US zone).
export const spaceDefaultZone = 'Worldwide';

// Fields NGUI-2019 marks "Visible" with no visibility condition.
export const spaceInitialDetailsVisibleFields = [
    'Class of Business',
    'Line of Business',
    'Client',
    'Re',
    'Client Size',
    'Zone',
    'Program Name',
    'Program Type',
    'Broker',
    'Broker Contact',
    'Local Broker',
    'Cession Consideration',
    'Law & Jurisdiction',
    'Binder / Line Slip',
    'Prior Submit',
    'Controlled by Ops',
    'Exposure Tags',
] as const;

// Fields NGUI-2019 marks "Visible" only once a condition is met, so they are
// hidden on a fresh Space program (Re off, Binder off, Surplus Line Broker
// off, non-US zone, Placing Office not selected).
export const spaceInitialDetailsConditionalFields = [
    'Original Insured',
    'CBI Consumer',
    'Surplus Line Broker',
    'License number',
    'TRIA Eligible',
    'TRIA Taken up',
    'US Business Placement',
    'MGA Code',
] as const;

// Fields NGUI-2019 marks "Not Visible" for Space. Only labels confirmed to
// exist on another Line of Business in QA are listed, so a hidden assertion
// cannot pass merely because the label text is wrong.
export const spaceInitialDetailsHiddenFields = [
    'Fleet TIV',
    'Vessels in Fleet',
    'Requires LOC',
    'AIR Occ. Code',
    'B.I. TIV',
    'Terror TIV',
    'Est Month Close',
    'Marketing',
    'Obligor Name',
    'Obligor Country',
    'Guarantor',
    "Guarantor's Country",
    'Transaction Description',
    'Risk Code',
    'Policy Reference',
    'Program Priority',
    'Enable Structure Changes',
    'Tariff Vulnerability Indicator',
    'Is SRT',
    'Additional Insured Airlines',
    'Cirium Operator',
    'Cirium N/A',
    'Usage Types',
    'Buildings TIV',
    'Contents TIV',
    'Others TIV',
    'Total Insured Value',
    'CTE Sublimit',
    'ORG Process',
    'Belongs to pool',
    'Pool',
    'Reinsurance Pool',
] as const;

// Values that satisfy the NGUI-2019 visibility conditions.
export const spaceVisibilityTriggers = {
    // Any US zone (IsUsZone == true) reveals the TRIA fields.
    usZone: 'US Nationwide',
    // "Placing Office = FIID" -- FIID is the Dublin placing office.
    fiidPlacingOffice: 'Dublin',
    // Label the Client field switches to when Re is toggled on.
    reinsuredClientLabel: 'Reinsured',
} as const;

// ==================== Financial Layers (NGUI-2105) ====================
// Row headers of the Financial Layers grid, captured live from QA via
// playwright-cli and matched without the trailing required "*" marker.

// Fields NGUI-2105 marks "Visible" with no additional condition.
export const spaceFinancialLayerVisibleFields = [
    'ID',
    'Sort Order',
    'On',
    'Not Placed',
    'Stack/Clash',
    'Carrier Binder',
    'Carrier',
    'Stamp Reference',
    'Inception Date',
    'Expiry Date',
    'Description',
    'Currency',
    "Lloyd's Risk Codes",
    'Policy Limit',
    'Excess',
    'Minimum Signing',
    'Written Line',
    'Signed Line',
    'Order %',
    'Prob of Closing',
    'UMCC Line',
    'UMCC Date',
    'Bound Premium (Share)',
    'Deductions',
    'Commissions',
    'Profit Commission',
    'Amount Quoted (Share)',
    'Est Gross Premium (100%)',
    'Est Gross Premium (Share)',
    'RPI & RARC',
    'Differential',
    'RPI Type',
    'GELR%',
    'ULR%',
    'Leader',
    "Lloyd's Leader",
    'Weighted EPI',
    'EPI Rationale',
    'UMR',
    'Placing Basis',
    'Period Basis',
    'Earning Pattern',
    'Placement Type',
    'Bureau Settled',
    'Gross Pricing',
    'Net Pricing',
    'Operations',
    'Backup',
    'PML',
    'Contributes To RDS',
    'Gross Loss Ratio',
    'Cover Required',
    'Satellite Name Alternative',
    'Satellite Failure Rate',
    'Fidelis Failure Rate',
    'Satellite Usage',
] as const;

const inOrbitProgramTypes: readonly SpaceProgramType[] = [
    'Satellite in Orbit',
    'Sat Launch & Orbit',
    'Space Reinsurance',
];

const launchProgramTypes: readonly SpaceProgramType[] = [
    'Sat Launch & Orbit',
    'Satellite Launch',
    'Space Reinsurance',
];

// Fields NGUI-2105 shows only for the listed Program Types (hidden otherwise).
export const spaceFinancialLayerProgramTypeFields: Readonly<
    Record<string, readonly SpaceProgramType[]>
> = {
    'Orbit Type': inOrbitProgramTypes,
    'Satellite Model': inOrbitProgramTypes,
    'Satellite Man. Country': inOrbitProgramTypes,
    'Satellite Value': inOrbitProgramTypes,
    'Satellite Operator': inOrbitProgramTypes,
    'Design Life': inOrbitProgramTypes,
    'End of Life': inOrbitProgramTypes,
    'Satellite Name': ['Satellite in Orbit', 'Satellite Launch'],
    'Coverage Period (months)': ['Sat Launch & Orbit'],
    'Launch Vehicle': launchProgramTypes,
    'LV Service Provider': launchProgramTypes,
    'Launch Attempts': launchProgramTypes,
    'Launch Failures': launchProgramTypes,
    'Scheduled Launch Date': launchProgramTypes,
    // Not in NGUI-2105 (which lists it unconditionally); hiding it for
    // Satellite in Orbit was a later required change, confirmed with QA.
    'Actual Launch Date': launchProgramTypes,
};

// Fields NGUI-2105 marks "Not Visible" for Space. Only labels confirmed to
// exist on another Line of Business in QA are listed, so a hidden assertion
// cannot pass merely because the label text is wrong.
export const spaceFinancialLayerHiddenFields = [
    'Risk Card',
    'Layer Sub-limits',
    'Bound Premium (100%)',
    'Deductible',
    'Quoted ROL',
    'Gross Base Rate',
    'Repayment Frequency',
    'Profit to PML',
    '$ Cap. Usage',
    'Cover Type',
    'Coverage/Limits/Exposures',
    'Composite Terms',
    'PML Rate',
    'Amount to Aggs',
    'Grace Period',
    'EML %',
    'Combined Ratio',
] as const;

// ==================== Layer Checks (NGUI-2107) ====================
// Row headers of the Checks tab's Layer Checks grid (shown once the program
// is Bound), captured live from QA via playwright-cli.

// Fields NGUI-2107 marks "Visible" with no additional condition.
export const spaceLayerChecksVisibleFields = [
    'ID',
    'Stack/Clash',
    'Carrier Binder',
    'ROFR Decision',
    'Carrier',
    'Inception Date',
    'Expiry Date',
    'Description',
    'Currency',
    "Lloyd's Risk Codes",
    'Policy Limit',
    'Excess',
    'Minimum Signing',
    'Signed Line',
    'Order %',
    'Prob of Closing',
    'UMCC Line',
    'UMCC Date',
    'Bound Premium (Share)',
    'Deductions',
    'Amount Quoted (Share)',
    'Est Gross Premium (Share)',
    'RPI & RARC',
    'Differential',
    'RPI Type',
    'Leader',
    "Lloyd's Leader",
    'Weighted EPI',
    'Earning Pattern',
    'Placement Type',
    'Period Basis',
    'Placing Basis',
    'Bureau Settled',
    'Backup',
    'Gross Pricing',
    'Net Pricing',
    'PML',
    'EPI Rationale',
    'Satellite Name Alternative',
    'Satellite Usage',
    'Satellite Failure Rate',
    // Unlike the Financial Layers grid (NGUI-1961), Layer Checks shows it for
    // Satellite in Orbit too, matching NGUI-2107 -- verified live on QA.
    'Actual Launch Date',
] as const;

// Fields NGUI-2107 shows only for the listed Program Types (hidden otherwise).
export const spaceLayerChecksProgramTypeFields: Readonly<
    Record<string, readonly SpaceProgramType[]>
> = {
    'Satellite Model': inOrbitProgramTypes,
    'Satellite Man. Country': inOrbitProgramTypes,
    'Satellite Value': inOrbitProgramTypes,
    'Satellite Operator': inOrbitProgramTypes,
    'Satellite Name': ['Satellite in Orbit', 'Satellite Launch'],
    'Coverage Period (months)': ['Sat Launch & Orbit'],
    'LV Service Provider': launchProgramTypes,
    'Launch Attempts': launchProgramTypes,
    'Launch Failures': launchProgramTypes,
    'Scheduled Launch Date': launchProgramTypes,
};

// Fields NGUI-2107 marks "Not Visible" in Layer Checks for Space. Only labels
// confirmed to exist elsewhere in QA (Financial Layers grids) are listed, so a
// hidden assertion cannot pass merely because the label text is wrong.
export const spaceLayerChecksHiddenFields = [
    'Sort Order',
    'On',
    'Not Placed',
    'Risk Card',
    'Layer Sub-limits',
    'Written Line',
    'Bound Premium (100%)',
    'Commissions',
    'Profit Commission',
    'Est Gross Premium (100%)',
    'Deductible',
    'Quoted ROL',
    'GELR%',
    'ULR%',
    'Gross Base Rate',
    'Repayment Frequency',
    'UMR',
    'Operations',
    'Profit to PML',
    '$ Cap. Usage',
    'Cover Type',
    'Coverage/Limits/Exposures',
    'Composite Terms',
    'PML Rate',
    'Amount to Aggs',
    'Grace Period',
    'Contributes To RDS',
    'Gross Loss Ratio',
    'EML %',
    'Stamp Reference',
    'Orbit Type',
    'Fidelis Failure Rate',
    'Design Life',
    'End of Life',
    'Cover Required',
    'Launch Vehicle',
    'Combined Ratio',
] as const;
