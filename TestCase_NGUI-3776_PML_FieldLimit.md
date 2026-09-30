# Test Cases — Financial Layers: Increase PML Field Limit (NGUI-3776)

**Source:** Jira `NGUI-3776` "Hypercare - Construction - Increase PML Field Limits" (Story, High, status *Ready for Test*, parent epic NGUI-2937 "Group 2 - UAT & Hypercare Tickets"), including comments from Gareth Mason (22-Sep-2026) and Martin Milchov (28-Sep-2026). No screenshots/mockups attached; no live-app exploration done yet.

**Requirement (description):** "Raised by Barnaby & Millie (Construction) but this should apply to all LOB. Require an amendment to the existing validation on the PML field - set this to 999,999%."

**Behaviour per LOB (Martin Milchov comment):**
- **Shown and saved** (new limit applies): Specialty – Energy (incl. "Construction"), Property, Space, Political Risk Re.
- **Shown but NOT saved:** Reinsurance – Property (all program types except Direct RDF). The Reinsurance save path has no PML field in the UI mapping, BFF, API or DB table type, so the value is lost on save.
- **Shown because no visibility rule exists (saved):** Specialty – Specialty, Political Risk, Credit, Title, E-Cat, MGA/Misc, M&A, Fine Arts & Specie, Asset Backed Finance, International Casualty; all Outwards lines; Carrier.

**Summary:** 16 test cases across the following areas:
- **Boundary validation:** maximum, just above the maximum, just below the maximum, zero.
- **Negative input:** negative values, non-numeric input, empty value.
- **Decimal precision.**
- **Regression:** values above the previous limit are no longer rejected.
- **Persistence per LOB group** from the comment.
- **Edit of an existing program.**
- **The Reinsurance – Property "shown but not saved" behaviour.**

**Assumptions (to be confirmed — see Open Questions):**
- **A1 — Maximum value:** taken as **999,999%**, per the ticket description. Martin's comment writes "999.999%"; this is treated as a typo of the same value (see Q1).
- **A2 — Location:** the PML field is on the **Financial Layers** tab (per-layer column "PML"), as documented on the Space E2E page and in NGUI-2732.
- **A3 — Minimum and negatives:** the minimum is 0 and negative values are rejected (not stated in the ticket).
- **A4 — Previous limit:** unknown. TC-004 uses 1,000% and 50,000% as "above any plausible old limit" values (see Q2).
- **A5 — Blocking message:** a value above the maximum blocks Save with an inline validation message on the PML cell. Exact wording unknown (see Q3).

---

## A. Boundary validation (Specialty – Energy / Construction)

Common preconditions for TC-001 to TC-009:
- User is logged into Solas QA with program create/edit permissions.
- A draft or active program exists with Class of Business = **Specialty**, Line of Business = **Energy**, and a "Construction" program type.
- The user is on the **Financial Layers** tab, in edit mode, with at least one layer and all other required layer fields filled (Policy Limit, Period Basis, Placing Basis).

### TC-NGUI-3776-001 — PML accepts the maximum value 999,999%
| Field | Value |
| --- | --- |
| **Priority** | High |
| **Category** | Boundary / Functional |
| **Traceability** | Description: "set this to 999,999%" |
| **Test Data** | PML = 999999 |

**Steps:**
1. In the layer's **PML** field, enter `999999`.
2. Tab out of the field.
3. Click **Save**.
4. Reload the page and open the Financial Layers tab.

**Expected Results:**
- Step 2: No validation error is shown on the PML field.
- Step 3: "Financial layers saved" appears and Save completes.
- Step 4: PML shows **999,999%** (the value is persisted, not truncated or rounded).

### TC-NGUI-3776-002 — PML rejects a value just above the maximum
| Field | Value |
| --- | --- |
| **Priority** | High |
| **Category** | Boundary / Validation |
| **Traceability** | Description: new upper limit 999,999% |
| **Test Data** | PML = 1000000 (and, if decimals are allowed, 999999.01) |

**Steps:**
1. In the PML field, enter `1000000`.
2. Tab out of the field.
3. Try to click **Save**.

**Expected Results:**
- Step 2: The PML field is marked invalid and shows a validation message stating the maximum (999,999%).
- Step 3: The layer is not saved (Save is blocked or an error is shown). The previously saved PML value is unchanged after reload.

