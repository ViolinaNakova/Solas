---
name: e2e-scenario-creator
description: Run and document a manual end-to-end (E2E) exploratory scenario for a Line of Business (LOB) / Program Type combination in the Solas app, walking the full program lifecycle in QA (Program Creation through Bound Sign-Off), screenshotting each step, cross-checking behavior against Jira tickets for visibility conditions/defaults/known bugs, and reconciling the findings into a Confluence "E2E Scenarios" page. Use this whenever the user asks to "refresh"/"update"/"run" an E2E scenario for a LOB or Program Type, mentions walking a program through QA up to Bound/Sign-Off, or references the Space/ASC E2E refresh pattern as a template for another LOB. This is a manual/exploratory browser-driven QA activity against the live QA environment — distinct from writing Playwright automation (route those requests to `common-tasks` / `test-standards` / `page-objects` instead).
---

# E2E Scenario Creator

This skill captures a repeatable process for refreshing the documentation of a Line of
Business (LOB) / Program Type's full program lifecycle in Solas QA — first proven on
Space / Specialty (ASC – Sat Launch & Orbit) — so it can be reused for any other LOB without
re-discovering the same steps or tooling gotchas.

This is **manual/exploratory browser testing against a live QA environment**, not Playwright
test authoring. It produces updated Confluence documentation and screenshots, not spec files.
If the user actually wants automated Playwright coverage of this flow, that's a separate task —
route it to `common-tasks` (for the codegen prompt) and `test-standards`/`page-objects` once you
get there.

## MANDATORY: Human review before anything is posted or published

The user **always** wants to review the work before it leaves the local session. This is a
standing rule, not a per-request option — it applies even if a prompt template below omits
"ask me before publishing", and it is never waived implicitly.

Before **any** outward-facing action, stop, show the user exactly what will be sent (full
draft text, list of screenshots, target page/ticket/URL), and wait for explicit approval:

- Creating or updating a Confluence page (including drafts, attachments, and comments)
- Creating, editing, commenting on, transitioning, or linking a Jira issue
- Publishing an Artifact, Claude Doc, or any other shareable page
- Uploading files/screenshots to any external system
- Committing or pushing to git

Approval for one post does not carry over to the next — ask again for each distinct publish.
Read-only actions (fetching Jira tickets, reading Confluence, exploring QA) need no approval.
Creating records **inside the QA app itself** as part of running the flow (programs, notes,
file uploads to drop spots) is the test activity and does not need a separate approval.

## Why this process exists

QA behavior drifts from documentation constantly: tickets meant to change a default get put
"On Hold" or cancelled, dropdown option labels get renamed, drop-spot names change, and new
required-field gates get added at later lifecycle stages without anyone updating the docs. The
value of this skill isn't just "click through the app" — it's **treating every mismatch between
what's documented and what QA actually does as a finding to report**, backed by the Jira ticket
that explains (or fails to explain) it.

## 0. Gather inputs before starting

Confirm you have (ask the user for whatever is missing):

- **Class of Business**
- **Line of Business**
- **Program Type / Mapping Code(s)**
- **Confluence page to update** — the LOB's "E2E Scenarios for LOB = X" page
- **QA environment** — default `https://qa-01.tfpuw.com/` unless the user names a different one

Then search Jira for the tickets that explain expected behavior for this LOB, before touching
the app:

- `"Visibility Conditions" AND "[LOB]"` (Initial Details / Header)
- `"Financial Layers" AND "Visibility Conditions" AND "[LOB]"`
- `"Layer Checks" AND "Visibility Conditions" AND "[LOB]"`
- `"UAT" AND "[LOB]"` under the relevant "Enhancements & Bugs" parent epic

Note each ticket's status as you go — **Closed/Done means the behavior should be live in QA;
On Hold/Cancelled means it was never implemented, so don't expect it and don't flag its absence
as a new bug.** This distinction is what turns a confusing mismatch into a documented, cited
finding later.

## 1. Read the existing Confluence pattern first

Before running anything in QA, open the target Confluence page and note:

- The existing "Test Scenario" structure and step numbering — you'll reuse this, not redesign it
- The documented "Strict Visibility Check" field lists per section
- Any linked Risk Card sub-pages for other mapping codes

Reusing the existing structure matters more than it sounds: the reader of this doc is comparing
across LOBs, so a refreshed page that keeps the same shape is far more useful than one that's
been reorganized.

