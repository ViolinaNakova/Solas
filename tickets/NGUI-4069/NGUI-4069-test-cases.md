# NGUI-4069 — Test Cases: Fin Layers - Reinsurance - Import from Excel - Additional Fields to be imported

**Created:** 2026-10-21 | **Updated:** 2026-10-21 (rewritten for one program with 5 Fin Layers) | **Total cases:** 20 | **Observations:** [NGUI-4069-observations.md](NGUI-4069-observations.md)

**Sources:**
- NGUI-4069 description (field table F1–F4) and AC-1.
- The tickets that define the target fields: NGUI-2383 (import popup, existing columns), NGUI-2315 (Quoted ROL popup, term < 18 months), NGUI-3349 (Annualised Quoted ROL popup, term ≥ 18 months, Annualisation Factor), NGUI-153 (Leader popup) and NGUI-1879 (AM Best Profit PML).

**By category:** Functional 13 · Validation 4 · Edge Case 3
**By priority:** High 8 · Medium 10 · Low 2

## Test program

All cases use **one program, Program R**, with five Fin Layers. Between cases only the **import data** changes, plus the program **Expiry date** for the term-dependent cases in section 5.

**Program R:** an existing program with COB = Reinsurance, Inception 01-Jan-2026 and Expiry 31-Dec-2026 (policy term < 18 months), opened in edit mode. Note the Layer ID of each Fin Layer.

**Fin Layer baseline** (set through the popups before the run, and restore it when a case needs the baseline again):

| Layer | Quoted ROL popup | Profit to PML / AM Best Profit PML | Leader popup | Other |
| ----- | ---------------- | ---------------------------------- | ------------ | ----- |
| **FL1** | Quoted ROL = 8.000000%, FOT ROL = 0 | empty / empty | Fidelis Overall Lead = No, Leader empty | Policy Limit populated |
| **FL2** | Quoted ROL = 8.000000%, FOT ROL = 5.000000% | empty / empty | Fidelis Overall Lead = No, Leader = "OLD LEAD", Ex Leader = "EX LEAD", Other Leader = "OTHER LEAD" | Lloyd's Leader selected |
| **FL3** | Quoted ROL = 8.000000%, FOT ROL = 0 | empty / empty | **Fidelis Overall Lead = Yes** (Leader = "Fidelis", read-only) | — |
| **FL4** | Quoted ROL = 8.000000%, FOT ROL = 0 | empty / AM Best Profit PML = 5.00% | Fidelis Overall Lead = No, Leader = "OLD LEAD" | Signed Line populated |
| **FL5** | no ROL values | empty / empty | Fidelis Overall Lead = No, Leader empty | Used for the long-term cases (section 5) |

**Import data:**
- Prepared in Excel and copied with Ctrl+C. The headers are exactly as written in the ticket *(A1)*.
- Percentages are entered as decimal fractions (0.05 = 5%).
- `[FLn ID]` stands for that layer's real Layer ID.

**Steps:**
- "Import" refers to the Import button in the Fin Layer section.
- **"Apply" refers to the confirm button in the Import Layer Data popup.** NGUI-3632 may rename it to "Import" *(Q10)*.

**Run order:**
- Sections 1–4 use the baseline term (< 18 months).
- Section 5 changes the Expiry once, to 01-Jan-2028 (730 days, so Annualisation Factor = 0.5 per *A3*). TC-NGUI-4069-008 changes it to 01-Jul-2027 (exactly 18 months).

---

## 1. FOT ROL (term < 18 months)

