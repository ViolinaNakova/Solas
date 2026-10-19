# NGUI-3780 — Amortisation Schedule - Data Validation, upload and Visualisation

**Type:** Story | **Status:** Open | **Priority:** Medium | **Analyzed:** 2026-10-15
**Link:** https://fidelisinsurance.atlassian.net/browse/NGUI-3780
**Parent:** NGUI-1259 Generic Submission Flow | **Labels:** Group5 | **Assignee:** Marijana Pancevski | **Reporter:** Daniel Coelho
**Links:** blocks NGUI-3984 (Fin Layers "Amount to Aggs" calculation), blocks NGUI-3985 ("Fidelis Exposure" field), connects to NGUI-3969 (Terms Sheet for PR / PR Re / ABF&PC)

> **Sources read:** full description, issue links, and descriptions of linked/related tickets (NGUI-3984, NGUI-3985, NGUI-3969, NGUI-2902, NGUI-2888, NGUI-2904, NGUI-2894, NGUI-3282, NGUI-3283). The ticket has **no comments**.
> **Not read:** the 10 inline screenshots (`image-20260921-*.png`) and the sample file `ABSA_390531_PML.Amortxlsx_Correct_Structure_Dev6_Program ID 379472 _ Layer 529886 - 2126_Correct Data.xlsx`. The Atlassian connection can't download attachments. Check them manually before testing; they may answer some questions below.

## Summary

Political Risk, Political Risk Re and Asset Backed Finance & Portfolio Credit users can upload an Excel amortisation schedule to the existing "PML Amortisation Schedule" drop spot and link it to one program layer. The system checks the file's structure and data types and lists any errors in a popup. The user then reviews and edits the data in a second popup, where it is checked against the selected layer, and saves it. Once saved, the schedule is shown in the Financial Layers tab through two new rows, "Amort Schedule" and "Amort Freeze Date". Two other tickets build on this data: Fidelis Exposure (NGUI-3985) and Amount to Aggs (NGUI-3984).

## Scope

- **In scope:**
  - Layer selection popup
  - Excel structure and data-type validation, plus the error popup
  - Review/edit popup ("Amortisation File Entries") with checks against the layer
  - Saving the schedule data and the file
  - New Fin Layers rows "Amort Schedule" and "Amort Freeze Date"
  - View Details popup
- **Out of scope / not mentioned:**
  - Calculations that use the schedule (NGUI-3984, NGUI-3985)
  - Replacing or deleting a saved schedule
  - Permissions and roles
  - Audit history
  - File type and size limits
  - Behaviour for LOBs outside the three listed
- **Affected areas:**
  - Program → Files / drop spots ("PML Amortisation Schedule")
  - Financial Layers tab (view and edit mode)
  - Fin Layer dropdown in the add file popup; new popups: Error importing file, Amortisation File Entries, Amort Schedule details
  - Backend import/validation and storage of the schedule
- **LOBs:** COB = Specialty; LOB = Political Risk, Political Risk Re, Asset Backed Finance & Portfolio Credit

## Acceptance Criteria (as written)

The ticket has no formal AC section. The requirements below are taken from its numbered steps so test cases can refer to them.

1. **AC-1 Availability**: the feature is available when COB = Specialty AND LOB is Asset Backed Finance & Portfolio Credit, Political Risk or Political Risk Re.
2. **AC-2 Layer selection** _(updated 2026-10-16: steps 1 & 2 and Scenarios 1–3 changed, Scenario 4 removed)_: in the add file popup, when the selected drop spot is "PML Amortisation Schedule", a Fin Layer dropdown is displayed.
   - Single-select dropdown of existing layer IDs + carrier numeric code.
   - **Apply** is enabled only when a Fin Layer is selected. Clicking it links the layer, starts import and validation, and closes the popup.
   - The separate "Select Program Layer" popup and its **Cancel** button were removed.
3. **AC-3 Header fields**: Repayments (E1/F1, Decimal), Premium (E2/F2, Percentage), Fidelis Line (E3/F3, Percentage). Label and value are both required.
4. **AC-4 Table headers**: Period B5, From B6, To C6, Days D5, Gross Exposure E5, Repayments F5, Policy Limit G5, Total Premium H5, Fidelis Premium I5. All required.
5. **AC-5 Table rows**:
   - Data starts at row 7, rows are read one after another, and the number of rows is not limited.
   - A row with any value in B:I is a data row, and then every cell in B:I of that row is required.
   - Processing stops at the first fully blank row.
   - Formats: From/To = Date, Days = Integer, all other columns = Decimal.
