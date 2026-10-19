# NGUI-3780 — Test Cases: Amortisation Schedule - Data Validation, upload and Visualisation

**Created:** 2026-10-16 | **Updated:** 2026-10-16 (Program Layer Selection, after the ticket update) | **Total cases:** 47 | **TestRail import:** [NGUI-3780-test-cases.csv](NGUI-3780-test-cases.csv)

**Sources:** Jira description and Acceptance Criteria field (Scenarios 1–40; Scenario 9 removed), answers from Daniel Coelho in the ticket comment (Q1–Q10), and the observations file.

**Revision 2026-10-16:** Daniel Coelho updated description steps 1 & 2 and AC Scenarios 1–3, and removed Scenario 4. The layer is now chosen in a Fin Layer dropdown inside the add file popup (shown when the drop spot is "PML Amortisation Schedule") and confirmed with Apply; the separate Select Program Layer popup and its Cancel button are gone. TC-001 to TC-007 were rewritten (TC-007 now covers the dropdown showing only for this drop spot, replacing the removed Cancel case), and the upload steps in all other cases now use the new flow. TC-014 to TC-047 now follow the TestRail Steps pattern: the preconditions are written into step 1 ("Open an existing Program with … And Excel file prepared from the valid template where …"), so they have no separate Preconditions.

**By type:** Happy Path 14 · Negative 14 · Validation 19  
**By priority:** High 36 · Medium 10 · Low 1

## Answers used

- **Q1:** Premium is compared with Gross Pricing, Fidelis Line with Signed Line (ticket now updated).
- **Q2:** Rounding is display-only; values are stored as decimals.
- **Q3:** From ≤ To and Days checks apply to every row; no gap/overlap check.
- **Q5:** A file with no data rows is an error; rows after a blank row are ignored.
- **Q6:** .xlsx is supported; with several sheets the first one is read.
- **Q7:** The latest uploaded file is used (PQ behaviour; Solas to be confirmed in testing).
- **Q9:** A freeze date outside the schedule dates is allowed.
- **Q10:** No check of Total Repayments against the column sum; no test needed.

## Open gaps

- **Layer selection:** Scenario 3 still says Apply "closes the Select Program Layer popup", while the description says the add file popup closes. The exact label of the Fin Layer dropdown isn't given (the ticket calls it "Financial layer drop down" and "select Fin Layer drop down"). With Scenario 4 removed, what Cancel in the add file popup does after a layer is selected isn't specified; no test written.
- **Q4:** The answer (".xls") doesn't say which Date/Percentage formats are accepted. The format tests use plain text ("abc") and 30.5 as invalid values only.
- **Q8:** The answer describes the Expected Errors toggle, not the Amort Schedule toggle in Fin Layers. What the Amort Schedule toggle does is still unknown, so only its visibility and its effect on the Freeze Date toggle are tested.
- **Q5:** The error shown for a file with no data rows isn't specified (which section/text). TC expects a generic error.
- **Q6:** Behaviour for .xls/.csv and file size limits is unknown; no tests written.
- **Amort. Exposure** when today is outside all rows isn't specified; no test written.
- The ticket screenshots and sample file weren't reviewed; check them before running the tests.

## Program Layer Selection

