# NGUI-2901 — Test Cases: Visibility Conditions - Political Risk (Specialty) — Additional Visibility conditions

**Created:** 2026-10-21 | **Total cases:** 13
**Ticket:** https://fidelisinsurance.atlassian.net/browse/NGUI-2901 (Story, Open, Medium; parent NGUI-1259 Generic Submission Flow)

**Scope:** only the AC block **"Additional Visibility conditions → assuming that the program Class of Business = Specialty AND the Line of Business = Political Risk"**, and the matching "Additional Visibility Condition" column of the field table:

| # | Field | Section | Shown when |
| - | ----- | ------- | ---------- |
| V1 | CBI Consumer (toggle) | Initial Details | Placing Office = FIID |
| V2 | Original Insured (dropdown + "Create Client", "Add Client") | Initial Details | Re toggled on |
| V3 | License number (textbox) | Initial Details | Surplus Line broker toggled on |
| V4 | MGA Code (dropdown) | Initial Details | Binder / Line Slip toggled on |
| V5 | Cancelled (date picker) | Dates & Restrictions | Underwriting = Bound, Bound (Pre Sign-Off), Bound (Signed Off), Bound (Cancelled) or Bound (Expired) |
| V6 | % GWP HGM Initiative (textbox) | Dates & Restrictions | Is HGM toggled on |
| V7 | Modelling Level (dropdown) | Underwriting Status | Binder / Line Slip toggled on |
| V8 | Declinature Reason (dropdown) | Underwriting Status | Underwriting = Declined or NTU |
| V9 | Future Opportunity and Rationale | Underwriting Status | Underwriting = Declined or NTU |

**Out of scope:** the plain Visible / Not Visible list and the "Reinsured" relabel of Client ("Other Rules").

**Sources:** NGUI-2901 description table, AC and comments (Daniel Coelho, 2026-10-08: Broker Contact added; 2026-10-15: Future Opportunity / Rationale added). The values below come from the existing Space visibility automation in this repo:
- FIID is the **Dublin** placing office (`test-data/static/solas/space-visibility.ts`).
- Underwriting status values come from `enums/solas/program-lifecycle.ts`.
- Declining a program goes through the **Declined** button and the **Decline Program** dialog (`pages/solas/program-detail.page.ts`).

**By category:** Functional 12 · Edge Case 1
**By priority:** High 8 · Medium 5

## Test data and conventions

- **Program setup:** every block starts from a program with **COB = Specialty** and **LOB = Political Risk**. Use any Political Risk Program Type.
- **The three modes in the AC:**
  - **Creating:** a new program, opened from Add a New Program, that hasn't been saved yet.
  - **Editing:** an existing program in edit mode.
  - **Consulting:** an existing saved program in view mode.
- **Placing Office values:** FIID = **Dublin**. "London" stands for any non-FIID office.
- **Additional buttons:**
  - The AC says they're displayed only when **creating or editing** a program.
  - So when consulting a program, only the field is checked; the buttons aren't expected.
- **Programs at specific statuses:**
  - **Bound statuses:** moved there with the status buttons (Submission Ready → Quoted/Awaiting FOT → Bound → Pre Sign-Off → Sign-Off).
  - **Declined:** moved there with Declined → Decline Program dialog → Confirm.

---

## 1. Initial Details

#### TC-NGUI-2901-001 — CBI Consumer is visible only when Placing Office = FIID
Section: Visibility conditions · Priority: High · Category: Functional · References: NGUI-2901 (AC "CBI Consumer", V1)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with no Placing Office selected.<br>2. Look at the Initial Details section. | The "CBI Consumer" toggle switch is not displayed. |
| 2 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk.<br>2. In the Underwriting Status section, select Placing Office = "Dublin" (FIID).<br>3. Look at the Initial Details section. | The "CBI Consumer" toggle switch is displayed in Initial Details. |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Placing Office = "Dublin" in edit mode.<br>2. Change Placing Office to "London".<br>3. Look at the Initial Details section. | The "CBI Consumer" toggle switch is hidden as soon as the Placing Office changes; no save or reload is needed. |
| 4 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Placing Office = "London" in edit mode.<br>2. Change Placing Office to "Dublin".<br>3. Look at the Initial Details section. | The "CBI Consumer" toggle switch is displayed. |
| 5 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk and Placing Office = "Dublin" in view mode.<br>2. Look at the Initial Details section. | The "CBI Consumer" toggle switch is displayed (read-only). |
| 6 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk and Placing Office = "London" in view mode.<br>2. Look at the Initial Details section. | The "CBI Consumer" toggle switch is not displayed. |

