# Smart Citizen Foundation API Classification & Documentation

This document categorizes all backend API routes called by the Smart Citizen frontend. It serves as a reference for distinguishing between **Admin-Only**, **Authenticated Member & Admin (Protected)**, and **Public / Non-Protected** API endpoints.

---

## Architecture Overview

The backend uses a router configuration in [router.go](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/backend/router.go) with the following middleware types to enforce access controls:

1. **Public / No Middleware**: Accessible to anyone, including guests.
2. **`OptionalAuthMiddleware`**: Enforces strict parsing of JWT cookies if present (allowing logged-in users to link accounts/actions), but allows anonymous guests to proceed without redirecting.
3. **`AuthMiddleware`**: Restricts access to authenticated sessions, assigning `userID` and `userType` to the request context.
4. **`AdminMiddleware` / Explicit Handler Checks**: Restricts access to users where `userType == "admin"`. If a non-admin requests these resources, a `403 Forbidden` or `401 Unauthorized` is returned.

---

## 1. Admin-Only APIs

These routes are restricted to administrative accounts. Enforced either via `AdminMiddleware` in the router or via explicit role checks inside the Go handlers.

| HTTP Method | Route Endpoint                   | Frontend Function      | File Location                                                                                                                                 | Protection Mechanism                                                 | Description                                              |
| :---------- | :------------------------------- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- | :------------------------------------------------------- |
| **GET**     | `/api/users`                     | `getNonAdminUsers()`   | [frontend/features/admin/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/admin/api.ts)                         | `AuthMiddleware` + Go handler role check                             | Lists all registered, non-admin members.                 |
| **PUT**     | `/api/users/:id/suspend`         | `suspendUser()`        | [frontend/features/admin/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/admin/api.ts)                         | `AuthMiddleware` + Go handler role check                             | Suspends or unsuspends a user account.                   |
| **DELETE**  | `/api/users/:id`                 | `deleteUser()`         | [frontend/features/admin/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/admin/api.ts)                         | `AuthMiddleware` + Go handler role check                             | Deletes a user account.                                  |
| **GET**     | `/api/events/:id/users`          | `getUsersByEventId()`  | [frontend/features/citizen/community/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/community/api.ts) | `AuthMiddleware` + `AdminMiddleware`                                 | Retrieves lists of registered participants for an event. |
| **GET**     | `/api/admin/reports`             | `getAdminReports()`    | [frontend/features/admin/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/admin/api.ts)                         | `AuthMiddleware` + Go handler role check                             | Lists support tickets requiring admin moderation.        |
| **PUT**     | `/api/admin/reports/:id/resolve` | `resolveAdminReport()` | [frontend/features/admin/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/admin/api.ts)                         | `AuthMiddleware` + Go handler role check                             | Resolves and writes resolutions for support tickets.     |
| **POST**    | `/api/events`                    | `createEvent()`        | [frontend/features/citizen/community/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/community/api.ts) | `AuthMiddleware` (Enforced on frontend via Admin role UI protection) | Creates a new volunteer/community event.                 |
| **PUT**     | `/api/events/:id`                | `updateEvent()`        | [frontend/features/citizen/community/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/community/api.ts) | `AuthMiddleware` (Enforced on frontend via Admin role UI protection) | Updates existing event metadata/details.                 |
| **DELETE**  | `/api/events/:id`                | `deleteEvent()`        | [frontend/features/citizen/community/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/community/api.ts) | `AuthMiddleware` (Enforced on frontend via Admin role UI protection) | Deletes an event.                                        |

---

## 2. Authenticated Member & Admin APIs (Protected)

These routes require standard authentication via `AuthMiddleware`. They can be invoked by any logged-in user (e.g. member, volunteer, or admin).

### Auth & Profile