| ID | Acceptance Criteria | Title | Type | Priority | Preconditions | Steps | Expected Result |
| -- | ------------------- | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-NGUI-3780-001 | General, Scenario 1 | Fin Layer dropdown is displayed for each in-scope LOB | Happy Path | High | Three Specialty programs exist with LOB Political Risk, Political Risk Re and Asset Backed Finance & Portfolio Credit, each with a financial layer. Valid amortisation file available. | 1. Open the Political Risk program and open the add file popup.<br>2. In the add file popup, attach the file and select "PML Amortisation Schedule" as the drop spot.<br>3. Repeat steps 1-2 for the Political Risk Re program.<br>4. Repeat steps 1-2 for the Asset Backed Finance & Portfolio Credit program. | The Fin Layer dropdown is displayed in the add file popup for all three programs. |
| TC-NGUI-3780-002 | General | Fin Layer dropdown is not displayed for an out-of-scope LOB | Negative | Medium | Program with a LOB outside scope (e.g. Space) exists, with a financial layer. Valid amortisation file available. | 1. Open the program and open the add file popup.<br>2. In the add file popup, attach the file and select "PML Amortisation Schedule" as the drop spot. | The Fin Layer dropdown is not displayed. After the upload, no amortisation import starts and the Amortisation File Entries popup is not displayed. |
| TC-NGUI-3780-003 | Scenario 1 | Fin Layer dropdown lists the program layers | Happy Path | High | Program with COB = Specialty and LOB = Political Risk exists, with two financial layers that have Signed Line, Gross Pricing and Policy Limit populated. Valid amortisation file available. | 1. Open the program and open the add file popup.<br>2. In the add file popup, attach the file and select "PML Amortisation Schedule" as the drop spot.<br>3. Click the Fin Layer dropdown. | The dropdown lists both layer IDs of the program, each with its carrier numeric code. No layers from other programs are listed. |
| TC-NGUI-3780-004 | Scenario 1 | Only one layer can be selected | Validation | Medium | Program with COB = Specialty and LOB = Political Risk exists, with two financial layers that have Signed Line, Gross Pricing and Policy Limit populated. Valid amortisation file available. | 1. Open the program and open the add file popup.<br>2. In the add file popup, attach the file and select "PML Amortisation Schedule" as the drop spot.<br>3. Select the first layer in the Fin Layer dropdown.<br>4. Select the second layer in the Fin Layer dropdown. | Only the second layer is selected; the first selection is replaced. |
| TC-NGUI-3780-005 | Scenario 2 | Apply button is enabled only after a layer is selected | Validation | High | Program with COB = Specialty and LOB = Political Risk exists, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. Valid amortisation file available. | 1. Open the program and open the add file popup.<br>2. In the add file popup, attach the file and select "PML Amortisation Schedule" as the drop spot.<br>3. Check the Apply button without selecting a layer.<br>4. Select the layer in the Fin Layer dropdown. | Apply is disabled while no Fin Layer is selected and becomes enabled after a layer is selected. |
| TC-NGUI-3780-006 | Scenario 3 | Apply links the layer and starts the import | Happy Path | High | Program with COB = Specialty and LOB = Political Risk exists, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. Valid amortisation file available. | 1. Open the program and open the add file popup.<br>2. In the add file popup, attach the file and select "PML Amortisation Schedule" as the drop spot.<br>3. Select the layer in the Fin Layer dropdown and click Apply. | The add file popup closes, the file is imported and validated, and the Amortisation File Entries popup is displayed with the Layer Line, Layer Gross Pricing and Layer Limit of the selected layer. |
| TC-NGUI-3780-007 | Scenario 1 | Fin Layer dropdown is displayed only for the PML Amortisation Schedule drop spot | Validation | Medium | Program with COB = Specialty and LOB = Political Risk exists, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. Valid amortisation file available. | 1. Open the program and open the add file popup.<br>2. Attach the file and select a drop spot other than "PML Amortisation Schedule".<br>3. Change the drop spot to "PML Amortisation Schedule".<br>4. Change the drop spot back to the other drop spot. | The Fin Layer dropdown is not displayed for the other drop spot, is displayed after "PML Amortisation Schedule" is selected, and is hidden again when the other drop spot is selected. |

## Excel File Structure Validation

**Preconditions summary**

Common to all tests in this section:
- User is logged in to Solas QA and can edit programs.
- A program exists with COB = Specialty and LOB = Political Risk.
- The program has a financial layer with Signed Line, Gross Pricing and Policy Limit populated.
- A valid amortisation template is available (based on the sample file attached to the ticket): labels in E1:E3, values in F1:F3, table headers in B5:I5, B6 and C6, data from row 7.

Test files (copies of the valid template):

| Test | File setup |
| ---- | ---------- |
| TC-NGUI-3780-008 | Rows 7 to 10 contain data, row 11 is fully blank, rows 12 to 14 contain data |
| TC-NGUI-3780-009 | Row 7 and all rows below are blank |
| TC-NGUI-3780-010 | Workbook with two sheets: sheet 1 holds a valid schedule, sheet 2 holds different data |