### TC-NGUI-3776-003 — PML accepts a value just below the maximum
| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Category** | Boundary |
| **Test Data** | PML = 999998 |

**Steps:**
1. Enter `999998` in PML.
2. Click **Save**.
3. Reload the page.

**Expected Results:** No validation error. Save succeeds, and after reload PML shows 999,998%.

### TC-NGUI-3776-004 — Values above the previous limit are no longer rejected (regression of the old cap)
| Field | Value |
| --- | --- |
| **Priority** | High |
| **Category** | Regression / Functional |
| **Traceability** | Description: "amendment to the existing validation"; Construction users need higher PML % |
| **Test Data** | PML = 1000, then PML = 50000 |

**Steps:**
1. Enter `1000` in PML and click **Save**.
2. Reload the page and check the PML value.
3. Enter `50000` in PML and click **Save**.
4. Reload the page and check the PML value.

**Expected Results:** Both values save without a validation error and are shown after reload as 1,000% and 50,000%.

### TC-NGUI-3776-005 — PML accepts zero (lower boundary)
| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Category** | Boundary |
| **Test Data** | PML = 0 |

**Steps:**
1. Enter `0` in PML.
2. Click **Save**.
3. Reload the page.

**Expected Results:** No validation error. Save succeeds, and after reload PML shows 0%.

### TC-NGUI-3776-006 — PML rejects a negative value
| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Category** | Negative / Validation |
| **Traceability** | Assumption A3 |
| **Test Data** | PML = -1 |

**Steps:**
1. Enter `-1` in PML.
2. Tab out.
3. Try to Save.

**Expected Results:** A validation message is shown or the minus sign is not accepted. The layer is not saved with a negative PML.

### TC-NGUI-3776-007 — PML rejects non-numeric input
| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Category** | Negative / Validation |
| **Test Data** | PML = `abc`, `12a`, `%` |

**Steps:**
1. Type each value into the PML field in turn.
2. Tab out after each one.

**Expected Results:** Non-numeric characters are either blocked while typing or cause a validation message. No non-numeric value can be saved.

### TC-NGUI-3776-008 — PML decimal precision
| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Category** | Validation |
| **Traceability** | Q4 (precision not specified) |
| **Test Data** | PML = 12345.67, then 999998.99 |

**Steps:**
1. Enter `12345.67` in PML.
2. Click **Save** and reload.
3. Enter `999998.99` in PML.
4. Click **Save** and reload.

**Expected Results:** Decimals are handled consistently with the field's configured precision: stored and shown as entered, or rounded by a documented rule. Decimals don't push a sub-maximum value over the limit, and don't cause a validation error.

### TC-NGUI-3776-009 — PML can be cleared (empty value)
| Field | Value |
| --- | --- |
| **Priority** | Low |
| **Category** | Negative / Edge Case |
| **Test Data** | PML = empty |

**Steps:**
1. Save the layer with PML = 5000.
2. Clear the PML field.
3. Click **Save**.
4. Reload the page.

**Expected Results:** PML is optional, so Save succeeds and PML is empty after reload. The previous 5000 value doesn't come back.

---

## B. Persistence per LOB group (from the Martin Milchov comment)

Common preconditions for TC-010 to TC-014: a program of the stated Class of Business / Line of Business is open on the Financial Layers tab in edit mode, with one layer and all other required fields filled.

### TC-NGUI-3776-010 — Specialty – Property: PML 999,999% is shown and saved
| Field | Value |
| --- | --- |
| **Priority** | High |
| **Category** | Functional / Persistence |
| **Traceability** | Comment: "Shown and saved – Speciality – … Property" |
| **Test Data** | CoB = Specialty · LoB = Property · PML = 999999 |

**Steps:**
1. Enter `999999` in PML.
2. Click **Save**.
3. Reload the page and open Financial Layers.

**Expected Results:** No validation error. After reload PML = 999,999%.

### TC-NGUI-3776-011 — Specialty – Space: PML 999,999% is shown and saved
| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Category** | Functional / Persistence |
| **Traceability** | Comment: "Shown and saved – … Space" |
| **Test Data** | CoB = Specialty · LoB = Space · PML = 999999 |

**Steps and Expected Results:** Same as TC-010.

