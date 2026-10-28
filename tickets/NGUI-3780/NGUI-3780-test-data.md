# NGUI-3780 — Amortisation Schedule: Purpose and Base Test Data

**Created:** 2026-10-22
**Sources:**
- Prequel screenshots of program 409421 (Fin Layers before and after the upload, and the Amortisation File Entries popup)
- The sample file `ABSA_390531_PML.Amortxlsx_Correct_Structure_Dev6_Program ID 379472 _ Layer 529886 - 2126_Correct Data.xlsx`
- [NGUI-3780-observations.md](NGUI-3780-observations.md) and [NGUI-3780-test-cases.md](NGUI-3780-test-cases.md)

## What this feature is for

The feature applies to Political Risk, Political Risk Re and ABF & Portfolio Credit. These policies cover a loan, such as an export-credit bank's loan to the Ministry of Finance of Montenegro. The borrower repays the loan in instalments, so the insured exposure shrinks over time. A single Policy Limit of 24,000,000 doesn't show how much Fidelis is actually exposed to today.

The amortisation schedule is the repayment plan for the loan. For each period it gives the outstanding Gross Exposure, the repayment made, the Policy Limit and the premium. Fidelis's real exposure on any date is:

**Gross Exposure of the period that contains that date × Fidelis Line**

That value is the "Amort. Exposure" in the review popup. NGUI-3780 only imports, validates, stores and displays the schedule. Two blocked tickets use the stored data:
- **NGUI-3985 (Fidelis Exposure)** and **NGUI-3984 (Amount to Aggs)** will use "the row whose From–To contains today (or the Freeze Date)".
- **Amort Freeze Date** pins that calculation to a fixed date instead of today.

## What the Prequel screenshots show

**Before the upload (Fin Layers).** The layer has Signed Line 90%, Gross Pricing 0%, Policy Limit 24,000,000 and "Amort Schedule: No amortisation schedule".

**Review popup (Amortisation File Entries).** Fidelis Line, Premium and Policy Limit are all red, because the sample file doesn't match the layer:

| Check | Layer | File | Result |
| ----- | ----- | ---- | ------ |
| Fidelis Line vs Signed Line | 90% | F3 = 29% | ❌ |
| Premium vs Gross Pricing | 0% | F2 = 3% | ❌ |
| First-row Policy Limit vs layer Policy Limit | 24,000,000 | G7 = 21,348,574 | ❌ |

All three are "expected" error types, so the toggle "The detected errors are expected, let me save the amortisation entries" appears. You have to switch it on before Save is enabled.

**The values in the popup check out:**
- **Amort. Exposure:** 6,774,404 = 23,360,015 × 29%. Today (22-Oct-2026) falls in the 15-Sep-2026 → 17-Mar-2027 row.
- **Days:** every row matches the inclusive count, for example 11-Jun → 15-Sep = 97.
- **Gross Exposure** is the previous Gross Exposure minus this row's repayment, for example 23,720,638 − 360,623 = 23,360,015.
- **Fidelis Premium** = Total Premium × 29%, for example 174,347 × 0.29 = 50,560.63.
- **Fid Share** 534,447 = SUM(I) 534,446.51, rounded for display.

**After Save (Fin Layers).** The Amort Schedule row shows "Ends on 21-04-2031", which is the To date of the last row. The Amort Freeze Date row (toggle + date picker) now appears.

### Points to check in Solas