#### TC-NGUI-2901-002 — Original Insured and its buttons are visible only when Re is on
Section: Visibility conditions · Priority: High · Category: Functional · References: NGUI-2901 (AC "Original Insured", AC "additional buttons", V2)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with the "Re" switch off.<br>2. Look at the Initial Details section. | The "Original Insured" dropdown is not displayed, and neither are its "Create Client" and "Add Client" buttons. |
| 2 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with the "Re" switch off.<br>2. Switch "Re" on. | The "Original Insured" dropdown is displayed in Initial Details, with its "Create Client" and "Add Client" buttons. |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and "Re" on in edit mode.<br>2. Switch "Re" off. | The "Original Insured" dropdown and its "Create Client" and "Add Client" buttons are hidden. |
| 4 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk, "Re" on and an Original Insured selected, in view mode.<br>2. Look at the Initial Details section. | The "Original Insured" field is displayed with the saved value. The "Create Client" and "Add Client" buttons are not displayed (view mode). |
| 5 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk and "Re" off in view mode.<br>2. Look at the Initial Details section. | The "Original Insured" field is not displayed. |

#### TC-NGUI-2901-003 — License number is visible only when Surplus Line broker is on
Section: Visibility conditions · Priority: High · Category: Functional · References: NGUI-2901 (AC "License number", V3)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with the "Surplus Line broker" switch off.<br>2. Look at the Initial Details section. | The "License number" field is not displayed. |
| 2 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with the "Surplus Line broker" switch off.<br>2. Switch "Surplus Line broker" on. | The "License number" field is displayed in Initial Details. |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and "Surplus Line broker" on in edit mode.<br>2. Switch "Surplus Line broker" off. | The "License number" field is hidden. |
| 4 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk, "Surplus Line broker" on and a License number entered, in view mode.<br>2. Look at the Initial Details section. | The "License number" field is displayed with the saved value. |
| 5 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk and "Surplus Line broker" off in view mode.<br>2. Look at the Initial Details section. | The "License number" field is not displayed. |

#### TC-NGUI-2901-004 — MGA Code is visible only when Binder / Line Slip is on
Section: Visibility conditions · Priority: High · Category: Functional · References: NGUI-2901 (AC "MGA Code", V4)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with the "Binder / Line Slip" switch off.<br>2. Look at the Initial Details section. | The "MGA Code" dropdown is not displayed. |
| 2 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with the "Binder / Line Slip" switch off.<br>2. Switch "Binder / Line Slip" on. | The "MGA Code" dropdown is displayed in Initial Details. |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and "Binder / Line Slip" on in edit mode.<br>2. Switch "Binder / Line Slip" off. | The "MGA Code" dropdown is hidden. |
| 4 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk, "Binder / Line Slip" on and an MGA Code selected, in view mode.<br>2. Look at the Initial Details section. | The "MGA Code" field is displayed with the saved value. |
| 5 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk and "Binder / Line Slip" off in view mode.<br>2. Look at the Initial Details section. | The "MGA Code" field is not displayed. |

---

## 2. Dates & Restrictions

#### TC-NGUI-2901-005 — % GWP HGM Initiative is visible only when Is HGM is on
Section: Visibility conditions · Priority: Medium · Category: Functional · References: NGUI-2901 (AC "Is GWP HGM Initiative", V6) · Note: field label to confirm, Q1

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with the "Is HGM" switch off.<br>2. Look at the Dates & Restrictions section. | The "% GWP HGM Initiative" field is not displayed. |
| 2 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with the "Is HGM" switch off.<br>2. Switch "Is HGM" on. | The "% GWP HGM Initiative" field is displayed in Dates & Restrictions. |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and "Is HGM" on in edit mode.<br>2. Switch "Is HGM" off. | The "% GWP HGM Initiative" field is hidden. |
| 4 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk, "Is HGM" on and % GWP HGM Initiative entered, in view mode.<br>2. Look at the Dates & Restrictions section. | The "% GWP HGM Initiative" field is displayed with the saved value. |
| 5 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk and "Is HGM" off in view mode.<br>2. Look at the Dates & Restrictions section. | The "% GWP HGM Initiative" field is not displayed. |

#### TC-NGUI-2901-006 — Cancelled is visible for every Bound status
Section: Visibility conditions · Priority: High · Category: Functional · References: NGUI-2901 (AC "Cancelled" — visible, V5) · Note: blocks 4–5 **Blocked by Q2**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Bound" in edit mode.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" date picker is displayed. |
| 2 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Bound (Pre Sign-Off)" in edit mode.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" date picker is displayed. |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Bound (Signed Off)" in view mode.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" field is displayed. |
| 4 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Bound (Cancelled)" in view mode.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" field is displayed, with the cancellation date if one is set. |
| 5 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Bound (Expired)" in view mode.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" field is displayed. |
| 6 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Quoted/Awaiting FOT" in edit mode.<br>2. Click "Bound" and complete the move to Bound.<br>3. Look at the Dates & Restrictions section. | The "Cancelled" field is not displayed before step 2 and is displayed once the program is Bound. |

