# New Requirements and Issue Log

## 1. Smart Citizen ID Generation
- **Status**: Pending Backend Implementation.
- **Description**: The unique `GSCXXXXXX` ID sequence is missing from the backend user schema. It currently defaults to a substring of the UUID on the frontend add slug thing so that i can correctly show the slug as id in frontend.


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