1. In Prequel the whole Policy Limit column has red markers. The ticket says only the first row is compared with the layer. Check whether those markers are errors or only cell markers.
2. G17 (the last row's Policy Limit) looks blank or "-" in Excel but imports as 0. In Solas a blank cell in a data row should be a "Missing Value" error, so check what G17 actually contains.
3. Consecutive rows in the sample share a boundary date (row N's To = row N+1's From). This is accepted because there is no gap or overlap check (Q3).

## How to build base data

The idea is to create one clean "golden" layer and file where every check passes. Every negative test is then that same file with **one** change, so each test fails for exactly one reason.

**Rules the golden data must follow:**
1. Use a Specialty program with LOB Political Risk, Political Risk Re or ABF&PC.
2. Fill in the layer's Signed Line, Gross Pricing and Policy Limit.
3. F3 (Fidelis Line) = the layer's **Signed Line**.
4. F2 (Premium) = the layer's **Gross Pricing**.
5. G7 (first-row Policy Limit) = the layer's **Policy Limit**.
6. In every row, From ≤ To, and Days = To − From + 1.
7. **Today's date must fall inside one row**, so that Amort. Exposure can be checked.
8. Make F1 equal SUM(F). The system doesn't check this (Q10), but it keeps the data realistic.
9. Enter From/To as real Excel date cells, not text.

### Golden layer in Solas

| Field | Value |
| ----- | ----- |
| Signed Line | **25%** |
| Gross Pricing | **2%** |
| Policy Limit | **10,000,000** |

### Golden Excel file (one sheet, same layout as the sample)

Header fields:

| Row | Label (E) | Value (F) |
| --- | --------- | --------- |
| 1 | Repayments | 10,000,000.00 |
| 2 | Premium | 2.00% |
| 3 | Fidelis line | 25.00% |

Table headers:
- Row 5: Period (B5), Days (D5), Gross Exposure (E5), Repayments (F5), Policy Limit (G5), Total Premium (H5), Fidelis Premium (I5)
- Row 6: From (B6), To (C6)

Data rows:

| Row | From (B) | To (C) | Days (D) | Gross Exposure (E) | Repayments (F) | Policy Limit (G) | Total Premium (H) | Fidelis Premium (I) |
| --- | -------- | ------ | -------- | ------------------ | -------------- | ---------------- | ----------------- | ------------------- |
| 7 | 01/07/2026 | 31/12/2026 | 184 | 10,000,000.00 | 0.00 | 10,000,000.00 | 100,821.92 | 25,205.48 |
| 8 | 01/01/2027 | 30/06/2027 | 181 | 7,500,000.00 | 2,500,000.00 | 7,500,000.00 | 74,383.56 | 18,595.89 |
| 9 | 01/07/2027 | 31/12/2027 | 184 | 5,000,000.00 | 2,500,000.00 | 5,000,000.00 | 50,410.96 | 12,602.74 |
| 10 | 01/01/2028 | 30/06/2028 | 182 *(leap year)* | 2,500,000.00 | 2,500,000.00 | 2,500,000.00 | 24,931.51 | 6,232.88 |
| 11 | 01/07/2028 | 31/12/2028 | 184 | 0.00 | 2,500,000.00 | 0.00 | 0.00 | 0.00 |

Row 12 is left completely blank, which ends the table.

**How the columns are calculated:**
- **Total Premium** = Gross Exposure × Premium × Days / 365.
- **Fidelis Premium** = Total Premium × Fidelis Line.
- The system doesn't validate these calculations; they only make the data realistic.

### Expected results with the golden data

| Where | Expected |
| ----- | -------- |
| Review header | Layer Line 25%, Layer Gross Pricing 2%, Layer Limit 10,000,000, Fidelis Line 25%, Premium 2% |
| Amort. Exposure (today = 22-Oct-2026 → row 7) | 10,000,000 × 25% = **2,500,000** |
| Rounding on display | 100,821.92 → **100,822**; 24,931.51 → **24,932**; 6,232.88 → **6,233** |
| Summary | Total Repayments **10,000,000**, Total Premium **250,548**, Fidelis Share **62,637**, Fidelis Line **25%** |
| Errors | None: the toggle is hidden and Save is enabled |
| Fin Layers after Save | Amort Schedule "Ends on 31-12-2028", eye button enabled, Amort Freeze Date row present |
| Stored values | Full decimals (100,821.92), because rounding is for display only (Q2) |

## Variants derived from the golden file

Make one change per file and keep everything else the same as the golden file.

| Change | Tests | Covers |
| ------ | ----- | ------ |
| F3 = 29% | Fidelis Line red; toggle shown | TC-022, TC-028 |
| F2 = 3% | Premium red; toggle shown | TC-020, TC-032 |
| G7 = 9,000,000 (and G8 changed to a wrong value) | Row 1 Policy Limit red; row 2 not checked | TC-023 |
| F2, F3 and G7 all wrong | Same situation as the Prequel screenshot: all three red, toggle shown, Save only after the toggle is on | TC-028 |
| Row 8: From 30/06/2027, To 01/01/2027 | From > To error; toggle hidden; Save disabled | TC-024 |
| D9 = 180 | Days error; toggle hidden; Save disabled | TC-025 |
| D9 = 180 **and** F2 = 3% | Mixed errors: Save still blocked | TC-027 |
| E7 = 10,000,000.50 | Display rounding of .5 | TC-017 |
| Row 9 fully blank | Only rows 7–8 imported | TC-008 |
| Row 7 and below blank | File rejected | TC-009 |
| E1 and H5 empty, F7 empty, B8 = "abc" | Error popup with Total Errors: 4 | TC-011 |
| E1, E2, E3 empty | Missing Headers & Labels (3) | TC-040 |
| F1, F2, F3 empty | Missing Values (3) | TC-042 |
| F1, F2, F3 = "abc" | Invalid Values (3) | TC-043 |
| B5, B6, C6, D5:I5 empty | Missing Headers & Labels (9) | TC-044 |
| Rows 7 to 506 filled with the same pattern | Large file (500 rows) | TC-045 |
| Second sheet with different data | Only the first sheet is read | TC-010 |

## Notes

- Put the golden data on a **dedicated layer**. Saving a schedule mutates the layer, and a re-upload replaces the schedule (Q7), so use a separate layer or reset after each test.
- Today's date moves. When the run date passes 31/12/2026, Amort. Exposure moves to row 8 (7,500,000 × 25% = 1,875,000). For automation, generate the dates relative to today, or use the Freeze Date.
