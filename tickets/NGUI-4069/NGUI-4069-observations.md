# NGUI-4069 — UAT - Solas - Fin Layers - Reinsurance - Import from Excel - Additional Fields to be imported

**Type:** Story | **Status:** Open | **Priority:** Highest | **Analyzed:** 2026-10-21
**Link:** https://fidelisinsurance.atlassian.net/browse/NGUI-4069
**Parent:** NGUI-4020 (Group 4 - UAT & Hypercare Tickets) | **Sprint:** none | **Labels:** Group4, UAT | **Component:** Solas UI | **Reporter:** Daniel Coelho

## Summary

This story adds four columns to the Reinsurance Fin Layer "Import Layer Data" function from NGUI-2383: **FOT ROL**, **Annualised Fot RoL**, **AmBestProfitPmL** and **Leader**. When the import is applied, each column fills an existing Fin Layer field: the FOT ROL fields in the Quoted ROL / Annualised Quoted ROL popup, the AM Best Profit PML field, and the Leader field in the Leader popup. Values follow the format and rounding rules in the ticket table. The point is to cut manual data entry for fields the UAT users still had to type in after an import.

## Scope

- **In scope:** importing the four new columns, converting and rounding them, and showing them in the target Fin Layer fields and popups. COB = Reinsurance only.
- **Out of scope / not mentioned:**
  - Error handling for the new columns.
  - Behaviour that depends on the policy term (apart from the note on Annualised Fot RoL).
  - Recalculation inside the ROL popups.
  - Leader popup rules (Fidelis Overall Lead).
  - Saving the program.
  - Import button visibility.
- **Affected areas:**
  - The Program create/edit Fin Layer section and the Import Layer Data popup.
  - The **Quoted ROL** popup (NGUI-2315, policy term < 18 months).
  - The **Annualised Quoted ROL** popup (NGUI-3349, policy term ≥ 18 months).
  - The **AM Best Profit PML** field (NGUI-1879, data-ref `amBestProfitPml-input`).
  - The **Leader** popup and the Fin Layer Leader textbox (NGUI-153).

## Acceptance Criteria (as written)

1. **AC-1:** Given valid data for the listed fields is in the Data Entry Panel and the Apply button is enabled, when the user clicks Apply:
   - the data is converted and formatted according to the field rules;
   - values are rounded according to the rounding rules;
   - the popup closes;
   - the data is copied into the matching Fin Layer fields;
   - the updated values are shown in the Fin Layer fields.

**Field rules (description table), treated as part of AC-1:**

| ID | Column (Data Entry) | Target field | Input format | Display format | Rounding |
| -- | ------------------- | ------------ | ------------ | -------------- | -------- |
| F1 | FOT ROL | "Quoted ROL" popup → FOT ROL | Decimal (0.01) | Percentage, 6 dp (1.000000%) | 7th decimal ≥ 5 rounds up, else down (0.010000005 → 1.000001; 0.01000004 → 1.000000) |
| F2 | Annualised Fot RoL | "Annualised ROL" popup → Annualised FOT ROL (only visible when policy term > 18 months) | Decimal (0.01) | Percentage, 6 dp | Same as F1 |
| F3 | AmBestProfitPmL | AM Best Profit PML | Decimal (0.01) | Percentage, 2 dp (1.00%) | 3rd decimal ≥ 5 rounds up, else down (0.01005 → 1.01; 0.01004 → 1.00) |
| F4 | Leader | Leader popup → Leader | Text (ABCD12321) | Text | N/A |

## Observations

- **O1. There's only one AC, and it covers the happy path only.**
  - It doesn't cover invalid data, an empty cell, or any of the policy-term or popup rules (source: AC field).
  - The ticket has no comments, attachments or links, and it isn't in a sprint.
- **O2. The 18-month threshold doesn't match.** NGUI-4069 says Annualised FOT ROL is "only visible when policy term **> 18** months". NGUI-3349 shows the Annualised Quoted ROL popup and the relabel when the policy term is "**18 months or greater**" (source: description vs NGUI-3349 AC). → Q1
- **O3. The popup names in this ticket aren't the real titles.**
  - "Quoted ROL" popup: NGUI-2315 titles it **Quoted ROL** (subtitle "Add Quoted ROL here"), with Quoted ROL and FOT ROL fields. It's used when the term is < 18 months.
  - "Annualised ROL" popup: NGUI-3349 titles it **Annualised Quoted ROL**, with the fields Quoted ROL, FOT ROL, Annualised Quoted ROL and Annualised FOT ROL. It's used when the term is ≥ 18 months.

  So FOT ROL must land in whichever popup applies to the program's term.
