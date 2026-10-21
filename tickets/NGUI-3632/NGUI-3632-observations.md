# NGUI-3632 — Solas - Fin Layers - Reinsurance - Import from Excel - Error handling improvement

**Type:** Story | **Status:** Open | **Priority:** Highest | **Analyzed:** 2026-10-21
**Link:** https://fidelisinsurance.atlassian.net/browse/NGUI-3632
**Parent:** NGUI-4020 (Group 4 - UAT & Hypercare Tickets) | **Sprint:** Solas Sprint 28 | **Labels:** Group4, UAT | **Component:** Solas UI | **Reporter:** Daniel Coelho

## Summary

Today the Reinsurance Fin Layer "Import Layer Data" popup (from NGUI-2383) stops at the first validation error, shows only that one error and pastes nothing. This story changes the popup so it lists **all** errors at once and highlights the bad Layer ID cells, unrecognised columns and invalid cells. It also lets the user switch on a **"Proceed to import"** toggle and do a **partial import**: valid data is imported, while rows with invalid Layer IDs, unrecognised columns and invalid cells are skipped. Three structural errors stay blocking: no header row, no Layer ID column, and no valid Layer ID at all.

## Scope

- **In scope:**
  - Paste validation in the "Import Layer Data" popup of the Fin Layer section, for COB = Reinsurance.
  - Alerts ("Validation Failed" / "Errors Found"), error messages and counts, cell and column highlighting.
  - The "Proceed to import" toggle and the Import button enable/disable logic.
  - Partial import behaviour.
- **Unchanged ("As Is"):** the header-row check and the Layer ID column check (message, nothing pasted, Import disabled).
- **Out of scope / not mentioned:**
  - Column mappings, formats and rounding rules (owned by NGUI-2383; new columns come in NGUI-4069).
  - Import button visibility.
  - Clear and Cancel behaviour.
  - Saving the program after import.
- **Affected areas:** Program create/edit, Fin Layer section, the Import Layer Data popup and the values of the Fin Layer fields (including the popup-based fields such as Quoted ROL, ULR and RPI & RARC). Role: Reinsurance underwriter.

## Acceptance Criteria (as written)

1. **AC-1 Header Row:** If the pasted data has fewer than two rows, the "Validation Failed" alert and the message "Unable to paste data. The input must include a header row" are shown, no data is pasted and Import is disabled.
2. **AC-2 Mandatory Column (LayerId):** If there is no Layer ID column, the "Validation Failed" alert and the message "Unable to paste data. The input must include a Layer ID Column." are shown, no data is pasted and Import is disabled.
3. **AC-3 All Layer IDs invalid:** If none of the Layer IDs match an existing layer, the "Validation Failed" alert and the message "The provided Layer ID(s) do not match any existing layer" are shown, no data is pasted and Import is disabled.
4. **AC-4 Valid + invalid Layer IDs, no other errors:**
   - The "Errors Found" alert is shown and the data is pasted, with the invalid Layer ID cells highlighted.
   - The messages "Only data of the valid Layer ID(s) will be imported" and "One or more provided Layer IDs do not match any existing layer. Invalid Layer ID(s): [IDs]" are shown.
   - Import is disabled, and the "Proceed to import" toggle is shown, Off by default.
5. **AC-5 Column and/or data errors (at least one valid Layer ID):** The message "Unrecognised columns and cells containing invalid values will not be imported" and the "Proceed to import" toggle (Off) are shown.
6. **AC-6 Column errors:**
   - The "Validation Failed" alert is shown, the data is pasted and the invalid columns are highlighted.
   - The header "Column validation errors ([count])" is shown, followed by "Column '[Column Name]' is not recognised" for each invalid column.
   - Import is disabled and the toggle is Off.
7. **AC-7 Data errors:**
   - The "Validation Failed" alert is shown, the data is pasted and each invalid cell is highlighted.
   - The header "Data validation errors ([count])" is shown, followed by "[Row] - [Layer ID] - The value provided for column '[Column Name]' is invalid. Expected type: [Expected Data Type]" for each invalid value.
   - Import is disabled and the toggle is Off.
8. **AC-8 Invalid Layer IDs + column/data errors:**
   - The "Validation Failed" alert is shown, the data is pasted and the invalid Layer ID cells are highlighted.
   - The two Layer ID messages and the "Unrecognised columns…" message are shown.
   - The column and data error sections from AC-6 and AC-7 are shown as they apply.
   - Import is disabled and the toggle is Off.
