---
name: test-case-creator
description: Design structured, executable manual test cases from Jira issues, UI screenshots/mockups, or both — before any Playwright code is written. Use when the user asks to "design test cases for X", "give me test coverage for PROJ-1234", or wants a test-case matrix from a ticket or image before automating it. Produces a TestRail-style test-case set (ID, section, priority, step blocks with inline preconditions and expected results) that later feeds `common-tasks` + `test-standards` when the user is ready to automate. This is the DEFAULT skill for any test-case-creation request — only use the standalone `jira-test-designer` agent when the user explicitly asks for that agent by name. Not for writing spec files directly — that's `common-tasks`/`test-standards`.
author: Ivan Davidov
---

# Test Case Creator

Design layer between raw requirements (Jira tickets, screenshots, mockups) and this scaffold's automated tests. Produces a reviewable manual test-case matrix — the human gate before anything gets automated.

For the 8-phase workflow see `ai-native-workflow/SKILL.md`. This skill owns Phase 3 (Explore) + Phase 4 (Plan) for **test design** intents specifically; automation itself routes onward to `common-tasks`.

**Default for test-case requests.** Use this skill whenever the user asks to design/create test cases, unless they explicitly name the `jira-test-designer` agent — in that case, invoke that agent instead of this skill.

## Critical

- **This produces a test-case document, not code.** Never jump straight to writing a `.spec.ts` file from this skill — output the test-case matrix first, get it reviewed (Phase 5 human gate), *then* route to `common-tasks`/`test-standards` to automate the ones the user picks.
- **Jira is source of truth when provided; ask when it isn't.** Fetch the full issue via the `atlassian` MCP tools (description, acceptance criteria, subtasks, comments, linked issues, attachments) — never guess acceptance criteria from a ticket title alone.
- **Images are evidence, not guesses.** When screenshots/mockups are provided, describe what you actually see (exact labels, visible states) before deriving test cases from it. Never invent a field, button, or validation message that isn't visible in the image or documented in the ticket.
- **Ambiguity → ask, don't assume.** Missing acceptance criteria, unclear image, contradiction between Jira and the screenshot → surface it and ask, per this scaffold's "ask, don't invent" rule. Document assumptions explicitly if you proceed anyway.
- **Every test case must be atomic, repeatable, independent, and traceable** back to a specific acceptance criterion or visible UI element — no vague steps like "verify it works."

## Instructions

### Phase 1: Gather inputs

| Input available | Action |
| --- | --- |
| Jira issue key(s) only | Fetch via `atlassian` MCP (`getJiraIssue`, linked issues, comments, attachments) |
| Screenshots/mockups only | Examine each image: visible elements, states (enabled/disabled/error/empty/loading), text/labels, flow order |
| Both | Fetch Jira **and** examine images; cross-reference — flag any gap or contradiction between documented requirements and the visual design before proceeding |
| Neither (vague request) | Ask the user for the ticket key, image, or a written description before continuing |

### Phase 2: Analyze for coverage dimensions

Walk every dimension that applies to the feature — don't skip silently, mark N/A if a dimension doesn't apply:

- **Functional**: happy path, alternative flows, business rules
- **UI-specific** (when images given): every interactive element, required-field validation, input format validation, button enabled/disabled states, screen-to-screen navigation
- **Boundary**: min/max values, character limits, file size/type limits, date ranges
- **Negative**: invalid input per field, missing required fields, wrong formats
- **Edge cases**: special/unicode characters, very long input, empty submission, rapid double-submit, network failure mid-action, session timeout
- **Integration points**: API calls, third-party services, auth flows
- **Non-functional**: performance (load time), security (masking, transmission), accessibility (keyboard nav, screen reader, contrast)

### Phase 3: Write the test cases (TestRail "Steps" format)

Test cases are written so they can be pasted straight into TestRail (template *Test Case (Steps)*). Each case has a short header, then one or more **step blocks**. Each step block is a self-contained variation of the scenario with its own Step and Expected Result column.

**Case header:**

| Field | Requirement |
| --- | --- |
| **Test Case ID** | `TC-{JIRA-KEY or feature}-{seq}`, e.g. `TC-PROJ-1234-001` |
| **Section** | The TestRail section the case lives in, e.g. `Amortisation schedule` |
| **Title** | Descriptive, states what is being verified |
| **Priority** | High / Medium / Low, by risk and business impact |
| **Category** | Functional / Validation / Security / UI-UX / Edge Case / etc. |
| **References** | Jira key(s) / acceptance criterion the case traces to |

