---
name: bug-ticket-logger
description: Write a complete, professional Jira-style bug ticket from a tester's or developer's description of a defect found during manual, API, or automation testing. Use when the user says "I found a bug", "log this as a bug", "write a bug ticket for X", or describes broken/missing/incorrect behavior and wants it documented. This is the DEFAULT skill for any bug-ticket-writing request — only use the standalone `jira-bug-logger` agent when the user explicitly asks for that agent by name. Not for filing the ticket into Jira itself — that's the `atlassian` MCP tools (`createJiraIssue`), used only if the user asks to actually create it.
author: Ivan Davidov
---

# Bug Ticket Logger

Turns a bug description (from manual testing, API testing, or a failed automated test) into a structured, professional bug ticket. Produces the ticket text; only files it into Jira via the `atlassian` MCP tools if the user explicitly asks to create it there.

**Default for bug-ticket requests.** Use this skill whenever the user asks to log/write a bug ticket, unless they explicitly name the `jira-bug-logger` agent — in that case, invoke that agent instead of this skill.

## Critical

- **Derive every field from the user's description** — never invent a pre-condition, step, or environment detail that wasn't stated or reasonably inferable from standard QA practice for this area of the app.
- **Never conflate Actual vs Expected.** Actual = what happens now (the bug). Expected = what should happen. Keep these strictly separate.
- **Ask for clarification only when the description is too vague to produce a meaningful ticket.** Otherwise, produce the ticket and explicitly note any assumptions made rather than blocking on them.
- **Steps to Reproduce must be atomic, numbered, and unambiguous** — any developer or tester should be able to follow them without guessing.
- **Adapt to the test type**: API-found bugs must include endpoint, method, request payload, and response details; automation-found bugs must reference the test case/spec file name if the user provided one.
- **This produces ticket text, not a filed Jira issue.** Only call `createJiraIssue` (via the `atlassian` MCP tools) if the user explicitly asks to create/file it — otherwise just present the formatted ticket for review.

## Instructions

### Phase 1: Gather the defect description

Take whatever the user gives you (a sentence, a failed test's output, an API response mismatch). If it's too vague to produce pre-conditions, steps, and actual/expected results, ask one targeted clarifying question — otherwise proceed and flag assumptions in the output.

### Phase 2: Infer severity and title

- **Priority**: Critical / High / Medium / Low — infer from the severity of user/business impact described.
- **Title format**: `[Module/Feature] - [Defect Description]`, specific and precise. Never use vague titles like "Bug found" or "Something is wrong".
  - Good: "Claims Movement - Duplicate File Name Validation Message Missing on Upload"
  - Good: "API /claims - 200 Status Returned on Duplicate Document Upload Instead of 400"

### Phase 3: Write the ticket

Always use this exact structure:

```
**[TICKET TITLE]**

**Type:** Bug

**Priority:** [Critical / High / Medium / Low]

**Pre-conditions:**
- List all conditions that must be met before reproducing the bug (logged-in user, existing data, environment state, etc.)

**Steps to Reproduce:**
1. Step one
2. Step two
3. Continue until the bug is triggered...

**Actual Result:**
What currently happens (the buggy behavior).

**Expected Result:**
What should happen according to requirements or standard UX/behavior.

**Environment:** [If mentioned by the user; otherwise "To be specified by reporter"]
```

For API-sourced bugs, add endpoint, HTTP method, request payload, and response body/status under Pre-conditions or Actual Result as appropriate. For automation-sourced bugs, name the failing test file/case.

### Phase 4: Present for review

Show the formatted ticket to the user along with any assumptions made while filling in inferred pre-conditions or steps. Do not file it into Jira unless the user explicitly asks — if they do, use the `atlassian` MCP `createJiraIssue` tool with these fields, resolving the correct project/issue-type via `getVisibleJiraProjects` / `getJiraIssueTypeMetaWithFields` first rather than guessing.

## See Also

- **`ai-native-workflow`** — 8-phase workflow this skill plugs into when bug logging is part of a larger debugging/verification task.
- **`debugging`** — load this first if the bug was surfaced by a failing Playwright test, to diagnose root cause before writing the ticket.
- **`.claude/agents/jira-bug-logger.md`** — the standalone agent this skill's methodology is distilled from; use it instead of this skill only when the user explicitly asks for that agent by name.
