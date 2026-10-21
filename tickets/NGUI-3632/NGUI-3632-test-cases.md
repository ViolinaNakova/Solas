# NGUI-3632 — Test Cases: Fin Layers - Reinsurance - Import from Excel - Error handling improvement

**Created:** 2026-10-21 | **Updated:** 2026-10-21 (rewritten for one program with 5 Fin Layers) | **Total cases:** 24 | **Observations:** [NGUI-3632-observations.md](NGUI-3632-observations.md)

**Sources:** the NGUI-3632 description and Acceptance Criteria field (AC-1 to AC-10, as numbered in the observations file), and NGUI-2383 (the original import: popup, column names, formats, rounding). The 7 ticket screenshots weren't reviewed; check the alert placement and highlight colours against them before running the tests.

**By category:** Functional 8 · Validation 12 · Edge Case 2 · Regression 2
**By priority:** High 14 · Medium 8 · Low 2

## Test program

All cases use **one program, Program R**, with five Fin Layers. Between cases only the **import data** changes. The one exception is TC-NGUI-3632-024 blocks 2–3 (Import button visibility), which need other programs.

**Program R:** an existing program with **COB = Reinsurance** and five Fin Layers **FL1–FL5**, opened in edit mode. Note the Layer ID of each layer.

**Fin Layer baseline** (the same for FL1–FL5): Policy Limit = 1,000,000; Signed Line = 10.0000%; Inception Date = 01-Jan-2026; On (Bound) = Off; Currency = USD.

**Reset data:** paste this to bring all five layers back to the baseline after a case that imports values. Toggle On if it's shown, then Apply/Import.

| LAYERID | PrimaryLimit | SignedLine | Inception | Bound | Currency |
| ------- | ------------ | ---------- | --------- | ----- | -------- |
| [FL1 ID] … [FL5 ID] (one row each) | 1000000 | 0.1 | 1/1/2026 | FALSE | USD |

**Import data:**
- Prepared in Excel and copied with Ctrl+C. Column headers use the NGUI-2383 names.
- `[FLn ID]` stands for that layer's real Layer ID.
- `999991` and `999992` are Layer IDs that don't exist.
- `[OTHER ID]` is the Layer ID of a layer in another Reinsurance program in QA. It exists in Solas but not in Program R. No setup is needed; only the number is used.

**Assumptions:**
- The confirm button is **Import** *(Q1)*.
- Message texts follow the AC wording *(Q3)*.
- `[Row]` and `[Expected Data Type]` are placeholders until Q4 and Q5 are answered.
- Imported values are checked on the program form after the popup closes, and are saved with the program *(Q15)*.

---

## 1. Blocking structural errors

#### TC-NGUI-3632-001 — Paste without a header row and a data row is rejected
Section: Fin Layer import · Priority: High · Category: Validation · References: NGUI-3632 (AC-1)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with only the header row `LAYERID`, `PrimaryLimit` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The "Validation Failed" alert is displayed above the data entry panel with the message "Unable to paste data. The input must include a header row.". No data is pasted in the data entry panel. The Import button is disabled. The "Proceed to import" toggle is not displayed. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with a single row `[FL1 ID]`, `5000000` and no header row copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The "Validation Failed" alert and the message "Unable to paste data. The input must include a header row." are displayed. The data entry panel stays empty, Import is disabled and the toggle is not displayed. |

#### TC-NGUI-3632-002 — Paste without a Layer ID column is rejected
Section: Fin Layer import · Priority: High · Category: Validation · References: NGUI-3632 (AC-2) · Note: message text Blocked by Q2

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `PrimaryLimit`, `SignedLine` and the row `5000000`, `0.25` (no LAYERID column) copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The "Validation Failed" alert is displayed with the message "Unable to paste data. The input must include a Layer ID Column.". No data is pasted. Import is disabled. The "Proceed to import" toggle is not displayed. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LayerNumber`, `PrimaryLimit` and the row `[FL1 ID]`, `5000000` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | Same result as block 1: the Layer ID column is treated as missing, nothing is pasted, Import is disabled and the toggle is not displayed. |

#### TC-NGUI-3632-003 — Paste where no Layer ID matches a layer of the program is rejected
Section: Fin Layer import · Priority: High · Category: Validation · References: NGUI-3632 (AC-3)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit` and the rows `999991`, `5000000` and `999992`, `6000000` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The "Validation Failed" alert is displayed with the message "The provided Layer ID(s) do not match any existing layer". No data is pasted. Import is disabled. The "Proceed to import" toggle is not displayed. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit` and the row `[OTHER ID]`, `5000000` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | Same result as block 1: a layer from another program counts as not matching, nothing is pasted and Import is disabled. |

#### TC-NGUI-3632-004 — All Layer IDs invalid plus column/data errors is still blocking
Section: Fin Layer import · Priority: Medium · Category: Validation · References: NGUI-3632 (AC-3, AC-5 precondition "at least one Layer ID is valid") · Assumption A3

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit`, `FooBar` and the row `999991`, `abc`, `x` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | Only the blocking AC-3 result is shown: the "Validation Failed" alert with "The provided Layer ID(s) do not match any existing layer". No column or data validation sections are displayed, no data is pasted, Import is disabled and the toggle is not displayed. |