## 2. Run the flow in QA step by step

Screenshot at each ✅ point (see naming convention below). Work through the full lifecycle:

1. **Program Creation** — Submissions → Add a New Program
2. **Initial Parameters** — Class of Business / Line of Business / Zone / Program Type
3. **Initial Details** — fill mandatory fields (Client, Program Name, Broker); verify the
   strict field-visibility list against the Jira ticket from step 0; note any field that should
   be hidden per Jira but appears (or vice versa)
4. **Dates & Restrictions** — fill Inception/Expiry/Receipt; toggle Renewable/In
   Pipeline/ESG Positive; verify conditional fields (Renewal Frequency/Target Date) appear
   correctly
5. **Underwriting Status** — assign Placing/Referring Office, Underwriter, Account
   Manager, Modeller; confirm status defaults to Opportunity
6. **Perils** — select/verify default peril; note if the LOB has a forced/default peril
   per Jira
7. **Financial Layers** — verify default toggles; fill Policy Limit + any LOB-specific
   required field (e.g. Earning Pattern needs a LOB-specific option, not "Standard"); verify the
   LOB-specific field block (satellite/aircraft/vessel-type fields etc.) appears for the right
   Program Type
8. **Files (Submission)** — upload a file to the "Submission" drop spot → status becomes
   Partial Submission → Finalize
9. **Risk Card** — Show Risk Card → switch to Presentation Mode to see the bespoke
   header; verify header field count/labels and financial layer column count against the doc;
   test Notes → Add Note → UMCC (or LOB-equivalent) template
10. **Tasks to Submission Ready**:
    - Complete each TO DO task shown (Referral, Risk Card, Pricing, Aggregate Checks, any
      Pre-Bound compliance/warning tasks — these can usually be resolved inline)
    - Populate Hotline via the **Tasks menu** — not the header Hotline button, which is legacy
    - Click **Submission Ready** → fix any flagged required fields in the popup (Details /
      Financial Layers) → Proceed → Change Status
11. **UMCC Outcome** — Tasks → Populate UMCC outcome; check the actual dropdown options
    in QA, since they may differ from older docs (e.g. "Reviewed/Declined/Bring Back" vs
    "Approved/Declined")
12. **Quoted/Awaiting FOT** — Files → upload to the **Quote** drop spot (verify the exact
    drop-spot name in QA — "Sent Quote" may not exist) → status auto-advances
13. **FOT Received** — click the button in the header
14. **Bound** — click Bound → Proceed → fix all flagged required fields; these grow at
    each stage (e.g. Client Size, RPI Type, GELR%, Leader, Placement Type) → confirm Change
    Status
15. **Checks tab** — mark all Program Checks and Underwriting Checklist items green:
    - Some checks require visiting another tab first — e.g. "Contract Review completed or not
      required" needs the Contract tab (select Contract + Review Status); "Final Slip filed"
      needs a file uploaded to the **Signing** drop spot. Don't assume a direct click on the
      check icon always works.
    - The "Perils" section has its own section-level "Check" button, separate from individual
      peril icons
16. **Pre Sign-Off** — click once all checks are green
17. **Sign-Off** — check Tasks first; if blocked with "A Bound Signed-Off task must be
    created", open Tasks, confirm the "Sign off program" task exists, then click Sign-Off again

## 3. Reconcile findings against the doc

For each step, note anything that diverges from what's currently documented:

- Fields visible/hidden differently than documented → cross-check against the Jira
  visibility-conditions ticket from step 0
- Any default value that changed, or a proposed-default ticket that's still On Hold/Cancelled
- Any button/label wording that changed (dropdown option names, drop-spot names)
- Any extra required-field gate that appears only at a later status (Submission Ready / Bound)

Write findings as direct, citable statements — "X is Y, NOT Z as previously documented
(TICKET-123)" — not vague notes. See the worked example below for the tone and level of detail
to aim for.

## 4. Update the Confluence page

- Keep the existing step numbering/pattern; change only what's actually different in QA
- Replace outdated screenshots with new ones at each meaningful step (creation, each section
  fill, status transitions, Risk Card presentation mode, notes, final Sign-Off)
- Add a short note next to any changed field/behavior citing the Jira ticket number
- **Always ask the user before publishing** — show the full draft and screenshot list first
  (see "MANDATORY: Human review before anything is posted or published" above)

## Reusable prompt templates