### TC-NGUI-3776-012 — Specialty – Political Risk Re: PML 999,999% is shown and saved
| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Category** | Functional / Persistence |
| **Traceability** | Comment: "Shown and saved – … Political Risk Re" |
| **Test Data** | CoB = Specialty · LoB = Political Risk Re · PML = 999999 |

**Steps and Expected Results:** Same as TC-010.

### TC-NGUI-3776-013 — LOB without a visibility rule (Specialty – Credit): PML 999,999% is shown and saved
| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Category** | Functional / Persistence |
| **Traceability** | Comment: "Shown because no visibility rule exists for them (saved)" |
| **Test Data** | CoB = Specialty · LoB = Credit · PML = 999999 (spot-check one more from the list if time allows, e.g. Title or M&A) |

**Steps and Expected Results:** Same as TC-010.

### TC-NGUI-3776-014 — Outwards line: PML 999,999% is shown and saved
| Field | Value |
| --- | --- |
| **Priority** | Low |
| **Category** | Functional / Persistence |
| **Traceability** | Comment: "All Outwards lines, Carrier" |
| **Test Data** | CoB = Outwards · any LoB · PML = 999999 |

**Steps and Expected Results:** Same as TC-010.

### TC-NGUI-3776-015 — Reinsurance – Property: PML is shown but NOT saved (known limitation)
| Field | Value |
| --- | --- |
| **Priority** | High |
| **Category** | Functional / Known Limitation |
| **Traceability** | Comment: "Shown but NOT saved – Reinsurance – Property (all program types except Direct RDF)" |
| **Test Data** | CoB = Reinsurance · LoB = Property · any Program Type except Direct RDF · PML = 5000 |

**Steps:**
1. Open the Financial Layers tab in edit mode.
2. Enter `5000` in PML. Confirm no validation error, since the new limit applies in the UI.
3. Click **Save**.
4. Reload the page and open Financial Layers.

**Expected Results (as documented in the comment):**
- Step 2: The value is accepted in the UI.
- Step 4: PML is empty, because Reinsurance has no save path for PML.

**Note:** This documents current behaviour; it isn't confirmed as acceptable. See Q5 on whether the field should be hidden for Reinsurance – Property or a defect raised.

---

## C. Edit of an existing program

### TC-NGUI-3776-016 — Existing program: a PML value is updated to the new maximum
| Field | Value |
| --- | --- |
| **Priority** | Medium |
| **Category** | Functional / Regression |
| **Preconditions** | An existing (finalized) Specialty – Energy program has a saved layer with PML = 100. The user has edit permissions for the program's current status. |
| **Test Data** | Old PML = 100 · New PML = 999999 |

**Steps:**
1. Open the existing program and go to the **Financial Layers** tab.
2. Click **Edit**.
3. Change PML from `100` to `999999`.
4. Click **Save**.
5. Reload the page.

**Expected Results:** Save succeeds with no validation error. After reload PML = 999,999%, and no other layer fields have changed.

---

## High-priority cases

- **TC-001:** the maximum is accepted.
- **TC-002:** above the maximum is rejected.
- **TC-004:** the old cap no longer applies.
- **TC-010:** Specialty – Property is saved.
- **TC-015:** the Reinsurance – Property value is lost on save.

## Open Questions

- **Q1 — What is the maximum?** The description says "999,999%" (nine hundred ninety-nine thousand), and the comment says "999.999%". The values and expected results of TC-001 to TC-004 depend on the answer.
- **Q2 — What was the previous limit?** Knowing it lets TC-004 test exactly "old limit + 1".
- **Q3 — What does the validation message say?** The exact text shown when PML exceeds the maximum is needed for TC-002 (and for automation).
- **Q4 — What precision does the field use?** The number of decimal places and any rounding rule are needed for TC-008.
- **Q5 — Is losing the value on Reinsurance – Property accepted?** Martin's comment says it is shown but not saved. Is that accepted for this ticket, or should the field be hidden or a defect raised?
- **Q6 — How does Direct RDF behave?** Reinsurance – Property "Direct RDF" is excluded from the not-saved group. Is PML hidden there, or saved? A case can be added once this is confirmed.
- **Q7 — Does anything else show PML?** Does the new limit also apply to other places PML appears (Risk Card, Layer Checks, import/templates)? No such places are listed in the ticket.