- **O4. Typing a value in the Annualised Quoted ROL popup recalculates its pair (NGUI-3349).**
  - The pairs are FOT ROL ↔ Annualised FOT ROL and Quoted ROL ↔ Annualised Quoted ROL.
  - The factor is **Annualisation Factor = 365 / Policy Term (days)**, and only values > 0 trigger it.
  - This ticket doesn't say whether an import triggers the same recalculation. It also doesn't say what happens when both FOT ROL and Annualised Fot RoL are imported in one row. → Q2, Q3
- **O5. What the Fin Layer shows depends on FOT ROL.**
  - **Term < 18 months (NGUI-2315):** the Quoted ROL field shows the FOT ROL value when FOT ROL ≠ 0, otherwise the Quoted ROL value. Importing FOT ROL changes the value shown in the Quoted ROL field.
  - **Term ≥ 18 months (NGUI-3349):** the Annualised Quoted ROL field shows a pair at 2 dp chosen from a matrix, e.g. "FOT ROL (Annualised FOT ROL)" = "5.00% (3.04%)".

  The display format for the < 18 months case (6 dp or 2 dp) isn't stated. → Q11
- **O6. Annualised Fot RoL when the term is under the threshold.** The Quoted ROL popup has no Annualised FOT ROL field, so it's unclear whether the value is rejected, ignored, or stored hidden. → Q4
- **O7. Leader can conflict with the Leader popup rules (NGUI-153).**
  - When **Fidelis Overall Lead = Yes**, the Leader textbox is set to "Fidelis" and is read-only. An imported Leader value would then conflict with the popup.
  - Leader, Ex Leader and Other Leader are free text. Entering a value on the Fin Layer also updates the popup.
  - There's a separate **Lloyd's Leader** field (NGUI-2254 / 1943 / 2031 / 3858), and the import must not write to it. → Q5, Q6, Q7
- **O8. The new column names are unusually cased.**
  - The new names are "Annualised Fot RoL" and "AmBestProfitPmL". NGUI-2383 already has "QUOTED ROL" and "Annualised Quoted Rol", plus a different field "Profit PML" (Profit to PML).
  - Columns with similar names must still go to separate fields: FOT ROL vs QUOTED ROL, Annualised Fot RoL vs Annualised Quoted Rol, AmBestProfitPmL vs Profit PML.
  - It isn't known whether the header matching is case-sensitive. → Q8
- **O9. The AC refers to the "Apply" button (NGUI-2383 wording).** NGUI-3632 (same epic, also Open) calls it "Import" and also changes the error handling. Which error behaviour applies to the new columns depends on which ticket ships first. → Q9, Q10
- **O10. AM Best Profit PML precision.** NGUI-3267 changed decimal precision for AM Best Profit PML (and other fields) to match Prequel. This ticket's 2-dp display should be checked against that. → Q12
- **O11. There's no automation for the import popup or for these fields in the repo** (no page object or spec under `pages/` or `tests/`).

## Risks & Regression Impact

- **Values written to a field with a similar name.** For example, FOT ROL could overwrite Quoted ROL, or AmBestProfitPmL could go to Profit PML. Wrong premium and ROL figures are high impact.
- **Inconsistent annualised pairs.** If the import bypasses the popup's recalculation, FOT ROL and Annualised FOT ROL can disagree with the Annualisation Factor (O4).
- **The Fin Layer ROL display changes** once FOT ROL ≠ 0. Users may see the Quoted ROL field switch to showing the FOT value; this is expected but easy to read as a bug.
- **Leader** could overwrite the read-only "Fidelis" value, or write into Lloyd's Leader by mistake.
- **Regression** of the existing NGUI-2383 columns: QUOTED ROL, Annualised Quoted Rol, Profit PML and the rounding rules.
- **Interaction with NGUI-3632:** until 4069 is deployed, the new columns are reported as "not recognised".

## Dependencies & Test Data Needs

- **QA build** with NGUI-2383, NGUI-2315, NGUI-3349 and NGUI-4069 deployed. Note whether NGUI-3632 is also deployed.
- **Program R:** one program with COB = Reinsurance, Inception 01-Jan-2026 and Expiry 31-Dec-2026, and **five Fin Layers (FL1–FL5)**. Only the import data changes between test cases (decided 2026-10-21).
  - **Long-term cases:** the term-dependent cases change the Expiry to 01-Jan-2028 (730 days, Annualisation Factor = 0.5 if the term is counted as Expiry − Inception).
  - **Threshold case:** the Expiry is changed to 01-Jul-2027 (exactly 18 months).
- **Layer baseline:** set per layer through the popups, so that each layer covers one starting state.
  - FOT ROL: 0 on some layers and ≠ 0 on others.
  - Leader popup: Fidelis Overall Lead = No with a Leader value; Fidelis Overall Lead = Yes on FL3.
  - Lloyd's Leader, Ex Leader and Other Leader set on FL2, to check they aren't touched.
  - AM Best Profit PML set on FL4.
