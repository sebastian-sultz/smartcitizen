# Backend API Requirements: NGO Member Dashboard Integration

This document outlines the API endpoints, request/response contracts, and database schema changes required by the frontend team to integrate the completed **NGO Member Dashboard**.

All endpoints should be gated behind JWT authentication (handled via access token cookies).

---

## 1. Database Schema Specifications

### Table: `users` (Extensions)
Add or map the following columns to store profile data:
* `dob` (TEXT/DATE, nullable): Date of birth.
* `address` (TEXT, nullable): Residential address.
* `city` (TEXT, nullable): Resident city.
* `district` (TEXT, nullable): Resident district.
* `state` (TEXT, nullable): Resident state.
* `pincode` (TEXT, nullable): Resident 6-digit postal code.
* `linkedin_url` (TEXT, nullable): LinkedIn URL.
* `twitter_url` (TEXT, nullable): Twitter/X URL.
* `facebook_url` (TEXT, nullable): Facebook URL.
* `volunteer_status` (TEXT, default 'not_applied'): Enum values: `'not_applied'`, `'pending'`, `'approved'`, `'rejected'`.

### New Table: `donations`
Keeps track of direct support transactions:
```sql
CREATE TABLE donations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    transaction_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    purpose TEXT NOT NULL,          -- e.g. 'Environment', 'Education', 'Legal Aid'
    payment_method TEXT NOT NULL,   -- e.g. 'UPI', 'Card', 'NetBanking'
    status TEXT NOT NULL,           -- 'success', 'pending', 'failed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    receipt_url TEXT,
    tax_certificate_url TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### New Table: `recurring_donations`
Stores monthly/annual subscription mandates:
```sql
CREATE TABLE recurring_donations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    frequency TEXT NOT NULL,        -- 'monthly', 'quarterly', 'annually'
    purpose TEXT NOT NULL,
    status TEXT NOT NULL,           -- 'active', 'paused', 'cancelled'
    next_billing_date DATE NOT NULL,
    payment_method TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### New Table: `tax_certificates`