6. **AC-6 Error popup**: header "Error importing file", texts "The uploaded file does not follow the defined structure or contains invalid data", "Please fix the following errors and try uploading again", "Total Errors:[count]".
   - Section "Missing Headers & Labels ([n])": columns Field / Error / Expected Position.
   - Section "Missing Values ([n])": columns Field / Error / Expected Position.
   - Section "Invalid Values ([n])": columns Field / Error / Expected Format / Position.
   - Each section appears only when it has errors. **Close** closes the popup and nothing is imported.
7. **AC-7 Per-field error messages**: exact Field / Error / Position text for every label, header and value (listed in the ticket), with row-specific positions for table values (e.g. `B[row]`).
8. **AC-8 Review popup header**: "Amortisation File Entries" shows:
   - Layer Line = the layer's Signed Line
   - Layer Gross Pricing = the layer's Gross Pricing
   - Layer Limit = the layer's Policy Limit
   - Fidelis Line = F3 (editable)
   - Premium = F2 (editable)
   - Amort. Exposure = Gross Exposure of the row whose From–To range contains today × F3
9. **AC-9 Review table & summary**:
   - Table columns: From, To, Days, Gross Exposure, Repayments, Policy Limit, Total Premium, Fidelis Premium. Every cell is editable; date cells open a date picker.
   - Decimals are rounded to the nearest whole number for display.
   - Summary: Total Repayments = F1, Total Premium = SUM(H), Fidelis Share = SUM(I), Fidelis Line = F3.
10. **AC-10 Checks against the layer**: a failing field is shown in red with a tooltip.
    - Premium = the layer's Signed Line. Tooltip: "Premium must match the Signed Line value of the selected layer."
    - Fidelis Line = the layer's Gross Pricing. Tooltip: "Fidelis Line must match the Gross Pricing value of the selected layer."
    - First-row Policy Limit = the layer's Policy Limit. Tooltip: "Policy Limit must match the selected layer Policy Limit."
    - From ≤ To. Tooltip: "From date must be less than or equal to To date."
    - Days = days between From and To, inclusive. Tooltip: "Days value must equal the number of days between From and To dates (inclusive)."
11. **AC-11 Error states**:
    - Case 1, errors in From/Days: the Expected Errors toggle is hidden and Save is disabled.
    - Case 2, errors only in Fidelis Line, Premium or Policy Limit: the toggle "The detected errors are expected, let me save the amortisation entries" is shown. OFF → Save disabled; ON → Save enabled.
    - Case 3, no errors: Save is enabled.
12. **AC-12 Save/Cancel**:
    - Cancel closes the popup and saves nothing.
    - Save stores the schedule in the database, closes the popup, and saves the Excel file in the "PML Amortisation Schedule" drop spot.
13. **AC-13 "Amort Schedule" row** in Fin Layers, placed after "Profit Commission":
    - Label "Amort Schedule".
    - Toggle, visible only in edit mode.
    - Read-only end date = the To value of the last row, blank when no data.
    - Eye (View Details) button, enabled only when data exists.
14. **AC-14 "Amort Freeze Date" row**, placed after "Amort Schedule":
    - Toggle, enabled only when the Amort Schedule toggle is ON and data exists; visible only in edit mode.
    - Date picker, enabled only when the Freeze Date toggle is ON and the layer is in edit mode.
15. **AC-15 View Details popup**:
    - Table: From, To, Days, Gross Exposure, Repayment, Policy Limit.
    - Summary: Total Repayments, Total Premium, Fid Share, Fid Line.

## Observations

1. **The value pairs in the layer checks look swapped.** "Premium must match the Signed Line" and "Fidelis Line must match Gross Pricing". In the same popup, "Layer Line" (Signed Line) sits next to "Fidelis Line", and "Layer Gross Pricing" next to "Premium". The natural pairs are Fidelis Line ↔ Signed Line and Premium ↔ Gross Pricing. NGUI-3984/3985 also use "Fidelis Line (in amort schedule file)" where Signed Line would otherwise be used. *(description step 4; NGUI-3984, NGUI-3985)*
2. **Edited values vs. the stored file.** Every value in the review popup can be edited, but the original Excel file is what gets saved to the drop spot. After edits, the stored file and the database data will differ. *(description step 4)*
3. **Rounding is only described for display.** "Values imported from Excel as decimals are rounded to the nearest whole number and displayed as integers". The ticket doesn't say:
   - whether the stored values are rounded too
   - whether percentages (Premium, Fidelis Line) are rounded. 12.5% → 13% would affect the layer checks and the calculations in NGUI-3984/3985.
   - whether the layer checks compare rounded or raw values. *(description step 4)*
