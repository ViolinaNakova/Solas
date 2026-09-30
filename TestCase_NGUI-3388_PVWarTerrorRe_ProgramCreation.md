# Test Case — Specialty / Political Violence War & Terror Re Program Creation (NGUI-3388 verification)

**Source:** Jira `NGUI-3388` ("Belongs to Pool" and "Pool" values not saved when creating a new program) + live exploration of `qa.tfpuw.com` via `playwright-cli` (program **449217**, created 2026-09-18). No screenshots/mockups used.

**Summary:** 3 test cases covering the happy-path creation of a Specialty / Political Violence War & Terror Re program, and the specific NGUI-3388 regression check (pool fields persisting after create). Coverage: Functional (creation), Regression (pool persistence), Negative (blocking Cession Consideration bug found during exploration, logged as a separate defect candidate — not yet filed).

**Assumptions made** (none specified in the original request, resolved via live app defaults):
- Zone: **Africa** (already the last-used default in the app; not requested).
- Program Type: **PV Treaty – Agg XL** (1 of 6 available for this Line of Business; not requested, first option picked).
- Client/Broker/Underwriter reused from prior workflow sample data (HELIOS KLINIKEN GMBH / LINK BROKER UK LTD / Aaron Naysmith) for consistency with `Solas_AddProgram_Workflow.md`.
- Law & Jurisdiction: **England & Wales** (this Line of Business uses a country/state picker, not the simple jurisdiction list used by other templates — see workflow doc "Run 8").

**Known live-app gap surfaced during exploration (see "Open Issues" below):** Cession Consideration cannot be left unset on this Line of Business/Program Type — the backend returns HTTP 400 if `CessionOpportunityTypeId` is `null`. This is captured as TC-3 (negative case) and flagged separately as a candidate defect, not filed as a ticket.

---

## TC-1 — Create a Specialty / Political Violence War & Terror Re program (happy path)

| Field | Value |
| --- | --- |
| **Priority** | High |
| **Category** | Functional |
| **Preconditions** | User is logged into Solas (QA) with valid credentials and program-creation permissions. Client "HELIOS KLINIKEN GMBH" and Broker "LINK BROKER UK LTD" exist and are selectable. |
| **Test Data** | Class of Business: Specialty · Line of Business: Political Violence War & Terror Re · Zone: Africa · Program Type: PV Treaty – Agg XL · Client: HELIOS KLINIKEN GMBH · Broker: LINK BROKER UK LTD · Law & Jurisdiction: England & Wales · AIR Occ. Code: 301 - Residential - General residential · Terror TIV: 10,000,000 · B.I. TIV: 1,000,000 · Cession Consideration: N/A · Underwriter: Aaron Naysmith · Placing Office: London · Policy Limit (Layer 1): 10,000,000 · Placing Basis: Aggregate Excess of Loss · Period Basis: LOD |

**Steps:**
1. Click **Add a New Program**.
2. Select Class of Business = "Specialty".
3. Select Line of Business = "Political Violence War & Terror Re" (note: distinct from the similarly-named "Political Violence War And Terror" entry — verify the `&` variant is selected).
4. Select Zone = "Africa".
5. Select Program Type = "PV Treaty – Agg XL".
6. Click **Add**.
7. On Initial Details, select Client = "HELIOS KLINIKEN GMBH" and Broker = "LINK BROKER UK LTD".
8. Select Law & Jurisdiction = "England & Wales".
9. Select AIR Occ. Code = "301 - Residential - General residential".
10. Enter Terror TIV = 10,000,000 and B.I. TIV = 1,000,000.
11. Select Cession Consideration = "N/A".
12. Select Underwriter = "Aaron Naysmith" (Account Manager auto-fills to match).
13. Click **Next step**.
14. On Dates & Restrictions, leave defaults and click **Next step**.
15. On Underwriting Status, confirm Placing Office = "London" (auto-fills Referring Office), Underwriting = "Opportunity", Modelling = "Awaiting Data". Click **Next step**.
16. On Select Perils, click **Next step** without selecting a peril.
17. On Add Financial Layers, enter Policy Limit = 10,000,000, select Placing Basis = "Aggregate Excess of Loss" and Period Basis = "LOD". Click **Next step**.
18. On Files, click **Finalize**.

**Expected Results:**
- Step 6: dialog closes and the wizard opens on Initial Details with a draft program created.
- Step 13: draft is saved server-side (an `upsertprogram` call returns 200/2xx) and the wizard advances to Dates & Restrictions.
- Step 18: program is finalized (moves out of draft state), and the program detail heading shows `{ProgramId} - HELIOS KLINIKEN GMBH`.

**Postconditions:** A new, non-draft program exists for Client "HELIOS KLINIKEN GMBH", Line of Business "Political Violence War & Terror Re". No cleanup performed — created programs are left active per existing project convention (see `Solas_AddProgram_Workflow.md`).