---

## 2. Valid and invalid Layer IDs (no other errors)

#### TC-NGUI-3632-005 — Invalid Layer IDs are listed and highlighted with the "Errors Found" alert
Section: Fin Layer import · Priority: High · Category: Validation · References: NGUI-3632 (AC-4) · Note: highlight colour Blocked by Q6

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit`, `SignedLine` and the rows `[FL1 ID]`, `5000000`, `0.25`; `999991`, `6000000`, `0.3`; `999992`, `7000000`, `0.35` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The "Errors Found" alert is displayed above the data entry panel, and all three rows are pasted in the panel. The `999991` and `999992` cells are highlighted; the FL1 cell is not. The messages "Only data of the valid Layer ID(s) will be imported" and "One or more provided Layer IDs do not match any existing layer. Invalid Layer ID(s): 999991, 999992" are displayed. No column or data validation sections are displayed. Import is disabled. The "Proceed to import" toggle is displayed and switched Off. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit` and the rows `[FL1 ID]`, `5000000`; `[OTHER ID]`, `6000000` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The "Errors Found" alert is displayed. Only the `[OTHER ID]` cell is highlighted, and the message lists "Invalid Layer ID(s): [OTHER ID]". Import is disabled and the toggle is Off. |

#### TC-NGUI-3632-006 — Import with the toggle On imports only rows with valid Layer IDs
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-3632 (AC-4, AC-9, AC-10)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with all layers at the baseline. And import data with the headers `LAYERID`, `PrimaryLimit`, `SignedLine` and the rows `[FL1 ID]`, `5000000`, `0.25`; `999991`, `6000000`, `0.3`; `[FL2 ID]`, `7000000`, `0.35` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste".<br>4. Switch the "Proceed to import" toggle On.<br>5. Click "Import". | The popup closes. FL1 shows Policy Limit 5,000,000 and Signed Line 25.0000%. FL2 shows Policy Limit 7,000,000 and Signed Line 35.0000%. FL3–FL5 keep the baseline (1,000,000 / 10.0000%). No layer with ID 999991 is created. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with all layers at the baseline. And the same import data as in block 1 copied to the clipboard.<br>2. Click "Import" in the Fin Layer section and click "Paste".<br>3. Switch the "Proceed to import" toggle On and click "Import".<br>4. Save the program, close it and reopen it. | After reopening, FL1 and FL2 still show the imported values (5,000,000 / 25.0000% and 7,000,000 / 35.0000%), and FL3–FL5 the baseline. *(Q15)* |

---

## 3. Column validation errors (all Layer IDs valid)

