---
name: task-report
description: Build a daily or monthly report of the tasks the user completed and save it under `passed task daily/` in the repo root. A task counts as completed when the user moved it to READY FOR RELEASE or UAT in Jira (via the `atlassian` MCP); the report lists only those completed tasks. Use when the user says "daily report", "monthly report", "what did I complete today / this month", "report of my completed tasks", "status report for October", or asks to fill the passed task daily folder. Not for analyzing a single ticket (use `ticket-analyzer`) or logging bugs (use `bug-ticket-logger`).
---

# Task Report

Writes a Markdown report that lists **only the tasks the user completed** in one day or one calendar month:

```
passed task daily/
├── daily/
│   └── 2026-10-27-daily-report.md
└── monthly/
    └── 2026-10-monthly-report.md
```

## Critical

- **Completed tasks only.** A task is completed when **the user** moved it to `READY FOR RELEASE` or `UAT` during the period. Leave out everything else: in-progress work, carry-over, commits, local files, worklogs, bugs reported, and statuses like Done, Closed or Resolved.
- **Report only what Jira shows.** Never invent tasks, statuses or times.
- **Use absolute dates.** Turn "today", "yesterday" or "last month" into exact dates, based on today's date in context.
- **Read-only on Jira.** Never transition, edit or comment on an issue.

## Instructions

### Step 1: Resolve the period

| User says | Type | Range |
| --- | --- | --- |
| "daily report", "today", nothing specific | daily | today |
| "yesterday" / a date (`27.10.2026`, `2026-10-27`) | daily | that day |
| "monthly report", "this month" | monthly | 1st of the current month to today |
| "last month" / a month name (`September`) | monthly | that whole calendar month |

For a custom range, name the file `{from}_to_{to}-report.md` and save it in `daily/`.

### Step 2: Find completed tasks

Load the tools in one call: `ToolSearch select:mcp__atlassian__getAccessibleAtlassianResources,mcp__atlassian__searchJiraIssuesUsingJql,mcp__atlassian__getJiraIssue,mcp__atlassian__atlassianUserInfo`. Get the `cloudId`, then run this query. **Always give explicit times.** With date-only values, `DURING ("a", "b")` includes the whole of day `b`, so it leaks into the next day:

```
status changed TO ("READY FOR RELEASE", UAT) BY currentUser() DURING ("{from:yyyy/MM/dd} 00:00", "{to:yyyy/MM/dd} 23:59")
```

Request the fields `summary`, `status`, `issuetype`, `priority`.

**Monthly: find dates without reading changelogs.** Many changelogs are too large to read efficiently. Run the query once per status (`TO UAT` and `TO "READY FOR RELEASE"`), with `fields: ["created"]` to keep the payload small. If an issue reached both statuses, report READY FOR RELEASE. Then re-run the query one day at a time (`"yyyy/MM/dd 00:00"` to `"yyyy/MM/dd 23:59"`) to get the date of each issue's last move in the month. Run the day queries in parallel. Check that the number of dated issues matches the monthly total (`searchResultMode: "count"`).

**Daily (or to confirm an unclear case):** read the changelog (`getJiraIssue` with `expand: "changelog"`, `updateHistory: false`) to find the time and the target of the user's transition. Changelogs can be too large to return inline. If so, filter the saved result with a short script for `status` items in the period.

- If the issue reached both statuses in the period, report the one it reached last.
- If it was moved to one of them and then moved away again (e.g. READY FOR RELEASE → Failed Test → UAT), report the status it ended the period on. If it ended on neither, drop it.
- If the query errors on a status name, find the exact spelling on one of the user's issues and retry.

### Step 3: Write the report

Create `passed task daily/daily/` or `passed task daily/monthly/` if it's missing. If the file already exists, overwrite it.

**Daily:**

```markdown
# Daily Report — 2026-10-27

**Author:** {Jira display name}

## Completed Tasks (N)
| Key | Summary | Type | Priority | Status | Moved at |
| --- | --- | --- | --- | --- | --- |
| [NGUI-3870](https://{site}/browse/NGUI-3870) | … | Bug | High | UAT | 11:12 |

Ready for Release: N · UAT: N
```

**Monthly:** use the same table, but replace **Moved at** with **Date** (`YYYY-MM-DD`) and sort by date. Title it `# Monthly Report — October 2026 (2026-10-01 to 2026-10-31)`.

If nothing was completed, write `No completed tasks for {period}.` under the heading.

### Step 4: Report back

Tell the user the saved path and the counts (total, Ready for Release, UAT). Don't paste the whole report. Don't commit unless the user asks.

## Troubleshooting

- **Atlassian MCP not authenticated or failing:** don't write a report. Tell the user that Jira is unavailable and show the error.