| ID | Acceptance Criteria | Title | Type | Priority | Preconditions | Steps | Expected Result |
| -- | ------------------- | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-NGUI-3780-008 | Scenario 7 | Rows after the first fully blank row are ignored | Validation | High | Program with COB = Specialty and LOB = Political Risk exists, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. Excel file prepared from the valid template where rows 7 to 10 contain data, row 11 is blank and rows 12 to 14 contain data. | 1. Open the program and open the add file popup, then attach the file and select "PML Amortisation Schedule" as the drop spot.<br>2. Select the layer in the Fin Layer dropdown and click Apply. | The review popup table shows only rows 7 to 10. Rows 12 to 14 are ignored and no error is reported for them. |
| TC-NGUI-3780-009 | Scenario 7 | File with no data rows is rejected | Negative | Medium | Program with COB = Specialty and LOB = Political Risk exists, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. Excel file prepared from the valid template where row 7 and all rows below are blank. | 1. Open the program and open the add file popup, then attach the file and select "PML Amortisation Schedule" as the drop spot.<br>2. Select the layer in the Fin Layer dropdown and click Apply. | The file is not imported and an error is displayed. The Amortisation File Entries popup is not displayed. |
| TC-NGUI-3780-010 | Q6 answer | Only the first sheet of the workbook is read | Validation | Medium | Program with COB = Specialty and LOB = Political Risk exists, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. Workbook whose first sheet holds a valid schedule and whose second sheet holds different data. | 1. Open the program and open the add file popup, then attach the file and select "PML Amortisation Schedule" as the drop spot.<br>2. Select the layer in the Fin Layer dropdown and click Apply. | The review popup shows the data from the first sheet only. |

## File Import Error Handling

**Preconditions summary**

Common to all tests in this section:
- User is logged in to Solas QA and can edit programs.
- A program exists with COB = Specialty and LOB = Political Risk.
- The program has a financial layer with Signed Line, Gross Pricing and Policy Limit populated, and no amortisation schedule saved.
- A valid amortisation template is available (based on the sample file attached to the ticket): labels in E1:E3, values in F1:F3, table headers in B5:I5, B6 and C6, data from row 7.

Test files (copies of the valid template with errors added):

| Test | File setup | Errors expected |
| ---- | ---------- | --------------- |
| TC-NGUI-3780-011 | E1 and H5 empty, F7 empty, B8 contains "abc" | 4 (2 missing labels/headers, 1 missing value, 1 invalid value) |
| TC-NGUI-3780-012 | Only G10 empty | 1 missing value |
| TC-NGUI-3780-013 | F1 empty | 1 missing value |

| ID | Acceptance Criteria | Title | Type | Priority | Preconditions | Steps | Expected Result |
| -- | ------------------- | ----- | ---- | -------- | ------------- | ----- | --------------- |
| TC-NGUI-3780-011 | Scenario 10, Scenario 11 | Import error popup content and counts | Validation | High | Program with COB = Specialty and LOB = Political Risk exists, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. Excel file prepared from the valid template where E1 and H5 are empty, F7 is empty and B8 contains "abc". | 1. Open the program and open the add file popup, then attach the file and select "PML Amortisation Schedule" as the drop spot.<br>2. Select the layer in the Fin Layer dropdown and click Apply. | The popup shows the title Error importing file, the texts The uploaded file does not follow the defined structure or contains invalid data, Please fix the following errors and try uploading again, Total Errors: 4, and a Close button. Sections are shown as Missing Headers & Labels (2), Missing Values (1) and Invalid Values (1). |
| TC-NGUI-3780-012 | Scenario 11 | Only sections with errors are displayed | Validation | Medium | Program with COB = Specialty and LOB = Political Risk exists, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. Excel file prepared from the valid template where only cell G10 is empty. | 1. Open the program and open the add file popup, then attach the file and select "PML Amortisation Schedule" as the drop spot.<br>2. Select the layer in the Fin Layer dropdown and click Apply. | Only the Missing Values (1) section is displayed. Missing Headers & Labels and Invalid Values are not displayed. |
| TC-NGUI-3780-013 | Scenario 16 | Close on import error popup imports nothing | Negative | High | Program with COB = Specialty and LOB = Political Risk exists, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. Excel file prepared from the valid template where cell F1 is empty. | 1. Open the program and open the add file popup, then attach the file and select "PML Amortisation Schedule" as the drop spot.<br>2. Select the layer in the Fin Layer dropdown and click Apply.<br>3. Click Close.<br>4. Open the Financial Layers tab and check the layer. | The popup closes. No data is imported or saved and the layer has no amortisation schedule. |

