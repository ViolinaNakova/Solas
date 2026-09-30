---
name: test-case-creator
description: Design structured, executable manual test cases from Jira issues, UI screenshots/mockups, or both — before any Playwright code is written. Use when the user asks to "design test cases for X", "give me test coverage for PROJ-1234", or wants a test-case matrix from a ticket or image before automating it. Produces a documented test-case set (ID, priority, steps, expected results) that later feeds `common-tasks` + `test-standards` when the user is ready to automate. This is the DEFAULT skill for any test-case-creation request — only use the standalone `jira-test-designer` agent when the user explicitly asks for that agent by name. Not for writing spec files directly — that's `common-tasks`/`test-standards`.
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

### Phase 3: Write the test-case matrix

Each test case gets:

| Field | Requirement |
| --- | --- |
| **Test Case ID** | `TC-{JIRA-KEY or feature}-{seq}`, e.g. `TC-PROJ-1234-001` |
| **Title** | Descriptive, states what is being verified |
| **Priority** | High / Medium / Low, by risk and business impact |
| **Category** | Functional / Validation / Security / UI-UX / Edge Case / etc. |
| **Preconditions** | Required system state, test data, config |
| **Test Steps** | Numbered, unambiguous, executable by a non-technical tester |
| **Expected Results** | Specific and measurable per step or overall |
| **Test Data** | Concrete values — reuse this scaffold's `test-data/factories/{area}/` or `test-data/static/{area}/` naming if the case is headed for automation |
| **Postconditions** | Expected end state, if relevant |

### Phase 4: Deliver + self-verify

Before presenting to the user, confirm:

- [ ] Every acceptance criterion from the Jira issue is covered (if Jira was provided)
- [ ] Every interactive element from the image is covered (if an image was provided)
- [ ] No case is ambiguous or compound (one aspect per case)
- [ ] Priorities assigned by actual risk, not uniformly "High"
- [ ] Assumptions are called out explicitly, not buried
- [ ] Traceability is visible (case → requirement/element)

Present as:
1. Summary — source(s) used, total case count, coverage areas, assumptions
2. Cases grouped by screen/feature/flow
3. High-priority cases called out
4. Any gaps/open questions surfaced separately from the cases themselves

### Phase 5: Hand off to automation (optional, only when asked)

If the user wants some of these automated, route to `common-tasks` (Phase 1: resolve `{area}`) with **this test case's Preconditions/Steps/Expected Results/Test Data as the spec** — don't re-derive requirements from scratch. Load `page-objects`/`selectors`/`api-testing`/`test-standards` per the normal routing table.

## See Also

- **`ai-native-workflow`** — 8-phase workflow this skill plugs into for the design phases.
- **`common-tasks`** — where a reviewed test case goes next to become an actual `.spec.ts`.
- **`test-standards`** — spec structure/tagging once a case is automated.
- **`data-strategy`** — reuse this when a case's "Test Data" should become a factory.
- **`.claude/agents/jira-test-designer.md`** — the standalone agent this skill's methodology is distilled from; use it instead of this skill only when the user explicitly asks for that agent by name.