#### TC-NGUI-4069-001 — FOT ROL is imported into the Quoted ROL popup with 6-decimal rounding
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-4069 (AC-1, F1), NGUI-2315

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL1 has Quoted ROL = 8.000000% and FOT ROL = 0. And import data with the headers `LAYERID`, `FOT ROL` and the row `[FL1 ID]`, `0.05` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Click "Edit" next to FL1's Quoted ROL field. | The import popup closes. The "Quoted ROL" popup shows FOT ROL = 5.000000%; Quoted ROL is still 8.000000%. FL1's Quoted ROL field in the Fin Layer now shows the FOT ROL value (5%, format per Q11). FL2–FL5 are not changed. |
| 2 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `FOT ROL` and the row `[FL1 ID]`, `0.010000005` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Click "Edit" next to FL1's Quoted ROL field. | FOT ROL = 1.000001% (rounded up). |
| 3 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `FOT ROL` and the row `[FL1 ID]`, `0.01000004` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Click "Edit" next to FL1's Quoted ROL field. | FOT ROL = 1.000000% (rounded down). |

#### TC-NGUI-4069-003 — FOT ROL = 0 brings back the Quoted ROL value in the Fin Layer
Section: Fin Layer import · Priority: Medium · Category: Edge Case · References: NGUI-4069 (F1), NGUI-2315 (display rule) · **Blocked by Q14**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL2 has Quoted ROL = 8.000000% and FOT ROL = 5.000000%. And import data with the headers `LAYERID`, `FOT ROL` and the row `[FL2 ID]`, `0` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply". | FL2's FOT ROL in the popup becomes 0, and FL2's Quoted ROL field shows the Quoted ROL value (8%) again. |

#### TC-NGUI-4069-004 — FOT ROL and QUOTED ROL in one paste go to separate fields
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-4069 (F1), NGUI-2383 (QUOTED ROL)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `QUOTED ROL`, `FOT ROL` and the row `[FL1 ID]`, `0.07`, `0.04` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Click "Edit" next to FL1's Quoted ROL field. | The "Quoted ROL" popup shows Quoted ROL = 7.000000% and FOT ROL = 4.000000%; the values are not swapped. FL1's Quoted ROL field shows the FOT ROL value (4%). |

---

## 2. AmBestProfitPmL

#### TC-NGUI-4069-010 — AmBestProfitPmL is imported into AM Best Profit PML with 2-decimal rounding
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-4069 (AC-1, F3), NGUI-1879 · Note: precision to confirm, Q12

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL1 has AM Best Profit PML empty. And import data with the headers `LAYERID`, `AmBestProfitPmL` and the row `[FL1 ID]`, `0.01` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply". | The import popup closes. FL1's AM Best Profit PML field shows 1.00%. |
| 2 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `AmBestProfitPmL` and the row `[FL1 ID]`, `0.01005` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply". | FL1's AM Best Profit PML = 1.01% (rounded up). |
| 3 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `AmBestProfitPmL` and the row `[FL1 ID]`, `0.01004` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply". | FL1's AM Best Profit PML = 1.00% (rounded down). |

#### TC-NGUI-4069-011 — AmBestProfitPmL and Profit PML in one paste go to separate fields
Section: Fin Layer import · Priority: Medium · Category: Functional · References: NGUI-4069 (F3), NGUI-2383 (Profit PML → Profit to PML)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL2 has Profit to PML and AM Best Profit PML empty. And import data with the headers `LAYERID`, `Profit PML`, `AmBestProfitPmL` and the row `[FL2 ID]`, `0.12`, `0.34` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply". | FL2 shows Profit to PML = 12.00% and AM Best Profit PML = 34.00%; the values are not swapped. |

---

## 3. Leader

#### TC-NGUI-4069-012 — Leader is imported into the Leader field of the Leader popup
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-4069 (AC-1, F4), NGUI-153

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL1's Leader popup has Fidelis Overall Lead = No and an empty Leader. And import data with the headers `LAYERID`, `Leader` and the row `[FL1 ID]`, `ABCD12321` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Open FL1's Leader popup. | The import popup closes. FL1's Leader textbox in the Fin Layer shows "ABCD12321", and the Leader popup shows Leader = "ABCD12321". |
| 2 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL4's Leader popup has Fidelis Overall Lead = No and Leader = "OLD LEAD". And import data with the headers `LAYERID`, `Leader` and the row `[FL4 ID]`, `NEW LEAD 01` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Open FL4's Leader popup. | FL4's Leader is replaced by "NEW LEAD 01" in both the Fin Layer textbox and the popup. *(Restore FL4 Leader = "OLD LEAD" before TC-014 block 3 and TC-020.)* |