## Data Import and Review

#### TC-NGUI-3780-014 — Valid file opens the review popup without saving
Section: Data Import and Review · Priority: High · Type: Happy Path · Acceptance Criteria: Scenario 17

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And a valid Excel file prepared from the template.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Without saving, open the program in another browser tab and check the layer in the Financial Layers tab. | The Amortisation File Entries popup is displayed. The layer has no saved amortisation schedule yet. |

#### TC-NGUI-3780-015 — Review popup header fields
Section: Data Import and Review · Priority: High · Type: Happy Path · Acceptance Criteria: Scenario 18

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where F3 is 10% and today's date falls between From and To of the row with Gross Exposure 1000000.40.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Check the header fields of the Amortisation File Entries popup. | Layer Line equals the layer Signed Line, Layer Gross Pricing equals the layer Gross Pricing, Layer Limit equals the layer Policy Limit, Fidelis Line equals F3, Premium equals F2 and Amort. Exposure shows 100000. |

#### TC-NGUI-3780-016 — Imported values can be edited
Section: Data Import and Review · Priority: Medium · Type: Happy Path · Acceptance Criteria: Scenario 18, Scenario 20

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And a valid Excel file prepared from the template.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Change From and To in row 1 using the date picker.<br>5. Enter 31 in Days.<br>6. Enter integers in Gross Exposure, Repayments, Policy Limit, Total Premium and Fidelis Premium.<br>7. Enter 3.5% in Premium and 12% in Fidelis Line. | From and To open a date picker and show the picked dates. All other fields accept and show the entered values. |

#### TC-NGUI-3780-017 — Schedule table shows imported rows with rounded values
Section: Data Import and Review · Priority: High · Type: Happy Path · Acceptance Criteria: Scenario 19

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where row 7 has Gross Exposure 1234.5 and row 8 has Gross Exposure 1234.4.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Compare the table with columns B to I of the file. | The table has columns From, To, Days, Gross Exposure, Repayments, Policy Limit, Total Premium and Fidelis Premium with one row per data row. Decimals are shown as whole numbers: row 1 Gross Exposure 1235, row 2 Gross Exposure 1234. |

#### TC-NGUI-3780-018 — Days does not accept a non-integer value
Section: Data Import and Review · Priority: Low · Type: Negative · Acceptance Criteria: Scenario 20

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And a valid Excel file prepared from the template.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Click a Days cell and enter 30.5.<br>5. Click the same Days cell and enter abc. | Neither value is accepted and the Days cell keeps a valid integer. |

#### TC-NGUI-3780-019 — Summary fields are populated from the file
Section: Data Import and Review · Priority: High · Type: Happy Path · Acceptance Criteria: Scenario 21

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And a valid Excel file prepared from the template.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Check the summary fields under the table. | Total Repayments equals F1, Total Premium equals the sum of column H, Fidelis Share equals the sum of column I and Fidelis Line equals F3. |

## Imported Data - Business Rules Validation

#### TC-NGUI-3780-020 — Premium different from layer Gross Pricing is flagged
Section: Imported Data - Business Rules Validation · Priority: High · Type: Validation · Acceptance Criteria: Scenario 22

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where F2 differs from the layer Gross Pricing.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Hover over Premium. | Premium is highlighted in red and the tooltip shows Premium must match the Gross Pricing value of the selected layer. |

