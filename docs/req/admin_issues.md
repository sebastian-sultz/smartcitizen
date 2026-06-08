# Backend Admin & Security Issue Log

This document lists critical authorization bypasses, data leaks, and workflow gaps identified in the Go backend. These issues must be reviewed and resolved by the backend development team to ensure platform security and data privacy.

---

## 1. Critical Privilege Escalation on Events (Programs)

* **Location:** `backend/router.go` & `backend/modules/event/handler.go`
* **Affected Endpoints:** 
  * `POST /api/events`
  * `PUT /api/events/:id`
  * `DELETE /api/events/:id`
* **Issue:** 
  These endpoints are grouped under `middleware.AuthMiddleware()`, which only validates if a user is logged in. However, the handler functions (`CreateEvent`, `UpdateEvent`, `DeleteEvent`) **do not check the user's role**.
* **Impact:** 
  Any logged-in citizen/member can create, update, or delete any community program or workshop by directly calling these endpoints.
* **Recommended Fix:** 
  Add a role validation helper check in the handlers (e.g., verifying that the claims `userType == "admin"` in the context) or define a separate `AdminMiddleware` for administrative event-management routes.

---

## 2. Event Participants List Privacy Leak

* **Location:** `backend/router.go` & `backend/modules/event/handler.go`
* **Affected Endpoint:** `GET /api/events/:id/users`
* **Issue:** 
  This endpoint returns the registrations list (containing the full names and phone numbers of all registered citizens) for a given event. The route is only protected by generic authentication, and the handler `GetUsersByEventID` performs no role check.
* **Impact:** 
  Any logged-in member can scrape the name and phone number details of all other members registered for any program.
* **Recommended Fix:** 
  Restrict `GetUsersByEventID` to users with `admin` role status.

---

## 3. Volunteer CRUD Security Bypass

* **Location:** `backend/router.go` & `backend/modules/volunteer/handler.go`
* **Affected Endpoints:**
  * `GET /api/volunteers`
  * `PUT /api/volunteers/:id`
  * `DELETE /api/volunteers/:id`
* **Issue:** 
  Guarded only by standard `AuthMiddleware()`. The handlers do not check if the requester is an admin or the owner of the volunteer profile.
* **Impact:** 
  Any member can fetch the entire directory of volunteers, and also modify or delete another user's volunteer profile details.
* **Recommended Fix:** 
  * Restrict `GET /api/volunteers` and `DELETE /api/volunteers/:id` to `admin` users.
  * Restrict `PUT /api/volunteers/:id` to either `admin` users or the specific user whose `userID` matches the volunteer's `user_id`.

---

## 4. Payment History Security Data Leak

* **Location:** `backend/modules/payment/handler.go`
* **Affected Endpoint:** `GET /api/payments/history`
* **Issue:** 
  The handler `GetPaymentHistory` supports filtering results by `userId` via a query parameter for administrative views:
  ```go
  if qUserID := c.Query("userId"); qUserID != "" {
      userID = &qUserID
  }
  ```
  However, it does not check if the requester is an admin before applying this filter.
* **Impact:** 
  Any authenticated citizen can read the private transaction details of any other member in the database by appending `?userId=<other-user-uuid>` to the URL.
* **Recommended Fix:** 
  Only permit the query parameter filter override if `userType == "admin"` is present in the request context.

---

## 5. Publicly Queryable Sensitive Financial Statistics

* **Location:** `backend/router.go`
* **Affected Endpoint:** `GET /api/auth/stats`
* **Issue:** 
  This endpoint returns global platform counts and total financial amounts (`total_amount` donated). It is registered outside of the protected auth route group.
* **Impact:** 
  Platform financial totals can be queried by any unauthenticated anonymous caller.
* **Recommended Fix:** 
  Move `auth.GET("/stats")` to the authenticated `/auth` protected group or restrict it to admin users.

---

## 6. Lack of Volunteer Applicant Review Workflow

* **Location:** `backend/modules/volunteer/model.go` & `backend/modules/volunteer/service.go`
* **Issue:** 
  The `Volunteer` database table does not have an application status column (e.g. `Status` field with states like `Pending`, `Approved`, `Rejected`). When a user applies and meets basic eligibility (referral count threshold), they are immediately registered as active volunteers in the system. The admin can only reject them by completely deleting their database record.
* **Recommended Fix:** 
  Introduce a `status` field (varchar/enum) to the `Volunteer` schema. Let new applications initialize as `Pending` and add an endpoint (e.g. `PUT /api/volunteers/:id/status`) restricted to admins to toggle between `Approved` and `Rejected`.