| HTTP Method | Route Endpoint                | Frontend Function      | File Location                                                                                                                                 | Description                                                         |
| :---------- | :---------------------------- | :--------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------ |
| **GET**     | `/api/auth/me`                | `getProfile()`         | [frontend/features/shared/auth/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/auth/api.ts)             | Fetches the authenticated user's account session info.              |
| **PUT**     | `/api/auth/profile-photo/:id` | `updateProfilePhoto()` | [frontend/features/shared/auth/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/auth/api.ts)             | Uploads and updates a user's profile photo to Cloudinary.           |
| **GET**     | `/api/auth/profile/:id`       | `getProfile()`         | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts)                     | Retrieves metadata and details of user profile.                     |
| **GET**     | `/api/users/:id/events`       | `getEventsByUserId()`  | [frontend/features/citizen/community/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/community/api.ts) | Lists events that a specific user has registered for.               |
| **GET**     | `/api/users/:id/referred`     | `getReferredMembers()` | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts)                     | Retrieves a list of users registered via this user's referral code. |

### Event Registration

| HTTP Method | Route Endpoint             | Frontend Function    | File Location                                                                                                                                 | Description                                                                       |
| :---------- | :------------------------- | :------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------- |
| **POST**    | `/api/events/:id/register` | `registerForEvent()` | [frontend/features/citizen/community/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/community/api.ts) | Registers the logged-in user for an event. (Restricted to non-admins in handler). |

### Volunteer Application & Management

| HTTP Method | Route Endpoint              | Frontend Function        | File Location                                                                                                                               | Description                               |
| :---------- | :-------------------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ | :---------------------------------------- |
| **POST**    | `/api/volunteers`           | `createVolunteer()`      | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts)                   | Submits a volunteer application.          |
| **GET**     | `/api/volunteers`           | `getVolunteers()`        | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts)                   | Lists registered volunteers.              |
| **GET**     | `/api/volunteers/:id`       | `getVolunteer()`         | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts)                   | Retrieves details of a volunteer profile. |
| **PUT**     | `/api/volunteers/:id`       | `updateVolunteer()`      | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts)                   | Updates volunteer profile details.        |
| **PUT**     | `/api/volunteers/:id/image` | `updateVolunteerImage()` | [frontend/features/public/volunteer/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/public/volunteer/api.ts) | Updates volunteer profile photo.          |
| **DELETE**  | `/api/volunteers/:id`       | `deleteVolunteer()`      | [frontend/features/public/volunteer/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/public/volunteer/api.ts) | Deletes a volunteer profile.              |

### Support Tickets / Reports

> **Note**: Standard users can only view or message support tickets that they created. Admins can view/message any tickets.
> | HTTP Method | Route Endpoint | Frontend Function | File Location | Description |
> | :--- | :--- | :--- | :--- | :--- |
> | **GET** | `/api/reports` | `getUserReports()` | [frontend/features/shared/reports/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/reports/api.ts) | Lists tickets created by the authenticated user. |
> | **POST** | `/api/reports` | `createReport()` | [frontend/features/shared/reports/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/reports/api.ts) | Creates a support ticket. |
> | **GET** | `/api/reports/:id` | `getReport()` | [frontend/features/shared/reports/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/reports/api.ts) | Fetches the full details of a specific ticket. |
> | **POST** | `/api/reports/:id/messages` | `addReportMessage()` | [frontend/features/shared/reports/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/reports/api.ts) | Sends a message/update within a ticket chat. |
> | **GET** | `/api/reports/:id/messages` | `getReportMessages()` | [frontend/features/shared/reports/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/reports/api.ts) | Retrieves message history for a ticket chat. |

### Payments & Donation History

| HTTP Method | Route Endpoint               | Frontend Function      | File Location                                                                                                             | Description                                            |
| :---------- | :--------------------------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------- |
| **GET**     | `/api/payments/history`      | `getDonationHistory()` | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts) | Retrieves a paginated history of the user's donations. |
| **GET**     | `/api/payments/stats`        | `getDonationStats()`   | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts) | Aggregates stats on total and recurring donations.     |
| **GET**     | `/api/payments/certificates` | `getTaxCertificates()` | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts) | Fetches generated 80G tax certificates.                |

---

## 3. Public / Non-Protected APIs

These routes can be called by anyone (guests and authenticated sessions). They handle authentication, general lists, and payment routing.