#### TC-NGUI-2901-007 — Cancelled is hidden for non-Bound statuses
Section: Visibility conditions · Priority: Medium · Category: Functional · References: NGUI-2901 (AC "Cancelled" — not visible, V5)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" field is not displayed. |
| 2 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Partial Submission" in edit mode.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" field is not displayed. |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Submission Ready" in edit mode.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" field is not displayed. |
| 4 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Quoted/Awaiting FOT" in edit mode.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" field is not displayed. |
| 5 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Declined" in view mode.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" field is not displayed. |
| 6 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "NTU" in view mode.<br>2. Look at the Dates & Restrictions section. | The "Cancelled" field is not displayed. |

---

## 3. Underwriting Status

#### TC-NGUI-2901-008 — Modelling Level is visible only when Binder / Line Slip is on
Section: Visibility conditions · Priority: High · Category: Functional · References: NGUI-2901 (AC "Modelling Level", V7)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with the "Binder / Line Slip" switch off.<br>2. Look at the Underwriting Status section. | The "Modelling Level" dropdown is not displayed. |
| 2 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk, with the "Binder / Line Slip" switch off.<br>2. In Initial Details, switch "Binder / Line Slip" on.<br>3. Look at the Underwriting Status section. | The "Modelling Level" dropdown is displayed in Underwriting Status, and the "MGA Code" dropdown is displayed in Initial Details. One switch controls both fields. |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and "Binder / Line Slip" on in edit mode.<br>2. Switch "Binder / Line Slip" off. | The "Modelling Level" dropdown is hidden in Underwriting Status, and "MGA Code" is hidden in Initial Details. |
| 4 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk, "Binder / Line Slip" on and a Modelling Level selected, in view mode.<br>2. Look at the Underwriting Status section. | The "Modelling Level" field is displayed with the saved value. |
| 5 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk and "Binder / Line Slip" off in view mode.<br>2. Look at the Underwriting Status section. | The "Modelling Level" field is not displayed. |

#### TC-NGUI-2901-009 — Declinature Reason is visible for Declined and NTU
Section: Visibility conditions · Priority: High · Category: Functional · References: NGUI-2901 (AC "Declinature Reason" — visible, V8) · Note: NTU flow Q3

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Partial Submission" in edit mode.<br>2. Click "Declined", select a Declinature Reason and enter a Declinature/NTU Rationale in the "Decline Program" dialog, then click "Confirm".<br>3. Look at the Underwriting Status section. | Underwriting = "Declined". The "Declinature Reason" dropdown is displayed in Underwriting Status with the reason selected in the dialog. |
| 2 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Quoted/Awaiting FOT" in edit mode.<br>2. Mark the program as NTU (with a Declinature Reason).<br>3. Look at the Underwriting Status section. | Underwriting = "NTU". The "Declinature Reason" dropdown is displayed with the selected reason. |
| 3 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk and Underwriting = "Declined" in view mode.<br>2. Look at the Underwriting Status section. | The "Declinature Reason" field is displayed with the saved value. |

#### TC-NGUI-2901-010 — Declinature Reason is hidden for other statuses
Section: Visibility conditions · Priority: Medium · Category: Functional · References: NGUI-2901 (AC "Declinature Reason" — not visible, V8)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk.<br>2. Look at the Underwriting Status section. | The "Declinature Reason" dropdown is not displayed. |
| 2 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Submission Ready" in edit mode.<br>2. Look at the Underwriting Status section. | The "Declinature Reason" dropdown is not displayed. |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Quoted/Awaiting FOT" in edit mode.<br>2. Look at the Underwriting Status section. | The "Declinature Reason" dropdown is not displayed. |
| 4 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Bound" in view mode.<br>2. Look at the Underwriting Status section. | The "Declinature Reason" field is not displayed. |

#### TC-NGUI-2901-011 — Future Opportunity and Rationale are visible for Declined and NTU
Section: Visibility conditions · Priority: High · Category: Functional · References: NGUI-2901 (AC "Future Opportunity and Rationale" — visible, V9; comment 2026-10-15) · Note: field types Q4

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Partial Submission" in edit mode.<br>2. Click "Declined", complete the "Decline Program" dialog and click "Confirm".<br>3. Look at the Underwriting Status section. | Underwriting = "Declined". Both "Future Opportunity" and "Rationale" are displayed in Underwriting Status. |
| 2 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Quoted/Awaiting FOT" in edit mode.<br>2. Mark the program as NTU.<br>3. Look at the Underwriting Status section. | Underwriting = "NTU". Both "Future Opportunity" and "Rationale" are displayed. |
| 3 | 1. Open an existing saved program with COB = Specialty, LOB = Political Risk and Underwriting = "Declined" in view mode.<br>2. Look at the Underwriting Status section. | "Future Opportunity" and "Rationale" are displayed with their saved values. |