#### TC-NGUI-4069-013 — Leader import when Fidelis Overall Lead = Yes
Section: Fin Layer import · Priority: Medium · Category: Validation · References: NGUI-4069 (F4), NGUI-153 (Leader = Fidelis, read-only) · **Blocked by Q5**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL3's Leader popup has Fidelis Overall Lead = Yes (Leader = "Fidelis", read-only). And import data with the headers `LAYERID`, `Leader` and the row `[FL3 ID]`, `ABCD12321` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply" if it's enabled.<br>3. Open FL3's Leader popup. | Record whether Leader stays "Fidelis" (import skipped or rejected) or is overwritten. Expected per Q5. Fidelis Overall Lead and the other dropdowns are not changed. |

#### TC-NGUI-4069-014 — Leader text boundaries and special characters
Section: Fin Layer import · Priority: Low · Category: Validation · References: NGUI-4069 (F4) · **Blocked by Q6**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL1's Leader popup has Fidelis Overall Lead = No. And import data with the headers `LAYERID`, `Leader` and the row `[FL1 ID]`, `Lloyd's & Co. (Syndicate 2121) – Ünited` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply". | FL1's Leader shows the text exactly as pasted, including the apostrophe, ampersand, brackets, dash and accented character. |
| 2 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL1's Leader popup has Fidelis Overall Lead = No. And import data with the headers `LAYERID`, `Leader` and the row `[FL1 ID]` plus a 256-character text copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply". | The value is accepted or rejected according to the maximum length from Q6. It is never silently cut short without a message. |
| 3 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL4 has Leader = "OLD LEAD". And import data with the headers `LAYERID`, `Leader`, `SignedLine` and the row `[FL4 ID]`, an empty Leader cell, `0.25` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply". | FL4's Signed Line = 25.0000%. Leader stays "OLD LEAD" unless Q6 says an empty cell clears it. |

#### TC-NGUI-4069-015 — Leader import doesn't change Lloyd's Leader, Ex Leader or Other Leader
Section: Fin Layer import · Priority: Medium · Category: Functional · References: NGUI-4069 (F4), NGUI-153, NGUI-2254 · Q7

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL2 has a Lloyd's Leader selected and its Leader popup has Fidelis Overall Lead = No, Leader = "OLD LEAD", Ex Leader = "EX LEAD" and Other Leader = "OTHER LEAD". And import data with the headers `LAYERID`, `Leader` and the row `[FL2 ID]`, `ABCD12321` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Open FL2's Leader popup. | Only Leader changes, to "ABCD12321". Lloyd's Leader, Ex Leader ("EX LEAD") and Other Leader ("OTHER LEAD") are not changed. |

---

## 4. Multi-layer, errors and cancel (term < 18 months)

#### TC-NGUI-4069-016 — All new columns imported together with existing columns for several layers
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-4069 (AC-1, F1, F3, F4), NGUI-2383

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, with FL1, FL2 and FL4 at their baseline. And import data with the headers `LAYERID`, `PrimaryLimit`, `QUOTED ROL`, `FOT ROL`, `AmBestProfitPmL`, `Leader` and three rows copied to the clipboard: `[FL1 ID]`, `5000000`, `0.08`, `0.05`, `0.12`, `LEAD 1`; `[FL2 ID]`, `6000000`, `0.09`, `0.06`, `0.23`, `LEAD 2`; `[FL4 ID]`, `7000000`, `0.10`, `0.07`, `0.34`, `LEAD 4`.<br>2. Click "Import" and click "Paste". | All six columns are pasted in the data entry panel. No error is displayed for the new columns, and Apply is enabled. |
| 2 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, with FL1, FL2 and FL4 at their baseline. And the same import data as in block 1 copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Open the Quoted ROL and Leader popups of FL1, FL2 and FL4. | **FL1:** Policy Limit 5,000,000; Quoted ROL 8.000000% and FOT ROL 5.000000%; AM Best Profit PML 12.00%; Leader "LEAD 1". **FL2:** 6,000,000; 9.000000% / 6.000000%; 23.00%; "LEAD 2". **FL4:** 7,000,000; 10.000000% / 7.000000%; 34.00%; "LEAD 4". No values are mixed between the layers, and FL3 and FL5 are not changed. |

#### TC-NGUI-4069-018 — Invalid values in the new decimal columns are reported
Section: Fin Layer import · Priority: High · Category: Validation · References: NGUI-4069 (F1–F3), NGUI-2383 / NGUI-3632 (error handling) · **Blocked by Q9**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `FOT ROL` and the row `[FL1 ID]`, `abc` copied to the clipboard.<br>2. Click "Import" and click "Paste". | **NGUI-2383 handling:** "Issues Pasting Data. Unable to paste the column FOT ROL. Incorrect type given" is displayed and nothing is pasted. **NGUI-3632 handling:** the "Validation Failed" alert, "Data validation errors (1)" with the line for column 'FOT ROL' (Expected type: Decimal) and the cell highlighted are displayed, with the "Proceed to import" toggle Off. In both cases, FL1's FOT ROL is not updated. |
| 2 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `Annualised Fot RoL` and the row `[FL1 ID]`, `5%` copied to the clipboard.<br>2. Click "Import" and click "Paste". | Same handling as block 1, for column 'Annualised Fot RoL'. Nothing is stored for FL1. |
| 3 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `AmBestProfitPmL` and the row `[FL4 ID]`, `twelve` copied to the clipboard.<br>2. Click "Import" and click "Paste". | Same handling as block 1, for column 'AmBestProfitPmL'. FL4's AM Best Profit PML stays 5.00%. |

#### TC-NGUI-4069-019 — Column headers with different casing
Section: Fin Layer import · Priority: Low · Category: Validation · References: NGUI-4069 (column names) · **Blocked by Q8**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode. And import data with the headers `LAYERID`, `fot rol`, `AmBestProfitPML` and the row `[FL1 ID]`, `0.05`, `0.12` copied to the clipboard.<br>2. Click "Import" and click "Paste". | Record whether the headers are recognised (values imported as in TC-001 and TC-010) or reported as unrecognised or not matching any property. Expected per Q8. |

#### TC-NGUI-4069-020 — Cancel after pasting the new columns applies no changes
Section: Fin Layer import · Priority: Medium · Category: Functional · References: NGUI-2383 (Cancel), NGUI-4069

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL4 has FOT ROL = 0, AM Best Profit PML = 5.00% and Leader = "OLD LEAD". And import data with the headers `LAYERID`, `FOT ROL`, `AmBestProfitPmL`, `Leader` and the row `[FL4 ID]`, `0.05`, `0.12`, `NEW LEAD` copied to the clipboard.<br>2. Click "Import" and click "Paste".<br>3. Click "Cancel". | The popup closes. FL4 keeps FOT ROL = 0 (the Quoted ROL field still shows Quoted ROL), AM Best Profit PML = 5.00% and Leader = "OLD LEAD". |

#### TC-NGUI-4069-007 — Annualised Fot RoL for a term below the threshold
Section: Fin Layer import · Priority: Medium · Category: Validation · References: NGUI-4069 (F2 "only visible when policy term > 18 months") · **Blocked by Q4**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, term 01-Jan-2026 – 31-Dec-2026, 5 Fin Layers) in edit mode, where FL1 has Quoted ROL = 8.000000% and FOT ROL = 0. And import data with the headers `LAYERID`, `Annualised Fot RoL` and the row `[FL1 ID]`, `0.05` copied to the clipboard.<br>2. Click "Import" and click "Paste".<br>3. Click "Apply" if it's enabled.<br>4. Click "Edit" next to FL1's Quoted ROL field. | Record whether the paste is rejected with an error, accepted and ignored, or stored. The "Quoted ROL" popup has no Annualised FOT ROL field, and its Quoted ROL (8.000000%) and FOT ROL (0) are not changed. Expected per Q4. |

---

## 5. Long policy term (≥ 18 months)

> **Setup for this section:** in Program R, change the Expiry to **01-Jan-2028** (term 730 days, Annualisation Factor = 0.5) and keep it for TC-002, 005, 006, 009 and 017. TC-008 changes it to **01-Jul-2027**. When the section is done, restore the Expiry to 31-Dec-2026.

#### TC-NGUI-4069-002 — FOT ROL is imported into the Annualised Quoted ROL popup
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-4069 (AC-1, F1), NGUI-3349 · Note: Annualised FOT ROL value **Blocked by Q2**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with the Expiry changed to 01-Jan-2028 (term 730 days), where FL5 has no ROL values. And import data with the headers `LAYERID`, `FOT ROL` and the row `[FL5 ID]`, `0.05` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Click "Edit" next to FL5's Annualised Quoted ROL field. | The "Annualised Quoted ROL" popup shows FOT ROL = 5.000000%. If the import recalculates like manual entry (A4), Annualised FOT ROL = 2.500000% and the Fin Layer field shows "5.00% (2.50%)". Quoted ROL and Annualised Quoted ROL are not changed. |

#### TC-NGUI-4069-005 — Annualised Fot RoL is imported into the Annualised Quoted ROL popup with 6-decimal rounding
Section: Fin Layer import · Priority: High · Category: Functional · References: NGUI-4069 (AC-1, F2), NGUI-3349 · Note: FOT ROL recalculation **Blocked by Q2**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with the Expiry changed to 01-Jan-2028 (term 730 days). And import data with the headers `LAYERID`, `Annualised Fot RoL` and the row `[FL5 ID]`, `0.05` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Click "Edit" next to FL5's Annualised Quoted ROL field. | The "Annualised Quoted ROL" popup shows Annualised FOT ROL = 5.000000%. If recalculated (A4), FOT ROL = 10.000000% and the Fin Layer field shows "10.00% (5.00%)". Quoted ROL and Annualised Quoted ROL are not changed. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with the Expiry changed to 01-Jan-2028. And import data with the headers `LAYERID`, `Annualised Fot RoL` and the row `[FL5 ID]`, `0.010000005` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Click "Edit" next to FL5's Annualised Quoted ROL field. | Annualised FOT ROL = 1.000001% (rounded up). |
| 3 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with the Expiry changed to 01-Jan-2028. And import data with the headers `LAYERID`, `Annualised Fot RoL` and the row `[FL5 ID]`, `0.01000004` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Click "Edit" next to FL5's Annualised Quoted ROL field. | Annualised FOT ROL = 1.000000% (rounded down). |

#### TC-NGUI-4069-006 — FOT ROL and Annualised Fot RoL in the same row
Section: Fin Layer import · Priority: Medium · Category: Edge Case · References: NGUI-4069 (F1, F2), NGUI-3349 · **Blocked by Q3**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with the Expiry changed to 01-Jan-2028 (term 730 days). And import data with the headers `LAYERID`, `FOT ROL`, `Annualised Fot RoL` and the row `[FL5 ID]`, `0.05`, `0.03` (these don't match the 0.5 factor) copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Click "Edit" next to FL5's Annualised Quoted ROL field. | Record which values are stored: both as given (5.000000% / 3.000000%), or one recalculated from the other. Expected per Q3. The Fin Layer field shows the stored pair at 2 dp. |
| 2 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with the Expiry changed to 01-Jan-2028. And import data with the headers `LAYERID`, `FOT ROL`, `Annualised Fot RoL` and the row `[FL5 ID]`, `0.05`, `0.025` (these match the 0.5 factor) copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply". | The popup shows FOT ROL = 5.000000% and Annualised FOT ROL = 2.500000%. The Fin Layer field shows "5.00% (2.50%)". |

#### TC-NGUI-4069-009 — Annualised Fot RoL and Annualised Quoted Rol in one paste go to separate fields
Section: Fin Layer import · Priority: Medium · Category: Functional · References: NGUI-4069 (F2), NGUI-2383 (Annualised Quoted Rol)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with the Expiry changed to 01-Jan-2028 (term 730 days). And import data with the headers `LAYERID`, `Annualised Quoted Rol`, `Annualised Fot RoL` and the row `[FL5 ID]`, `0.4`, `0.03` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Click "Edit" next to FL5's Annualised Quoted ROL field. | The popup shows Annualised Quoted ROL = 40.000000% and Annualised FOT ROL = 3.000000%; the values are not swapped. Quoted ROL and FOT ROL show their recalculated values (if A4 holds: 80.000000% and 6.000000%). |

#### TC-NGUI-4069-017 — Imported new-field values persist after saving the program
Section: Fin Layer import · Priority: Medium · Category: Functional · References: NGUI-4069 (AC-1), A6

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with the Expiry changed to 01-Jan-2028 (term 730 days), where FL5's Leader popup has Fidelis Overall Lead = No. And import data with the headers `LAYERID`, `FOT ROL`, `AmBestProfitPmL`, `Leader` and the row `[FL5 ID]`, `0.05`, `0.12`, `LEAD 5` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Save the program, close it and reopen it in view mode.<br>4. Click "View" next to FL5's Annualised Quoted ROL field and open FL5's Leader popup. | After reopening, the Annualised Quoted ROL popup (read-only) shows FOT ROL = 5.000000% (and the Annualised FOT ROL from Q2). AM Best Profit PML shows 12.00%. The Leader popup shows "LEAD 5". |

#### TC-NGUI-4069-008 — Annualised Fot RoL at exactly 18 months (threshold)
Section: Fin Layer import · Priority: Medium · Category: Edge Case · References: NGUI-4069 (F2 "> 18 months") vs NGUI-3349 ("18 months or greater") · **Blocked by Q1**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open Program R (COB = Reinsurance, 5 Fin Layers) in edit mode with the Expiry changed to 01-Jul-2027 (term exactly 18 months). And import data with the headers `LAYERID`, `Annualised Fot RoL` and the row `[FL5 ID]`, `0.05` copied to the clipboard.<br>2. Click "Import", click "Paste" and click "Apply".<br>3. Open the ROL popup next to FL5's ROL field. | With "≥ 18 months" (NGUI-3349): the field is labelled "Annualised Quoted ROL" and the popup shows Annualised FOT ROL = 5.000000%. With "> 18 months" (this ticket): the outcome is the same as TC-NGUI-4069-007. Record which happens; it confirms Q1. |

---

## Not covered (open questions)

- **Negative values and values above 100% for the three percentage columns (Q13).** Add boundary cases once the limits are confirmed.
- **Import while the program is Bound / Signed Off (Leader fields are editable at Bound per NGUI-3722).** Not in the ticket's scope.

## Traceability matrix

| Requirement | Test cases |
| ----------- | ---------- |
| AC-1 Data converted, rounded, copied and shown; popup closes | 001, 002, 005, 010, 012, 016, 017 |
| F1 FOT ROL (6 dp, Quoted ROL popup) | 001, 002, 003, 004, 006, 016, 018 |
| F2 Annualised Fot RoL (6 dp, Annualised popup, term threshold) | 005, 006, 007, 008, 009, 018, 019 |
| F3 AmBestProfitPmL (2 dp) | 010, 011, 016, 018, 019 |
| F4 Leader (text, Leader popup) | 012, 013, 014, 015, 016 |
| Regression of NGUI-2383 columns / Cancel | 004, 009, 011, 016, 020 |