| HTTP Method | Route Endpoint                         | Frontend Function                               | File Location                                                                                                                                                                                                                                                         | Protection Mechanism     | Description                                                            |
| :---------- | :------------------------------------- | :---------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :--------------------------------------------------------------------- |
| **POST**    | `/api/auth/register`                   | `registerUser()`                                | [frontend/features/shared/auth/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/auth/api.ts)                                                                                                                                     | None                     | Registers a new citizen account.                                       |
| **POST**    | `/api/auth/login`                      | `loginUser()`                                   | [frontend/features/shared/auth/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/auth/api.ts)                                                                                                                                     | None                     | Logs in and issues JWT tokens in HttpOnly cookies.                     |
| **POST**    | `/api/auth/forget-password`            | `forgetPassword()`                              | [frontend/features/shared/auth/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/auth/api.ts)                                                                                                                                     | None                     | Starts password reset workflow.                                        |
| **POST**    | `/api/auth/refresh`                    | `(Automatic interceptor)`                       | [frontend/lib/axios.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/lib/axios.ts)                                                                                                                                                                   | None                     | Silently refreshes expired access tokens.                              |
| **GET**     | `/api/auth/stats`                      | `getSystemStats()`                              | [frontend/features/shared/auth/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/shared/auth/api.ts)                                                                                                                                     | None                     | Returns total impacts and metrics for landing page.                    |
| **GET**     | `/api/events`                          | `getAllEvents()`                                | [frontend/features/citizen/community/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/community/api.ts)                                                                                                                         | None                     | Retrieves a list of upcoming public events.                            |
| **GET**     | `/api/events/:id`                      | `getEventById()`                                | [frontend/features/citizen/community/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/community/api.ts)                                                                                                                         | None                     | Retrieves event details for public viewing.                            |
| **POST**    | `/api/payments/initiate`               | `initiatePayment()` / `initiatePublicPayment()` | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts) & [frontend/features/public/donation/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/public/donation/api.ts) | `OptionalAuthMiddleware` | Initiates a donation checkout session. Logs guest or user accordingly. |
| **POST**    | `/api/payments/webhook`                | _(Stripe Ingest)_                               | _(Backend Internal Router)_                                                                                                                                                                                                                                           | Stripe Signature Check   | Receives event status notifications from Stripe payment gateway.       |
| **GET**     | `/api/payments/status/:transactionId`  | `getPaymentStatus()`                            | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts)                                                                                                                                             | None                     | Check processing status of checkouts (polling).                        |
| **GET**     | `/api/payments/receipt/:transactionId` | `getReceiptStatus()`                            | [frontend/features/citizen/api.ts](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/api.ts)                                                                                                                                             | None                     | Checks and returns temporary signed URL for receipts.                  |
| **GET**     | `/health`                              | _(System Health)_                               | [backend/router.go](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/backend/router.go)                                                                                                                                                                           | None                     | Checks if the backend server is operational.                           |

in simple language:

Admin-Only APIs:

Access is restricted to admin accounts via role-checks or AdminMiddleware.
Used for listing users (GET /api/users), suspending/deleting users (PUT /api/users/:id/suspend, DELETE /api/users/:id), event moderation registration details (GET /api/events/:id/users), and handling admin ticket reports (GET /api/admin/reports, PUT /api/admin/reports/:id/resolve).
Creation and editing of events (POST /api/events, PUT /api/events/:id, DELETE /api/events/:id) are restricted to the Admin UI in the frontend.

Authenticated Member & Admin APIs (Protected):

Require standard AuthMiddleware session verification.
Used for viewing own profile/history (GET /api/auth/me, GET /api/payments/history, GET /api/payments/stats), updating profiles, volunteer profile adjustments (/volunteers/_), creating support tickets, and chatting (/reports/_).

Public / Non-Protected APIs:

Accessible by guests and logged-in users alike.
Include landing statistics (GET /api/auth/stats), register/login/forget-password endpoints, public event listings (GET /api/events), and payment/receipt handling (POST /api/payments/initiate via OptionalAuthMiddleware(), GET /api/payments/status/:transactionId, and GET /api/payments/receipt/:transactionId).