Organizes yearly 80G tax benefit slips:
```sql
CREATE TABLE tax_certificates (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    fiscal_year TEXT NOT NULL,      -- e.g. 'FY 2025-2026'
    amount INTEGER NOT NULL,
    status TEXT NOT NULL,           -- 'generated', 'pending'
    download_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### New Table: `support_tickets`
Logs communication help logs:
```sql
CREATE TABLE support_tickets (
    id TEXT PRIMARY KEY,
    ticket_id TEXT UNIQUE NOT NULL, -- e.g. 'SC-4829'
    user_id TEXT NOT NULL,
    category TEXT NOT NULL,         -- 'account', 'donation', 'volunteer', 'technical', 'other'
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL,          -- 'low', 'medium', 'high'
    status TEXT NOT NULL,           -- 'open', 'in_progress', 'resolved', 'closed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);
```

### New Table: `ticket_messages`
Stores chat logs inside support tickets:
```sql
CREATE TABLE ticket_messages (
    id TEXT PRIMARY KEY,
    ticket_id TEXT NOT NULL,
    sender TEXT NOT NULL,           -- 'user', 'agent'
    sender_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(ticket_id) REFERENCES support_tickets(id)
);
```

---

## 2. API Endpoint Protocols

### 2.1 Dashboard Stats & Timeline

#### `GET /api/citizen/stats`
Returns general dashboard KPI counts for the current logged-in user.
* **Response `200 OK`**:
```json
{
  "totalDonated": 4500,
  "totalReferrals": 12,
  "campaignsJoined": 3,
  "badgeLevel": "Level 2 (Regular)",
  "eventsAttended": 2,
  "volunteerStatus": "approved"
}
```

#### `GET /api/citizen/activities`
Retrieves timeline logs.
* **Response `200 OK`**:
```json
[
  {
    "id": "act_1",
    "type": "donation",
    "title": "Donation Processed Successfully",
    "description": "Contributed ₹1,500 towards the Juhu Tree Plantation Drive.",
    "date": "2026-05-18T10:30:00Z"
  }
]
```

---

### 2.2 Profile Management

#### `GET /api/citizen/profile`
Retrieves extended personal credentials.
* **Response `200 OK`**:
```json
{
  "id": "usr_92810",
  "name": "Ravi Sharma",
  "email": "ravi.sharma@example.com",
  "phone": "9876543210",
  "dob": "1994-08-12",
  "userType": "member",
  "memberId": "SC-E8F91B",
  "joinDate": "2026-01-15T00:00:00Z",
  "status": "active",
  "address": "402, Sea Breeze, Carter Road",
  "city": "Mumbai",
  "district": "Mumbai Suburban",
  "state": "Maharashtra",
  "pincode": "400050",
  "linkedinUrl": "https://linkedin.com/in/ravisharma",
  "twitterUrl": "https://x.com/ravisharma",
  "facebookUrl": ""
}
```

#### `PUT /api/citizen/profile`
Updates optional fields (dob, address, city, state, pincode, social URLs).
* **Request JSON**:
```json
{
  "address": "402, Sea Breeze, Carter Road",
  "city": "Mumbai",
  "district": "Mumbai Suburban",
  "state": "Maharashtra",
  "pincode": "400050",
  "linkedinUrl": "https://linkedin.com/in/ravisharma"
}
```
* **Response `200 OK`**: Returns the complete updated profile object.

---

### 2.3 Donations System

#### `GET /api/citizen/donations`
Query parameters (optional): `status` (success/pending/failed), `purpose`, `search` (transaction ID).
* **Response `200 OK`**:
```json
[
  {
    "id": "don_8829",
    "transactionId": "TRX-829310",
    "amount": 1500,
    "purpose": "Tree Plantation Campaign",
    "paymentMethod": "UPI (GPay)",
    "status": "success",
    "date": "2026-05-18T10:30:00Z",
    "receiptUrl": "/receipts/TRX-829310.pdf",
    "taxCertificateUrl": "/certificates/FY2026_TRX-829310.pdf"
  }
]
```

#### `GET /api/citizen/donations/stats`
* **Response `200 OK`**:
```json
{
  "lifetimeDonated": 4500,
  "donatedThisYear": 3000,
  "donatedLastMonth": 1500,
  "totalTransactions": 3,
  "averageAmount": 1500,
  "donorLevel": "Silver"
}
```

#### `GET /api/citizen/donations/recurring`
* **Response `200 OK`**: Array of recurring mandates.

#### `DELETE /api/citizen/donations/recurring/:id`
Cancels the specified active mandate.
* **Response `200 OK`**: `{"success": true, "message": "Mandate cancelled."}`

#### `GET /api/citizen/donations/tax-certificates`
* **Response `200 OK`**: Array of fiscal tax slips.

---

### 2.4 Referrals System

#### `GET /api/citizen/referrals/stats`
* **Response `200 OK`**:
```json
{
  "totalInvited": 15,
  "joinedCount": 12,
  "activeDonorsCount": 4,
  "totalContributionGenerated": 12500,
  "referralCode": "GSC-RAVI94",
  "referralLink": "https://gscf.org/join?ref=GSC-RAVI94"
}
```

#### `GET /api/citizen/referrals/members`
* **Response `200 OK`**: List of referred users showing their current join status.

---

### 2.5 Volunteer Gating

#### `GET /api/citizen/volunteer/eligibility`
Checks eligibility counts for volunteer gating checklist.
* **Response `200 OK`**:
```json
{
  "invitedCount": 15,
  "joinedCount": 12,
  "donatedCount": 4,
  "isEligible": true,
  "requiredInvited": 10,
  "requiredJoined": 10,
  "requiredDonated": 1
}
```

#### `POST /api/citizen/volunteer/apply`
Lodge coordination application (under `/volunteers` endpoint).
* **Request JSON**:
```json
{
  "profession": "Software Engineer",
  "experience": "Coordinated beach cleanups with Rotaract club in college",
  "availability": "weekends",
  "interest": "environment",
  "workType": "field",
  "motivation": "Want to drive environmental cleanup assemblies in Mumbai Suburban area"
}
```
* **Response `201 Created`**: `{"success": true, "message": "Application lodged for review."}`

---

### 2.6 Help Desk Support

#### `GET /api/citizen/support/tickets`
* **Response `200 OK`**: List of support tickets.

#### `POST /api/citizen/support/tickets`
Lodges a new support issue.
* **Request JSON**:
```json
{
  "category": "donation",
  "subject": "Tax Certificate Issue",
  "description": "80G slip for FY 2025-2026 is missing in the dashboard.",
  "priority": "low"
}
```
* **Response `201 Created`**: Returns the newly logged `SupportTicket` object.

#### `POST /api/citizen/support/tickets/:id/reply`
Posts a new discussion reply to a ticket thread.
* **Request JSON**:
```json
{
  "content": "Thank you for the quick response. The receipt details are correct."
}
```
* **Response `200 OK`**: Returns the updated ticket object containing the new message.
