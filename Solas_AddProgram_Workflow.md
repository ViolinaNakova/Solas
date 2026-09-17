# Solas (QA) — Add New Program Workflow

Reference playbook for creating a new Program in Solas via the browser UI (qa.tfpuw.com), built from creating Program **408288 – HELIOS KLINIKEN GMBH** (Space / Sat Launch & Orbit).

## Quick Start

To prompt a new program creation using this file, give Claude a prompt like:

> Use `C:\Users\Violina Nakova\Documents\Solas_AddProgram_Workflow.md` to create a new Solas program. Class of Business: **[value]**, Line of Business: **[value]**, Zone: Africa, Program Type: **[value]**. Use the same sample data pattern for the financial layers as documented in the file.

Only 3 values need to be filled in each time (Zone is fixed at Africa — see "What changes each time you repeat this workflow" below). Example:

> Use `C:\Users\Violina Nakova\Documents\Solas_AddProgram_Workflow.md` to create a new Solas program. Class of Business: Specialty, Line of Business: Energy, Zone: Africa, Program Type: Upstream. Use the same sample data pattern for the financial layers as documented in the file.

**Default is now 3 financial layers, not 2** (changed permanently as of Run 5): Layer 1 and Layer 2 per the existing sample-data pattern, then **Layer 3 = a Clone of Layer 1** (see the new "Clone Layer" gotcha under Step 6) rather than a third hand-filled layer. If a future request explicitly asks for only 2 layers, that overrides this default — otherwise assume 3.

**The requested Program Type string may not exist verbatim in the dropdown.** Confirmed on Run 5: "Aviation Hull & Liability" is not a literal option under either Reinsurance or Specialty for Line of Business = Aviation. If the exact requested value isn't found, list what *is* available for that Class of Business/Line of Business combination and pick the closest reasonable match (state the substitution explicitly rather than guessing silently) — don't assume the request was wrong, the platform's naming just doesn't always match industry-standard terminology.

If the new Program Type has its own "correct" Earning Pattern value (see the gotcha under Step 6), state it up front — confirmed so far:
- **Sat Launch & Orbit** and **Satellite Launch** (Specialty/Space) both use "Sat Launch (Orbital/Non-Orbital)".
- **Satellite in Orbit** (Specialty/Space) uses **"Standard"**, NOT "Sat Launch (Orbital/Non-Orbital)" — even though the latter is a selectable option in the dropdown for this Program Type too, it leaves the field invalid. Earning Pattern correctness is Program-Type-specific even within the same Class of Business/Line of Business — don't generalize from other Space templates.
- **Aggregate XL** (Reinsurance/Property, and likely other non-Space Program Types) uses **"Standard"** — it's the first/default option in the dropdown and was accepted without issue.
- If unsure for a new type, expect to be asked (see the Earning Pattern gotcha — the dropdown is virtualized, so an initial scan can wrongly suggest an option is unavailable), and verify by checking whether "Next step"/Save is blocked after selecting it, not just whether the option exists in the list.

Also note: **different Program Types (and especially different Class of Business values) have different Financial Layer field sets** (see "Program Type/Class of Business changes the field set" under Step 6) — the sample data table for a new type will need adapting, not a literal reuse. Reinsurance in particular adds a whole extra set of fields (Reins, RARC, Agg Limit/Excess, Adj. %, etc.) not present on Specialty templates.

## Login

URL: https://qa.tfpuw.com/submissions

1. Click **Sign In with Microsoft**.
2. Enter email, click Next.
3. Enter password, click Sign in.
4. Approve MFA push notification in Microsoft Authenticator app (enter/tap the displayed number).

**Credentials (QA environment):**
- Username: `violina.nakova@fidelisinsurance.com`
- Password: `Gomes2199laiho2199.!!`

> ⚠️ Stored here in plaintext at the user's explicit request for personal reference. Do not commit this file to a shared/public repo or send it anywhere. Treat as sensitive.

## What changes each time you repeat this workflow

Only **4 fields** vary between runs — everything else below follows the same fixed steps:
1. **Class of Business**
2. **Line of Business**
3. **Zone** — Africa
4. **Program Type**

## Step 1 — Add a New Program dialog

Click **Add a New Program** (top of Submissions list or the button in the main welcome panel).

Fill the 4 characteristic fields:
- Class of Business (dropdown)
- Line of Business (dropdown, populated after Class of Business is chosen)
- Zone (searchable combobox — type to filter, e.g. "Africa"). Once selected, the Program Type dropdown often opens automatically with its first/default option pre-highlighted.
- Program Type (dropdown, populated after Zone is chosen)

Click **Add**.

## Step 2 — Initial Details

- **Client**: searchable combobox, type client name and select from suggestions (e.g. "HELIOS KLINIKEN GMBH")
- **Broker**: searchable combobox, required (e.g. "LINK BROKER UK LTD")
- Class of Business / Line of Business / Zone / Program Type are pre-filled (disabled) from Step 1
- **Cession Consideration**: on Specialty templates this defaults to "N/A" and can be left alone; on **Reinsurance** templates it is often blank and **required** — click it and pick an option (e.g. "N/A", first in the list). If the dropdown briefly shows "No options found", see the Cession Consideration gotcha under Step 6 before assuming it's broken.
- Click **Next step** once Client, Broker, and (if required) Cession Consideration are set (this is when the draft program record is actually created on the backend)

## Step 3 — Dates & Restrictions

- Inception / Expiry / Receipt dates default to today +1 year — leave as-is unless a specific test date is needed
- Click **Next step**

## Step 4 — Underwriting Status

- **Placing Office**: dropdown (e.g. "London") — auto-fills Referring Office to match
- **Underwriter**: searchable dialog — type a name or just pick the first suggested option (e.g. "Aaron Naysmith", "Aaron Osei") — auto-fills Account Manager
- **Modelling**: required on some Program Types (was optional/pre-filled for Sat Launch & Orbit, but required and blank for Satellite Launch and for Aggregate XL) — if required, pick **"Awaiting Data"** (first/default option in the dropdown)
- Click **Next step**

## Step 5 — Select Perils

- Optional for this template — Next step is enabled without selecting any peril
- Click **Next step**

## Step 6 — Add Financial Layers

This is the most complex step: many dozens of fields per layer (~69 for Specialty/Space, ~57 for Reinsurance/Property), several of which are dropdown/combobox controls that **only mount when their backend reference-data call succeeds**, and several of which are "Modal" fields whose visible cell is a read-only mirror of a value actually managed in a popup dialog.

