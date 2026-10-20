# NGUI-2107: Space (Specialty) visibility conditions, Layer Checks

**Ticket:** [NGUI-2107 Solas - Layer Checks - Visibility Conditions - Space (Specialty)](https://fidelisinsurance.atlassian.net/browse/NGUI-2107) (status: Closed)
**Spec:** [space-layer-checks-visibility.spec.ts](space-layer-checks-visibility.spec.ts)
**Environment:** QA1 (`https://qa-01.tfpuw.com`), build `26293.2001`, Chromium, 1920×1080
**Run date:** 2026-10-20

## Verdict

**All 6 runs passed.** For every program type the test could bind, the Layer Checks grid matches NGUI-2107: Sat Launch & Orbit, Satellite in Orbit and Satellite Launch.

- **Fixed bug confirmed:** QA earlier found the launch fields inverted between Satellite in Orbit and Sat Launch & Orbit. They now follow the ticket for both types.
- **Not covered: Space Reinsurance.** It can't be taken to Bound through the standard task-driven lifecycle. It stops at status NBI (see Finding 1).

## What the test does

1. **Create the program.** Specialty / Space / Worldwide, with a **random Program Type** from Sat Launch & Orbit, Satellite in Orbit and Satellite Launch. The test fills Initial Details with the shared reference data and skips Perils. It fills one Financial Layer with the fields every Space type needs: description, numeric fields, RPI Type, Placing Basis and Earning Pattern. Then it finalizes the program.
2. **Upload a Submission file.** The status becomes **Partial Submission**.
3. **Complete the tasks:** Compliance License check, Pricing, Referral (Approved), the UMCC note from the Risk Card, and Hotline (Proceed).
4. **Move to Submission Ready.** The test fills Quoted RPI and ULR.
5. **Set the UMCC outcome to Reviewed and upload a Quote.** The status becomes **Quoted/Awaiting FOT**.
6. **Move to Bound.** The test fills GELR, Leader and Placement Type, plus Client Size.
7. **Open the Checks tab** and check the **Layer Checks** grid:
   - fields that should always be visible are visible;
   - fields that depend on the Program Type follow the type picked;
   - fields Layer Checks should not show are hidden.

## Results

| Run | Program Type | Program ID | Result | Time |
|-----|--------------|-----------|--------|------|
| 1 | Sat Launch & Orbit | 414348 | Passed | 148.1s |
| 2 | Sat Launch & Orbit | 414349 | Passed | 163.1s |
| 3 | Sat Launch & Orbit | 414350 | Passed | 173.5s |
| 4 | Satellite in Orbit | 414351 | Passed | 168.2s |
| 5 | Satellite Launch | 414352 | Passed | 173.8s |
| 6 | Satellite Launch | 414353 | Passed | 188.1s |

These are the runs with the final version of the test. Earlier failures during development are listed under "How stable the test is".

## Coverage

### Fields that should always be visible (42 fields)

ID, Stack/Clash, Carrier Binder, ROFR Decision, Carrier, Inception Date, Expiry Date, Description, Currency, Lloyd's Risk Codes, Policy Limit, Excess, Minimum Signing, Signed Line, Order %, Prob of Closing, UMCC Line, UMCC Date, Bound Premium (Share), Deductions, Amount Quoted (Share), Est Gross Premium (Share), RPI & RARC, Differential, RPI Type, Leader, Lloyd's Leader, Weighted EPI, Earning Pattern, Placement Type, Period Basis, Placing Basis, Bureau Settled, Backup, Gross Pricing, Net Pricing, PML, EPI Rationale, Satellite Name Alternative, Satellite Usage, Satellite Failure Rate, Actual Launch Date.

### Fields that depend on the Program Type (10 fields)

| Field | Sat Launch & Orbit | Satellite in Orbit | Satellite Launch |
|-------|:-:|:-:|:-:|
| Satellite Model, Satellite Man. Country, Satellite Value, Satellite Operator | ✅ | ✅ | – |
| Satellite Name | – | ✅ | ✅ |
| Coverage Period (months) | ✅ | – | – |
| LV Service Provider, Launch Attempts, Launch Failures, Scheduled Launch Date | ✅ | – | ✅ |

✅ = visible, – = hidden. All three Program Types were confirmed by passing runs.

### Fields that should not be visible (37 fields)

Sort Order, On, Not Placed, Risk Card, Layer Sub-limits, Written Line, Bound Premium (100%), Commissions, Profit Commission, Est Gross Premium (100%), Deductible, Quoted ROL, GELR%, ULR%, Gross Base Rate, Repayment Frequency, UMR, Operations, Profit to PML, $ Cap. Usage, Cover Type, Coverage/Limits/Exposures, Composite Terms, PML Rate, Amount to Aggs, Grace Period, Contributes To RDS, Gross Loss Ratio, EML %, Stamp Reference, Orbit Type, Fidelis Failure Rate, Design Life, End of Life, Cover Required, Launch Vehicle, Combined Ratio.

Every label in this list was seen in a Financial Layers grid in QA, so its spelling is confirmed. This matters because a "should be hidden" check would still pass if the label name were misspelled.

These ticket fields are **not checked**, because QA never shows their labels: Vessel Type, Deductibles, Rates, Cargo Type, Event Type, Insured Gross Interest, Indemnity, Coverage %, Layer Basis, Slip Profit Commission, Hull Interest Type, Cargo Interest Type, Cargo Interest Subtypes.

## Findings

### 1. Space Reinsurance can't be bound through the standard lifecycle (decision needed)

- On programs 414337 and 414338, uploading a Submission file moved the status to **Partial Submission**, but **no lifecycle tasks were created**. The header showed "0 Tasks TO DO" for several minutes.
- The header offers **NBI** instead of **Submission Ready**. Clicking NBI moves the status to **NBI**, and then no further status button appears. The "..." menu only offers Add Declaration, Manual Renewal and Cross Entity.
- Because of this, the test picks its random type from the three other Space types only. This is set by `spaceProgramTypesWithTaskLifecycle`.
- **Question:** how should a Space Reinsurance program reach Bound? Once I know the steps, I can add it to this test.

### 2. Actual Launch Date matches the ticket here

- NGUI-2107 lists Actual Launch Date as always visible in Layer Checks, and QA shows it for Satellite in Orbit too (run 4).
- This differs from the **Financial Layers** grid, where the NGUI-1961 change hides it for Satellite in Orbit.
- The ticket's comments had earlier reported this field as missing from Layer Checks. It is now present.

### 3. Earning Pattern must fit the Program Type to pass the Bound gate

The Bound gate requires Earning Pattern. If the pattern doesn't fit the Program Type, the app shows "Earning Pattern is not valid":

| Program Type | Valid pattern (verified on QA) | Rejected |
|--------------|-------------------------------|----------|
| Satellite in Orbit | Standard (Custom also works) | Sat Launch (Orbital/Non-Orbital), 24th Method, Double Straight Line, No Pattern, Seasonal |
| Sat Launch & Orbit | Sat Launch (Orbital/Non-Orbital) | Standard |
| Satellite Launch | Sat Launch (Orbital/Non-Orbital) | – (also used by the existing Satellite Launch E2E) |

This mapping is stored in `spaceEarningPatternByProgramType`.

### 4. A Layer Checks field that NGUI-2107 doesn't mention

The grid shows **"Carrier Rationale(s)"**, which is not in the ticket. The test does not check it.

### 5. Data-mapping problems reported in the ticket are not covered

The ticket's comments reported two value problems:
- Satellite Model shows "-";
- UMCC Date and Scheduled Launch Date are shown 1 day early.

This test only checks which fields are shown. It does not check their values, so these problems are not covered.

## Test data and cleanup

- Every run creates a **Bound** program that stays in QA. A Bound program can't be declined, which is consistent with your other lifecycle E2E tests.
- Programs created while building and running this test:
  - **Bound:** 414341, 414347, 414348 to 414353.
  - **Stopped earlier:** 414336, 414339, 414343 to 414346.
  - **Space Reinsurance at NBI or Partial Submission:** 414337, 414338.

## How stable the test is

Problems found and fixed during development:

- **Earning Pattern was missing**, so the Bound gate failed. It is now set per Program Type.
- **The Layer Checks section locator** matched the heading's own wrapper. It now requires the grid's ID row as well.
- **Actual Launch Date** was first wrongly treated as hidden for Satellite in Orbit. It is now treated as always visible, matching QA and the ticket.

Intermittent problems in shared lifecycle steps. They come from QA or from the existing page objects, not from the visibility checks:

- the "Edit File Properties" upload dialog stayed open after Apply (seen with 3 parallel workers);
- the Compliance License Check dialog didn't close (seen once);
- QA showed blank pages after reloads.

Run this test with **one worker** (`--workers=1`). Each run takes about 3 minutes.

## Changes outside the spec

- **`pages/solas/add-program.page.ts`:** new `fillRequiredSpaceFinancialLayer()`. It fills the minimum layer fields any Space type needs and leaves the type-specific fields empty.
- **`pages/solas/program-checks.page.ts`:** new `layerChecksSection` and `layerChecksFieldLabel()` locators.
- **`test-data/static/solas/space-visibility.ts`:**
  - the Layer Checks field lists and Program Type rules;
  - `spaceProgramTypesWithTaskLifecycle`, the three types the test can bind;
  - `spaceEarningPatternByProgramType`, the pattern map above.
- **`test-data/factories/solas/program.factory.ts`:** new `generateSpaceTaskLifecycleProgramType()`.
- **`enums/solas/program-lifecycle.ts`:** two new `LifecycleOption` values, `RPI_TYPE_NEW_TO_FIDELIS` and `PLACING_BASIS_DIRECT_OPEN_MARKET`.

## How to run

```bash
npx playwright test "tests/solas/visibility conditions/space/space-layer-checks-visibility.spec.ts" --project=chromium --workers=1
```