9. **AC-9 Toggle behaviour:** While validation errors exist, switching the toggle On enables Import and switching it Off disables Import.
10. **AC-10 Import behaviour:** Clicking Import:
    - imports rows with valid Layer IDs and skips rows with invalid Layer IDs;
    - imports recognised columns (valid-ID rows only) and skips unrecognised columns;
    - imports valid values and updates the Fin Layer fields (valid-ID rows only);
    - skips invalid values, so those fields are not updated;
    - closes the popup.

## Observations

- **O1. Button name changed.** NGUI-2383 calls the confirm button **Apply**; this ticket calls it **Import** throughout (source: the description and AC of both tickets). It may be a rename or a wording slip. → Q1
- **O2. "As Is" Layer ID column message doesn't match the original story.** NGUI-2383 defines "Unable to Paste Data. The column LayerId has not been found in the pasted data. This column must be present and have the exact same name." This ticket marks the scenario "As Is" but quotes "Unable to paste data. The input must include a Layer ID Column." (source: description vs NGUI-2383). Either the app was already changed or one of the texts is wrong. → Q2
- **O3. The "Validation Failed" alert is new even for the "As Is" scenarios.** The description says the alert sits "on top of area where data is pasted"; NGUI-2383 had no alert title (source: description + screenshots). Only the message and the blocking behaviour are "As Is".
- **O4. The wording differs between the description and the AC:**
  - The Layer ID message in the description has a double period: "…existing layer. . Invalid Layer ID(s)…". The AC has a single period.
  - The data-error line in the description includes the word "Date": "[Row] - [Layer ID] - Date The value provided…". The AC doesn't.
  - Column names are in double quotes in the description ("Column \"[name]\"is not recognised", with no space before "is") and in single quotes in the AC.
  - In the description's combined scenario (invalid IDs + validation errors), the two Layer ID messages are merged into one sentence. The AC lists them separately.
  - The AC header-row message has no trailing period; the description has one. → Q3
- **O5. Alert title depends on the scenario:**
  - Valid + invalid IDs with no other errors → **"Errors Found"**.
  - Any column or data error, with or without invalid IDs → **"Validation Failed"**.
  - All three blocking scenarios → "Validation Failed".

  The user sees "Validation Failed" both when nothing can be imported and when a partial import is possible (source: description + AC). → Q7
- **O6. Highlight colour is only given for one case.** The combined scenario says invalid Layer ID cells are "highlighted in Orange". The colour isn't given for invalid columns, invalid cells, or invalid IDs in the AC-4 scenario (source: description). → Q6
- **O7. `[Row]` is undefined.** It could be the Excel row, the pasted row including the header, or the data row index. `[Expected Data Type]` labels are also undefined. NGUI-2383 lists formats such as Decimal, Integer, Date (MM/DD/YYYY), TRUE/FALSE and ISO 4217 Code. → Q4, Q5
- **O8. Partial import inside a row.** AC-10 says invalid values "do not update the corresponding Fin Layer fields", so in a valid row the valid cells are imported and the invalid cells keep their current value (source: AC-10 + description). This is the main data-integrity risk: the right field must be left unchanged and the other fields must still update.
- **O9. Errors on invalid-ID rows aren't defined.** Neither source says whether bad cells in a row with an invalid Layer ID are listed or counted as data errors or highlighted. The import rule says that row is skipped entirely. → Q8
- **O10. A bad value in the LAYERID column itself isn't defined.** A non-integer such as "abc", or an empty cell, could be treated as an invalid Layer ID (AC-4) or as a data-type error (AC-7). NGUI-2383 had a separate "Incorrect type given" error for layerid. → Q9
- **O11. NGUI-2383's business-rule checks may or may not count as data validation errors.** These are the MarketDifferential minimum of 70% ("Differential is required and cannot be less than 70%") and the PrimaryLimit maximum of 9,999,999,999,999,999,999. If they're data errors, the cell is skipped on import. → Q10
- **O12. Clear, Cancel, re-paste and an error-free paste aren't covered:**
  - **Clear:** not mentioned. It's unknown whether it also resets the alerts, the messages and the toggle.
  - **Cancel:** not mentioned. Per NGUI-2383 it closes the popup without changes, which should still hold when the toggle is On.
  - **Re-paste:** not mentioned. A second Paste while errors are shown should replace the old errors and reset the toggle.
  - **Error-free paste:** not described. Presumably no alert or toggle, and Import is enabled straight away. → Q14, Q16
