# NGUI-2901: Political Risk (Specialty) visibility conditions, verification

**Ticket:** [NGUI-2901 Solas - Visibility Conditions - Political Risk (Specialty)](https://fidelisinsurance.atlassian.net/browse/NGUI-2901) (status: In Test)
**Environment:** QA1 (`https://qa-01.tfpuw.com`), build `26300.2701`, Chromium via `playwright-cli`
**Date:** 2026-10-27
**Checked against:** the field table in the ticket description, including the comments of 2026-10-08 (Broker Contact) and 2026-10-15 (Future Opportunity, Rationale).

## Verdict

**Not ready to pass.**

- **What passes:** Initial Details, Dates & Restrictions and Underwriting Status show the right fields, and every "Not Visible" field is hidden.
- **What fails:** the additional visibility conditions work when creating and editing a program, with one exception (% GWP HGM Initiative). When viewing a saved program, most of them aren't applied.

| # | Finding | Mode |
| - | ------- | ---- |
| 1 | View mode ignores most additional visibility conditions. CBI Consumer, License number, MGA Code, Modelling Level, % GWP HGM Initiative, Declinature Reason, Future Opportunity and Rationale are shown on every saved program, whatever their condition. | Consulting |
| 2 | % GWP HGM Initiative is shown (disabled) while Is HGM is off. The ticket says it should be hidden. | Creating, editing, consulting |
| 3 | Override isn't shown in view mode. It's shown when creating and editing. *To confirm whether this is expected.* | Consulting |

**Known exclusion:** Tenor Months isn't built yet ([NGUI-1427](https://fidelisinsurance.atlassian.net/browse/NGUI-1427), Ready).

## How it was checked

- **Creating:** Add a New Program → Specialty / Political Risk / Africa / Political Risks → wizard. Every visible label was read per section. Each condition was switched on and off, and Placing Office was set to Abu Dhabi, Bermuda, Dublin and London in turn.
- **Editing:** Details → **Edit** on existing Political Risk programs. The labels were read and the conditions switched where the app allows it. Nothing was saved.
- **Consulting:** the Details tab in view mode on existing programs. Each label and its value were read.
- **"Hidden" checks:** every visible label in each section was collected. Any field that should be hidden would have appeared under its own name, so the check doesn't depend on guessing label spellings.

| Program | Underwriting status | Notable values |
| ------- | ------------------- | -------------- |
| 413304 | Partial Submission | Dublin; all switches off |
| 408038 | Quoted/Awaiting FOT | London; Is HGM = Yes |
| 414340 | Bound | Dublin |
| 394504 | Bound (Pre Sign-Off) | Dublin |
| 399424 | Bound (Signed Off) | London; Has Surplus Line Broker = Yes |
| 393513 | Bound (Expired) | London; Binder / Line Slip = Yes |
| 409678 | Declined | Dublin |
| 388557 | NTU | London; Re = Yes; Is HGM = Yes |

No Political Risk program in **Submission Ready** or **Bound (Cancelled)** was found, so those two statuses weren't checked.

---

## 1. Initial Details fields ✅

**Visible: all shown.** Class of Business, Line of Business, Client (+ Create Client / Add Client), Re, Client Size, Program Name, Program Type, Broker, Broker Contact, Local Broker (+ Create Local Broker), Has Surplus Line Broker, Surplus Line Broker, Cession Consideration, Law & Jurisdiction, Binder / Line Slip, Prior Submit, Controlled by Ops, Enable Structure Changes, Est Month Close, Marketing, Obligor Name (+ client buttons), Obligor Country, Guarantor (+ client buttons), Guarantor's Country, Transaction Description, Risk Code, Policy Reference, Program Priority, Tariff Vulnerability Indicator, Exposure Tags.

- Client is relabeled "Reinsured" when Re is on, as "Other Rules" requires.

**Not visible: all 27 hidden.** Zone, Fleet TIV, Vessels in Fleet, TRIA Eligible, TRIA Taken up, US Business Placement, Requires LOC, AIR Occ. Code, B.I. TIV, Terror TIV, Is SRT, Additional Airlines, Cirium Operator ID, Cirium N/A, Usage Types, Artist / Band Name, Buildings TIV, Contents TIV, Others TIV, Total Insured Value, ORG Process, Zone Exclusion, ATIA Applicable, Belongs to Pool, Pool, Reinsurance Pool, Assets.

## 2. Dates & Restrictions fields ✅

**Visible: all shown.** Inception, Expiry, Receipt, Quote Due, Is HGM, ESG Positive, In Pipeline, Security Required, Coverage Required, Renewable, Renewal Frequency, Renewal Target Date, U/W Action Due, U/W Action Comment, Reset Clause, Reset Clause Date, MCA, Ready for UMCC.

**Not visible: all 9 hidden.** Notice of Cancellation, Notice of Cancellation Date, NOC not applicable, CTE Sublimit, Cancel and Replace, Cancel and Replace date, Cancel and Replace Earned Premium Pattern, Retro, Prior Year Est. Adj. Premium.

## 3. Underwriting Status fields ✅ (except finding 3)

**Visible: all shown.** Placing Office, Referring Office, Underwriter, Modeller, Underwriting, Modelling, Operations, Hotline Outcome, Hotline Date, Post Loss Opportunity, Override, Account Manager, Producer.

- Override isn't shown in view mode (finding 3).

**Not visible: all 9 hidden.** QS Partners (toggle), QS Partners (dropdown), X‑Sell To Recipient, X‑Sell To, Client Credit Rating, Hours toggle switch, Hours dropdown, Reinst. Same Event, Two Risk Warranty.

## 4. Fields with additional visibility conditions

✅ = matches the ticket · ❌ = doesn't match · n/a = can't be exercised in that mode

| Field (section) | Condition | Creating | Editing | Consulting (view) |
| --------------- | --------- | -------- | ------- | ----------------- |
| CBI Consumer (Initial Details) | Placing Office = FIID (Dublin) | ✅ Only for Dublin; updates straight away | ✅ Hidden as soon as the office changes to London | ❌ Shown for London programs |
| Original Insured + client buttons (Initial Details) | Re is on | ✅ | ✅ | ✅ |
| License number (Initial Details) | Surplus Line broker is on | ✅ | ✅ | ❌ Shown when the switch is off |
| MGA Code (Initial Details) | Binder / Line Slip is on | ✅ | n/a (Binder / Line Slip is locked when editing) | ❌ Shown when Binder / Line Slip is off |
| Cancelled (Dates & Restrictions) | Underwriting = any Bound status | ✅ Hidden | ✅ Shown only on Bound | ✅ Shown on Bound, Pre Sign-Off, Signed Off and Expired only |
| % GWP HGM Initiative (Dates & Restrictions) | Is HGM is on | ❌ Visible but disabled when off | ❌ Visible but disabled when off | ❌ Shown when Is HGM is off |
| Modelling Level (Underwriting Status) | Binder / Line Slip is on | ✅ | n/a | ❌ Shown when Binder / Line Slip is off |
| Declinature Reason (Underwriting Status) | Underwriting = Declined or NTU | ✅ Hidden | ✅ Only on Declined and NTU | ❌ Shown on every status |
| Future Opportunity (Underwriting Status) | Underwriting = Declined or NTU | ✅ Hidden | ✅ Only on Declined and NTU | ❌ Shown on every status |
| Rationale (Underwriting Status) | Underwriting = Declined or NTU | ✅ Hidden | ✅ Only on Declined and NTU | ❌ Shown on every status |

**Note:** the app also has a **Declinature/NTU Rationale** field that isn't in the ticket. It behaves like Declinature Reason.

## Next steps

1. **Raise bugs** for findings 1 and 2.
2. **Confirm** whether Override should be hidden in view mode (finding 3).
3. **Ask the BA** whether Declinature/NTU Rationale should be added to the ticket.
4. **Check Bound (Cancelled)** for Cancelled once a Political Risk program with that status exists.
5. **Re-check Tenor Months** once NGUI-1427 is done.
