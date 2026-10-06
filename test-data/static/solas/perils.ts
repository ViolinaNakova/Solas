// Peril codes shown on the "Select Perils" step of the Reinsurance / Marine /
// Retro Agg template (captured live from QA via playwright-cli). The
// Reinsurance / Personal Accident / Excess of Loss template shows the same set.
export const reinsuranceMarinePerilCodes = [
    'TC',
    'EQ',
    'SC',
    'TR',
    'WT',
    'IF',
    'FR',
    'FF',
    'WF',
    'EX',
    'CF',
    'VE',
    'EC',
    'CL',
    'WR',
    'SR',
    'NC',
    'PD',
    'NA',
    'NM',
    'XC',
] as const;

export type ReinsuranceMarinePerilCode =
    (typeof reinsuranceMarinePerilCodes)[number];