- **O13. Persistence.** NGUI-2383 copies the data into the Fin Layer fields on the program form. It's unclear whether the import saves on its own or the user still has to Save the program. → Q15
- **O14. The ticket has no comments, and it's still Open in the active sprint (Sprint 28).** The screenshots (7 attachments) show the target UI; check them against the build.
- **O15. There's no automation for the Import Layer Data popup in the repo yet.** No page object or spec was found under `pages/` or `tests/`. The Space Satellite Launch create-program specs only build layers.

## Risks & Regression Impact

- **Wrong field updated in a partial import.** Leaving out an unrecognised column in the middle of the paste could shift the column-to-field mapping, so values land in the wrong Fin Layer field. This is high impact, because premium and limit data could be silently corrupted.
- **Invalid cells clearing existing values** instead of leaving them unchanged (O8).
- **Rows with invalid IDs partly applied,** or applied to the wrong layer.
- **Regression of the NGUI-2383 rules:** column mapping, format conversion, rounding, the popup-based fields (Quoted ROL / ULR / RPI & RARC / GELR) and Cancel.
- **Interaction with NGUI-4069,** which adds new columns (FOT ROL, Annualised Fot RoL, AmBestProfitPmL, Leader). If 4069 isn't deployed first, those columns are reported as "not recognised".
- **Long error lists** (many layers × many columns): the popup must stay usable and every error must be listed. The point of the ticket is to stop showing only the first error.
- **Clipboard-based input** makes automation harder: Playwright needs clipboard permissions, and Chromium is the safest browser for it.

## Dependencies & Test Data Needs

- **QA environment** with the Reinsurance Fin Layer import (NGUI-2383) and, ideally, NGUI-4069 deployed.
- **Program R:** one program with COB = Reinsurance and **five Fin Layers (FL1–FL5)**, the Layer IDs noted, and a baseline already populated (Policy Limit, Signed Line, Inception, Currency, …) so that "not updated" can be checked. Only the import data changes between test cases (decided 2026-10-21).
- **[OTHER ID]:** the Layer ID of a layer in any other Reinsurance program in QA, used as "existing but not in this program". Only the number is needed.
- **Excel data sets** to copy to the clipboard: one valid set, plus the variations listed in the test cases. Column headers are taken from the NGUI-2383 mapping table, e.g. `LAYERID`, `PrimaryLimit`, `SignedLine`, `Inception`, `Bound`, `Currency`, `LocationsExposedToLayer`, `MarketDifferential`.
- **The ticket's screenshots,** for the exact alert placement and highlight colours.

## Assumptions

- **A1.** The confirm button is labelled **Import** (as in this ticket), not Apply. *(Q1)*
- **A2.** An error-free paste shows no alert and no toggle, and Import is enabled straight away (NGUI-2383 behaviour). *(Q16)*
- **A3.** If every Layer ID is invalid, the blocking AC-3 behaviour applies even when there are also column or data errors. AC-5 to AC-8 require "at least one Layer ID is valid".
- **A4.** Values imported into the Fin Layer fields still need the program to be saved before they persist (NGUI-2383 behaviour). *(Q15)*
- **A5.** The messages are checked against the AC wording (single quotes, no "Date", no double period) until Q3 is answered.

## Questions to Ask

