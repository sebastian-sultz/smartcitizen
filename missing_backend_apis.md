# Missing Backend Payment Endpoints

The frontend requires the following two API endpoints to be implemented on the backend payment module. Currently, the frontend is configured to call these endpoints directly.

---

### 1. Retrieve User Donation Statistics
* **Route**: `GET /api/payments/stats`
* **Auth**: Required (`AuthMiddleware()`)
* **Purpose**: Fetch aggregated donation stats for the authenticated user to display on the Member Dashboard KPI cards.
* **Success Response (`200 OK`)**:
  ```json
  {
    "lifetimeDonated": 25000,
    "donatedThisYear": 10000,
    "donatedLastMonth": 5000,
    "totalTransactions": 5,
    "averageAmount": 5000,
    "donorLevel": "Gold"
  }
  ```
  *(Note: monetary values should be returned in standard currency units, e.g. INR/Rupees, or documented if returned in paise so frontend can scale them accordingly).*

---

### 2. Retrieve Tax Certificates List
* **Route**: `GET /api/payments/certificates`
* **Auth**: Required (`AuthMiddleware()`)
* **Purpose**: Fetch the list of generated 80G tax certificates/slips for the authenticated user's tax dashboard.
* **Success Response (`200 OK`)**:
  ```json
  {
    "certificates": [
      {
        "id": "cert-2026",
        "fiscalYear": "FY 2026-27",
        "amount": 25000,
        "status": "generated",
        "downloadUrl": "/api/payments/certificates/cert-2026/download"
      }
    ]
  }
  ```
