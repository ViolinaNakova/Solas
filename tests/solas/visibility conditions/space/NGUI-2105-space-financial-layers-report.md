# NGUI-2105: Space (Specialty) visibility conditions, Financial Layers

**Ticket:** [NGUI-2105 Solas - Financial Layers - Visibility Conditions - Space (Specialty)](https://fidelisinsurance.atlassian.net/browse/NGUI-2105) (status: Closed)
**Spec:** [space-financial-layers-visibility.spec.ts](space-financial-layers-visibility.spec.ts)
**Environment:** QA1 (`https://qa-01.tfpuw.com`), build `26293.2001`, Chromium
**Run date:** 2026-10-20

## Verdict

**Every run passed: 7 runs, 0 failures.** In each run, the Financial Layers grid matched NGUI-2105 for the Space Program Type picked at random. One change is not in the ticket: QA hides **Actual Launch Date** for Satellite in Orbit. You confirmed this was a required change, so the test expects it.

## What the test does

1. Open **Submissions** and click **Add a New Program**.
2. Choose **Specialty / Space**, keep Zone on **Worldwide**, and pick a **random Space Program Type** with `generateSpaceProgramType()`. The type picked is recorded as a test annotation.
3. Fill **Initial Details** with the shared reference data: client HELIOS KLINIKEN GMBH, broker LINK BROKER UK LTD, Law & Jurisdiction Other, Placing Office London, Underwriter Aaron, and Inception set to today.
4. Skip **Select Perils** and wait for the **Financial Layers** grid.
5. Check the grid's row headers:
   - Fields that should always be visible are visible.
   - Fields that depend on the Program Type are visible or hidden to match the type picked.
   - Fields Space should not use are hidden.

## Results

| Run | Program Type (random) | Result | Time |
|-----|-----------------------|--------|------|
| 1 | not recorded (first run) | Passed | – |
| 2 | Satellite Launch | Passed | 25.9s |
| 3 | Satellite in Orbit | Passed | 29.2s |
| 4 | Satellite Launch | Passed | 22.0s |
| 5 | Sat Launch & Orbit | Passed | 22.8s |
| 6 | Sat Launch & Orbit | Passed | 20.8s |
| 7 | Satellite Launch | Passed | 24.2s |

Space Reinsurance was not picked in these 7 runs. I checked its grid by hand while exploring (program 414327), and it matches the expected rules.

## Coverage

### Fields that should always be visible (56 fields, all visible)

ID, Sort Order, On, Not Placed, Stack/Clash, Carrier Binder, Carrier, Stamp Reference, Inception Date, Expiry Date, Description, Currency, Lloyd's Risk Codes, Policy Limit, Excess, Minimum Signing, Written Line, Signed Line, Order %, Prob of Closing, UMCC Line, UMCC Date, Bound Premium (Share), Deductions, Commissions, Profit Commission, Amount Quoted (Share), Est Gross Premium (100%), Est Gross Premium (Share), RPI & RARC, Differential, RPI Type, GELR%, ULR%, Leader, Lloyd's Leader, Weighted EPI, EPI Rationale, UMR, Placing Basis, Period Basis, Earning Pattern, Placement Type, Bureau Settled, Gross Pricing, Net Pricing, Operations, Backup, PML, Contributes To RDS, Gross Loss Ratio, Cover Required, Satellite Name Alternative, Satellite Failure Rate, Fidelis Failure Rate, Satellite Usage.

### Fields that depend on the Program Type (15 fields)

All four Program Types were checked by hand during exploration (programs 414324 to 414327). The automated runs confirmed every type except Space Reinsurance.

| Field | Sat Launch & Orbit | Satellite in Orbit | Satellite Launch | Space Reinsurance |
|-------|:-:|:-:|:-:|:-:|
| Orbit Type, Satellite Model, Satellite Man. Country, Satellite Value, Satellite Operator, Design Life, End of Life | ✅ | ✅ | – | ✅ |
| Satellite Name | – | ✅ | ✅ | – |
| Coverage Period (months) | ✅ | – | – | – |
| Launch Vehicle, LV Service Provider, Launch Attempts, Launch Failures, Scheduled Launch Date | ✅ | – | ✅ | ✅ |
| Actual Launch Date (not in the ticket, see below) | ✅ | – | ✅ | ✅ |

✅ = visible, – = hidden. QA matches all of these rules.

### Fields that should not be visible (17 fields, all hidden)

Risk Card, Layer Sub-limits, Bound Premium (100%), Deductible, Quoted ROL, Gross Base Rate, Repayment Frequency, Profit to PML, $ Cap. Usage, Cover Type, Coverage/Limits/Exposures, Composite Terms, PML Rate, Amount to Aggs, Grace Period, EML %, Combined Ratio.

A "should be hidden" check passes when the label is missing. If a label name were spelled wrong, the check would still pass, so it would prove nothing. To prevent this, I only check labels I found on the Financial Layers grid of another Line of Business in QA. I found them on programs from:

- PV Treaty
- Marine Retro
- Energy Construction
- Political Violence
- Terrorism & Sabotage
- Airline
- Property NA Cat XOL

## Findings

### 1. Actual Launch Date: confirmed change that is not in the ticket

- **NGUI-2105** lists Actual Launch Date as Visible with no condition.
- **QA** shows it for Sat Launch & Orbit, Satellite Launch and Space Reinsurance, and hides it for Satellite in Orbit.
- You confirmed this was a required change. The test treats it as a Program Type rule.
- **Suggestion:** update NGUI-2105, or link the ticket that made the change, so the ticket stays the source of truth.

### 2. Ticket fields not checked, because QA has no such label

I could not find these 13 "Not Visible" fields on any Line of Business I could open. Most are Marine Cargo/Hull or Contingency fields, or expandable panels rather than grid rows:

- Vessel Type
- Deductibles (panel)
- Rates (panel)
- Cargo Type
- Event Type
- Insured Gross Interest
- Indemnity
- Coverage %
- Layer Basis
- Slip Profit Commission
- Hull Interest Type
- Cargo Interest Type
- Cargo Interest Subtypes

To cover them, I would need finalized Marine Cargo, Marine Hull and Contingency programs to read the labels from. Send me their IDs and I'll add these checks.

### 3. Name difference

The ticket says **"Amount To Aggs"** and the app says **"Amount to Aggs"**. The test uses the app's spelling.

### 4. Fields in the grid that the ticket doesn't mention

Other Lines of Business also show these fields: RARC, RARC Methodology, Unlimited Limit, Reins, Adj. %, First Instalment Date, AM Best Profit PML, Price / PML, TFP Available Line %. They are correctly hidden for Space, but NGUI-2105 doesn't list them, so the test doesn't check them.

## Test data and cleanup (needs a decision)

- **This test saves data.** Clicking "Next step" from Initial Details creates the program as an **Opportunity**, so every run leaves one Space program behind.
- **There is no cleanup.** This follows the other program-creation specs, which keep their programs on purpose.
- **The existing `decline()` cleanup no longer works on this build.** When I tried it, the Decline dialog's Confirm returned **HTTP 400** from `/uwprograms/declinaturereasons`. The backend rejected the rationale "Test cleanup - automated E2E test" with: *"Does not explain why pricing is inadequate. Appears to be an automated test comment."* I did not try to get around that check.
- **Programs left in QA:**
  - Exploration: 414324 (Sat Launch & Orbit), 414325 (Satellite in Orbit), 414326 (Satellite Launch) and 414327 (Space Reinsurance), all with client HELIOS KLINIKEN GMBH.
  - Test runs: 7 more programs, IDs not recorded.
- **Next step:** decide how test programs should be cleaned up on the new build. Options include a test-only API, a whitelisted rationale, or a scheduled sweep.

## Changes outside the spec

- `pages/solas/add-program.page.ts`: new `financialLayerFieldLabel(label)` locator. It matches grid row headers by their text and ignores two other kinds of `-label` elements on the page:
  - the program header captions, such as "Insured:";
  - the grid's floating sticky copy of the header column (`floating-header-*`). Without this exclusion, a field like "ID" matched twice.
- `test-data/static/solas/space-visibility.ts`: the Financial Layers field lists and the Program Type rules.
- The test also uses things added for the Initial Details work: `generateSpaceProgramType()`, `escapeRegExp()`, the `ADD_PROGRAM_WIZARD_TEST` timeout and the `createProgram` zone fix.

## How to run

```bash
npx playwright test "tests/solas/visibility conditions/space/space-financial-layers-visibility.spec.ts" --project=chromium
```