Full version, for a LOB run for the first time:

```
Update the Confluence page [PAGE URL] with a refreshed e2e flow for LOB = [LOB],
Program Type = [PROGRAM TYPE], up to Bound Sign-off status, on https://qa-01.tfpuw.com/.
Follow the existing pattern for text and screenshots. Check these Jira tickets for
additional details: [ticket links, or a JQL search]. Ask me before publishing.
```

Shorter version, once this has been run a few times for other LOBs:

```
Refresh the E2E scenario for [LOB] / [PROGRAM TYPE] on [Confluence page URL],
same process as we used for Space/ASC — run it in QA, screenshot each step,
flag any discrepancies against Jira, then show me the update before you save it.
```

## Screenshot naming convention

Name each screenshot `stepN_<what-it-shows>.jpg`, one or two per step — e.g.
`step1_add_new_program.jpg`, `step7_earning_pattern_fixed.jpg`,
`step9_risk_card_presentation_mode.jpg`, `refresh_bound_signed_off.jpg`.

Always capture with `save_to_disk: true`, then copy from the scratch screenshot folder into
`Downloads\` with the descriptive name above — the scratch filenames are just timestamps and
aren't useful for later reference.

### Screenshots needed for Risk Card validation (step 9)

The Risk Card is the densest step in the flow and deserves its own sub-checklist, following
the same per-section breakdown used by the "E2E Risk Card Validation" Confluence pages (see
the Space/Specialty/Sat Launch (ASL) page as the pattern to copy for any other mapping code).
Treat each Risk Card sub-section as its own Action → Expected Result check, each with a
dedicated screenshot, rather than a single generic "Risk Card" shot:

1. **Open Risk Card** — `step9a_risk_card_open.jpg`: from the Details tab, click "Show Risk
   Card"; confirm the window opens successfully.
2. **Program (Header) section** — `step9b_header_section.jpg`: confirm the header shows
   *exactly* the documented field set for this LOB/mapping code (e.g. for ASL: Law &
   Jurisdiction, UW Zone / Risk Location, Broker, (Re)Insured Domicile, Post Loss Opportunity,
   Inception Date, Expiry Date) — no more, no fewer. Flag any extra/missing field against the
   doc as a finding.
3. **Financial Layer section** — `step9c_financial_layer_section.jpg` (plus a second shot if a
   horizontal scrollbar is needed to see all columns): confirm the section has its own
   independent scrollbar and that the column list matches the doc exactly, field-by-field —
   don't just eyeball "looks about right."
4. **Notes section (LOB template, e.g. UMCC)** — click **+ Add Note** and select the
   LOB-specific template from the dropdown, then screenshot each table it generates
   separately: `step9d_notes_table1_capacity.jpg`, `step9d_notes_table2_subtotal.jpg`,
   `step9d_notes_table3_details.jpg`. Confirm each table's column set matches the doc, that
   any pre-filled rows (e.g. carrier rows) appear, and — after entering text and saving —
   capture `step9d_notes_saved.jpg` to confirm the data is retained and formatted correctly.

This granularity (one screenshot per sub-section/table, not one per step) is the pattern to
replicate when writing or refreshing a Risk Card validation page for a new LOB or mapping
code.

## Tooling gotchas (read before repeating work already solved once)

**File uploads only work where the target has a real `<input type="file">`:**
- The Confluence editor and the Solas app's own file/image fields both expose a real hidden
  file input — use `find` to get its `ref`, then upload against that ref. Files must live
  somewhere the session can read (copy into `Downloads\` first if they started in a scratch temp
  folder).
- **Google Docs "Insert Image → Upload from computer" cannot be automated.** It opens a genuine
  OS-level file picker with zero `input[type=file]` elements in the page DOM (confirmed via
  `document.querySelectorAll('input[type="file"]').length` → `0`), so `find` won't locate one
  either. Don't retry this — if the target doc is Google Docs, write
  `[Insert image: <filename>.jpg]` placeholders and tell the user to drag the files in manually
  from `Downloads\`. This is a hard platform limitation, not a flaky-tool issue worth working
  around.

**Editing Google Docs via the toolbar bullet-list button is error-prone:** clicking it while the
cursor sits at the *end* of the last bullet (rather than on a fresh empty bullet) toggles list
formatting off for that line without starting a new paragraph, so the next typed text runs on
with no line break. To avoid this:
- Press **Return** first to create a new empty line, *then* toggle the list button, so the
  toggle applies to the new empty paragraph rather than the previous content line.
- If a merge happens anyway, don't try to fix it with more clicking — select the whole affected
  paragraph (`Home`, then `Shift+Down`/`Shift+End`) and retype it cleanly. Coordinate-based
  mid-line edits (clicking "between" two characters to insert a line break) are unreliable at
  typical zoom levels and tend to eat or duplicate the wrong character.
- Google Docs Find & Replace (`Ctrl+H`) does support `\n` as a real newline, but only when "Use
  regular expressions" is checked — verify the checkbox state in a screenshot before relying on
  it, since unchecked it inserts `\n` as two literal characters.

**Browser-extension flakiness** (`Cannot access a chrome-extension:// URL of different
extension`) can recur through a long session independent of anything done wrong. Recovery steps,
roughly in the order they're worth trying:
1. Retry the exact same call once or twice.
2. Ask the user to reload the Claude in Chrome extension (`chrome://extensions` → reload).
3. Open a throwaway new tab and screenshot it — a `chrome://newtab` page confirms the tool works
   again — then close it and retry the real tab.