4. **The From ≤ To and Days checks don't say which rows they apply to.** Presumably every row. The ticket also doesn't check that consecutive rows have no gaps or overlaps (row N+1 From = row N To + 1). *(description step 4)*
5. **The Error case 1 text mentions only "From or Days".** A From > To error is flagged on From, so it is covered. It doesn't say whether a To cell can also be in an error state. *(description, Error case 1 vs 2)*
6. **Accepted formats aren't defined:**
   - **Date**: an Excel date value or text such as "01/02/2026", and which format.
   - **Percentage**: 0.15, 15% or "15".
   - **Integer**: whether 30.0 counts.
   - Whether negative or zero values are allowed (e.g. Repayments, Days = 0).
   - Thousand separators and currency symbols in Decimal cells. *(description step 3.1)*
7. **Data rows aren't explicitly required.** If row 7 is blank, the table has zero rows; the ticket doesn't say whether that is an error. Data after the first fully blank row is ignored silently, which is risky if users leave a gap row by mistake. *(description step 3.1)*
8. **File-level checks aren't covered:** file type (.xls / .csv / .pdf), file size, password-protected files, workbooks with several sheets (which sheet is read), and an empty workbook. *(not mentioned)*
9. **Re-upload isn't covered.** If a layer already has a schedule, the ticket doesn't say whether a new upload overwrites it, adds a version, or is blocked. There is no delete function, and it doesn't say what removing the file from the drop spot does to the stored data. *(not mentioned)*
10. **The "Amort Schedule" toggle has no stated purpose:** what ON/OFF means, its default, whether OFF removes or ignores the data, and whether the toggle depends on data existing. *(description step 5)*
11. **Probable copy-paste error in AC-14.** The Amort Freeze Date row says "**Amort Schedule** toggle – only enabled if Amort Schedule toggle is ON…". This most likely means an "Amort Freeze Date" toggle. *(description step 5)*
12. **The Expected Errors toggle text is unclear.** It reads "Visible on if … Fidelis Line / Premium / Policy Limit has a validation error" and "Not Visible if … errors are detected in other fields". This seems to mean "visible only when **all** errors are in those three fields", which is how Error case 2 reads. *(description step 4)*
13. **Total Repayments (F1) isn't compared with SUM(F7:F…).** The header value and the column sum could disagree without any warning. *(description steps 3.1, 4)*
14. **Typos in the ticket:** "Assed Backed", "Sabe button", "Repayment" vs "Repayments". *(description)*
15. **No existing automation touches amortisation.** There are no matches for "amort" in `pages/`, `tests/` or `enums/`. *(repo)*

## Risks & Regression Impact

- **Downstream calculations** NGUI-3984 (Amount to Aggs) and NGUI-3985 (Fidelis Exposure) are blocked by this ticket. They use the "row where today's date / freeze date is between From/To" and "Fidelis Line in file". Wrong date-range or rounding behaviour here will cause wrong exposures and aggregates.
- **Drop spot behaviour:** adding a popup to an existing drop spot can break current uploads to "PML Amortisation Schedule" for other LOBs, and generic file upload flows (see NGUI-2992 drop spot filtering).
- **Financial Layers form:** two new rows placed after "Profit Commission" affect field order and visibility for the PR / PR Re / ABF&PC tables (NGUI-2902, NGUI-2888), and possibly the Layer Checks tables (NGUI-2904, NGUI-2894).
- **Excel parsing:** dates, locales (dd/mm vs mm/dd), percentages stored as fractions, and formula cells are common sources of defects.
- **Large files:** the row count is unlimited, so popup rendering and validation of many rows could be slow.

## Dependencies & Test Data Needs

- QA programs with COB = Specialty and LOB = Political Risk, Political Risk Re and ABF&PC, each with at least 2 financial layers that have Signed Line, Gross Pricing and Policy Limit filled in.
- A control program from another LOB (e.g. Space, Energy Renewables) to check the feature is unavailable there.
- Excel files built from the attached sample (`ABSA_390531_…Correct Data.xlsx`):
  - a valid file
  - each header label missing
  - each table header missing
  - each value missing (header fields and table cells)
  - each value in the wrong format
  - a mix of errors (to check the counts)
  - a blank row in the middle of the table
  - zero data rows
  - a large file (e.g. 500+ rows)
  - a file that fails each layer check (Premium, Fidelis Line, Policy Limit, From > To, wrong Days)
  - a file where today's date falls in no row
  - non-xlsx files