#### TC-NGUI-3632-007 — Unrecognised columns are listed, counted and highlighted
Section: Fin Layer import · Priority: High · Category: Validation · References: NGUI-3632 (AC-5, AC-6) · Note: quote style Blocked by Q3

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit`, `FooBar` and the row `[FL1 ID]`, `5000000`, `abc` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The "Validation Failed" alert is displayed and the data is pasted in the panel. The whole `FooBar` column is highlighted. The messages "Unrecognised columns and cells containing invalid values will not be imported", "Column validation errors (1)" and "Column 'FooBar' is not recognised" are displayed. No Layer ID messages and no "Data validation errors" section are displayed. Import is disabled. The "Proceed to import" toggle is displayed and switched Off. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `FooBar`, `PrimaryLimit`, `Limit2` and the rows `[FL1 ID]`, `a`, `5000000`, `b`; `[FL2 ID]`, `c`, `7000000`, `d` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | "Column validation errors (2)" is displayed, followed by "Column 'FooBar' is not recognised" and "Column 'Limit2' is not recognised". Both columns are highlighted and `PrimaryLimit` is not. Import is disabled and the toggle is Off. |

#### TC-NGUI-3632-008 — Import excludes unrecognised columns and keeps the column mapping correct
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-3632 (AC-10)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with all layers at the baseline. And import data with the headers `LAYERID`, `PrimaryLimit`, `FooBar`, `SignedLine` and the rows `[FL1 ID]`, `5000000`, `x`, `0.25`; `[FL2 ID]`, `7000000`, `y`, `0.35` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste".<br>4. Switch the "Proceed to import" toggle On.<br>5. Click "Import". | The popup closes. FL1 shows Policy Limit 5,000,000 and Signed Line 25.0000%. FL2 shows Policy Limit 7,000,000 and Signed Line 35.0000%. The values `x` and `y` don't appear in any Fin Layer field, and the `SignedLine` values after the excluded column go to Signed Line, not to another field. FL3–FL5 are not changed. |

---

## 4. Data validation errors (all Layer IDs valid)

#### TC-NGUI-3632-009 — Invalid value per data type is listed and the cell highlighted
Section: Fin Layer import · Priority: High · Category: Validation · References: NGUI-3632 (AC-5, AC-7), NGUI-2383 (formats) · Note: `[Row]` Blocked by Q4, expected-type labels Blocked by Q5

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit`, `SignedLine` and the row `[FL1 ID]`, `abc`, `0.25` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The "Validation Failed" alert is displayed and the data is pasted. Only the `abc` cell is highlighted. The messages "Unrecognised columns and cells containing invalid values will not be imported", "Data validation errors (1)" and "[Row] - [FL1 ID] - The value provided for column 'PrimaryLimit' is invalid. Expected type: [Decimal]" are displayed. No "Column validation errors" section and no Layer ID messages are displayed. Import is disabled and the "Proceed to import" toggle is Off. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `Inception` and the row `[FL1 ID]`, `13/45/2026` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | "Data validation errors (1)" is displayed with the line for column 'Inception' and Expected type [Date (MM/DD/YYYY)]. The cell is highlighted. Import is disabled and the toggle is Off. |
| 3 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `Bound` and the row `[FL1 ID]`, `YES` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | "Data validation errors (1)" is displayed with the line for column 'Bound' and Expected type [TRUE/FALSE]. The cell is highlighted. Import is disabled and the toggle is Off. |
| 4 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `Currency` and the row `[FL1 ID]`, `EURO` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | "Data validation errors (1)" is displayed with the line for column 'Currency' and Expected type [ISO 4217 code]. The cell is highlighted. Import is disabled and the toggle is Off. |
| 5 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `LocationsExposedToLayer` and the row `[FL1 ID]`, `10.5` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | "Data validation errors (1)" is displayed with the line for column 'LocationsExposedToLayer' and Expected type [Integer]. The cell is highlighted. Import is disabled and the toggle is Off. |

#### TC-NGUI-3632-010 — All data errors are listed, not only the first one
Section: Fin Layer import · Priority: High · Category: Validation · References: NGUI-3632 (AC-7, description "Context")

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit`, `Inception`, `Bound` and the rows `[FL1 ID]`, `abc`, `5/1/2026`, `TRUE`; `[FL2 ID]`, `7000000`, `xyz`, `MAYBE` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | "Data validation errors (3)" is displayed with three lines: FL1 / 'PrimaryLimit', FL2 / 'Inception' and FL2 / 'Bound', each with the correct [Row] and Layer ID. Exactly those three cells are highlighted. Import is disabled and the toggle is Off. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit`, `SignedLine` and one row per layer (FL1–FL5), where `PrimaryLimit` = `abc` in every row and `SignedLine` = `0.25`, copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | "Data validation errors (5)" is displayed with one line per layer (FL1–FL5, 'PrimaryLimit'), and all five lines can be read (*Q19*). All five `abc` cells are highlighted. Import is disabled and the toggle is Off. |