---

## TC-2 — "Belongs to Pool" and "Pool" values persist after program creation (NGUI-3388 regression)

| Field | Value |
| --- | --- |
| **Priority** | High |
| **Category** | Regression |
| **Preconditions** | Same as TC-1 through step 12 (Initial Details reached, in-progress draft). At least one selectable Pool value exists (e.g. "Domestic"). |
| **Test Data** | Belongs to Pool: ON · Pool: "Domestic" (deliberately not the default "Excluded", so a persisted value is distinguishable from a still-default one) |

**Steps:**
1. Complete TC-1 steps 1–12, additionally:
   1a. On Initial Details, toggle **Belongs to pool** ON.
   1b. In the **Pool** dropdown that appears, select **"Domestic"**.
2. Continue TC-1 steps 13–18 to finalize the program.
3. Note the finalized program's ID from the heading.
4. Hard-reload the program's detail page directly via URL (`/programs/{id}/edit?tab=details`) — do not rely on the in-memory post-finalize view.
5. Inspect the **Belongs to pool** and **Pool** fields on the reloaded Initial Details panel.
6. (API-level check, optional but recommended) Inspect the raw response of `GET uwsub/getprograminfo?programId={id}` for the `belongsToPool` and `terrorPoolId` fields.

**Expected Results:**
- Step 5: **Belongs to pool** should show as checked/"Yes", and **Pool** should show "Domestic".
- Step 6: `belongsToPool` should be `true` and `terrorPoolId` should be a non-null ID matching "Domestic".

**Actual Result observed on 2026-09-18 (program 449217):** Belongs to pool renders as **"No"**, Pool renders as **"-"** (blank). Raw `getprograminfo` response: `"belongsToPool": null, "terrorPoolId": null`. This is despite the `upsertprogram` request (verified via browser network log) correctly sending `"BelongsToPool": true, "TerrorPoolId": 2` at creation time — confirming the defect is server-side (the create path does not persist these fields), not a UI/request-construction issue. **NGUI-3388 is CONFIRMED STILL REPRODUCING** as of this run, contradicting the ticket's most recent comment (2026-09-17) that claimed the data "saved every time on QA."

**Postconditions:** Same as TC-1. Recommend re-opening/commenting on NGUI-3388 with program 449217 as fresh repro evidence (not done automatically — pending user confirmation).

---

## TC-3 — Program creation is blocked with HTTP 400 when Cession Consideration is left unset (candidate defect, negative case)

| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Category** | Negative / Validation |
| **Preconditions** | Same as TC-1 through step 10 (Terror TIV/B.I. TIV filled), Cession Consideration NOT yet touched (remains at its default "Select a Cession Consideration" placeholder). |
| **Test Data** | Cession Consideration: left unset |

**Steps:**
1. Complete TC-1 steps 1–10.
2. Skip Cession Consideration (leave at default placeholder).
3. Complete remaining required fields (Underwriter, etc.) and click **Next step**.

**Expected Results:** Either (a) the wizard advances (if Cession Consideration is genuinely optional for this Line of Business), or (b) a field-level validation message appears telling the user Cession Consideration is required — but the request should not reach the backend with an invalid payload.

**Actual Result observed on 2026-09-18:** No client-side validation blocks the "Next step" click (Cession Consideration has no red asterisk / required marker in the UI). The `upsertprogram` request is sent with `"CessionOpportunityTypeId": null`, and the API returns **HTTP 400**: `The JSON value could not be converted to System.Int32. Path: $.CessionOpportunityTypeId`. The wizard does not advance and no user-facing error message is shown in the UI (only visible via browser console/network inspection) — this is itself a UX gap on top of the underlying backend defect.

**Postconditions:** No program created via this path. **This looks like a genuine, separate product defect** (backend DTO does not accept `null` for a UI-optional field, with no surfaced UI error) — flagged here for awareness; not filed as its own Jira ticket without explicit confirmation.

---

## Open Issues / Follow-ups (outside the test cases above)

1. **NGUI-3388 confirmed still open** — recommend commenting on the ticket with program 449217's reproduction evidence (payload sent vs. `getprograminfo` response).
2. **New candidate defect**: Cession Consideration `null` → 400 on create, silently blocking the wizard with no UI error message, specific to Political Violence War & Terror Re / PV Treaty – Agg XL (untested on other Program Types under this Line of Business). Recommend logging via the `bug-ticket-logger` skill if the user wants this tracked formally.
3. TC-1/TC-2 are not yet automated as Playwright specs. If desired, hand off to `common-tasks` (`area = solas`) using this document's Preconditions/Steps/Expected Results as the spec, following the existing `add-program.page.ts` POM patterns.