#### TC-NGUI-3780-021 — No errors: Save enabled without toggle
Section: Imported Data - Business Rules Validation · Priority: High · Type: Happy Path · Acceptance Criteria: Scenario 22, Scenario 23, Scenario 30

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where F2 equals the layer Gross Pricing, F3 equals the layer Signed Line, G7 equals the layer Policy Limit and all From, To and Days values are correct.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Check the fields, the Expected Errors toggle and the Save button. | No field is highlighted, the Expected Errors toggle is not displayed and Save is enabled. |

#### TC-NGUI-3780-022 — Fidelis Line different from layer Signed Line is flagged
Section: Imported Data - Business Rules Validation · Priority: High · Type: Validation · Acceptance Criteria: Scenario 23

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where F3 differs from the layer Signed Line.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Hover over Fidelis Line. | Fidelis Line is highlighted in red and the tooltip shows Fidelis Line must match the Signed Line value of the selected layer. |

#### TC-NGUI-3780-023 — Only the first-row Policy Limit is compared with the layer
Section: Imported Data - Business Rules Validation · Priority: High · Type: Validation · Acceptance Criteria: Scenario 24

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where G7 and G8 both differ from the layer Policy Limit.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Hover over Policy Limit in row 1.<br>5. Check Policy Limit in row 2. | Row 1 Policy Limit is highlighted in red with the tooltip Policy Limit must match the selected layer Policy Limit. Row 2 is not highlighted. |

#### TC-NGUI-3780-024 — From later than To is flagged in any row
Section: Imported Data - Business Rules Validation · Priority: High · Type: Validation · Acceptance Criteria: Scenario 25, Scenario 28

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where row 7 has From 31/01/2027 and To 01/01/2027, row 8 has From and To 01/02/2027 with Days 1, and the last row has From later than To.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Hover over From in row 1.<br>5. Check From in row 2 and in the last row.<br>6. Check the Expected Errors toggle and the Save button. | From in row 1 and in the last row is highlighted in red with the tooltip From date must be less than or equal to To date. Row 2 is not highlighted. The toggle is not visible and Save is disabled. |

#### TC-NGUI-3780-025 — Days not matching the inclusive date range is flagged in any row
Section: Imported Data - Business Rules Validation · Priority: High · Type: Validation · Acceptance Criteria: Scenario 26, Scenario 28

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where row 7 is 01/01/2027 to 31/01/2027 with Days 30, row 8 is 01/02/2027 to 28/02/2027 with Days 28, and the last row has wrong Days.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Hover over Days in row 1.<br>5. Check Days in row 2 and in the last row.<br>6. Check the Expected Errors toggle and the Save button. | Days in row 1 and in the last row is highlighted in red with the tooltip Days value must equal the number of days between From and To dates (inclusive). Row 2 is not highlighted. The toggle is not visible and Save is disabled. |

#### TC-NGUI-3780-026 — Correcting a value removes the error highlight
Section: Imported Data - Business Rules Validation · Priority: High · Type: Validation · Acceptance Criteria: Scenario 27

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where From in row 7 is later than To and F2 differs from the layer Gross Pricing.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Change From in row 1 to a date before To.<br>5. Change Premium to the layer Gross Pricing.<br>6. Hover over both fields. | The red highlight is removed from both fields and no tooltip is shown. |

#### TC-NGUI-3780-027 — Date error with a layer mismatch still blocks saving
Section: Imported Data - Business Rules Validation · Priority: High · Type: Negative · Acceptance Criteria: Scenario 28

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where Days in row 7 is wrong and F2 differs from the layer Gross Pricing.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Check the Expected Errors toggle and the Save button. | The Expected Errors toggle is not visible and Save is disabled. |

#### TC-NGUI-3780-028 — Expected Errors toggle controls Save for layer mismatches
Section: Imported Data - Business Rules Validation · Priority: High · Type: Validation · Acceptance Criteria: Scenario 29

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where only F3, F2 and G7 differ from the layer Signed Line, Gross Pricing and Policy Limit, and there are no From or Days errors.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Check the Expected Errors toggle and the Save button.<br>5. Switch the toggle on.<br>6. Switch the toggle off. | The toggle The detected errors are expected, let me save the amortisation entries is displayed and off, and Save is disabled. Switching it on enables Save; switching it off disables Save again. |