#### TC-NGUI-3632-011 — Import skips invalid cells and still imports the valid cells of the same row
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-3632 (AC-10)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode, where FL1 is at the baseline (Policy Limit = 1,000,000, Signed Line = 10.0000%). And import data with the headers `LAYERID`, `PrimaryLimit`, `SignedLine` and the row `[FL1 ID]`, `abc`, `0.25` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste".<br>4. Switch the "Proceed to import" toggle On.<br>5. Click "Import". | The popup closes. FL1's Policy Limit is still 1,000,000 (not cleared and not changed). FL1's Signed Line is updated to 25.0000%. FL2–FL5 are not changed. |

#### TC-NGUI-3632-012 — Column and data errors together
Section: Fin Layer import · Priority: Medium · Category: Validation · References: NGUI-3632 (AC-5, AC-6, AC-7, AC-10)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit`, `FooBar`, `SignedLine` and the row `[FL3 ID]`, `abc`, `x`, `0.25` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The "Validation Failed" alert is displayed. "Unrecognised columns and cells containing invalid values will not be imported" is displayed once. "Column validation errors (1)" with "Column 'FooBar' is not recognised" is displayed, and so is "Data validation errors (1)" with the FL3 / 'PrimaryLimit' line. The `FooBar` column and the `abc` cell are highlighted. Import is disabled and the toggle is Off. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode, where FL3 is at the baseline (Policy Limit = 1,000,000). And the same import data as in block 1 copied to the clipboard.<br>2. Click "Import" in the Fin Layer section and click "Paste".<br>3. Switch the "Proceed to import" toggle On and click "Import". | The popup closes. FL3's Policy Limit stays 1,000,000, its Signed Line is 25.0000%, and `x` doesn't appear in any field. |

---

## 5. Invalid Layer IDs and validation errors together

#### TC-NGUI-3632-013 — All error types are displayed together
Section: Fin Layer import · Priority: High · Category: Validation · References: NGUI-3632 (AC-8) · Note: message format Blocked by Q3

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit`, `FooBar`, `SignedLine` and the rows `[FL1 ID]`, `abc`, `x`, `0.25`; `[FL2 ID]`, `7000000`, `y`, `0.35`; `999991`, `6000000`, `z`, `0.3` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The "Validation Failed" alert is displayed (not "Errors Found") and the data is pasted. The `999991` cell is highlighted in orange, the `FooBar` column is highlighted, and the `abc` cell is highlighted. Displayed: "Only data of the valid Layer ID(s) will be imported", "One or more provided Layer IDs do not match any existing layer. Invalid Layer ID(s): 999991", "Unrecognised columns and cells containing invalid values will not be imported", "Column validation errors (1)" with "Column 'FooBar' is not recognised", and "Data validation errors (1)" with the FL1 / 'PrimaryLimit' line. Import is disabled and the "Proceed to import" toggle is Off. |

#### TC-NGUI-3632-014 — Import with all error types imports only the valid data of valid rows
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-3632 (AC-10)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with all layers at the baseline. And the same import data as in TC-NGUI-3632-013 copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste".<br>4. Switch the "Proceed to import" toggle On.<br>5. Click "Import". | The popup closes. FL1: Policy Limit stays 1,000,000 and Signed Line = 25.0000%. FL2: Policy Limit = 7,000,000 and Signed Line = 35.0000%. No data from the `999991` row is imported and no layer is created. `x`, `y` and `z` don't appear in any field. FL3–FL5 are not changed. |

#### TC-NGUI-3632-015 — Invalid value in a row with an invalid Layer ID
Section: Fin Layer import · Priority: Medium · Category: Edge Case · References: NGUI-3632 (AC-8, AC-10) · **Blocked by Q8**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with all layers at the baseline. And import data with the headers `LAYERID`, `PrimaryLimit` and the rows `[FL4 ID]`, `5000000`; `999991`, `abc` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The `999991` Layer ID is reported as invalid. Whether the `abc` cell is also listed under "Data validation errors" and highlighted depends on the answer to Q8; record what's shown. After toggle On + Import, only FL4's Policy Limit is updated, to 5,000,000. |

---

## 6. Toggle and popup controls

#### TC-NGUI-3632-016 — "Proceed to import" toggle enables and disables Import
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-3632 (AC-9)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit` and the rows `[FL1 ID]`, `5000000`; `999991`, `6000000` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste".<br>4. Switch the "Proceed to import" toggle On. | Import is disabled before step 4 and becomes enabled after the toggle is switched On. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And the same import data as in block 1 copied to the clipboard.<br>2. Click "Import" in the Fin Layer section and click "Paste".<br>3. Switch the "Proceed to import" toggle On.<br>4. Switch the "Proceed to import" toggle Off. | Import becomes disabled again. The popup stays open and no Fin Layer data is changed. |
| 3 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit` and the row `[FL1 ID]`, `abc` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section and click "Paste".<br>3. Switch the "Proceed to import" toggle On, then Off. | Import is enabled while the toggle is On and disabled while it is Off, for a data validation error. |