4. Navigate the stuck tab to its own current URL to force a fresh attach; this alone resolves it
   most often.
5. A full Chrome restart is rarely needed, but if used, a fresh tab group is needed afterward too
   (the old group will report as no longer existing).

Text-only tools (page-text extraction, `find`) tend to keep working even when the visual/JS
tools are down — use them to verify document state without burning retries on the visual tool.

## Worked example: Space / Specialty (ASC – Sat Launch & Orbit)

Kept as a reference for what a completed refresh looks like and to avoid re-discovering the
same findings twice. Validated on QA1 26266.2306, refreshed 23-Sep-2026.

Findings were applied directly to the Confluence page as inline corrections (not a footnote
list) — that's the right pattern to follow for any LOB:

- Contract field is hidden on Initial Details (NGUI-2378) — matches doc.
- Cession Consideration now defaults to N/A on Initial Details (NGUI-2376).
- Default peril = Cyber Loss confirmed for all Space program types (NGUI-2342).
- Default Carrier Binder is still "Fidelis IG - FUL", NOT "Space Consortium (with 2126) - UK -
  2026" — NGUI-2343 remains On Hold, not implemented.
- Prob of Closing defaults to 100%, NOT 75% — NGUI-2344 was cancelled, not implemented.
- Earning Pattern must be set to a Space-specific option (e.g. "Sat Launch
  (Orbital/Non-Orbital)"), NOT the generic "Standard" default — the layer form blocks Save/Next
  until this is fixed.
- UMCC Outcome dropdown options are "Reviewed", "Declined" and "Bring Back", NOT
  "Approved/Declined" as previously documented.
- Hotline outcome should be populated via the Tasks panel (View on the Hotline task), NOT the
  Hotline button in the page header — the header button is legacy.
- The Quote file drop spot is named "Quote", NOT "Sent Quote" as previously documented.
- Written Line must equal Signed Line, and Minimum Signing is required, before the program can
  move to Submission Ready.
- Moving to Bound requires additional fields not previously flagged: RPI Type, GELR%, Leader and
  Placement Type on Financial Layers, plus Client Size on Details.
- The Checks tab "Contract Review completed or not required" item is resolved via the Contract
  tab (select Contract = e.g. Draft Received, Contract Review Status = No Review Required), not
  by clicking the check icon directly.
- The Checks tab "Final Slip filed" item requires a file uploaded to the "Signing" drop spot on
  the Files tab before it turns green.
- Sign-Off is blocked ("A Bound Signed-Off task must be created before you can sign off the
  program") until the "Complete pre-sign off checks" task is fully resolved and a follow-up
  "Sign off program" task appears; click Sign-Off again once that task is visible.

Screenshot set produced: `step1_add_new_program.jpg`, `step2_program_params.jpg`,
`step3_initial_details.jpg`, `step4_dates_restrictions.jpg`, `step5_underwriting_status.jpg`,
`step6_perils_default.jpg`, `step7_financial_layer_defaults.jpg`,
`step7_earning_pattern_fixed.jpg`, `step9_risk_card_presentation_mode.jpg`,
`step9_umcc_notes.jpg`, `step10_fot_received.jpg`, `step10_bound_popup.jpg`,
`refresh_bound_signed_off.jpg`.