#### TC-NGUI-2901-012 — Future Opportunity and Rationale are hidden for other statuses
Section: Visibility conditions · Priority: Medium · Category: Functional · References: NGUI-2901 (AC "Future Opportunity and Rationale" — not visible, V9)

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Start creating a new program with COB = Specialty and LOB = Political Risk.<br>2. Look at the Underwriting Status section. | "Future Opportunity" and "Rationale" are not displayed. |
| 2 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Submission Ready" in edit mode.<br>2. Look at the Underwriting Status section. | "Future Opportunity" and "Rationale" are not displayed. |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and Underwriting = "Bound" in view mode.<br>2. Look at the Underwriting Status section. | "Future Opportunity" and "Rationale" are not displayed. |

---

## 4. Edge cases

#### TC-NGUI-2901-013 — Value of a conditional field after its condition is switched off
Section: Visibility conditions · Priority: Medium · Category: Edge Case · References: NGUI-2901 (V2, V3, V4, V6) · **Blocked by Q5**

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and "Surplus Line broker" on in edit mode.<br>2. Enter a License number.<br>3. Switch "Surplus Line broker" off, then on again. | "License number" is hidden while the switch is off. When it's switched on again, record whether the entered value is kept or cleared (expected per Q5). |
| 2 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and "Binder / Line Slip" on in edit mode, with MGA Code and Modelling Level selected.<br>2. Switch "Binder / Line Slip" off and save the program.<br>3. Reopen the program in edit mode and switch "Binder / Line Slip" on. | Record whether MGA Code and Modelling Level still hold the old values or are empty after the save (expected per Q5). |
| 3 | 1. Open an existing program with COB = Specialty, LOB = Political Risk and "Re" on in edit mode, with an Original Insured selected.<br>2. Switch "Re" off and save the program.<br>3. Reopen the program in view mode. | "Original Insured" is not displayed. Whether the value is still stored depends on Q5. |

---

## Gaps and questions

| # | Question | Affects |
| - | -------- | ------- |
| Q1 | The AC calls the field **"Is GWP HGM Initiative"**; the table calls it **"% GWP HGM Initiative"**. Which label does the UI show? | TC-005 |
| Q2 | How is a QA program put into **Bound (Cancelled)** and **Bound (Expired)**? These statuses aren't reachable with the lifecycle buttons used in the repo's automation. Should an existing program be used, or does a status change in the back end need to be requested? | TC-006 blocks 4–5 |
| Q3 | How is a program set to **NTU**: a dedicated button, or the Decline Program dialog with an NTU option? Is a Declinature Reason required for NTU? | TC-009, TC-011 |
| Q4 | "Future Opportunity" and "Rationale" have no entry mode in the table. What control types are they? Is "Rationale" the same field as the **"Declinature/NTU Rationale"** in the Decline Program dialog, or a separate one? | TC-011 |
| Q5 | When a condition is switched off (Re, Surplus Line broker, Binder / Line Slip, Is HGM), is the hidden field's value cleared, or kept and saved? | TC-013 |
| Q6 | The AC writes "License number" and the table writes "Licence number". The live label on Space is "License number"; confirm it's the same for Political Risk. | TC-003 |
| Q7 | "Placing Office" is in the Underwriting Status section but controls CBI Consumer in Initial Details. Confirm that the visibility updates straight away in the same edit session, without saving. | TC-001 blocks 3–4 |

## Traceability matrix

| Requirement | Test cases |
| ----------- | ---------- |
| V1 CBI Consumer — Placing Office = FIID | 001 |
| V2 Original Insured (+ buttons) — Re on | 002, 013 |
| V3 License number — Surplus Line broker on | 003, 013 |
| V4 MGA Code — Binder / Line Slip on | 004, 008, 013 |
| V5 Cancelled — Bound statuses | 006, 007 |
| V6 % GWP HGM Initiative — Is HGM on | 005 |
| V7 Modelling Level — Binder / Line Slip on | 008, 013 |
| V8 Declinature Reason — Declined / NTU | 009, 010 |
| V9 Future Opportunity and Rationale — Declined / NTU | 011, 012 |
| AC "additional buttons follow visibility" | 002 |