#### TC-NGUI-3632-017 — Cancel with the toggle On applies no changes
Section: Fin Layer import · Priority: Medium · Category: Functional · References: NGUI-2383 (Cancel), NGUI-3632 (AC-9)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with all layers at the baseline. And import data with the headers `LAYERID`, `PrimaryLimit` and the rows `[FL5 ID]`, `5000000`; `999991`, `6000000` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section and click "Paste".<br>3. Switch the "Proceed to import" toggle On.<br>4. Click "Cancel". | The popup closes. FL5's Policy Limit is still 1,000,000 and no Fin Layer data is changed. |

#### TC-NGUI-3632-018 — Clear removes the data, the errors and the toggle
Section: Fin Layer import · Priority: Medium · Category: Functional · References: NGUI-2383 (Clear) · **Blocked by Q14**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit`, `FooBar` and the row `[FL1 ID]`, `abc`, `x` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section and click "Paste".<br>3. Switch the "Proceed to import" toggle On.<br>4. Click "Clear". | The data entry panel is empty (headers included). The alert, the error messages and the "Proceed to import" toggle are no longer displayed. Import is disabled. |

#### TC-NGUI-3632-019 — A new paste replaces the previous errors and resets the toggle
Section: Fin Layer import · Priority: Medium · Category: Functional · References: NGUI-3632 (AC-4, AC-9) · **Blocked by Q14**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And two import data sets ready, both with the headers `LAYERID`, `PrimaryLimit`: set 1 with the rows `[FL1 ID]`, `abc` and `999991`, `6000000`; set 2 with the row `[FL1 ID]`, `5000000`.<br>2. Copy set 1, click "Import" in the Fin Layer section and click "Paste".<br>3. Switch the "Proceed to import" toggle On.<br>4. Copy set 2 and click "Paste" again. | The panel shows only set 2. The alert, all error messages and the toggle from set 1 are no longer displayed. Import is enabled (no errors, *Q16*). |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And two import data sets ready, both with the headers `LAYERID`, `PrimaryLimit`: set 1 with the row `[FL1 ID]`, `abc`; set 2 with the rows `999991`, `6000000` and `[FL1 ID]`, `5000000`.<br>2. Copy set 1, click "Import" and click "Paste".<br>3. Switch the "Proceed to import" toggle On.<br>4. Copy set 2 and click "Paste" again. | Only the set 2 errors are displayed (the "Errors Found" alert and Invalid Layer ID(s): 999991). The "Data validation errors" section from set 1 is gone. The toggle is reset to Off and Import is disabled. |

---

## 7. Edge cases and regression

#### TC-NGUI-3632-020 — Error-free paste imports directly with formats and rounding (regression)
Section: Fin Layer import · Priority: High · Category: Regression · References: NGUI-2383 (Apply, rounding), NGUI-3632 · Assumption A2 / Q16

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit`, `SignedLine`, `Inception`, `Bound`, `Currency` and the row `[FL1 ID]`, `12000.5`, `0.0100005`, `5/1/2026`, `TRUE`, `EUR` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The data is pasted. No alert, no error messages and no "Proceed to import" toggle are displayed. Import is enabled. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And the same import data as in block 1 copied to the clipboard.<br>2. Click "Import" in the Fin Layer section and click "Paste".<br>3. Click "Import". | The popup closes. FL1 shows Policy Limit 12,001, Signed Line 1.0001%, Inception Date 01-May-2026, the On toggle switched On and Currency EUR. FL2–FL5 are not changed. |

#### TC-NGUI-3632-021 — Non-integer or empty value in the LAYERID column
Section: Fin Layer import · Priority: Medium · Category: Validation · References: NGUI-3632 (AC-4 / AC-7) · **Blocked by Q9**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit` and the rows `[FL2 ID]`, `5000000`; `abc`, `6000000` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | `abc` is reported either as an invalid Layer ID (the AC-4 messages) or as a data validation error, depending on the answer to Q9. The cell is highlighted, Import is disabled and the toggle is Off. Only FL2 is imported after toggle On + Import. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit` and the rows `[FL2 ID]`, `5000000`; an empty Layer ID cell, `6000000` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The row with the empty Layer ID is reported and not imported (the exact message depends on Q9). Only FL2 is imported after toggle On + Import. |