## Saving and Cancelling

#### TC-NGUI-3780-029 — Cancel on review popup saves nothing
Section: Saving and Cancelling · Priority: High · Type: Negative · Acceptance Criteria: Scenario 31

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And a valid Excel file prepared from the template.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Edit a Days value.<br>5. Click Cancel.<br>6. Open the Financial Layers tab and check the layer. | The popup closes. No imported or amended data is saved and the layer has no amortisation schedule. |

#### TC-NGUI-3780-030 — Save stores the schedule, amendments and file
Section: Saving and Cancelling · Priority: High · Type: Happy Path · Acceptance Criteria: Scenario 32

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where all values match the layer, so there are no validation errors.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Change Gross Exposure in row 1 to 2000000.<br>5. Click Save.<br>6. Open View Details for the layer.<br>7. Open the program files. | The popup closes. View Details shows the schedule against the selected layer with Gross Exposure 2000000 in row 1. The uploaded file is in the PML Amortisation Schedule drop spot. |

#### TC-NGUI-3780-031 — Saved values keep full decimal precision
Section: Saving and Cancelling · Priority: High · Type: Validation · Acceptance Criteria: Scenario 32

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where row 7 has Gross Exposure 1234.56 and there are no validation errors.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Click Save.<br>5. Check the stored Gross Exposure value for the layer (database or API). | The stored Gross Exposure value is 1234.56. Rounding applies to display only. |

#### TC-NGUI-3780-032 — Save with accepted mismatches
Section: Saving and Cancelling · Priority: High · Type: Happy Path · Acceptance Criteria: Scenario 33

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where only F2 differs from the layer Gross Pricing.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Switch the Expected Errors toggle on.<br>5. Click Save.<br>6. Open View Details for the layer. | The popup closes and the schedule is saved against the layer with the mismatching Premium value. |

#### TC-NGUI-3780-033 — Re-upload replaces the schedule with the latest file
Section: Saving and Cancelling · Priority: Medium · Type: Validation · Acceptance Criteria: Q7 answer

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated, and an amortisation schedule is saved for the layer. And a second valid Excel file with different values prepared from the template.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply.<br>4. Click Save.<br>5. Open View Details for the layer. | View Details shows the values from the second file. |

## Amort Schedule Fields in Fin Layer

#### TC-NGUI-3780-034 — Amort Schedule row with a saved schedule
Section: Amort Schedule Fields in Fin Layer · Priority: High · Type: Happy Path · Acceptance Criteria: Scenario 34, Scenario 35, Scenario 36

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated, and an amortisation schedule is saved for the layer where the last row has To = 31/12/2029.<br>2. Open the Financial Layers tab.<br>3. Put the layer in edit mode. | In view mode an Amort Schedule row is shown after Profit Commission with the label Amort Schedule, the read-only end date 31/12/2029 and an enabled View Details eye button; the toggle is not visible. In edit mode the Amort Schedule toggle is visible. |

#### TC-NGUI-3780-035 — Amort Schedule row without a schedule
Section: Amort Schedule Fields in Fin Layer · Priority: Medium · Type: Validation · Acceptance Criteria: Scenario 35, Scenario 36, Scenario 39

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated, and no amortisation schedule is saved for the layer.<br>2. Open the Financial Layers tab.<br>3. Put the layer in edit mode and switch the Amort Schedule toggle on. | The end date is blank, the View Details eye button is disabled and the Amort Freeze Date toggle is disabled. |

#### TC-NGUI-3780-036 — View Details popup shows the saved schedule
Section: Amort Schedule Fields in Fin Layer · Priority: High · Type: Happy Path · Acceptance Criteria: Scenario 37

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated, and an amortisation schedule is saved for the layer.<br>2. Open the Financial Layers tab.<br>3. Click the View Details eye button. | A popup shows a table with From, To, Days, Gross Exposure, Repayment and Policy Limit, and a summary with Total Repayments, Total Premium, Fid Share and Fid Line. Values match the saved schedule. |