**Step block rules:**

- **Step column = numbered sub-actions (`1.`, `2.`, `3.` …), one action per line.**
- **Sub-action 1 carries the preconditions inline**, written as one sentence: what to open + the state it must be in + the prepared test data. E.g. *"Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where E1 and H5 are empty, F7 is empty and B8 contains "abc"."* — there is no separate Preconditions field.
- **Every step block restates its own preconditions in full** (no "same as above"), so each block can be executed on its own.
- The remaining sub-actions are short imperative UI actions using exact labels in double quotes: *Upload the file to the "PML Amortisation Schedule" drop spot.* / *Select the layer and click Select.*
- Use `Field = Value` for the setup state (`COB = Specialty`, `LOB = Political Risk`) and name exact cells/fields/values for test data (`cell G10 is empty`, `B8 contains "abc"`).
- **Expected Result column = the observable outcome after the last sub-action**, as specific as possible: popup/page title, exact message text, counts, buttons shown, sections shown **and** sections that are *not* shown, and persisted state (*"No data is imported or saved and the layer has no amortisation schedule."*).
- Group related variations (e.g. different invalid data in the same upload) as **multiple step blocks of one case**; split into separate cases when the feature area, the starting point, or the verified behaviour differs.

**Output template (Markdown, one case):**

```markdown
#### TC-PROJ-1234-003 — Import validation errors for PML Amortisation Schedule
Section: Amortisation schedule · Priority: High · Category: Validation · References: PROJ-1234 (AC 3)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where E1 and H5 are empty, F7 is empty and B8 contains "abc".<br>2. Upload the file to the "PML Amortisation Schedule" drop spot.<br>3. Select the layer and click Select. | The popup shows the title Error importing file, the text The uploaded file does not follow the defined structure or contains invalid data, Please fix the following errors and try uploading again, Total Errors: 4, and a Close button. Sections are shown as Missing Headers & Labels (2), Missing Values (1) and Invalid Values (1). |
| 2 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where only cell G10 is empty.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot.<br>3. Select the layer and click Select. | Only the Missing Values (1) section is displayed. Missing Headers & Labels and Invalid Values are not displayed. |
| 3 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where cell F1 is empty.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot.<br>3. Select the layer and click Select.<br>4. Click Close. | The popup closes. No data is imported or saved and the layer has no amortisation schedule. |
```

Use `<br>` between sub-actions so each step block stays in one table row (matches TestRail's one-cell-per-step layout). When the case is headed for automation, name the test data so it maps onto this scaffold's `test-data/factories/{area}/` or `test-data/static/{area}/`.

### Phase 4: Deliver + self-verify

Before presenting to the user, confirm:

- [ ] Every acceptance criterion from the Jira issue is covered (if Jira was provided)
- [ ] Every interactive element from the image is covered (if an image was provided)
- [ ] No case is ambiguous or compound (one verified behaviour per case; variations go in separate step blocks)
- [ ] Every step block starts with sub-action 1 carrying the full preconditions inline (no "same as above")
- [ ] Every Expected Result names exact titles/messages/counts/buttons and what is NOT shown or saved, where relevant
- [ ] Priorities assigned by actual risk, not uniformly "High"
- [ ] Assumptions are called out explicitly, not buried
- [ ] Traceability is visible (case → requirement/element)

Present as:
1. Summary — source(s) used, total case count, coverage areas, assumptions
2. Cases grouped by screen/feature/flow
3. High-priority cases called out
4. Any gaps/open questions surfaced separately from the cases themselves

### Phase 5: Hand off to automation (optional, only when asked)

If the user wants some of these automated, route to `common-tasks` (Phase 1: resolve `{area}`) with **this test case's step blocks (inline preconditions, sub-actions, Expected Result) as the spec** — typically one `test()` or data-driven loop entry per step block — don't re-derive requirements from scratch. Load `page-objects`/`selectors`/`api-testing`/`test-standards` per the normal routing table.

## See Also

- **`ai-native-workflow`** — 8-phase workflow this skill plugs into for the design phases.
- **`common-tasks`** — where a reviewed test case goes next to become an actual `.spec.ts`.
- **`test-standards`** — spec structure/tagging once a case is automated.
- **`data-strategy`** — reuse this when a case's "Test Data" should become a factory.
- **`.claude/agents/jira-test-designer.md`** — the standalone agent this skill's methodology is distilled from; use it instead of this skill only when the user explicitly asks for that agent by name.