### Known gotcha: reference-data 500 errors
Several dropdown fields (Currency, RPI Type, Leader/Lloyd's Leader syndicates, Placing Basis, Period Basis, Earning Pattern, Placement Type, Launch Vehicle, Orbit Type, Cession Consideration) are populated from `GET /underwriting-qa-api/uwsub/get*` calls. If these return HTTP 500 (seen during this session) or otherwise fail to populate in time, the corresponding field renders as a **completely empty cell with no visible control at all**, or a dropdown shows "No options found" — not just disabled. It is *not* fixable client-side.
- **Fix**: reload the page (or navigate to `/programs/{id}/edit?tab=details` or `?tab=financialLayers` directly) and check Network tab / console for `500` on `getcurrencies`, `getplacingbases`, `getcessionconsiderations`, etc. It resolved itself on retry both times this was seen (once on Cession Consideration) — treat as transient, but if it recurs, flag it as a bug.

### Known gotcha: Policy Limit validation
Setting Policy Limit's value via JS (`element.value = ...` + dispatch `input` event) leaves the field marked invalid (red border, blocks "Next step") even though the number looks correct. **Fix**: use a real fill/type interaction, then press Tab to blur — this triggers the number formatting (adds commas) and clears the invalid state.

### Known gotcha: Earning Pattern resets, and its correct value depends on Program Type
Changing other dropdowns (Cover Required, Satellite Model, Orbit Type, etc.) can silently reset Earning Pattern back to a template-default value. **Set Earning Pattern LAST**, after all other fields are final.
- For **Program Type = Sat Launch & Orbit** and **Satellite Launch**, the correct Earning Pattern value is **"Sat Launch (Orbital/Non-Orbital)"** — confirmed correct for both, not a bug. (An earlier assumption that "Standard" was correct was wrong — confirmed by the user.)
- For **Program Type = Aggregate XL** (Reinsurance/Property), **"Standard"** is correct — it's the first option in the (non-virtualized-feeling, short) list and was accepted without any follow-up correction needed.
- **The dropdown's option list is virtualized/scrollable.** A first, unfiltered read of "all options" can come back incomplete and wrongly suggest a value isn't available for a given Program Type (this happened for Satellite Launch — it looked absent, then appeared and was accepted once the field was actually interacted with). **Before concluding an option is unavailable, type to filter the dropdown** (e.g. type "Sat Launch") rather than trusting an initial unfiltered scan.

### Known gotcha: Program Type *and* Class of Business change the Financial Layer field set
The ~69-field list originally documented here is for **Sat Launch & Orbit** (Specialty/Space). Other Program Types — and especially other Class of Business values — have a *different* field set on the same Financial Layers form. Don't assume the same fields exist.
- **Satellite Launch** (Specialty/Space, confirmed): does **not** have Orbit Type, Satellite Model, Design Life, End of Life, Coverage Period (months), Satellite Value, Satellite Operator, or Satellite Man. Country. It **adds** a "Satellite Name" field not present on Sat Launch & Orbit.
- **Aggregate XL (Reinsurance/Property, confirmed)**: a substantially different ~57-field template. Has none of the Satellite/Space fields at all. Instead adds Reinsurance-specific fields not present on Specialty templates: **Layer Sub-limits, Quoted ROL, RARC, RARC Methodology, Unlimited Limit, Reins (expandable panel), Adj. %, First Instalment Date, Agg Limit, Agg Excess**. Also has **Profit Commission, $ Cap. Usage, PML, Profit to PML, AM Best Profit PML, Price / PML** which read as Reinsurance/Property-specific too.
- **Placing Basis can be pre-filled by the template itself** based on Program Type — e.g. for Aggregate XL it defaulted to "Aggregate Excess of Loss" (not "Direct Open Market") and was already valid; no manual selection was needed. Don't assume "Direct Open Market" applies to every template — check whether the field is already populated/valid before touching it.
- Before filling sample data on a new Program Type, re-scan the field label list on that layer rather than assuming a previously-documented table applies verbatim. Fields present in an old table but absent on the new template are simply skipped; new fields need a placeholder value (plain descriptive text like "test satellite 1", or a reasonable numeric guess, worked fine and was accepted by the user rather than a real value).

### Known gotcha (IMPORTANT): "Modal" fields cannot be reliably set by direct DOM value assignment
Several fields render as a *disabled/read-only* text or number cell paired with a pencil/edit icon that opens a dedicated modal (Deductions, GELR%, ULR%, RARC, Profit Commission, RPI & RARC, Reins, Layer Sub-limits, Lloyd's Risk Codes are all this style). For Deductions specifically, the modal requires picking a **Deduction Type** (Brokerage, FET (US), Ceding Commissions, Other Taxes, Other Deductions, Retail Brokerage) plus a % and a Level — it is not just a bare percentage.
- Setting these fields via `element.value = ...` + dispatched `input`/`change` events on the disabled companion cell **appears to work in the moment** (the cell shows the new value, "Financial layers saved" toast appears, Live Totals may even reflect it) but **does not reliably persist** — confirmed twice in the same session that Deductions and GELR% silently reverted to 0% after a page reload, even after being explicitly re-set and re-saved a second time via the same scripted approach.
- Using the field's real modal (click the pencil icon, fill the modal's own inputs, click Apply, then Save the layer) is the correct path, though even this did not immediately update the top-level summary cell in one observed case — worth a hard reload to confirm the true persisted state before trusting what's on screen.
- **The user manually re-entering GELR%, ULR%, Adj. %, Lloyd's Leader, Repayment Frequency, Profit to PML, AM Best Profit PML, and Price/PML directly through the real UI (not scripted) did persist correctly** (confirmed by reload) — so the underlying fields do work, the failure mode is specific to bypassing React's event handling via raw DOM manipulation on this particular style of field.
- **Confirmed a second time on Run 4 (417310, Satellite in Orbit)**: GELR% still reverted to 0.00% even when set via the *proper* GELR modal opened and filled by the agent (real click into the modal's own input, real Apply click — not raw DOM value-setting), and confirmed via hard reload. The user then entered the same GELR% values directly through the UI themselves, and those persisted correctly (10.00%/8.00%). **This means the gotcha isn't just "don't use scripted DOM manipulation" — even agent-driven clicks into the field's own modal aren't reliably enough; genuine human interaction is currently the only confirmed-reliable path for GELR% specifically.** Treat any agent-entered GELR%/Deductions value as unverified until the user confirms it, or ask the user to enter these two fields themselves.
- **Practical takeaway**: for any field on this form whose cell looks disabled/read-only with a paired pencil icon, prefer real `click`/`fill`/typed keyboard interaction (or ask the user to enter it), and always re-verify with a hard reload (navigate to `/programs/{id}/edit?tab=financialLayers`) before considering it done — don't trust a same-session toast or on-screen value alone for these fields specifically. For GELR% and Deductions specifically, budget for the possibility that even a correct agent-driven modal interaction won't persist, and hand off to the user as the fallback.

### Known gotcha: fields can silently reset across Save/reload/navigation cycles
Several optional (non-required, non-asterisked) fields — observed: Minimum Signing, Launch Vehicle, Cover Required, RPI Type, Lloyd's Leader, Deductions, GELR% — can revert to blank/0 after a Save, a page reload, or navigating away and back (e.g. Previous step → Financial Layers, or Files → Add Financial Layers). This happened repeatedly even after the fields were confirmed set and saved.
- **Fix**: after every Save (and especially right before clicking Finalize), re-open the Financial Layers tab and re-check each optional field on every layer — don't assume a field that was correct earlier in the session is still correct now.

### Known gotcha (CRITICAL): re-filling an already-populated field can concatenate instead of replace
Clicking into a field that already has a value and then using `fill` (or setting `.value` via JS) without first selecting all existing text can **append** the new value onto the old one instead of replacing it — e.g. correcting Policy Limit from a stale value produced `"3,500,000,035,000,000"` (two "35000000"s concatenated) instead of `"35,000,000"`. This silently corrupts the Live Totals (Premium/RoI can balloon to nonsensical numbers like millions of percent) without any validation error.
- **Fix**: when re-entering a value into a field that may already contain something, always click the field, press **Ctrl+A** to select all existing content, *then* fill the new value, then Tab to blur.
- **Always spot-check the Live Totals row** (Exposure / Premium / RoI) after filling or re-filling Policy Limit, Bound Premium (Share), or Amount Quoted (Share) on any layer — an absurd RoI (e.g. thousands or millions of percent) is the fastest tell that a field got concatenated rather than replaced.

### Known gotcha: adding a layer ("+") or Save can silently fail to register
The **+** button to add a new layer occasionally doesn't respond to the first click (no new layer/temp `-1` ID appears) — click it again and verify a new column with ID `-1` appeared before filling data into it. Similarly, a "Save" click can appear to succeed (toast shown, Save button greys out) while the new layer isn't actually persisted server-side — reload the page (or navigate directly to `/programs/{id}/edit?tab=financialLayers`) and confirm the layer now has a **real numeric ID** (not `-1`) and the Live Totals reflect all layers before moving on.

### Known gotcha: reloading `/programs/add` loses wizard state — use the program-specific edit URL instead
Once a draft program exists (Program ID assigned), reloading the generic `/programs/add` wizard URL resets the client-side wizard back to a blank "Add a New Program" form (Client/Broker/Cession Consideration all show as empty/required again) even though the program and its saved layers still exist server-side. **Always navigate to `/programs/{id}/edit?tab=financialLayers` (or the relevant tab) to check persisted state** — never reload `/programs/add` itself mid-workflow.

### Known gotcha: per-layer Carrier Binder can trigger its own compliance breach banner
Different layers can use different Carrier Binders/Syndicates (e.g. Layer 1 "Fidelis IG - FUL", Layer 2 a Lloyd's syndicate like "Syndicate 2126"), and each binder can carry its own **Max Line Size / Policy Length** limit. Exceeding it on a layer produces a distinct red banner at the top of the finalized program — e.g. *"Max Line Size/Policy Length Breach — F2126: Current exposure (8.75m USD) exceeds limit (5m USD). All breaches must be resolved by Underwriting Management before proceeding."* — separate from, and can appear alongside, the green **Compliance License Check** banner seen in earlier runs. Not a data-entry error; it's the binder's own configured limit being exceeded by the layer's Carrier Exposure.

### Known gotcha (new in Run 5): "Clone Layer" feature for adding a 3rd+ layer, and its extra required fields
The "..." menu on a layer's ID cell has **Clone** and **Delete** options in addition to the **+** button (which only adds a blank new layer). Clone opens a **"Clone Layer"** modal pre-filled with the source layer's Description/Written Line/Signed Line, but with **Carrier Binder and Carrier blank and required** — you must pick a binder for the cloned layer (the dropdown here can offer *different* binders than the source layer, e.g. Lloyd's syndicates not otherwise visible on the base form).
- **If the picked Carrier Binder is a Lloyd's syndicate, the Clone modal additionally requires ROFR Decision and Risk Allocation Rationale** (both dropdowns, not present when cloning onto a "Fidelis IG - FUL"-style binder) — pick any reasonable option (e.g. "Territories in which the IG is not licensed - applicable to IG QS" / "Planned Syndicate Allocation") for synthetic/test data.
- Update the Description field in the Clone modal before clicking Clone (it defaults to the source layer's description, e.g. "Layer 1" — leaving it unchanged will name the new layer identically to the one it was cloned from).
- After Clone, the new layer inherits all of the source layer's per-layer field values (RPI Type, GELR%, Leader, UMR, Placing Basis, Period Basis, Placement Type, etc.) — review and adjust any that shouldn't be identical to the source (e.g. UMR) before Save.

### Known gotcha (new in Run 5): switching a layer's Carrier Binder to a Lloyd's syndicate makes Lloyd's Risk Codes a required field
Distinct from the Max Line Size/Policy Length *compliance breach banner* gotcha above (which fires post-Finalize): setting a layer's Carrier Binder to any Lloyd's syndicate (not "Fidelis IG - FUL") makes **Lloyd's Risk Codes required to even reach "Next step"** — the field shows a red-outlined invalid state with the tooltip "Carrier F3123 requires at least one Lloyd's risk code." Opening its modal shows a pre-populated list of applicable codes (varies by Program Type — e.g. Airline offered 2T/AO/AP/H2/H3/L2) all defaulted to 0% allocation, plus a second validation ("allocations total must be 100%"). Set one code's allocation to 100% and **delete the other zero-value rows** (Apply stayed disabled with the extra zero rows still present, even though 100+0+0+0+0+0=100).

### Known gotcha (new in Run 5): Airline (Specialty/Aviation) Financial Layer field set adds Cover Type, Composite Terms, Coverage/Limits/Exposures
A fourth distinct field set (on top of the three Specialty/Space ones and the Reinsurance/Property one already documented) — no Satellite/Space fields and no Reinsurance-only fields (no Agg Limit/Excess, Reins, RARC). New fields not seen on any prior template: **Cover Type** (modal/dropdown), **Composite Terms** (plain text), **Coverage/Limits/Exposures** (modal, shows "0 Items" until populated — left unset in this run, not required). Otherwise close to the Reinsurance/Property field list (Deductions, RPI & RARC, GELR%, ULR%, Leader, UMR, Placing Basis, Period Basis, Earning Pattern, Placement Type all present and behaved the same way).
- **Earning Pattern was required and blank on Layer 2 for this template** (not pre-filled like Layer 1 sometimes is) — selecting "Standard" cleared the invalid state and enabled "Next step". Re-confirms the existing "verify Earning Pattern per Program Type, don't assume" guidance.

### Known gotcha (new in Run 5): GELR%/Deductions/RPI & RARC persisted correctly via agent-driven modal entry this run — treat prior non-persistence gotcha as intermittent, not absolute
Contrary to the Run 3/Run 4 finding that agent-driven modal interaction for GELR%/Deductions never reliably persists, **this run's agent-set Deductions (5%), GELR% (15% on all 3 layers), and RPI & RARC (78% on Layers 1 and 3) all persisted correctly after a hard reload**, using the same "real click into the modal's own input, real Apply click" approach previously reported as unreliable. RPI Type and RPI & RARC on **Layer 2 specifically were left unset** in this run — not because of a persistence failure, but because repeated clicks aimed at that field's dropdown/modal kept opening the wrong modal (Leader) instead, likely due to a page-scroll-position/uid-staleness issue in the automation tooling, not a platform bug. **Practical takeaway**: don't assume GELR%/Deductions modal entry is doomed to fail — attempt it normally via real click+fill+Apply, but always confirm with a hard reload before reporting it as done, and if a field's modal keeps opening the wrong dialog, re-take a fresh snapshot/screenshot rather than reusing stale element references.

### Known gotcha: browser automation tool can get stuck — fall back to chrome-devtools MCP
Mid-session, the `claude-in-chrome` MCP tools (click, javascript_tool, even screenshot) started failing consistently with `Cannot access a chrome-extension:// URL of different extension`, even across freshly-created tabs and after closing/reopening the tab group — `find` (read-only) kept working, but nothing that could interact with the page did. Switching entirely to the `chrome-devtools` MCP tools (`new_page`, `take_snapshot`, `click`, `fill`, `evaluate_script`, `press_key`) resolved it immediately (required logging into a fresh browser context, since it's a separate Chrome connection). If claude-in-chrome tools start failing repeatedly with extension-related errors, don't keep retrying indefinitely — switch tool families.

### Required fields (block "Next step" until valid)
On, Stack/Clash, Carrier Binder (auto-filled from binder), Inception/Expiry Date (auto-filled), Currency, Policy Limit, Order %, Differential, Placing Basis, Period Basis.

### Sample data used (Layer 1 / Layer 2) — Specialty / Sat Launch & Orbit
| Field | Layer 1 | Layer 2 |
|---|---|---|
| Description | Layer 1 | Layer 2 |
| Currency | USD - US Dollar | USD - US Dollar |
| Policy Limit | 20,000,000 | 35,000,000 |
| Excess | 500,000 | 1,000,000 |
| Minimum Signing | 15% | 10% |
| Written Line | 20% | 25% |
| Signed Line | 20% | 25% |
| Bound Premium (Share) | 500,000 | 875,000 |
| Amount Quoted (Share) | 4,000,000 | 8,750,000 |
| Est Gross Premium (Share) | 2,000,000 | 3,500,000 |
| RPI Type | New to Fidelis | New to Fidelis |
| Placing Basis | Direct Open Market | Direct Open Market |
| Period Basis | LOD | LOD |
| Earning Pattern | Sat Launch (Orbital/Non-Orbital) | Sat Launch (Orbital/Non-Orbital) |
| Placement Type | N/A | N/A |
| Lloyd's Leader | [0623] A F Beazley and Others | [0623] A F Beazley and Others |
| Launch Vehicle | FALCON 9 - SPACEX | ARIANE 5 ECA - ARIANESPACE |
| Orbit Type | GEO | LEO |
| Satellite Model | AMOS - IAI | 702-HP - BOEING |
| Cover Required | Launch Only | In-Orbit |
| Design Life / End of Life | 2 / 2 | 3 / 3 |
| Launch Attempts / Failures | 1 / 0 | 2 / 0 |
| Coverage Period (months) | 12 | 18 |
| Satellite Value | 134,434,343 | 200,000,000 |
| Satellite Man. Country | Bulgaria | Romania |
| UMR | UMR-TEST-001 | UMR-TEST-002 |

**Post-creation manual edits made by user (current live values, checked on the Details view after Finalize):**
| Field | Layer 1 | Layer 2 |
|---|---|---|
| Satellite Failure Rate | 7.0000% | 6.0000% |
| Fidelis Failure Rate | 8.0000% | 7.0000% |
| Scheduled Launch Date | 23-Jul-2026 | 22-Jul-2026 |

### Sample data used — Satellite Launch template (Layer 1 / Layer 2)
Same overall pattern as above, adapted for the fields this template actually has (see "Program Type changes the Financial Layer field set" gotcha).
| Field | Layer 1 | Layer 2 |
|---|---|---|
| Description | Layer 1 | Layer 2 |
| Policy Limit | 20,000,000 | 35,000,000 |
| Excess | 500,000 | 1,000,000 |
| Minimum Signing | 15% | 10% |
| Written Line | 20% | 25% |
| Signed Line | 20% | 25% |
| Bound Premium (Share) | 500,000 | 875,000 |
| Amount Quoted (Share) | 4,000,000 | 8,750,000 |
| Est Gross Premium (Share) | 2,000,000 | 3,500,000 |
| RPI Type | New to Fidelis | New to Fidelis |
| Placing Basis | Direct Open Market | Direct Open Market |
| Period Basis | LOD | LOD |
| Earning Pattern | Sat Launch (Orbital/Non-Orbital) | Sat Launch (Orbital/Non-Orbital) |
| Placement Type | N/A | N/A |
| Lloyd's Leader | [0623] A F Beazley and Others | [0623] A F Beazley and Others |
| Launch Vehicle | FALCON 9 - SPACEX | ARIANE 5 ECA - ARIANESPACE |
| Cover Required | Launch Only | Launch Only |
| Launch Attempts / Failures | 1 / 0 | 2 / 0 |
| Satellite Name | test satellite 1 | test satellite 2 |
| Satellite Name Alternative | test | test2 |
| LV Service Provider | test | test2 |
| Satellite Usage | test 1 | test 2 |
| UMR | UMR-TEST-001 | UMR-TEST-002 |

### Sample data used — Satellite in Orbit template (Layer 1 / Layer 2)
Third distinct Specialty/Space field set (see "Program Type changes the Financial Layer field set" gotcha) — no launch-event fields (no Launch Vehicle/Launch Attempts/Coverage Period), adds Weighted EPI/EPI Rationale/Gross Pricing/Net Pricing/Contributes To RDS/Gross Loss Ratio.
| Field | Layer 1 | Layer 2 |
|---|---|---|
| Description | Layer 1 | Layer 2 |
| Policy Limit | 20,000,000 | 35,000,000 |
| Excess | 500,000 | 1,000,000 |
| Minimum Signing | 15% | 10% |
| Written Line | 20% | 25% |
| Signed Line | 20% | 25% (see reset gotcha above — verify with a post-Finalize reload) |
| Bound Premium (Share) | 500,000 | 875,000 |
| Amount Quoted (Share) | 4,000,000 | 8,750,000 |
| Est Gross Premium (Share) | 2,000,000 | 3,500,000 |
| RPI Type | New to Fidelis | New to Fidelis |
| RPI & RARC | 33% (via modal, Quoted RPI field) | 45% (via modal) |
| GELR% | 15% (see Modal-fields gotcha — did not persist even on 2nd attempt) | 16% (same) |
| ULR% | 5% | 4% |
| Leader | Fidelis | Fidelis (reset once on Layer 2 only — see gotcha, re-fix via modal + reload-verify) |
| Lloyd's Leader | [0623] A F Beazley and Others | [0623] A F Beazley and Others |
| Placing Basis | Direct Open Market | Direct Open Market |
| Period Basis | LOD | LOD |
| Earning Pattern | Standard | Standard |
| Placement Type | N/A | N/A |
| Orbit Type | GEO | LEO |
| Satellite Model | AMOS - IAI | 702-HP - BOEING |
| Cover Required | In-Orbit | In-Orbit |
| Design Life / End of Life | 2 / 2 | 3 / 3 |
| Satellite Name | test satellite 1 | test satellite 2 |
| Satellite Name Alternative | test | test2 |
| Satellite Failure Rate | 7% | 6% |
| Fidelis Failure Rate | 8% | 7% |
| Satellite Value | 134,434,343 | 200,000,000 |
| Satellite Operator | test | test |
| Satellite Usage | test 1 | test 2 |
| Satellite Man. Country | Bulgaria | Romania |
| UMR | UMR-TEST-001 | UMR-TEST-002 |

### Sample data used — Reinsurance / Property / Aggregate XL template (Layer 1 / Layer 2)
Very different field set from the Specialty/Space templates above (see the "Program Type/Class of Business changes the field set" gotcha) — no Satellite fields at all, but adds Reinsurance-only fields (Agg Limit/Excess, Reins, RARC, etc.).
| Field | Layer 1 | Layer 2 |
|---|---|---|
| Description | Layer 1 | Layer 2 |
| Currency | USD - US Dollar (default) | USD - US Dollar (default) |
| Policy Limit | 20,000,000 | 35,000,000 |
| Excess | 500,000 | 1,000,000 |
| Minimum Signing | 15% | 10% |
| Written Line | 20% | 25% |
| Signed Line | 20% | 25% |
| Bound Premium (Share) | 500,000 | 875,000 |
| Deductions | 5% (via modal, Deduction Type = Brokerage) | 4.5% (via modal, Deduction Type = Brokerage) |
| RPI & RARC | 78% | 45% |
| RPI Type | New to Fidelis | New to Fidelis |
| GELR% | 15% (see Modal-fields gotcha) | 16% (see Modal-fields gotcha) |
| Agg Limit | 20,000,000 (= Policy Limit) | 35,000,000 (= Policy Limit) |
| Agg Excess | 500,000 (= Excess) | 1,000,000 (= Excess) |
| Leader | Fidelis | Fidelis |
| Placing Basis | Aggregate Excess of Loss (template default, left as-is) | Aggregate Excess of Loss (template default, left as-is) |
| Period Basis | LOD | LOD |
| Earning Pattern | Standard | Standard |
| Placement Type | N/A | N/A |
| UMR | UMR-TEST-001 | UMR-TEST-002 |

**Post-creation manual edits made by user (current live values, checked on the Details view after Finalize):**
| Field | Layer 1 | Layer 2 |
|---|---|---|
| Carrier Binder / Carrier | Fidelis IG - FUL / Fidelis IG | Syndicate 2126 - U... / F2126 |
| Lloyd's Risk Codes | 1E | 1E |
| Adj. % | 56.00% | 66.00% |
| GELR% | 11.00% | 11.00% |
| ULR% | 5.00% | 4.00% |
| Leader | Fidelis | VIOLINA / KIRIL |
| Lloyd's Leader | [0623] A F Beazley and Others | [2024] AdA SPA |
| Repayment Frequency | Bi-Monthly | Annually |
| $ Cap. Usage | 78 | 77 |
| Profit to PML | 7.00% | 8.00% |
| AM Best Profit PML | 7.0000% | 8.0000% |
| Price / PML | 7.0000% | 8.0000% |

Note: switching Layer 2's Carrier Binder to a Lloyd's syndicate (Syndicate 2126) with a lower Max Line Size than the layer's Carrier Exposure (8.75m vs a 5m limit) triggered the "Max Line Size/Policy Length Breach" banner described in the gotcha above — expected behavior, not a bug, given the deliberately mismatched values.

### Sample data used — Specialty / Aviation / Airline template (Layer 1 / Layer 2 / Layer 3)
Fourth distinct field set discovered (see the new Run 5 gotcha above) — closest to the Reinsurance/Property field list but without any Reinsurance-only fields, and adds Cover Type/Composite Terms/Coverage-Limits-Exposures. Layer 3 was created via **Clone** of Layer 1 (new permanent default — see "What changes each time" above), not hand-filled, so it inherited Layer 1's values verbatim except Carrier Binder (had to pick a different one, a Lloyd's syndicate) and Description.
| Field | Layer 1 | Layer 2 | Layer 3 (Clone of Layer 1) |
|---|---|---|---|
| Description | Layer 1 | Layer 2 | Layer 3 |
| Currency | USD - US Dollar (default) | USD - US Dollar (default) | USD - US Dollar (default) |
| Carrier Binder | Fidelis IG - FUL (default) | Fidelis IG - FUL (default) | Syndicate 3123 - UK - 2026 (picked in Clone modal) |
| Lloyd's Risk Codes | — (not required, Fidelis IG binder) | — (not required, Fidelis IG binder) | H2 - AIRLINE HULL, 100% (required — Lloyd's binder, see gotcha) |
| Policy Limit | 20,000,000 | 30,000,000 | 20,000,000 (cloned) |
| Excess | 500,000 | 20,500,000 (auto = Layer 1 Limit + Excess) | 500,000 (cloned) |
| Minimum Signing | 15% | 15% | 15% (cloned) |
| Written Line | 20% | 20% | 20% (cloned) |
| Signed Line | 20% | 20% | 20% (cloned) |
| Bound Premium (Share) | 500,000 | 300,000 | 500,000 (cloned) |
| Deductions | 5% (via modal, Deduction Type = Brokerage) | 5% (auto-inherited) | 5% (cloned) |
| Commissions | 14.5% (auto/pre-filled) | 14.5% (auto/pre-filled) | 13% (auto — differs by carrier binder) |
| RPI & RARC | 78% (via modal, Quoted RPI field) | — (left unset, see gotcha) | 78% (cloned) |
| RPI Type | New to Fidelis | — (left unset, see gotcha) | New to Fidelis (cloned) |
| GELR% | 15% (via modal) | 15% (via modal) | 15% (cloned) |
| Leader | Fidelis (via modal) | Fidelis (via modal) | Fidelis (cloned) |
| Placing Basis | Direct Open Market | Direct Open Market | Direct Open Market (cloned) |
| Period Basis | LOD | LOD | LOD (cloned) |
| Earning Pattern | — (not required for Layer 1) | Standard (required, see gotcha) | — (cloned from Layer 1, blank) |
| Placement Type | N/A | N/A | N/A (cloned) |
| UMR | UMR-TEST-001 | UMR-TEST-002 | UMR-TEST-001 (cloned, duplicate of Layer 1) |

ROFR Decision / Risk Allocation Rationale (Clone modal only, Layer 3): "Territories in which the IG is not licensed - applicable to IG QS" / "Planned Syndicate Allocation" — arbitrary reasonable picks for synthetic data, not semantically meaningful choices.

**Post-creation manual edits made by user (current live values, checked via page reload on 2026-08-12) — use this table, not the agent-entered one above, as the reference for next use:**
| Field | Layer 1 (584818) | Layer 2 (584819) | Layer 3 (584820) |
|---|---|---|---|
| Policy Limit | 20,000,000 (unchanged) | 30,000,000 (unchanged) | **120,000,000** (was 20,000,000) |
| Excess | 500,000 (unchanged) | 20,500,000 (unchanged, auto) | **3** (was 500,000 — deliberately tiny, not a typo per the data as found) |
| Minimum Signing | 15.0000% (unchanged) | **0.0000%** (was 15%) | **8.0000%** (was 15%) |
| Written Line | 20.0000000% (unchanged) | **8.0000000%** (was 20%) | **10.0000000%** (was 20%) |
| Signed Line | **19.0000000%** (was 20%) | **0.0000000%** (was 20%) | **10.0000000%** (was 20%) |
| Bound Premium (Share) | **475,000** (was 500,000) | **120,000** (was 300,000) | **250,000** (was 500,000) |
| Deductions | 5.000000% (unchanged) | 5.000000% (unchanged) | 5.000000% (unchanged) |
| Commissions | 14.500000% (unchanged) | 14.500000% (unchanged) | 13.000000% (unchanged, differs by binder) |
| Profit Commission | 3.00% / 2.00% | 4.00% / 4.00% | 2.00% / 5.00% |
| Quoted ROL | 78.000000% | 78.000000% | 13.000000% |
| RPI & RARC | 78.000000% (unchanged) | still unset ("-") | 78.000000% (unchanged) |
| RPI Type | New to Fidelis (unchanged) | **Soft** (was unset) | New to Fidelis (unchanged) |
| GELR% | 15.00% (unchanged) | 15.00% (unchanged) | **12.00%** (was 15%) |
| ULR% | unset ("-") | unset ("-") | unset ("-") |
| Leader | Fidelis (unchanged) | **VIOLINA / KIRIL** (was Fidelis) | **Fidelis / KIRIL** (was Fidelis) |
| Lloyd's Leader | [2019] AIG Jet syndicate | unset | [2454] Africa Specialty Risks |
| Weighted EPI | 3,120,000 (auto = Est Gross Premium Share) | 1,872,000 | 1,560,000 |
| Repayment Frequency | Monthly | Monthly | Monthly |
| Earning Pattern | **Standard** (was unset/not required) | Standard (unchanged) | **Custom** (was unset/cloned blank) |
| Gross Pricing | 90.0000% | 78.0000% | 56.0000% |
| Net Pricing | 85.5000% | 74.1000% | 53.2000% |
| Cover Type | Hull | Liability | Hull |
| Composite Terms | 56 | 56 | 56 |
| Coverage/Limits/Exposures | 2 Items (was "0 Items"/unset) | 1 Items (was "0 Items"/unset) | 1 Items (was "0 Items"/unset) |
| Placing Basis / Period Basis / Placement Type / UMR | Direct Open Market / LOD / N/A / UMR-TEST-001 (all unchanged) | Direct Open Market / LOD / N/A / UMR-TEST-002 (all unchanged) | Direct Open Market / LOD / N/A / UMR-TEST-001 (all unchanged) |

**New Live Totals after these edits: Exposure 6,200,000 | Premium 595,000 | RoL 9.5968%** (down substantially from the as-created 14,000,000 / 1,300,000 / 9.2857% — driven mainly by Layer 2 and Layer 3's Signed Line/Written Line/Minimum Signing being cut and Layer 3's Excess being reduced to a nominal 3 despite its Policy Limit growing 6x to 120,000,000).

Add a second layer via the **+** icon button next to "Live totals in" — it clones Carrier Binder/dates/Currency (and on the Reinsurance template, also clones Placing Basis/Period Basis/Earning Pattern/Placement Type) from the last layer as a starting point. RPI Type is **not** cloned and needs to be re-set on each new layer. For a third layer, prefer the **Clone** option on the "..." menu of an existing layer's ID cell instead — see the new Clone Layer gotcha above for its extra required fields (Carrier Binder, and conditionally ROFR Decision/Risk Allocation Rationale if a Lloyd's syndicate is picked).

Click **Save** after each layer's edits, then **Next step**. Given the reset/concatenation gotchas above, re-verify every field (including the Live Totals) one more time immediately before the final Save/Next step — and see the Modal-fields gotcha for Deductions/GELR%/ULR% specifically.

## Step 7 — Files

- Optional — no files required to proceed
- Click **Finalize** to complete the workflow (this is a one-way action — the program moves from the wizard into the standard tabbed program view: Details / Financial Layers / Files / Contract / Endorsements)

## Result

**Run 1:**
- Program created: **408288 – HELIOS KLINIKEN GMBH**, Specialty / Space / Africa / Sat Launch & Orbit
- Live totals after both layers: Exposure 12,750,000 | Premium 1,375,000 | RoI 10.7843%
- Post-finalize, a **"Compliance License Check — No License, Refer to FIID"** banner appears — standard compliance flag, not a data-entry error (likely tied to missing broker license number field, left blank in this run).

**Run 2:**
- Program created: **410413 – HELIOS KLINIKEN GMBH**, Specialty / Space / Africa / Satellite Launch
- Layer IDs: 576066 (Policy Limit 20M) and 576158 (Policy Limit 35M)
- Live totals after both layers: Exposure 12,750,000 | Premium 1,375,000 | RoI 10.7843% (same figures as Run 1 by design, since the same sample Policy Limit/Bound Premium/line% values were reused)
- Same Compliance License Check banner appeared post-finalize.
- This run is where the Earning Pattern virtualization, field-set-differs-by-Program-Type, silent field resets, and value-concatenation gotchas above were discovered — see those sections before repeating on a third Program Type.

**Run 3:**
- Program created: **414535 – HELIOS KLINIKEN GMBH**, Reinsurance / Property / Africa / Aggregate XL
- Layer IDs: 577469 (Policy Limit 20M) and 577470 (Policy Limit 35M)
- Live totals after both layers: Exposure 12,750,000 | Premium 1,375,000 | RoI 10.7843% (same figures as Runs 1–2 by design, same underlying sample values)
- Post-finalize banners: green **Compliance License Check — "Yes - Must not solicit business; and must be done on a cross-border basis"** (different wording from Runs 1–2, Reinsurance-specific), plus a red **Max Line Size/Policy Length Breach** banner after the user manually switched Layer 2's Carrier Binder to a Lloyd's syndicate with a lower limit than the layer's exposure (see gotcha above — expected, not a bug).
- This run is where the Reinsurance-specific Financial Layer field set, the Cession Consideration transient-empty-dropdown, the Modal-fields (Deductions/GELR%/ULR%) persistence gotcha, the `/programs/add` reload-loses-state gotcha, the per-binder compliance breach banner, and the claude-in-chrome → chrome-devtools MCP fallback were all discovered — see those sections before repeating on a fourth Class of Business/Program Type combination.

**Run 4:**
- Program created: **417310 – HELIOS KLINIKEN GMBH**, Specialty / Space / Africa / Satellite in Orbit
- Layer IDs: 579129 (Policy Limit 20M) and 579136 (Policy Limit 35M)
- Live totals after both layers: Exposure 12,750,000 | Premium 1,375,000 | RoI 10.7843% (same figures as Runs 1–3 by design, same underlying sample values)
- Post-finalize banner: green **Compliance License Check — "No License - Refer to FIID"** (same wording as Run 1, since License number was again left blank).
- **New required field discovered on Initial Details for this Program Type**: **Law & Jurisdiction** was blank and required (unlike prior Specialty/Space runs where it wasn't required) — selected "Other - N/A - Other - Refer".
- **New Financial Layer field set** (a third distinct Specialty/Space template, ~63 fields): has none of Launch Vehicle, Launch Attempts/Failures, or Coverage Period (months) — makes sense since this Program Type represents an already-in-orbit satellite, not a launch event. Adds fields not seen on Sat Launch & Orbit or Satellite Launch: **Weighted EPI, EPI Rationale, Gross Pricing, Net Pricing, Contributes To RDS, Gross Loss Ratio**. Keeps Orbit Type, Satellite Model, Design Life, End of Life, Satellite Name/Name Alternative/Failure Rate/Value/Operator/Usage/Man. Country (same as Sat Launch & Orbit), plus Satellite Name (like Satellite Launch).
- **Cover Required** dropdown options for this template: In-Orbit, L + 3/6/12/24/36/60 Months, Launch Only, LVFO — used **"In-Orbit"** (not "Launch Only") since this template represents ongoing in-orbit risk, not a launch — this was the right semantic choice and worked without issue.
- **Earning Pattern for this Program Type is "Standard", NOT "Sat Launch (Orbital/Non-Orbital)"** — despite being Specialty/Space like the other two templates. Selecting "Sat Launch (Orbital/Non-Orbital)" (which the dropdown search does surface as an available option) left the field marked invalid and blocked "Next step"; switching to "Standard" cleared the invalid state immediately. **Don't assume Earning Pattern is consistent across all Space Program Types — verify per Program Type**, since Sat Launch & Orbit/Satellite Launch use the Sat Launch pattern while Satellite in Orbit uses Standard.
- **New confirmed instance of the "fields silently reset" gotcha, this time on Signed Line specifically**: after filling both layers (Signed Line 20%/25%, matching Written Line), saving, and finalizing, a fresh reload showed **Signed Line reset to 0.0000000% on both layers** — despite Written Line, Minimum Signing (Layer 1), and every other plain numeric field persisting correctly. Also independently reset on this run: Minimum Signing (Layer 2 only, not Layer 1), Leader (Layer 2 only), GELR% (both layers, consistent with the pre-existing Modal-fields gotcha), and ULR% (both layers, despite ULR% being a plain textbox on this template, not a modal). Live Totals (Exposure/Premium/RoI) remained correct throughout, since they're computed from Written Line/Bound Premium, not Signed Line, in this template.
  - **Fix applied**: re-opened Edit, re-entered Signed Line/Minimum Signing/ULR% via real click + Ctrl+A + type (not scripted DOM value-setting) for both layers, re-applied Leader and GELR% via their modals, then Save. A hard reload after this second Save confirmed Signed Line, Minimum Signing, ULR%, and Leader all now persisted correctly. **GELR% alone still reset to 0.00% even after this second attempt** — consistent with the Modal-fields persistence gotcha being specifically about GELR% (and Deductions), not a general "any modal field" issue.
  - **Practical takeaway reinforced**: after Finalize, always do one more hard reload of the Financial Layers tab and spot-check every field that was filled — don't trust the pre-Finalize on-screen state, even for plain (non-modal) numeric fields like Signed Line and ULR%. This is a broader/more severe version of the existing "fields can silently reset" gotcha than previously documented — it's not limited to a small fixed list of optional fields, and it can affect fields on one layer but not the other in the same save.
- **Post-creation manual edits made by user (current live values, checked on the Financial Layers view after Finalize)** — the user filled in additional fields directly through the real UI that scripted/agent entry had left blank or stuck at 0%:

| Field | Layer 1 | Layer 2 |
|---|---|---|
| Deductions | 3.000000% (Layer 2 left at 0.000000%, not edited) | 0.000000% |
| Profit Commission | 5.00% / 6.00% | 5.00% / 6.00% |
| RPI & RARC | 56.000000% | 44.000000% |
| GELR% | 10.00% | 8.00% |
| Gross Pricing | 34.0000% | 35.0000% |
| Net Pricing | 32.9800% | 35.0000% |
| PML | 6.0000% | 8.0000% |
| Gross Loss Ratio | 5.0000% | 5.0000% |
| EPI Rationale | 3 | 3 |

  **This is the second confirmed instance (after Run 3) of GELR% persisting correctly when entered by a real human via the actual UI, after both scripted DOM-value-setting AND the proper GELR modal (opened and filled programmatically) failed to make it stick** — reinforcing that the Modal-fields persistence gotcha is specific to *programmatic* interaction (whether raw DOM manipulation or automated clicks into the modal), not a blanket platform bug affecting the field itself. When a task calls for GELR%/Deductions specifically, the most reliable approach is to ask the user to enter it, or treat any automated attempt as unverified until the user confirms.
- This run is where the Law & Jurisdiction-required-on-Specialty gotcha, the third distinct Space Financial Layer field set, the Cover Required/Earning Pattern per-Program-Type verification lesson, the broader Signed-Line/plain-field reset gotcha, and the second GELR%-manual-entry-succeeds confirmation were all discovered — see those sections before repeating on a fifth Program Type, especially another Space or Specialty variant.

**Run 5:**
- Requested Program Type "Aviation Hull & Liability" does not exist verbatim under either Reinsurance or Specialty for Line of Business = Aviation in this environment — confirmed by checking the full option list both ways. Closest available match under **Specialty / Aviation** is **"Airline"** (used) — see new "Program Type string may not exist verbatim" note under Quick Start.
- Program created: **422758 – HELIOS KLINIKEN GMBH**, Specialty / Aviation / Africa / Airline (mapping code **ALH**, category chain "Aviation & Aerospace -> Airlines -> Airline")
- Layer IDs: 584818 (Layer 1, Policy Limit 20M, Fidelis IG - FUL), 584819 (Layer 2, Policy Limit 30M, Fidelis IG - FUL), 584820 (Layer 3, Policy Limit 20M, cloned from Layer 1 onto Syndicate 3123 - UK - 2026)
- **First run using 3 layers** (new permanent default — see Quick Start) — Layer 3 created via the newly-discovered **Clone** feature rather than hand-filled
- Live totals after all 3 layers: Exposure 14,000,000 | Premium 1,300,000 | RoL 9.2857% (different from Runs 1–4's repeated 12,750,000/1,375,000/10.7843% figures, since this run used a different Policy Limit for Layer 2 (30M vs 35M) and added a third layer)
- Post-finalize banner: **Compliance License Check — "No License - Refer to FIID"** (same wording as Runs 1 and 4, License number left blank).
- This run is where the Clone Layer feature (and its own required-field set), the Lloyd's binder → Lloyd's Risk Codes required-field gate, the fourth distinct Financial Layer field set (Airline/Specialty-Aviation), and a data point of agent-driven GELR%/Deductions/RPI & RARC modal entry persisting correctly (contra Runs 3–4) were all discovered — see those sections before repeating on a Program Type not yet covered (e.g. any Reinsurance/Aviation, Casualty, or Marine variant).
- **Post-creation manual edits made by user (2026-08-12)**: user substantially re-worked the Signed/Written Line, Minimum Signing, and Bound Premium (Share) on all 3 layers, grew Layer 3's Policy Limit 6x (20M → 120M) while cutting its Excess to a nominal 3, filled in Layer 2's previously-unset RPI Type and Layer 1/Layer 3's previously-unset Earning Pattern, and populated Coverage/Limits/Exposures (previously left at "0 Items") on all 3 layers — full current-value table now in the "Sample data used — Specialty / Aviation / Airline template" section above (supersedes the as-created values for future reference). **New Live Totals: Exposure 6,200,000 | Premium 595,000 | RoL 9.5968%** (was 14,000,000 / 1,300,000 / 9.2857% as originally created).

**Run 6 (2026-09-17):**
- Environment note: this run used `https://qa-01.tfpuw.com` (a different QA slice than the `qa.tfpuw.com` used in Runs 1–5) — same login flow, same credentials, same behavior. The Azure AD app registration's `client_id` differs per subdomain (visible in the `login.microsoftonline.com` redirect URL) but the workflow is identical.
- Program created: **448590 – HELIOS KLINIKEN GMBH**, Specialty / Space / Africa / Satellite Launch
- **Only 2 layers this run, by explicit user request overriding the "3 layers by default" rule** — confirms that instruction from Quick Start is a default, not a hard requirement; state layer count explicitly when it should differ.
- Layer IDs: 611781 (Layer 1, Policy Limit 20M), 611947 (Layer 2, Policy Limit 35M) — same sample-data pattern as Run 2 (also Satellite Launch).
- Extra FL modal fields requested this run beyond the standard sample-data table, applied to **Layer 1 only**: Lloyd's Risk Codes (SC = 100%, delete not needed since only one non-zero row existed), Deductions (Brokerage, 3%) — user referred to this field as "Commissions" but its modal is titled "Deductions" and asks for Deduction Type + Deduction %, matching what was described; the actual "Commissions" field is a separate, non-modal, auto-filled 14.5% cell — Profit Commission (Profit Commission 20% / Management Expense 12%), RPI & RARC (Quoted RPI 25%), GELR (non-CAT 34% / CAT 12%, Total auto-computes to 46%), Leader (toggled "Fidelis Overall Lead" ON). All five persisted correctly via real click + fill + Apply, consistent with Run 5's finding that agent-driven modal entry can succeed (contra Runs 3–4) — but see the new gotcha below, since a *different* failure mode appeared this run.
- Live totals after both layers: Exposure 12,750,000 | Premium 1,375,000 | RoI 10.7843% (same as Runs 1–2, same underlying sample values).
- Post-finalize: no compliance banner observed in this run.

### Known gotcha (NEW in Run 6, CRITICAL): adding a second layer can swap the first layer's plain numeric fields with the new layer's
Distinct from the existing "fields can silently reset" gotcha (which blanks/zeros values) — this run saw the **first layer's Policy Limit, Excess, Minimum Signing, Written Line, Signed Line, and Bound Premium (Share) swap with the second layer's**, while modal-driven fields (Deductions, Profit Commission, RPI & RARC, GELR, Leader, Lloyd's Risk Codes) and the Description field stayed correctly attached to their own layer. Reproduced twice in the same session:
1. First occurrence: after filling Layer 1 completely, clicking **+** to add Layer 2, then filling Layer 2, a check of Layer 1 (before any Save) showed its plain numeric fields reset to blank/0 (the known reset gotcha) — this was corrected by re-filling Layer 1's plain fields a second time.
2. Second occurrence: after that correction, clicking **+** to add Layer 2 a *second* time (because the first Layer 2 attempt had been lost to a `beforeunload` navigation — see below) caused Layer 1's plain numeric fields to silently take on the *values just typed into Layer 2* instead of resetting to blank. Confirmed via `page.evaluate` reading each field's raw DOM value, then independently confirmed via a hard reload of the finalized program's read-only Financial Layers tab.
- **Practical takeaway**: after adding a new layer via **+**, treat the *previous* layer's plain numeric fields (Policy Limit, Excess, Minimum Signing, Written Line, Signed Line, Bound Premium (Share) — and likely Amount Quoted/Est Gross Premium, though not directly confirmed swapped this run) as unverified until a hard reload, even if they looked correct moments earlier. Re-check and re-fix *every* previously-filled layer's plain numeric fields after each **+** click, not just after the final Save.
- **Fix used successfully**: after Finalize (a one-way action, done deliberately even with reportedly-swapped data since it was needed to reach the read-only view for reliable verification), reopened Financial Layers, re-entered the correct numeric values per layer via real click + Ctrl+A + type + Tab, clicked **Save** (which appears in place of "Next step" when deep-linking directly into a specific wizard tab of an in-progress program rather than progressing through steps sequentially), then hard-reloaded and confirmed via the finalized read-only view that both layers now showed correct, non-swapped values.

### Known gotcha (NEW in Run 6): navigating away mid-edit triggers a native `beforeunload` dialog and discards ALL unsaved layer data, not just the current field
Using `goto`/`reload` to check persisted state (per the existing "always hard-reload to verify" advice) while a layer's fields have been edited but "Next step"/"Save" not yet clicked triggers the browser's native "leave site?" confirmation. Accepting it **discards every unsaved edit on every layer**, including ones that looked fine moments before — confirmed when an entire newly-added second layer vanished (reverted to only 1 layer existing) after accepting this dialog. **This means individual field edits on this form are NOT auto-saved per-field** (despite an earlier, incorrect assumption to that effect based on seeing "Program workflow updated successfully" log messages, which turned out to refer to the Details-tab wizard step, not per-field Financial Layer autosave) — only an explicit **Next step** (mid-wizard) or **Save** (when revisiting a tab directly) click persists Financial Layer edits to the backend. **Do not reload/navigate away to "check progress" mid-edit on this tab** — finish and explicitly save/advance first, or accept that anything unsaved will be lost.

### Known gotcha (NEW in Run 6): deep-linking into a specific wizard tab shows "Save" instead of "Next step"/"Previous step"
Navigating directly to `/programs/{id}/edit?tab=financialLayers` (or clicking that step in the sidebar) on an in-progress draft — rather than arriving via sequential "Next step" clicks — renders a **"Save"** button in place of the "Next step"/"Previous step" pair otherwise seen on that tab. Functionally it persists the tab's data the same way; useful when returning to fix a specific tab without re-walking the whole wizard.