#### TC-NGUI-3780-037 — Amort Freeze Date row and toggle state
Section: Amort Schedule Fields in Fin Layer · Priority: High · Type: Validation · Acceptance Criteria: Scenario 38, Scenario 39

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated, and an amortisation schedule is saved for the layer.<br>2. Open the Financial Layers tab and put the layer in edit mode.<br>3. Switch the Amort Schedule toggle on.<br>4. Switch the Amort Schedule toggle off. | An Amort Freeze Date row is shown after Amort Schedule with the label Amort Freeze Date, a toggle and a date picker. The Freeze Date toggle is enabled while the Amort Schedule toggle is on and disabled when it is off. |

#### TC-NGUI-3780-038 — Freeze date picker follows the Freeze Date toggle
Section: Amort Schedule Fields in Fin Layer · Priority: High · Type: Validation · Acceptance Criteria: Scenario 40

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated, and an amortisation schedule is saved for the layer.<br>2. Open the Financial Layers tab, put the layer in edit mode and switch the Amort Schedule toggle on.<br>3. Switch the Amort Freeze Date toggle on.<br>4. Switch the Amort Freeze Date toggle off. | The date picker is enabled while the Freeze Date toggle is on and disabled when it is off. |

#### TC-NGUI-3780-039 — Freeze date outside the schedule dates can be saved
Section: Amort Schedule Fields in Fin Layer · Priority: Medium · Type: Validation · Acceptance Criteria: Q9 answer

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated, and an amortisation schedule is saved for the layer running from 01/01/2027 to 31/12/2029.<br>2. Open the Financial Layers tab, put the layer in edit mode and switch both toggles on.<br>3. Pick 01/06/2031 as the freeze date.<br>4. Save the layer. | The layer is saved and the Amort Freeze Date shows 01/06/2031. |

## Mixed Scenarios

#### TC-NGUI-3780-040 — Missing header field labels
Section: Mixed Scenarios · Priority: High · Type: Negative · Acceptance Criteria: Scenario 5, Scenario 12

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where cells E1, E2 and E3 are empty.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply. | The Error importing file popup is displayed. Missing Headers & Labels lists three entries: Repayments - The label of the field Repayments is not in the expected cell - E1; Premium - The label of the field Premium is not in the expected cell - E2; Fidelis Line - The header of the field Fidelis Line is not in the expected cell - E3. |

#### TC-NGUI-3780-041 — Wrong label text and label in wrong cell
Section: Mixed Scenarios · Priority: Medium · Type: Negative · Acceptance Criteria: Scenario 5, Scenario 6, Scenario 12

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where E1 contains "Repayment", G5 contains "Limit" and the label "Premium" is moved from E2 to E4.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply. | Missing Headers & Labels lists three entries with Expected Position E1 (Repayments), G5 (Policy Limit) and E2 (Premium). |

#### TC-NGUI-3780-042 — Missing header field values
Section: Mixed Scenarios · Priority: High · Type: Negative · Acceptance Criteria: Scenario 5, Scenario 13

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where cells F1, F2 and F3 are empty.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply. | Missing Values lists three entries: Repayments - The value of the field Repayments is not in the expected cell - F1; Premium - The value of the field Premium is not in the expected cell - F2; Fidelis Line - The value of the field Fidelis Line is not in the expected cell - F3. |

#### TC-NGUI-3780-043 — Invalid header field value formats
Section: Mixed Scenarios · Priority: High · Type: Negative · Acceptance Criteria: Scenario 5, Scenario 14

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where cells F1, F2 and F3 contain "abc".<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply. | Invalid Values lists three entries: Repayments - Incorrect format in Repayments value - Decimal - F1; Premium - Incorrect format in Premium value - Percentage - F2; Fidelis Line - Incorrect format in Fidelis Line value - Percentage - F3. |