#### TC-NGUI-3632-022 — Business-rule violations (min/max values) during import
Section: Fin Layer import · Priority: Medium · Category: Validation · References: NGUI-2383 (MarketDifferential min 70%, PrimaryLimit max) · **Blocked by Q10**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `MarketDifferential`, `SignedLine` and the row `[FL3 ID]`, `0.5`, `0.25` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The value 50% (below the 70% minimum) is reported and the cell is highlighted, as a data validation error or with the NGUI-2383 message "Differential is required and cannot be less than 70%" (Q10). After toggle On + Import, FL3's Differential is not updated and Signed Line = 25.0000%. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `PrimaryLimit` and the row `[FL3 ID]`, `10000000000000000000` (above the 9,999,999,999,999,999,999 maximum) copied to the clipboard.<br>2. Click "Import" in the Fin Layer section.<br>3. Click "Paste". | The value is reported and highlighted (Q10), Import is disabled and the toggle is Off. After toggle On + Import, FL3's Policy Limit is not updated. |

#### TC-NGUI-3632-023 — Empty cell in a valid row and a recognised column
Section: Fin Layer import · Priority: Low · Category: Edge Case · References: NGUI-3632 (AC-10) · **Blocked by Q11**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode, where FL4 is at the baseline (Policy Limit = 1,000,000). And import data with the headers `LAYERID`, `PrimaryLimit`, `SignedLine` and the row `[FL4 ID]`, an empty cell, `0.25` copied to the clipboard.<br>2. Click "Import" in the Fin Layer section and click "Paste".<br>3. Click "Import" (switch the toggle On first if it's displayed). | FL4's Signed Line is updated to 25.0000%. Policy Limit is expected to stay 1,000,000 (not cleared) unless Q11 says otherwise. |

#### TC-NGUI-3632-024 — Import button visible only for Reinsurance programs with layers (regression)
Section: Fin Layer import · Priority: Low · Category: Regression · References: NGUI-2383 (visibility) · Note: blocks 2–3 need programs other than Program R

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode.<br>2. Go to the Fin Layer section. | The "Import" button is displayed. Clicking it opens the "Import Layer Data" popup. |
| 2 | 1. Open an existing program with COB = Specialty and at least one Fin Layer in edit mode.<br>2. Go to the Fin Layer section. | The "Import" button is not displayed. |
| 3 | 1. Start creating a new program with COB = Reinsurance and no Fin Layers yet.<br>2. Go to the Fin Layer section. | The "Import" button is not displayed. |

---

## Not covered (open questions)

- **Duplicate Layer ID rows and duplicate column headers (Q12).** Add cases once the expected behaviour is defined.
- **Case or whitespace differences in column names, e.g. `signedline`, `SignedLine ` (Q13).**
- **A paste with only the LAYERID column (Q17).**
- **NGUI-4069 columns (FOT ROL, Annualised Fot RoL, AmBestProfitPmL, Leader) (Q18).** If 4069 isn't deployed, these columns show up as unrecognised. They're covered in [NGUI-4069-test-cases.md](../NGUI-4069/NGUI-4069-test-cases.md).

## Traceability matrix

| Requirement | Test cases |
| ----------- | ---------- |
| AC-1 Header row | 001 |
| AC-2 Layer ID column | 002 |
| AC-3 All Layer IDs invalid | 003, 004 |
| AC-4 Valid + invalid Layer IDs, no other errors | 005, 006, 016, 019 |
| AC-5 Column/data errors — common message + toggle | 007, 009, 012 |
| AC-6 Column validation errors | 007, 008, 012 |
| AC-7 Data validation errors | 009, 010, 011, 012, 021 |
| AC-8 Invalid IDs + validation errors | 013, 014, 015 |
| AC-9 Toggle behaviour | 006, 016, 017, 019 |
| AC-10 Import behaviour | 006, 008, 011, 012, 014, 015, 023 |
| NGUI-2383 regression (Cancel, Clear, rounding, visibility, business rules) | 017, 018, 020, 022, 024 |