| # | Question | Why it matters | Addressed to | Answer |
| - | -------- | -------------- | ------------ | ------ |
| Q1 | Is the confirm button in the Import Layer Data popup now labelled **Import** (this ticket) or still **Apply** (NGUI-2383)? | Every step and expected result refers to it; automation locators depend on it. | PO | _pending_ |
| Q2 | Which text is correct for a missing Layer ID column: "Unable to paste data. The input must include a Layer ID Column." (this ticket, marked "As Is") or "Unable to Paste Data. The column LayerId has not been found in the pasted data. This column must be present and have the exact same name." (NGUI-2383)? | The scenario is marked "As Is" but the texts differ, so one source is wrong. | PO / Dev | _pending_ |
| Q3 | What's the exact wording of the messages where the description and AC differ? (a) Is it one double period or one period in "…existing layer. . Invalid Layer ID(s)"? (b) Is "Date" part of the data-error line? (c) Are column names in single or double quotes? (d) In the combined scenario, are the Layer ID messages one sentence or two? (e) Does the header-row message end with a period? | Exact-text assertions will fail on any of these. | PO | _pending_ |
| Q4 | What does `[Row]` in "[Row] - [Layer ID] - The value provided…" refer to: the Excel row number, the pasted row including the header, or the data row index (1 = first data row)? | Needed to write the expected message for every data-error case. | Dev | _pending_ |
| Q5 | What labels are shown for `Expected type: [Expected Data Type]` for each format, e.g. "Decimal", "Integer", "Date (MM/DD/YYYY)", "Boolean / TRUE,FALSE", "ISO 4217 Code"? | Needed for the exact expected message for each column type. | Dev | _pending_ |
| Q6 | Which highlight colour is used for (a) invalid Layer ID cells when there are no other errors, (b) unrecognised columns and (c) invalid cells? Is it orange for all of them, or does each error type have its own colour? | Highlighting is an acceptance criterion; we need a concrete expected result. | PO / UX | _pending_ |
| Q7 | Is it intended that "Errors Found" is shown only when the sole problem is invalid Layer IDs, and "Validation Failed" when there are column or data errors, even though a partial import is possible in both cases? | Confirms the alert-title expectations; the difference may be an oversight. | PO | _pending_ |
| Q8 | If a row has an invalid Layer ID and also an invalid value or a value in an unrecognised column, is that cell listed and counted under "Data validation errors" and highlighted, or is only the Layer ID reported? | Changes the expected counts and messages in the combined scenario. | PO / Dev | _pending_ |
| Q9 | How is a non-integer or empty value in the LAYERID column (e.g. "abc") handled: as an invalid Layer ID (AC-4) or as a data validation error (AC-7)? | The two lead to different alerts and messages. | Dev | _pending_ |
| Q10 | Are the NGUI-2383 business rules (MarketDifferential < 70%, PrimaryLimit > 9,999,999,999,999,999,999) reported as data validation errors and skipped on import? If not, how are they handled? | Decides whether an out-of-range value blocks the import, is skipped, or is imported. | PO | _pending_ |
| Q11 | What happens to an **empty** cell in a valid row and a recognised column: is the field left unchanged, cleared, or reported as an error? | Risk of silently wiping existing Fin Layer data. | PO | _pending_ |
| Q12 | How are (a) duplicate Layer ID rows and (b) duplicate column headers in one paste handled? | Undefined; could lead to inconsistent imports. | Dev | _pending_ |
| Q13 | Is column-name matching case-sensitive or whitespace-sensitive? For example, is "signedline" or "SignedLine " (with a trailing space) recognised? | Users often paste headers from Excel macros with different casing or spaces. | Dev | _pending_ |
| Q14 | After errors are shown, does **Clear** remove the alert, the messages and the toggle and disable Import? Does a new **Paste** replace the previous errors and reset the toggle to Off? | Not specified; old errors left on screen or a toggle stuck On could let a bad import through. | PO / Dev | _pending_ |
| Q15 | When the popup closes after Import, are the values saved immediately, or only after the program is saved? Does cancelling the program edit undo the import? | Decides whether the tests check the values after the popup closes or after saving and reopening the program. | PO | _pending_ |
| Q16 | When the paste has no errors, is Import enabled straight away with no alert and no toggle (unchanged from NGUI-2383)? | Regression check for the happy path. | PO | _pending_ |
| Q17 | Does NGUI-2383's "at least two columns" rule still apply? What happens when the paste contains only the LAYERID column? | Edge case not covered by the new AC. | Dev | _pending_ |
| Q18 | Will NGUI-4069 (additional columns) be deployed before or with this story? | Without it, FOT ROL, Annualised Fot RoL, AmBestProfitPmL and Leader are reported as unrecognised columns. | PO | _pending_ |
| Q19 | With many errors (e.g. 20 layers × several invalid cells), is the error list scrollable, or limited and summarised? | Usability of the "list all errors" goal; needed to design the volume case. | UX / Dev | _pending_ |
