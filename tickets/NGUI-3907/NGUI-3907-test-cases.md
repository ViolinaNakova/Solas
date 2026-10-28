# NGUI-3907 — API Test Cases: Specialty layer save with null Inception / Expiry / PrimaryLimit

**Created:** 2026-10-26 · **Cases:** 7 · **Source:** Jira description + AC

**Endpoint:** UW API `POST UWSub/SpecialtyLayerNew` (calls Prequel API `POST api/submissions/programs/specialty-layers`). DB table: `[Data].[Layers_t]`.

**Before you start:** open Swagger (TC-001) and check if `Inception`, `Expiry` and `PrimaryLimit` are **required** or **optional**:
- **Required** → run TC-002, skip TC-003.
- **Optional** → run TC-003, skip TC-002.

"Valid body" below = a request body for an existing Specialty program layer with all fields filled.

---

#### TC-NGUI-3907-001 — Swagger: both APIs agree on field types
Priority: High · Category: Contract · References: AC 2/3, AC 4

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Open both endpoints in Swagger (UW API and Prequel API).<br>2. Compare `Inception`, `Expiry`, `PrimaryLimit`. | Both APIs agree: the fields are required in both, or optional (nullable) in both. |
| 2 | 1. Open both endpoints in Swagger (UW API and Prequel API).<br>2. Compare `LayerBasisId`, `PeriodBasisId`, `PlacingBasisId`, `TurbineModelId`. | Same type in both APIs (e.g. both int32). |

#### TC-NGUI-3907-002 — Required fields: missing value returns 400
Priority: High · Category: Validation · References: AC 1, AC 2

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Valid body with `Inception` = `null`.<br>2. Send the request. | 400 with a message that `Inception` is required. Layer unchanged in DB. |
| 2 | 1. Valid body with `Expiry` = `null`.<br>2. Send the request. | 400 with a message that `Expiry` is required. Layer unchanged in DB. |
| 3 | 1. Valid body with `PrimaryLimit` = `null`.<br>2. Send the request. | 400 with a message that `PrimaryLimit` is required. Layer unchanged in DB. |
| 4 | 1. Valid body for 2 layers; layer 2 has `Expiry` = `null`.<br>2. Send the request. | 400 with a message that `Expiry` is required for layer 2. Neither layer is saved. |

#### TC-NGUI-3907-003 — Optional fields: missing value is saved as NULL
Priority: High · Category: Functional · References: AC 1, AC 3

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Valid body with `Inception` = `null`.<br>2. Send the request. | 200. Inception is NULL in DB. |
| 2 | 1. Valid body with `Expiry` = `null`.<br>2. Send the request. | 200. Expiry is NULL in DB. |
| 3 | 1. Valid body with `PrimaryLimit` = `null`.<br>2. Send the request. | 200. PrimaryLimit is NULL in DB (not 0). |
| 4 | 1. Valid body with all three = `null`.<br>2. Send the request.<br>3. GET the program layers. | 200 on save. GET returns the layer with the three fields `null` (no 500). |

#### TC-NGUI-3907-004 — Full layer still saves
Priority: High · Category: Functional · References: AC 1

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Valid body with new `Inception`, `Expiry` and `PrimaryLimit`.<br>2. Send the request. | 200. New values stored in DB. |

#### TC-NGUI-3907-005 — Clearing a value on an existing layer
Priority: High · Category: Validation · References: AC 1–3

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Layer with PrimaryLimit filled; valid body with `PrimaryLimit` = `null`.<br>2. Send the request. | Never 500.<br>If required: 400, old value kept in DB.<br>If optional: 200, value is now NULL in DB. |

#### TC-NGUI-3907-006 — Lookup ID above int32 max
Priority: Medium · Category: Edge Case · References: AC 4

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Valid body with `LayerBasisId` = `2147483648`.<br>2. Send the request.<br>3. Repeat for `PeriodBasisId`, `PlacingBasisId`, `TurbineModelId`. | 400 naming the field each time (not 500). Nothing saved. |

#### TC-NGUI-3907-007 — Wrong data type returns 400
Priority: Medium · Category: Validation · References: AC 1, AC 2

| # | Step | Expected Result |
| --- | --- | --- |
| 1 | 1. Valid body with `Inception` = `"abc"`.<br>2. Send the request. | 400 naming `Inception`. No stack trace or internal names (e.g. `PrequelApiClientException`) in the response. |
| 2 | 1. Valid body with `PrimaryLimit` = `"abc"`.<br>2. Send the request. | 400 naming `PrimaryLimit`. No internal details in the response. |

---

## Open questions

1. Are `Inception`, `Expiry` and `PrimaryLimit` required or optional after the fix?
2. If required: what does the 400 error message look like?
3. Lookup IDs: aligned to int or long? If long, TC-006 may not return 400.
