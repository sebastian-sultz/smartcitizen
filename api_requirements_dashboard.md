# Backend API Requirements — NGO Member Dashboard

> **Purpose**: This document defines all backend API endpoints, database models, request/response contracts, and business rules required by the frontend Member Dashboard. The frontend is being built with mock data that mirrors these exact contracts — when APIs are ready, we swap mock → real with minimal frontend changes.

> **Existing Backend Stack**: Go / Gin / PostgreSQL / GORM / JWT HttpOnly Cookies / Cloudinary / Repository Pattern

---

## Table of Contents

1. [Existing API Summary](#1-existing-api-summary)
2. [Profile Management APIs](#2-profile-management-apis)
3. [Donation Module APIs](#3-donation-module-apis)
4. [Referral Tracking APIs](#4-referral-tracking-apis)
5. [Volunteer Eligibility API](#5-volunteer-eligibility-api)
6. [Support/Ticket System APIs](#6-supportticket-system-apis)
7. [Dashboard Aggregation API](#7-dashboard-aggregation-api)
8. [Database Schema Changes](#8-database-schema-changes)
9. [Business Rules & Validation](#9-business-rules--validation)
10. [Authentication & Authorization](#10-authentication--authorization)

---

## 1. Existing API Summary

These endpoints already exist and are used by the dashboard:

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| `POST` | `/api/auth/login` | User login | No |
| `POST` | `/api/auth/register` | User registration | No |
| `POST` | `/api/auth/forget-password` | Password reset | No |
| `POST` | `/api/auth/refresh` | Token refresh | Cookie |
| `GET` | `/api/auth/profile/me` | Get current user profile | Yes |
| `GET` | `/api/auth/profile/:id` | Get user profile by ID | Yes |
| `PUT` | `/api/auth/profile-photo/:id` | Update profile photo | Yes |
| `GET` | `/api/auth/stats` | System stats (admin only) | Yes (admin) |
| `POST` | `/api/volunteers` | Create volunteer application | Yes |
| `GET` | `/api/volunteers` | List volunteers | Yes |
| `GET` | `/api/volunteers/:id` | Get volunteer by ID | Yes |

---

## 2. Profile Management APIs

### 2.1 Update User Profile

**Endpoint**: `PUT /api/auth/profile/me`
**Auth**: Required (member)
**Purpose**: Allow members to update their personal information.

**Request Body**:
```json
{
  "name": "Ravi Sharma",
  "email": "ravi@email.com",
  "date_of_birth": "1990-05-15",
  "address": "123, Sector 12",
  "city": "New Delhi",
  "district": "South Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "social_links": {
    "linkedin": "https://linkedin.com/in/ravi",
    "twitter": "https://twitter.com/ravi",
    "facebook": ""
  }
}
```

> All fields are optional — only provided fields should be updated (PATCH-style behavior).

**Response** (200):
```json
{
  "message": "profile updated successfully",
  "user": {
    "id": "uuid",
    "name": "Ravi Sharma",
    "phone": "9876543210",
    "email": "ravi@email.com",
    "date_of_birth": "1990-05-15",
    "profile_photo": "https://...",
    "user_type": "member",
    "address": "123, Sector 12",
    "city": "New Delhi",
    "district": "South Delhi",
    "state": "Delhi",
    "pincode": "110001",
    "social_links": {
      "linkedin": "https://linkedin.com/in/ravi",
      "twitter": "https://twitter.com/ravi",
      "facebook": ""
    },
    "total_payments": 5,
    "total_amount": 2500.00,
    "referral_payment_count": 12,
    "total_referrals": 18,
    "referral_id": "GSC-ABC123",
    "created_at": "2026-01-15T10:30:00Z",
    "updated_at": "2026-05-28T12:00:00Z"
  }
}
```

**Validation**:
- `name`: min 2, max 100 characters
- `email`: valid email format (optional)
- `pincode`: 6 digits (optional)
- `phone`: NOT editable through this endpoint (separate flow with OTP required)

> **Database Impact**: Add columns `email`, `date_of_birth`, `address`, `city`, `district`, `state`, `pincode`, `social_links` (JSONB) to the `users` table.

---

## 3. Donation Module APIs

### 3.1 Database Model: `donations`

```sql
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_id VARCHAR(50) UNIQUE NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  purpose VARCHAR(100) NOT NULL,
  payment_method VARCHAR(30),          -- 'upi', 'card', 'netbanking', 'wallet'
  payment_gateway VARCHAR(20),          -- 'razorpay', 'phonepe'
  gateway_order_id VARCHAR(100),
  gateway_payment_id VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending',  -- 'pending', 'success', 'failed', 'refunded'
  receipt_number VARCHAR(50),
  receipt_url VARCHAR(500),
  is_recurring BOOLEAN DEFAULT false,
  recurring_plan_id UUID,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at);
```

### 3.2 Get Donation History

**Endpoint**: `GET /api/donations/me`
**Auth**: Required (member)
**Query Params**:
- `page` (int, default: 1)
- `limit` (int, default: 10, max: 50)
- `status` (string, optional): `success` | `pending` | `failed` | `refunded`
- `from` (date, optional): Start date filter (YYYY-MM-DD)
- `to` (date, optional): End date filter (YYYY-MM-DD)
- `q` (string, optional): Search by transaction_id
- `sort` (string, optional): `created_at` | `amount` (default: `created_at`)
- `order` (string, optional): `asc` | `desc` (default: `desc`)

**Response** (200):
```json
{
  "donations": [
    {
      "id": "uuid",
      "transaction_id": "TRX-829310",
      "amount": 500.00,
      "currency": "INR",
      "purpose": "General Fund",
      "payment_method": "upi",
      "status": "success",
      "receipt_number": "GSCF-2026-0042",
      "receipt_url": "https://...",
      "is_recurring": false,
      "created_at": "2026-05-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "total_pages": 5
  }
}
```

### 3.3 Get Single Donation Detail

**Endpoint**: `GET /api/donations/:id`
**Auth**: Required (must be donation owner)

**Response** (200):
```json
{
  "donation": {
    "id": "uuid",
    "transaction_id": "TRX-829310",
    "amount": 500.00,
    "currency": "INR",
    "purpose": "General Fund",
    "payment_method": "upi",
    "payment_gateway": "razorpay",
    "gateway_order_id": "order_abc123",
    "gateway_payment_id": "pay_xyz789",
    "status": "success",
    "receipt_number": "GSCF-2026-0042",
    "receipt_url": "https://...",
    "is_recurring": false,
    "notes": "",
    "created_at": "2026-05-15T10:30:00Z",
    "updated_at": "2026-05-15T10:30:05Z"
  }
}
```

### 3.4 Get Donation Statistics

**Endpoint**: `GET /api/donations/me/stats`
**Auth**: Required (member)

**Response** (200):
```json
{
  "total_donated": 12500.00,
  "total_transactions": 15,
  "this_year": 5000.00,
  "this_month": 1000.00,
  "average_donation": 833.33,
  "first_donation_date": "2025-03-10T14:20:00Z",
  "last_donation_date": "2026-05-15T10:30:00Z",
  "donor_level": "silver"
}
```

**Donor Level Logic** (suggestion):
- Bronze: ₹0 – ₹999
- Silver: ₹1,000 – ₹9,999
- Gold: ₹10,000 – ₹49,999
- Platinum: ₹50,000+

### 3.5 Get Tax Certificates (80G)

**Endpoint**: `GET /api/donations/me/certificates`
**Auth**: Required (member)

**Response** (200):
```json
{
  "certificates": [
    {
      "id": "uuid",
      "fiscal_year": "2025-2026",
      "total_amount": 8500.00,
      "certificate_number": "80G-GSCF-2026-0042",
      "status": "generated",
      "download_url": "https://...",
      "generated_at": "2026-04-15T00:00:00Z"
    }
  ]
}
```

### 3.6 Get Recurring Donations

**Endpoint**: `GET /api/donations/me/recurring`
**Auth**: Required (member)

**Response** (200):
```json
{
  "recurring_donations": [
    {
      "id": "uuid",
      "amount": 500.00,
      "frequency": "monthly",
      "purpose": "General Fund",
      "status": "active",
      "next_charge_date": "2026-06-15T00:00:00Z",
      "start_date": "2026-01-15T00:00:00Z",
      "total_charged": 2500.00,
      "charges_count": 5
    }
  ]
}
```

---

## 4. Referral Tracking APIs

### 4.1 Database Enhancement

The current `users` table has `referral_id` (the ID of who referred this user), `referral_payment_count`, and `total_referrals`. We need a way to query referred members.

> **Key Insight**: When User B registers with User A's referral code, User B's `referral_id` field stores User A's ID. So to get all members referred by User A, we query `WHERE referral_id = UserA.id`.

No new table needed — we query existing user data differently.

### 4.2 Get Referral Statistics

**Endpoint**: `GET /api/referrals/me/stats`
**Auth**: Required (member)

**Response** (200):
```json
{
  "total_invited": 18,
  "total_joined": 14,
  "total_donated": 8,
  "total_contribution": 6500.00,
  "conversion_rate": 77.78,
  "donation_rate": 57.14,
  "volunteer_eligible": false,
  "eligibility_progress": {
    "referrals_needed": 10,
    "referrals_with_donation_needed": 10,
    "current_referrals": 14,
    "current_referrals_with_donation": 8,
    "steps_completed": 2,
    "total_steps": 3
  }
}
```

### 4.3 Get Referred Members List

**Endpoint**: `GET /api/referrals/me/members`
**Auth**: Required (member)
**Query Params**:
- `page` (int, default: 1)
- `limit` (int, default: 10, max: 50)
- `status` (string, optional): `active` | `inactive`
- `has_donated` (boolean, optional)
- `q` (string, optional): Search by name
- `sort` (string, optional): `created_at` | `total_amount` | `name`
- `order` (string, optional): `asc` | `desc`

**Response** (200):
```json
{
  "members": [
    {
      "id": "uuid",
      "name": "Priya Verma",
      "profile_photo": "https://...",
      "join_status": "active",
      "has_donated": true,
      "total_donation_amount": 1500.00,
      "donation_count": 3,
      "registration_date": "2026-02-20T09:15:00Z",
      "last_activity_date": "2026-05-10T14:30:00Z",
      "membership_status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 14,
    "total_pages": 2
  }
}
```

> **Privacy Note**: Phone numbers and emails of referred members should NOT be exposed through this endpoint. Only show name, photo, and aggregated activity data.

---

## 5. Volunteer Eligibility API

### 5.1 Check Volunteer Eligibility

**Endpoint**: `GET /api/volunteers/eligibility`
**Auth**: Required (member)

**Response** (200):
```json
{
  "is_eligible": false,
  "has_applied": false,
  "application_status": null,
  "criteria": {
    "min_referrals": 10,
    "min_referrals_joined": 10,
    "min_referrals_donated": 10,
    "current_referrals": 14,
    "current_referrals_joined": 14,
    "current_referrals_donated": 8
  },
  "progress_percentage": 80
}
```

When `has_applied` is `true`:
```json
{
  "is_eligible": true,
  "has_applied": true,
  "application_status": "pending",
  "applied_at": "2026-04-01T10:00:00Z",
  "application_id": "uuid",
  "criteria": { ... }
}
```

`application_status` values: `pending` | `approved` | `rejected`

> **Business Rule**: The existing volunteer service checks `ReferralPaymentCount <= 10` but the criteria should be:
> 1. Invited ≥ 10 users (total_referrals ≥ 10)
> 2. Those users successfully joined (registered) — this needs a count query
> 3. Those users completed donations — `referral_payment_count ≥ 10`

---

## 6. Support/Ticket System APIs

### 6.1 Database Model: `support_tickets`

```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  category VARCHAR(30) NOT NULL,          -- 'account', 'donation', 'volunteer', 'technical', 'other'
  subject VARCHAR(200) NOT NULL,
  priority VARCHAR(10) DEFAULT 'medium',  -- 'low', 'medium', 'high'
  status VARCHAR(20) DEFAULT 'open',      -- 'open', 'in_progress', 'resolved', 'closed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_type VARCHAR(10) NOT NULL,       -- 'user' | 'admin'
  sender_id UUID NOT NULL,
  message TEXT NOT NULL,
  attachment_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tickets_user_id ON support_tickets(user_id);
CREATE INDEX idx_tickets_status ON support_tickets(status);
CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
```

### 6.2 Create Support Ticket

**Endpoint**: `POST /api/support/tickets`
**Auth**: Required (member)

**Request Body**:
```json
{
  "category": "donation",
  "subject": "Missing donation receipt for TRX-829310",
  "message": "I made a donation on May 15 but haven't received my receipt...",
  "priority": "medium"
}
```

**Response** (201):
```json
{
  "message": "ticket created successfully",
  "ticket": {
    "id": "uuid",
    "ticket_number": "TKT-20260528-001",
    "category": "donation",
    "subject": "Missing donation receipt for TRX-829310",
    "priority": "medium",
    "status": "open",
    "created_at": "2026-05-28T10:00:00Z",
    "messages": [
      {
        "id": "uuid",
        "sender_type": "user",
        "message": "I made a donation on May 15 but haven't received my receipt...",
        "created_at": "2026-05-28T10:00:00Z"
      }
    ]
  }
}
```

**Ticket Number Format**: `TKT-YYYYMMDD-XXX` (auto-generated, sequential per day)

### 6.3 Get My Tickets

**Endpoint**: `GET /api/support/tickets/me`
**Auth**: Required (member)
**Query Params**:
- `page` (int, default: 1)
- `limit` (int, default: 10)
- `status` (string, optional): `open` | `in_progress` | `resolved` | `closed`

**Response** (200):
```json
{
  "tickets": [
    {
      "id": "uuid",
      "ticket_number": "TKT-20260528-001",
      "category": "donation",
      "subject": "Missing donation receipt for TRX-829310",
      "priority": "medium",
      "status": "open",
      "created_at": "2026-05-28T10:00:00Z",
      "updated_at": "2026-05-28T10:00:00Z",
      "message_count": 3,
      "last_reply_at": "2026-05-28T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 3,
    "total_pages": 1
  }
}
```

### 6.4 Get Ticket Detail

**Endpoint**: `GET /api/support/tickets/:id`
**Auth**: Required (must be ticket owner)

**Response** (200):
```json
{
  "ticket": {
    "id": "uuid",
    "ticket_number": "TKT-20260528-001",
    "category": "donation",
    "subject": "Missing donation receipt for TRX-829310",
    "priority": "medium",
    "status": "in_progress",
    "created_at": "2026-05-28T10:00:00Z",
    "updated_at": "2026-05-28T14:30:00Z",
    "messages": [
      {
        "id": "uuid",
        "sender_type": "user",
        "message": "I made a donation on May 15 but haven't received my receipt...",
        "created_at": "2026-05-28T10:00:00Z"
      },
      {
        "id": "uuid",
        "sender_type": "admin",
        "message": "We're looking into this. Could you share the payment screenshot?",
        "created_at": "2026-05-28T14:30:00Z"
      }
    ]
  }
}
```

### 6.5 Reply to Ticket

**Endpoint**: `POST /api/support/tickets/:id/messages`
**Auth**: Required (ticket owner or admin)

**Request Body**:
```json
{
  "message": "Here is the payment screenshot...",
  "attachment_url": "https://..."
}
```

**Response** (201):
```json
{
  "message": "reply added successfully",
  "ticket_message": {
    "id": "uuid",
    "sender_type": "user",
    "message": "Here is the payment screenshot...",
    "attachment_url": "https://...",
    "created_at": "2026-05-28T15:00:00Z"
  }
}
```

---

## 7. Dashboard Aggregation API

### 7.1 Member Dashboard Summary

**Endpoint**: `GET /api/dashboard/me`
**Auth**: Required (member)
**Purpose**: Single endpoint to fetch all dashboard home screen data in one call (reduces multiple API calls).

**Response** (200):
```json
{
  "profile": {
    "id": "uuid",
    "name": "Ravi Sharma",
    "phone": "9876543210",
    "profile_photo": "https://...",
    "user_type": "member",
    "referral_id": "GSC-ABC123",
    "created_at": "2026-01-15T10:30:00Z"
  },
  "stats": {
    "total_donated": 12500.00,
    "total_referrals": 18,
    "referrals_joined": 14,
    "referrals_donated": 8,
    "total_donations_count": 15,
    "badge_level": "silver",
    "volunteer_status": "not_applied",
    "events_attended": 3
  },
  "recent_activity": [
    {
      "type": "donation",
      "title": "Donated ₹500 to General Fund",
      "timestamp": "2026-05-15T10:30:00Z"
    },
    {
      "type": "referral_joined",
      "title": "Priya Verma joined via your referral",
      "timestamp": "2026-05-12T14:20:00Z"
    },
    {
      "type": "event",
      "title": "Registered for Awareness Program",
      "timestamp": "2026-05-10T09:00:00Z"
    }
  ],
  "upcoming_events": [
    {
      "id": "uuid",
      "title": "Awareness & Guidance Program",
      "date": "2026-07-05T10:00:00Z",
      "location": "Community Hall, Sector 12, Dwarka",
      "category": "Community"
    }
  ],
  "open_tickets_count": 1
}
```

> **Note**: This is an optimization endpoint. The frontend can also fetch data from individual endpoints. This aggregation avoids multiple roundtrips on dashboard load.

---

## 8. Database Schema Changes

### 8.1 `users` Table Additions

```sql
ALTER TABLE users ADD COLUMN email VARCHAR(200);
ALTER TABLE users ADD COLUMN date_of_birth DATE;
ALTER TABLE users ADD COLUMN address TEXT;
ALTER TABLE users ADD COLUMN city VARCHAR(100);
ALTER TABLE users ADD COLUMN district VARCHAR(100);
ALTER TABLE users ADD COLUMN state VARCHAR(100);
ALTER TABLE users ADD COLUMN pincode VARCHAR(10);
ALTER TABLE users ADD COLUMN social_links JSONB DEFAULT '{}';
```

### 8.2 New Tables

- `donations` — See Section 3.1
- `support_tickets` — See Section 6.1
- `ticket_messages` — See Section 6.1
- `recurring_donation_plans` (optional, for Phase 2):

```sql
CREATE TABLE recurring_donation_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(12,2) NOT NULL,
  frequency VARCHAR(20) NOT NULL,     -- 'monthly', 'quarterly', 'yearly'
  purpose VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'cancelled'
  gateway_subscription_id VARCHAR(100),
  next_charge_date TIMESTAMP WITH TIME ZONE,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  total_charged DECIMAL(12,2) DEFAULT 0,
  charges_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 9. Business Rules & Validation

### Donation Rules
- Minimum donation: ₹10
- All amounts in INR
- Donations are voluntary and non-refundable (unless admin policy allows)
- Receipt numbers auto-generated: `GSCF-YYYY-XXXX`
- 80G certificates generated per fiscal year (April 1 – March 31)

### Referral Rules
- Each user gets a unique referral code at registration (already exists as `referral_id`)
- Privacy: Referring users can see referred member names and aggregate data, but NOT phone numbers or emails
- Referral counts should update in real-time when new users register via referral

### Volunteer Eligibility
- Requires: `total_referrals >= 10` AND `referrals_joined >= 10` AND `referral_payment_count >= 10`
- Current backend checks only `ReferralPaymentCount <= 10` — needs expansion to include all 3 criteria
- Once eligible, user can submit one volunteer application
- Application goes through admin review (existing flow)

### Support Tickets
- Max 10 open tickets per user at any time
- Tickets auto-close after 30 days of inactivity
- Priority affects admin dashboard sorting, not SLA

---

## 10. Authentication & Authorization

All new endpoints follow the existing auth pattern:

1. **Middleware**: `middleware.AuthMiddleware()` — validates JWT from `access_token` cookie
2. **User Context**: `c.Get("userID")` and `c.Get("userType")` available after auth
3. **Owner Checks**: Donation, ticket, and referral endpoints must verify the requesting user owns the resource
4. **Admin Endpoints** (future): Admin should also be able to manage tickets via separate admin routes

### Route Registration Pattern

```go
// In main.go, after existing handlers:
donationRepo := donation.NewRepository(db)
donationService := donation.NewService(donationRepo)
donationHandler := donation.NewHandler(donationService)
donationHandler.RegisterRoutes(api)

// Similarly for referral and support modules
```

---

## API Endpoint Summary

| Method | Endpoint | Module | Priority |
|--------|----------|--------|----------|
| `PUT` | `/api/auth/profile/me` | Profile | High |
| `GET` | `/api/donations/me` | Donation | High |
| `GET` | `/api/donations/:id` | Donation | High |
| `GET` | `/api/donations/me/stats` | Donation | High |
| `GET` | `/api/donations/me/certificates` | Donation | Medium |
| `GET` | `/api/donations/me/recurring` | Donation | Low |
| `GET` | `/api/referrals/me/stats` | Referral | High |
| `GET` | `/api/referrals/me/members` | Referral | High |
| `GET` | `/api/volunteers/eligibility` | Volunteer | High |
| `POST` | `/api/support/tickets` | Support | Medium |
| `GET` | `/api/support/tickets/me` | Support | Medium |
| `GET` | `/api/support/tickets/:id` | Support | Medium |
| `POST` | `/api/support/tickets/:id/messages` | Support | Medium |
| `GET` | `/api/dashboard/me` | Dashboard | Medium |
