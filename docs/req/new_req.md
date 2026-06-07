# New Requirements and Issue Log

## 1. Smart Citizen ID Generation
- **Status**: Pending Backend Implementation.
- **Description**: The unique `GSCXXXXXX` ID sequence is missing from the backend user schema. Currently, it defaults to a client-side substring of the UUID.
- **Recommended Approach**: Add a dedicated, unique `citizen_id` or `referral_code` column/field to the backend `User` table, automatically generated as `GSCXXXXXX` (where XXXXXX is sequential) during user registration. This field should be returned in `UserResponse` and consumed directly by the frontend for referral sharing and ID visualization.


## 3. Contact Enquiry Form (Section 8 / 22)
- **Status**: Pending Backend Implementation.
- **Description**: The frontend landing page contact form is currently a mocked UI and does not connect to any active endpoint.

## 4. Reports API 500 Error (`GET /api/reports`)
- **Status**: Active Bug (Not Fixed / Reverted).
- **Description**: The `/api/reports` endpoint returns a `500 Internal Server Error` (with error message `"invalid user ID type in context"`).
- **Cause**: The authentication middleware ([auth.go](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/backend/infrastructure/middleware/auth.go#L32)) stores the context key `"userID"` as a `string` (`claims.UserID.String()`), while the handlers in [handler.go (report)](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/backend/modules/report/handler.go) attempt to type-assert it directly to `uuid.UUID` (e.g. `userIDRaw.(uuid.UUID)`). This type mismatch causes the handler to fail and return a `500` status.

## 5. User ID Context Inconsistencies (UUID vs. String)

- **Context & Resolution**:
  - **Key Naming**: Verified that the context key is consistently `"userID"` across all backend handlers and middleware.
  - **Type Standard**: Stored consistently as a `string` (`claims.UserID.String()`) inside the authentication middleware ([auth.go](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/backend/infrastructure/middleware/auth.go#L32)).
  - **Handler Assertions**: Updated all report handlers and payment handlers to safely assert the context value as a `string` (`ok := val.(string)`) and parse it using `uuid.Parse(idStr)` where a database UUID query is required. This completely resolves the runtime panic and type mismatch errors.

## 6. Volunteer Directory — Backend Filter Enhancement (`GET /api/volunteers`)
- **Status**: Pending Backend Implementation.
- **Description**: The `GET /api/volunteers` endpoint currently supports full-text search via `?q=` query param (searches across `name`, `profession`, `experience`, `city`, `district`, `address`). However, the frontend Need Help directory also provides **category (profession) filter** and **location (city) filter** as discrete dropdowns. These are currently applied client-side only after fetching all volunteers.
- **Required Backend Changes**:
  - Add `?profession=<value>` query parameter support to filter volunteers by exact profession match (case-insensitive `ILIKE`).
  - Add `?city=<value>` query parameter support to filter volunteers by city (case-insensitive `ILIKE`).
  - Both params should be composable with the existing `?q=` search param and pagination.
- **Files to Update**:
  - [`backend/modules/volunteer/repository.go`](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/backend/modules/volunteer/repository.go) — Add `profession` and `city` filter conditions to the `FindAll` GORM query.
  - [`backend/modules/volunteer/service.go`](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/backend/modules/volunteer/service.go) — Pass filter params from handler to repository.
  - [`backend/modules/volunteer/handler.go`](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/backend/modules/volunteer/handler.go) — Read `c.Query("profession")` and `c.Query("city")` and pass them to the service.
  - [`frontend/features/public/volunteer/api.ts`](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/public/volunteer/api.ts) — Add `profession` and `city` optional params to `getAllVolunteers()`.
  - [`frontend/features/public/need-help/components/NeedHelpDirectory.tsx`](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/public/need-help/components/NeedHelpDirectory.tsx) — Move filtering from client-side `Array.filter()` to passing params in the API call.

## 7. Tax Certificates API Endpoint (`GET /api/payments/certificates`)
- **Status**: Pending Backend Implementation.
- **Description**: The frontend member donations page attempts to fetch a list of 80G tax certificates using the endpoint `GET /api/payments/certificates`. This endpoint is not registered on the backend router and needs implementation.
- **Required Backend Changes**: Add a route `/certificates` to the protected payments group in `backend/router.go` and implement dynamic generation or listing in `backend/modules/payment/`.

## 8. Pagination Offset and Limit Parameter Support (`GET /api/payments/history`)
- **Status**: Pending Backend Implementation.
- **Description**: The backend pagination utility and handlers currently read `page` and `limit` query parameters, but standard API requirements align towards `offset` and `limit`. The frontend history pagination calls have been updated to send `offset` and `limit`. The backend should be updated to accept `offset` directly as a parameter and query the DB accordingly.