- **Clipboard data** prepared in Excel with the NGUI-2383 headers plus the four new headers.

## Assumptions

- **A1.** The column headers are exactly `FOT ROL`, `Annualised Fot RoL`, `AmBestProfitPmL` and `Leader`, as written in the ticket. *(Q8)*
- **A2.** Values are entered as decimal fractions (0.05 = 5%), the same as the existing NGUI-2383 percentage columns.
- **A3.** The policy term in days is Expiry − Inception, so 01-Jan-2026 → 01-Jan-2028 = 730 days and the factor = 0.5. *(confirm against NGUI-3349 behaviour in QA)*
- **A4.** An import behaves like entering the value in the popup and clicking Apply there, so the paired annualised value is recalculated. *(Q2)*
- **A5.** The confirm button is labelled the way the build shows it: Apply (this AC) or Import (NGUI-3632). *(Q10)*
- **A6.** As in NGUI-2383, the imported values persist only after the program is saved.

## Questions to Ask

| # | Question | Why it matters | Addressed to | Answer |
| - | -------- | -------------- | ------------ | ------ |
| Q1 | Is the threshold for Annualised FOT ROL **> 18 months** (this ticket) or **≥ 18 months** (NGUI-3349)? | Decides the result for a program with a term of exactly 18 months; the two tickets contradict each other. | PO | _pending_ |
| Q2 | When FOT ROL is imported for a term ≥ 18 months, is Annualised FOT ROL recalculated (FOT ROL × 365 / term days), as with manual entry in the popup? When Annualised Fot RoL is imported, is FOT ROL recalculated? | Decides the expected popup values and the Fin Layer display pair. Without recalculation the two values can be inconsistent. | PO / Dev | _pending_ |
| Q3 | If both FOT ROL and Annualised Fot RoL are in the same row, which one wins? Are both stored as given (even if they don't match the factor), or is one recalculated from the other? | Undefined. UAT users are likely to paste both columns from the macro. | PO | _pending_ |
| Q4 | What happens to Annualised Fot RoL when the policy term is below the threshold (the Quoted ROL popup has no Annualised field)? Is it rejected with an error, ignored silently, or stored and shown later if the term changes? | Data could be silently lost or kept hidden. | PO | _pending_ |
| Q5 | If the layer's Leader popup has **Fidelis Overall Lead = Yes** (Leader read-only = "Fidelis"), does an imported Leader value overwrite it, get skipped, or raise an error? | Conflicts with the NGUI-153 rule. | PO | _pending_ |
| Q6 | For Leader, what is the maximum length and which characters are allowed? Does an empty Leader cell clear the existing value or leave it unchanged? | Needed for boundary tests and to avoid wiping existing Leader data. | PO / Dev | _pending_ |
| Q7 | Confirm that the Leader column maps only to the **Leader** textbox in the Leader popup, not to Lloyd's Leader, Ex Leader or Other Leader. | Avoids writing to the wrong field, since Lloyd's Leader is a separate validated field. | Dev | _pending_ |
| Q8 | Are the header names exactly "FOT ROL", "Annualised Fot RoL", "AmBestProfitPmL" and "Leader", and is matching case-sensitive (e.g. "Annualised FOT ROL", "AmBestProfitPML")? | The unusual casing differs from the UI labels, so the macro output must match exactly. | Dev | _pending_ |
| Q9 | Which error handling applies to invalid values in the new columns: NGUI-2383 ("Issues Pasting Data. Unable to paste the column [X]. Incorrect type given") or NGUI-3632 (data validation errors + partial import)? Which ticket is released first? | Decides the expected result of every negative case. | PO / Dev | _pending_ |
| Q10 | Is the confirm button **Apply** (this AC, NGUI-2383) or **Import** (NGUI-3632)? | Step wording and automation locators. | PO | _pending_ |
| Q11 | For a term < 18 months with FOT ROL ≠ 0, in what format does the Quoted ROL field in the Fin Layer show the FOT ROL value (e.g. 5.000000% or 5.00%)? | Needed for the exact expected result. | Dev | _pending_ |
| Q12 | Is 2 dp still the correct display precision for AM Best Profit PML after NGUI-3267 (decimal-precision alignment with Prequel)? | Rounding expectations could be outdated. | Dev | _pending_ |
| Q13 | Are negative values or values above 100% (e.g. 1.5) accepted for FOT ROL, Annualised Fot RoL and AmBestProfitPmL? | Boundary cases; the popup fields may have limits the import bypasses. | PO | _pending_ |
| Q14 | Does importing FOT ROL = 0 (or an empty FOT ROL cell) clear an existing FOT ROL value, switching the Fin Layer display back to Quoted ROL? | Needed to know whether existing data can be reset by mistake. | PO | _pending_ |
