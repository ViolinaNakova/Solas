# Solas Risk Card Test Data Extraction — Workflow

Reference playbook for extracting real Financial Layers + Risk Card data from Solas (https://qa-01.tfpuw.com/ — always QA1) programs and publishing it as test data for the Automation Testing team in Confluence. Built from extracting programs **407784** (Specialty/Space/Satellite in Orbit, ASO), **408288** (Specialty/Space/Sat Launch & Orbit, ASC), and **417783** (Specialty/Contingency/Event Cancellation, SCN).

## Target Confluence page

- Parent page: **Risk Card Details for Automation Testing** — `pageId 4494753807`, `spaceId 128385030`, space key `FS`, cloudId `4e385565-4a0e-40ab-98d7-78d19ba806a5`.
- **The data lives on ONE single sub-page, which grows over time — do not create a new page per program/run.** The page is: **"Risk Card Test Data - Programs 407784 & 408288 (Space)"** — `pageId 4569726990`. Every new program's data gets *appended* to this same page as an additional section.
- Each program gets its own clearly separated section on that page (metadata table + Financial Layers table + Risk Card table), separated by `<hr/>`. Never merge multiple programs' data into shared tables — the automation team needs to pull one program's numbers at a time.

## Step 1 — Get program metadata

Navigate to `https://qa-01.tfpuw.com/programs/<ID>/edit?tab=details` and read from **Initial Details**:
- Class of Business
- Line of Business
- Program Type
- (Mapping Code is shown in the breadcrumb next to the CoB/LoB/Program Type path, e.g. "ASO => Aviation & Aerospace -> Space -> Sat in Orbit" — the 3-letter code before `=>` is the Mapping Code)

## Step 2 — Extract Financial Layers (all layers, all fields)

1. Click the **Financial Layers** tab (or navigate to `?tab=financialLayers`).
2. Take a `take_snapshot` (accessibility tree). For a Bound/read-only program, the tab renders as flat `StaticText` label/value pairs in DOM order: all field labels first (one per row), then all of Layer 1's values in the same field order, then Layer 2's values, etc.
3. **Known gotcha — empty fields silently drop from the snapshot.** A field with no value (e.g. an unset "Expiring", "UMR", "EPI Rationale") does not emit a node at all — it isn't a blank string, it's *absent*. This shifts your position-based mapping by one for every empty field. Do NOT assume label-index N always pairs with value-index N.
   - **Fix:** reconstruct field order from the label block (which always lists every field name, even for empty ones), then walk the value block sequentially, and whenever a value looks implausible for the current field, check whether the *previous* field was empty for this layer (cross-check against the other layer, where the same field may be populated) and shift accordingly.
4. Cross-validate the extraction using known field relationships before trusting it: Policy Limit = Sum Insured (Risk Card), Written/Signed Line percentages should sum sensibly, Bound Premium (Share) ÷ Carrier Line % ≈ Premium (100%), etc. (see Step 4 formulas — apply them here too as a sanity check on the raw Financial Layers values themselves, not just the Risk Card).

## Step 3 — Open the Risk Card

1. From the program's **Financial Layers** tab, click the **"Show Risk Card"** button in the page header.
2. **Known gotcha — do NOT navigate directly to `/programs/<ID>/risk-card` via URL.** Direct URL navigation can render a false **"No financial layers to display on risk card"** empty state even when the program has valid, Risk-Card-enabled layers. Always reach the Risk Card by clicking the "Show Risk Card" button from the program's Details or Financial Layers tab — this reliably loads the data. If you land on the risk-card URL some other way (e.g. resuming a session) and see the empty state, navigate back to the program tab and click the button fresh rather than reloading the risk-card URL.
3. Toggle **"Show all"** (top right of the Financial Layers panel within the Risk Card view) before extracting — confirmed to not add extra columns for the Space templates tested so far, but toggle it anyway since the field set is not guaranteed identical across LOB/Program Type.
4. Take a `take_snapshot`. Same row-major structure as Step 2: header field-name block first, then one value block per layer, then a **Totals** column value block (preceded by a literal "Totals" label node — skip that node itself, it's not a value).
5. Same empty-field-drops-the-node gotcha as Step 2 applies here too, including within the **Totals** column (e.g. "Sum Insured" and "Net Rate" commonly have no Totals value, while "Exposure (100% USD)" and "Premium (100% USD)" do).
6. The **Leader** cell contains extra sub-text ("Claims Agreement P: Y/N", "AP to Contract C: Y/N") inline with the leader name — these are annotations on the Leader field, not separate fields. Keep them attached to the Leader cell's value (e.g. "Fidelis (Claims Agreement P: Y, AP to Contract C: Y)") rather than treating them as their own rows.

## Step 4 — Cross-validate the Risk Card extraction

Before trusting your field-to-value alignment, verify at least 4–5 values per layer against known formulas (see the more complete formula reference in the `solas-risk-card-formulas-all-lob` / `solas-risk-card-field-mapping-space` memory notes). Quick checks that catch most alignment errors:
- **Carrier/Fidelis Line** = Signed Line % if any layer has Signed Line ≠ 0, else falls back to Written Line % for **all** layers in the program (evaluated globally, not per-layer).
- **Carrier/Fidelis Exposure (USD)** = Sum Insured × Carrier Line %
- **Carrier/Fidelis Premium (USD)** = Premium (100% USD) × Carrier Line % (and should equal the Financial Layers "Bound Premium (Share)" value)
- **Carrier/Fidelis Brokerage (USD)** = Carrier Premium (USD) × Deductions %
- **Premium (100% USD)** = Bound Premium (Share) ÷ Carrier Line %
- **Totals → GELR** = simple average across layers
- **Totals → ULR** = premium-weighted average, weighted by each layer's Bound Premium (Share) (not by Premium 100%)
- **Totals → RPI** = chain-linked formula (not a simple or premium-weighted average — expect a value between the naive average and the weighted average)

If a value doesn't reconcile, first suspect a field-alignment shift (Step 2/3 gotcha) before assuming the underlying data is wrong.

## Known anomaly (not a bug in your extraction)

Both 407784 and 408288 show **Risk Card "Deductions"/"Deductions %" Totals = "0"** — not a weighted average, not a dash, just a flat zero. Confirmed real UI behavior on two different Space Program Types; document it as-is rather than "fixing" it, and flag it in the page (as done for the existing programs) so the automation team doesn't mistake it for an extraction error.

## Step 5 — Append to the existing Confluence page (do NOT create a new page)

1. Fetch the current page body first: `getConfluencePage` with `pageId 4569726990`, `contentFormat: "html"` (or `markdown` just to read/confirm structure, but re-fetch as `html` before editing since that's the format you'll write back).
2. Build the new program's section using the same structure as the existing ones on that page, in this order:
   1. `<h1>` — Program ID + Client name (+ template/program name if present)
   2. A 4-column metadata table: Class of Business | Line of Business | Program Type | Mapping Code
   3. `<h2>Financial Layers (Financial Layers tab)</h2>` — full field table, one row per field, one column per layer, headed with the layer's DB ID and Description in the column header (e.g. `Layer 573477 ("Test layer 2")`)
   4. `<h2>Risk Card</h2>` — full field table, one row per field, one column per layer plus a final **Totals** column
3. Append the new section(s) to the end of the fetched body, separated from the prior content by `<hr/>`. Keep the closing "Data extracted from https://qa-01.tfpuw.com/..." note as the very last element of the page — move it to after your newly appended section(s) rather than leaving it stranded mid-page.

**Size gotcha (encountered on the 417783 run, 2026-08-14):** once the page accumulates several programs, its ADF body can exceed the tool chain's practical limits — `getConfluencePage` refuses synchronous HTML/markdown conversion past 512KB, and even the raw ADF fetch/edit round-trip breaks down once the body exceeds a few hundred KB (the file-read tool caps at 256KB, and `updateConfluencePage` needs the *full* body resent since there is no server-side append). If you hit this, fall back to creating a new child page (e.g. "Risk Card Test Data - Program \<ID\>") under the same parent ("Risk Card Details for Automation Testing", pageId `4494753807`) instead of the single-growing-page model, and link it from the main page's intro if that page is still small enough to edit. Flag this to the user rather than silently deviating — it contradicts the "never create a new page" rule above, but past a certain size there is no working alternative with the current tools.
4. Call `updateConfluencePage` with `pageId 4569726990`, `cloudId 4e385565-4a0e-40ab-98d7-78d19ba806a5`, `contentFormat: "html"`, the **full reconstructed body** (existing content + new sections — this endpoint replaces the whole body, it does not append server-side), and a `versionMessage` noting which program(s) were added (e.g. `"Add program 417310"`).
5. Leave `title` unset on the update unless you're intentionally renaming the page (e.g. if it stops making sense to keep "Programs 407784 & 408288" in the title once several more programs are added — that's a judgment call worth flagging to the user rather than silently renaming).

**Title gotcha (only relevant if you ever do rename it):** the `title` parameter is NOT HTML-escaped — if the title contains `&`, pass a literal `&` character, not `&amp;`, or Confluence will render the literal string `&amp;` in the title. (The `body` parameter DOES need HTML entities escaped as normal, e.g. `&amp;` inside table cells.)

## Reusable prompt template

See the companion prompt below — fill in the program numbers and hand it to Claude to repeat this workflow for additional programs, appending to the same existing page.