- The 10 screenshots attached to the ticket: they hold the exact UI layout for each popup and Fin Layers state.
- NGUI-3984 and NGUI-3985 can only be tested end-to-end after this ticket is delivered.

## Assumptions

- A1: The From ≤ To and Days checks apply to **every** data row (Obs. 4).
- A2: The Expected Errors toggle is visible only when **every** detected error is in Fidelis Line, Premium or Policy Limit (Obs. 12).

## Questions to Ask

| # | Topic | Question(s) | Related AC | Why it matters | Answer |
| - | ----- | ----------- | ---------- | -------------- | ------ |
| Q1 | Layer checks: Premium and Fidelis Line look swapped | Should **Premium** be compared with the layer's **Gross Pricing**, and **Fidelis Line** with the layer's **Signed Line**?<br>_(The ticket says the opposite: Premium = Signed Line, Fidelis Line = Gross Pricing.)_ | **AC-10** Checks against the layer | Sets the expected result of the main checks and of the NGUI-3984 / NGUI-3985 calculations |  |
| Q2 | Rounding of imported values | 1. Is rounding to whole numbers for **display only**, or are the **rounded values stored**?<br>2. Are **Premium** and **Fidelis Line** (percentages) rounded too? For example, does 12.5% become 13%?<br>3. Do the layer checks compare **rounded** or **raw** values? | **AC-9** Review table & summary | Accuracy of the stored data and of the NGUI-3984 / NGUI-3985 calculations |  |
| Q3 | Which rows the date and Days checks apply to | 1. Do the **From ≤ To** and **Days** checks apply to **every** row, or only some rows?<br>2. Should the system check that rows follow on from each other, with **no gaps or overlaps** (next row's From = previous row's To + 1)? | **AC-10** Checks against the layer | Sets the scope of the validation tests |  |
| Q4 | Accepted input formats | 1. **Date:** an Excel date value or text? Which format/locale (dd/mm vs mm/dd)?<br>2. **Percentage:** 0.15, 15% or 15?<br>3. **Integer:** is 30.0 accepted?<br>4. **All numbers:** are negative or zero values allowed? | **AC-3** Header fields<br>**AC-5** Table rows | Defines the valid and invalid data sets for the format tests |  |
| Q5 | Empty tables and blank rows | 1. Is a file with **zero data rows** (row 7 blank) an error?<br>2. Should data **after a blank row** be ignored silently, or flagged to the user? | **AC-5** Table rows | Expected behaviour at the edges of row detection |  |
| Q6 | File type, size and sheets | 1. Which **file types** are accepted (.xlsx only, or also .xls / .csv)?<br>2. What is the **maximum file size**?<br>3. If the workbook has **several sheets**, which one is read? | — | Needed for the file-level negative tests |  |
| Q7 | Re-uploading and deleting a schedule | 1. If a layer **already has a schedule**, does a new upload overwrite it, add a new version, or get blocked? Is there a confirmation?<br>2. Can a schedule be **deleted**?<br>3. Does deleting the file from the drop spot also **remove the stored data**? | — | Lifecycle tests and data integrity |  |
| Q8 | Purpose of the "Amort Schedule" toggle | 1. What does the toggle **do**? Does it turn the schedule on for calculations?<br>2. What is its **default** state?<br>3. What happens to the data when it is **OFF**? | **AC-13** "Amort Schedule" row | Defines the behaviour of the new Fin Layers row |  |
| Q9 | Amort Freeze Date toggle and date range | 1. In the Amort Freeze Date row, is the toggle meant to be an **"Amort Freeze Date"** toggle? The ticket says "Amort Schedule toggle".<br>2. Must the freeze date fall **within the schedule's dates**? | **AC-14** "Amort Freeze Date" row | Probable copy-paste error; also ties into the out-of-range rule in NGUI-3984 / NGUI-3985 |  |
| Q10 | Total Repayments vs. the column sum | Should **Total Repayments** (cell F1) be checked against the sum of the Repayments column (**SUM(F7:F…)**)? | **AC-9** Review table & summary | The two values could disagree without any warning |  |