#### TC-NGUI-3780-044 — Missing table headers
Section: Mixed Scenarios · Priority: High · Type: Negative · Acceptance Criteria: Scenario 6, Scenario 12

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where cells B5, B6, C6, D5, E5, F5, G5, H5 and I5 are empty.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply. | Missing Headers & Labels lists nine entries, one per header, each with Error "The header [name] is not in the expected cell" and its Expected Position: Period B5, From B6, To C6, Days D5, Gross Exposure E5, Repayments F5, Policy Limit G5, Total Premium H5, Fidelis Premium I5. |

#### TC-NGUI-3780-045 — All consecutive data rows from row 7 are read
Section: Mixed Scenarios · Priority: High · Type: Happy Path · Acceptance Criteria: Scenario 7, Scenario 19

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where rows 7 to 506 (500 rows) contain complete data.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply. | The review popup table shows all 500 rows matching Excel rows 7 to 506 in the same order. |

#### TC-NGUI-3780-046 — Missing table values are listed per cell
Section: Mixed Scenarios · Priority: High · Type: Negative · Acceptance Criteria: Scenario 7, Scenario 8, Scenario 13, Scenario 15

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where B8, C8, D8 and E8 are empty, F9, G9, H9 and I9 are empty, and all other cells are populated.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply. | Missing Values lists eight separate entries with Error "The value of the field [name] is not in the expected cell" and positions B8, C8, D8, E8, F9, G9, H9 and I9. Errors from the same row are not combined. The section count is 8. |

#### TC-NGUI-3780-047 — Invalid table value formats are listed per cell
Section: Mixed Scenarios · Priority: High · Type: Negative · Acceptance Criteria: Scenario 8, Scenario 14

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing Program with COB = Specialty and LOB = Political Risk, with a financial layer that has Signed Line, Gross Pricing and Policy Limit populated. And Excel file prepared from the valid template where row 9 has "abc" in B9, C9, E9, F9, G9, H9 and I9, and 30.5 in D9.<br>2. Upload the file to the "PML Amortisation Schedule" drop spot in the add file popup.<br>3. Select the layer in the Fin Layer dropdown and click Apply. | Invalid Values lists eight entries with Error "Incorrect format in [name] value": From Date B9, To Date C9, Days Integer D9, Gross Exposure Decimal E9, Repayments Decimal F9, Policy Limit Decimal G9, Total Premium Decimal H9, Fidelis Premium Decimal I9. |

## Traceability

| Acceptance Criteria | Test Cases |
| ------------------- | ---------- |
| General | 001, 002 |
| Scenario 1 | 001, 003, 004, 007 |
| Scenario 2 | 005 |
| Scenario 3 | 006 |
| Scenario 4 | Removed from the ticket |
| Scenario 5 | 040, 041, 042, 043 |
| Scenario 6 | 041, 044 |
| Scenario 7 | 008, 009, 045, 046 |
| Scenario 8 | 046, 047 |
| Scenario 9 | Removed from the ticket |
| Scenario 10 | 011 |
| Scenario 11 | 011, 012 |
| Scenario 12 | 040, 041, 044 |
| Scenario 13 | 042, 046 |
| Scenario 14 | 043, 047 |
| Scenario 15 | 046 |
| Scenario 16 | 013 |
| Scenario 17 | 014 |
| Scenario 18 | 015, 016 |
| Scenario 19 | 017, 045 |
| Scenario 20 | 016, 018 |
| Scenario 21 | 019 |
| Scenario 22 | 020, 021 |
| Scenario 23 | 021, 022 |
| Scenario 24 | 023 |
| Scenario 25 | 024 |
| Scenario 26 | 025 |
| Scenario 27 | 026 |
| Scenario 28 | 024, 025, 027 |
| Scenario 29 | 028 |
| Scenario 30 | 021 |
| Scenario 31 | 029 |
| Scenario 32 | 030, 031 |
| Scenario 33 | 032 |
| Scenario 34 | 034 |
| Scenario 35 | 034, 035 |
| Scenario 36 | 034, 035 |
| Scenario 37 | 036 |
| Scenario 38 | 037 |
| Scenario 39 | 035, 037 |
| Scenario 40 | 038 |
| Q6 answer | 010 |
| Q7 answer | 033 |
| Q9 answer | 039 |
