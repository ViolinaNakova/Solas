# NGUI-2019: Space (Specialty) visibility conditions, Initial Details

**Ticket:** [NGUI-2019 Solas - Visibility Conditions - Space (Specialty)](https://fidelisinsurance.atlassian.net/browse/NGUI-2019) (status: Closed)
**Spec:** [space-initial-details-visibility.spec.ts](space-initial-details-visibility.spec.ts)
**Environment:** QA1 (`https://qa-01.tfpuw.com`), build `26293.2001`, Chromium
**Run date:** 2026-10-20

## Verdict

**There are 9 tests: 7 pass, 0 fail and 2 are skipped.** The 7 passing tests are the auth setup and 6 visibility tests. Most of the Initial Details section matches NGUI-2019. The 2 skipped tests are marked `FIXME`. Each one covers a place where QA does not match the ticket. Someone needs to decide whether the app or the ticket is wrong.

## What the tests do

Every test runs these steps first, in `beforeEach`:

1. Open **Submissions** and click **Add a New Program**.
2. Choose Class of Business **Specialty** (the default) and Line of Business **Space**. Zone stays on **Worldwide**, which the app pre-selects for Space.
3. Choose a **random Space Program Type** using `generateSpaceProgramType()`. The options are Sat Launch & Orbit, Satellite in Orbit, Satellite Launch and Space Reinsurance. The type picked for each test is recorded as a test annotation.
4. Click **Add** to open the Initial Details step of the wizard.

The wizard keeps the new program in the browser until it is finalized. Because of that, the tests save nothing and need no cleanup. I checked this: the Drafts count did not change after about 25 wizard opens.

## Results (final run)

| # | Test | Program Type (random) | Result | Time |
|---|------|-----------------------|--------|------|
| 1 | Only the Space-relevant Initial Details fields are shown | Sat Launch & Orbit | Passed | 21.9s |
| 2 | Re on: Original Insured appears and Client is relabeled "Reinsured" (and both revert when Re is off) | Sat Launch & Orbit | Passed | 19.0s |
| 3 | Has Surplus Line Broker on: Surplus Line Broker and License number appear | Satellite in Orbit | Passed | 21.2s |
| 4 | Binder / Line Slip on: MGA Code appears | Satellite Launch | Passed | 19.5s |
| 5 | Placing Office = FIID (Dublin): CBI Consumer appears | Satellite Launch | Passed | 23.0s |
| 6 | US zone: TRIA Eligible appears. TRIA Eligible on: TRIA Taken up and US Business Placement appear | Space Reinsurance | Passed | 21.1s |
| 7 | Has Surplus Line Broker is hidden for a non-US zone | – | Skipped (FIXME) | – |
| 8 | Cont. Review Status is shown | – | Skipped (FIXME) | – |

The run before this one also passed, with the same count: 7 passed and 2 skipped.

## Coverage

### Fields that should always be visible (17 fields, all visible)

Class of Business, Line of Business, Client, Re, Client Size, Zone, Program Name, Program Type, Broker, Broker Contact, Local Broker, Cession Consideration, Law & Jurisdiction, Binder / Line Slip, Prior Submit, Controlled by Ops, Exposure Tags.

The extra buttons are also visible: **Add Client** and **Create Local Broker**.

### Conditional fields (8 fields, all hidden by default, all appear when their condition is met)

| Field | Condition in NGUI-2019 | What QA does |
|-------|------------------------|--------------|
| Original Insured | Re is selected | Matches. Client is also relabeled "Reinsured" |
| CBI Consumer | Placing Office = FIID | Matches. Appears only for **Dublin**, not for London, Bermuda or Abu Dhabi |
| Surplus Line Broker, License number | Surplus Line Broker toggle is on | Matches |
| TRIA Eligible | Zone is US or North America | Matches (checked with **US Nationwide**) |
| TRIA Taken up, US Business Placement | TRIA Eligible is selected | Matches |
| MGA Code | Binder / Line Slip is selected | Matches |

### Fields that should not be visible (32 fields, all hidden)

Fleet TIV, Vessels in Fleet, Requires LOC, AIR Occ. Code, B.I. TIV, Terror TIV, Est Month Close, Marketing, Obligor Name, Obligor Country, Guarantor, Guarantor's Country, Transaction Description, Risk Code, Policy Reference, Program Priority, Enable Structure Changes, Tariff Vulnerability Indicator, Is SRT, Additional Insured Airlines, Cirium Operator, Cirium N/A, Usage Types, Buildings TIV, Contents TIV, Others TIV, Total Insured Value, CTE Sublimit, ORG Process, Belongs to pool, Pool, Reinsurance Pool.

A "should be hidden" check passes when the label is missing. If a label name were spelled wrong, the check would still pass, so it would prove nothing. To prevent this, I opened the Add Program wizard for 17 other Lines of Business in QA. Every label in the list above was seen there, so its spelling is confirmed.

## Where QA and the ticket disagree

### 1. Has Surplus Line Broker shows for every zone (test 7 is skipped)

- **Expected (NGUI-2019):** "Surplus Line broker (checkbox)" is visible only when the zone is a US zone or North America (`IsUsZone == true`).
- **Actual:** QA shows the **Has Surplus Line Broker** switch for Worldwide, Africa and Canada too. It also shows on every other Line of Business I checked.
- **Next step:** ask the BA (Daniel Coelho) whether the condition was dropped on purpose. If it was not, log a bug. When this is settled, remove the skip from test 7 or delete the test.

### 2. Cont. Review Status is not shown (test 8 is skipped)

- **Expected (NGUI-2019):** "Cont. Review Status" is visible in Initial Details, with no condition.
- **Actual:** the field does not appear in the Add Program wizard. It also does not appear on an existing Space program (411639, Details tab).
- **Next step:** ask whether this field is still in scope. It may belong to a different section, such as Contract. When this is settled, remove the skip from test 8 or delete the test.

### 3. Ticket fields not checked, because QA has no such field

I could not find these fields on any Line of Business in QA, so the tests do not check them:

- Contract
- Personal Priority
- Tenor Months (marked "not implemented, NGUI-1427" in the progress tracker comment)
- Artist / Band Name
- EU Taxonomy Aligned
- Security Required
- Coverage Required

### 4. Small differences between the ticket and the app

- **Name differences:** the ticket and the app use different names for 3 fields. The tests use the app's names.

  | Ticket name | App label |
  |-------------|-----------|
  | Surplus Line broker (checkbox) | Has Surplus Line Broker |
  | Additional Airlines | Additional Insured Airlines |
  | AIR Occ.Code | AIR Occ. Code |

- **Broker Contact:** this field is visible in Initial Details but is not listed in NGUI-2019. It is checked as visible.
- **Prior Submit and Controlled by Ops:** both are visible but disabled until Binder / Line Slip is switched on. The tests only check that they are visible. A ticket comment says their visibility condition was removed to match Solas.
- **All four Space Program Types** show the same Initial Details fields, so choosing one at random does not change the checks.

## Changes outside the spec

- `pages/solas/add-program.page.ts`
  - New locators: the Initial Details section, field labels, and the Re, Surplus Line, Binder and TRIA switches, plus the Add Client and Create Local Broker buttons.
  - New actions: `flipSwitch`, `changeZone` and `selectPlacingOffice`.
  - **Fix in `createProgram`:** if the Zone is already the requested value, it is now left alone. Before, the code clicked "Worldwide" again although Space had already selected it. That click **deselected** the zone, and the code re-selected it. After that, clicking **Add** intermittently closed the dialog without opening the wizard. This caused 11 of the first 12 failures. Existing specs all pass "Africa", which is never pre-selected, so they behave as before.
- `pages/solas/submissions.page.ts` and `enums/util/timeouts.ts`
  - New `APP_RENDER` (40s) wait for the Submissions page and the wizard. QA sometimes shows a blank page for more than 10 seconds before it renders.
  - New `ADD_PROGRAM_WIZARD_TEST` (120s) test timeout for these tests.
- `test-data/static/solas/space-visibility.ts`: field lists and trigger values (US zone, FIID office).
- `test-data/factories/solas/program.factory.ts`: new `generateSpaceProgramType()` factory.
- `helpers/util/util.ts`: new `escapeRegExp()` helper.

## How stable the tests are

- **Label locator fix:** the first version found fields with `getByText`. When Binder / Line Slip was on, that also matched the MGA Code dropdown's placeholder text and raised a strict-mode error. Labels are now matched on `<label>` elements only.
- **Load-test runs:** during runs with up to 28 browser sessions at once, QA was redeployed (build `26292.1903` → `26293.2001`). Page loads took up to 30 seconds and some timed out. These failures came from the environment, not from the tests. Once the new build had warmed up, two normal runs in a row passed.
- **Auth setup:** `tests/solas/auth.setup.ts` checks the page within 10 seconds. A slow QA can fail it even when the session is still valid. That file has uncommitted local changes, so I did not touch it.

## How to run

```bash
npx playwright test "tests/solas/visibility conditions/space" --project=chromium
```
