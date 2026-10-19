---
name: ticket-analyzer
description: Analyze a Jira ticket end to end and file the results under `tickets/{JIRA-KEY}/` — fetches the ticket via the `atlassian` MCP, writes an observations + open-questions file, then asks the user whether to design test cases now (with the `test-case-creator` skill, into a second file) or leave them for later. Also use when the user later asks for test cases for an already-analyzed ticket. Use when the user says "analyze ticket X", "ticket analizator / ticket analyzer for PROJ-1234", "prepare ticket X", "what questions should I ask on PROJ-1234", or gives a Jira key and wants both a requirements review and test cases saved to disk. Not for writing Playwright specs (route to `common-tasks`) or logging bugs (use `bug-ticket-logger`).
---

# Ticket Analyzer

Turns one Jira ticket into a reviewable folder of analysis artifacts before any testing or automation starts:

```
tickets/
└── {JIRA-KEY}/
    ├── {JIRA-KEY}-observations.md   ← observations, risks, questions to ask
    └── {JIRA-KEY}-test-cases.md     ← test-case matrix (test-case-creator skill), only if the user wants it now
```

## Critical

- **Jira is the source of truth.** Fetch the full ticket through the `atlassian` MCP. Never derive requirements from the ticket title alone, and never invent acceptance criteria, field names, or messages.
- **Ask, don't assume.** Anything ambiguous, missing, or contradictory goes into the **Questions** section, not silently into a test case. If you proceed on an assumption, label it as one in both files.
- **Documents only, no code.** This skill writes Markdown into `tickets/`. Automating a test case is a separate request that routes to `common-tasks`.
- **One ticket per folder.** The folder name is the exact Jira key in upper case (e.g. `tickets/SOL-1234/`).

## Instructions

### Step 1: Resolve the ticket key and create the folder

1. Take the key from the user's message (e.g. `SOL-1234`) and normalize it to upper case. If only a number is given, ask for the project prefix, or take it from recent tickets in `tickets/`.
2. Create `tickets/{JIRA-KEY}/` in the repo root if it doesn't exist. Create `tickets/` itself if it's missing.
3. If the folder already has files, read them first. Update them in place and add a dated "Revision" note; don't overwrite them blindly.

### Step 2: Fetch and analyze the ticket

Load the Atlassian tools with ToolSearch first (`select:mcp__atlassian__getAccessibleAtlassianResources,mcp__atlassian__getJiraIssue,mcp__atlassian__searchJiraIssuesUsingJql,mcp__atlassian__getJiraIssueRemoteIssueLinks,mcp__atlassian__getConfluencePage`), then:

| Source | What to pull |
| --- | --- |
| `getAccessibleAtlassianResources` | `cloudId` (once per session) |
| `getJiraIssue` | Summary, type, status, priority, description, acceptance criteria, components, labels, fix version, attachments, comments |
| Parent / epic, subtasks, issue links | Related scope, "blocks/is blocked by", duplicates, earlier bugs in the same area (`searchJiraIssuesUsingJql`) |
| Remote links / Confluence | Specs or designs the ticket points to (`getJiraIssueRemoteIssueLinks`, `getConfluencePage`) |

If the MCP isn't authenticated or the issue can't be fetched, **stop** and tell the user. Don't analyze from memory.

Analyze the ticket for:

- **Scope**: what changes, for whom (roles), where in the app (screens, APIs, LOB / Program Type)
- **Acceptance criteria quality**: present? testable? measurable? complete?
- **Business rules**: visibility conditions, defaults, required fields, validations, state transitions
- **Gaps & contradictions**: description vs AC vs comments vs attachments vs linked tickets
- **Risks & impact**: regression areas, integrations, data migration, permissions, existing automation in `tests/` that touches the area
- **Dependencies**: blocked-by tickets, environment/config/feature flags, test data needed

### Step 3: Write `{JIRA-KEY}-observations.md`

Use this structure:

```markdown
# {JIRA-KEY} — {Summary}

**Type:** … | **Status:** … | **Priority:** … | **Analyzed:** {YYYY-MM-DD}
**Link:** {issue URL}

## Summary
2–4 sentences in your own words: what the ticket delivers and why.

## Scope
- In scope: …
- Out of scope / not mentioned: …
- Affected areas: screens, APIs, roles, LOBs

## Acceptance Criteria (as written)
1. … (verbatim or close paraphrase, numbered, so test cases can trace to AC-1, AC-2, …)

## Observations
- Facts and findings, each with its source (description / AC / comment by X / attachment / linked ticket)

## Risks & Regression Impact
- …

## Dependencies & Test Data Needs
- …

## Assumptions
- Anything we proceed on without confirmation

## Questions to Ask
| # | Question | Why it matters | Addressed to (PO / Dev / BA) | Answer |
| - | -------- | -------------- | ---------------------------- | ------ |
| Q1 | … | … | … | _pending_ |
```

Questions must be specific and answerable, e.g. "What should the default for field X be when Y is empty?", not "Please clarify the requirements."

### Step 4: Ask whether to create test cases now

**Always ask; never skip this step or decide yourself.** After the observations file is written, use `AskUserQuestion` to ask whether to create test cases now, with these options:

- **Create test cases now**: continue to Step 5.
- **Later, I'll ask for them**: skip Step 5 and go to Step 6. Say in the report that the user can ask for test cases later (e.g. "create test cases for {JIRA-KEY}"). When they do, read the existing `{JIRA-KEY}-observations.md` and run Step 5 from it. Fetch the ticket again only to check for changes since the analysis date.

### Step 5: Write `{JIRA-KEY}-test-cases.md` with the `test-case-creator` skill

1. Invoke the **`test-case-creator`** skill and follow its phases, using the ticket data you already fetched as input. Don't fetch the ticket again.
2. Each test case traces to an AC number (`AC-n`) or an observation from Step 3. Cases blocked by an open question get the note `Blocked by Q{n}`.
3. Save the output to `tickets/{JIRA-KEY}/{JIRA-KEY}-test-cases.md` with:
   - A header that has the ticket key, summary, date, sources used, total case count, and a coverage summary
   - Cases grouped by feature/flow, in the field layout from `test-case-creator` (ID `TC-{JIRA-KEY}-{seq}`, Title, Priority, Category, Preconditions, Steps, Expected Results, Test Data, Postconditions, Traceability)
   - A traceability matrix (AC → test-case IDs) at the end, so any AC without a case stands out

### Step 6: Report

Reply to the user with:
- Links to the files created
- A 2–3 line summary of the ticket
- The number of observations, questions, and test cases (High / Medium / Low), or a note that test cases were left for later
- The top 3 questions that block testing

Don't commit unless the user asks.

## See Also

- **`test-case-creator`**: the test-design method used in Step 4
- **`bug-ticket-logger`**: if the analysis finds an existing defect
- **`common-tasks`**: to automate selected test cases afterwards
- **`e2e-scenario-creator`**: for full LOB lifecycle walkthroughs in QA
