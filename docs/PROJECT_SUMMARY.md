# Global Smart Citizens Foundation (GSCF) — Master Project Summary

> [!NOTE]
> **Project Overview**: This document serves as the authoritative master summary for the **Global Smart Citizens Foundation (GSCF)** project. It details the purpose of every folder, module, service, route, and architecture component in both the backend and frontend.

---

## 📑 Table of Contents
1. [Project Purpose & Core Features](#1-project-purpose--core-features)
2. [Workspace & Directory Mapping ("Which Thing is For Which")](#2-workspace--directory-mapping-which-thing-is-for-which)
3. [User Roles & Permissions](#3-user-roles--permissions)
4. [Backend Module Architecture (Go + Gin + GORM)](#4-backend-module-architecture-go--gin--gorm)
5. [Frontend Architecture (Next.js 16 + React 19)](#5-frontend-architecture-nextjs-16--react-19)
6. [Authentication & Session Flow](#6-authentication--session-flow)
7. [Donation & PhonePe Payment Gateway Flow](#7-donation--phonepe-payment-gateway-flow)
8. [Production Deployment & CI/CD Pipeline](#8-production-deployment--cicd-pipeline)

---

## 1. Project Purpose & Core Features

The **Global Smart Citizens Foundation (GSCF)** is a full-stack digital NGO platform designed to engage citizens in social initiatives, streamline volunteer applications, manage donations with automated 80G tax receipt generation, and track multi-tier referral networks.

### Core Features:
- **Member Registration & Referral Tree**: Citizens register using a 10-digit mobile number and receive a unique referral link (`GSC-XXXXXX`). Downline referral networks and contribution statistics are calculated dynamically.
- **Volunteer Lifecycle Management**: Smart Citizens meeting minimum referral requirements (at least 10 referrals & 10 referred payments) can apply to become official Volunteers. Administrators review and approve/reject/suspend applications.
- **Donations & Automated 80G Tax Certificates**: Donors contribute via **PhonePe Payment Gateway**. Successful donations automatically generate official PDF receipts (with 80G tax exemption details) hosted on Cloudinary.
- **Abuse Reporting & Support Messaging**: Users can submit help/abuse reports, creating real-time multi-message ticket threads with platform Administrators.
- **Admin Dashboard & Compliance**: Dedicated portal for system stats, user suspension, volunteer approval, payment logs, and **Form 10BD CSV exports** for IT tax filing.

---

## 2. Workspace & Directory Mapping ("Which Thing is For Which")

```
smartcitizen/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions CI/CD pipeline (Docker build + EC2 deployment)
├── backend/                    # Go (Gin framework + GORM + PostgreSQL) REST API
│   ├── cmd/                    # Alternative entry points (if any)
│   ├── dto/                    # Data Transfer Objects (Request validation & Response JSON formats)
│   ├── infrastructure/         # Core infrastructure (Database connection & Middleware)
│   ├── modules/                # Domain modules (user, event, volunteer, payment, report, analytics)
│   ├── pkg/                    # Shared utilities (JWT, Cloudinary, PDF Generator, Pagination)
│   ├── main.go                 # Backend server entry point & initialization
│   ├── router.go               # Central API routes registration & middleware mounting
│   ├── Dockerfile              # Production multi-stage Docker build for Go server
│   ├── .env.example            # Backend environment variable template
├── frontend/                   # Next.js 16 (App Router + React 19 + Tailwind CSS v4)
│   ├── app/                    # Next.js App Router pages and layouts
│   ├── components/             # Reusable Design System UI components (Button, Input, Card, Table, etc.)
│   ├── features/               # Modular UI features (auth, citizen, admin, public)
│   ├── lib/                    # Shared utilities & Axios client instance with 401 interceptors
│   ├── store/                  # Client state management (Zustand stores)
│   ├── proxy.ts                # Next.js 16 server-side edge proxy (Route protection & silent refresh)
│   ├── next.config.ts          # Next.js configuration (Rewrites & Cloudinary image domains)
│   ├── Dockerfile              # Production multi-stage Docker build for Next.js app
├── docs/                       # Project documentation
│   ├── PROJECT_SUMMARY.md      # Master summary document (This file)
│   ├── api_classification.md   # API Specification & Endpoint documentation
│   └── DETAILS.md              # Technical PRD & Architecture specifications
```

---

## 3. User Roles & Permissions

| Role | Description | Access Rights |
| :--- | :--- | :--- |
| **Guest** | Unauthenticated site visitor | Browse home, initiatives, events, need-help directory; make guest donations. |
| **Member** (`Smart Citizen`) | Registered citizen | Access Citizen Dashboard, copy referral link, view downline tree, register for events, apply for volunteer status, download 80G tax receipts. |
| **Volunteer** | Verified active community volunteer | Approved by Admin after meeting referral threshold (10 referrals + 10 referred payments). |
| **Admin** | System Administrator (*Constrained to 1 user*) | Access Admin Portal, manage users/volunteers, review reports, export 10BD/CSV payment records, view platform analytics. |

---

## 4. Backend Module Architecture (Go + Gin + GORM)

The backend follows a **Modular Clean Architecture** pattern: `Handler ➔ Service ➔ Repository ➔ GORM Model`.

### Backend Modules:

1. **`backend/modules/user`**:
   - **Model**: `User` struct with unique `phone`, `member_id`, `referral_id`, downline totals, and partial unique index ensuring **only 1 Admin user**.
   - **Key Endpoints**: `/api/auth/register`, `/api/auth/login`, `/api/auth/refresh`, `/api/auth/me`, `/api/admin/users/:id/network`.

2. **`backend/modules/event`**:
   - **Model**: `Event` & `EventRegistration` with composite unique index `(event_id, user_id)` preventing duplicate registrations.
   - **Key Endpoints**: `GET /api/events`, `POST /api/events` (Admin), `POST /api/events/:id/register`.

3. **`backend/modules/volunteer`**:
   - **Model**: `Volunteer` struct with application status (`PENDING`, `APPROVED`, `REJECTED`, `SUSPENDED`).
   - **Key Logic**: Validates referral eligibility upon creation; updates user role (`user_type`) atomically upon Admin approval without demoting system Admins.
   - **Key Endpoints**: `POST /api/volunteers`, `GET /api/admin/volunteers`, `PUT /api/admin/volunteers/:id/status`.

4. **`backend/modules/payment`**:
   - **Model**: `Payment`, `Receipt`, and `ReceiptSequence` (atomic financial year sequence `GSCF/YYYY-YY/XXXX`).
   - **Key Logic**: Integrates with **PhonePe Standard Checkout V2** SDK; verifies PhonePe Webhook callback signatures; generates PDF receipts via Maroto/GoPDF; uploads receipts to Cloudinary.
   - **Key Endpoints**: `POST /api/payments/initiate`, `POST /api/payments/webhook`, `GET /api/admin/payments/export-10bd`.

5. **`backend/modules/report`**:
   - **Model**: `AbuseReport` and `ReportMessage` thread messages.
   - **Key Endpoints**: `POST /api/reports`, `POST /api/reports/:id/messages`, `PUT /api/admin/reports/:id/resolve`.

6. **`backend/modules/analytics`**:
   - Provides aggregated operational summary metrics for the Admin Dashboard.

### Infrastructure & Middleware (`backend/infrastructure/`):
- **`database/database.go`**: PostgreSQL connection setup with GORM and connection pool tuning (`SetMaxOpenConns(25)`, `SetMaxIdleConns(10)`).
- **`middleware/auth.go`**: Validates HTTP-only `access_token` JWT cookie.
- **`middleware/rate_limiter.go`**: Token-bucket IP rate limiter protecting against DDoS (120 req/min global, 15 req/min on `/auth/*`).
- **`middleware/security.go`**: Injects security headers (`X-Frame-Options`, `HSTS`, `X-Content-Type-Options`).
- **`middleware/cors.go`**: Configures CORS origins from `FRONTEND_URL` and `ALLOWED_ORIGINS`.

---

## 5. Frontend Architecture (Next.js 16 + React 19)

The frontend uses Next.js 16 App Router with strict component modularity:

- **`frontend/proxy.ts`**: Edge proxy interceptor natively executed by Next.js 16. Validates JWT access cookies, executes server-side silent token refresh against backend `/auth/refresh` if access token expired, and performs role-based route redirects.
- **`frontend/lib/axios.ts`**: Central Axios client with custom response interceptor. Automatically handles 401 Unauthorized responses by dispatching `auth-session-expired` events and triggering silent token refreshes.
- **`frontend/components/ui/`**: Custom design system components compliant with project rules (`Button`, `Input`, `Card`, `Badge`, `Dialog`, `TableComponent`, `EmptyState`).
- **`frontend/features/`**: Feature-grouped views:
  - `features/shared/auth`: Login forms (`LoginForm`), check-role handling.
  - `features/citizen/`: Citizen profile, referral tree graph, volunteer status card, tax certificates table.
  - `features/admin/`: Admin user table (`UserColumns.tsx`), volunteer lifecycle management, payment export tools.

---

## 6. Authentication & Session Flow

```
┌──────────────┐          1. POST /api/auth/login           ┌─────────────────┐
│ Browser Client│ ─────────────────────────────────────────> │ Go Backend API  │
│              │ <───────────────────────────────────────── │                 │
└──────────────┘    2. Set-Cookie: access_token (15m)        └─────────────────┘
                       Set-Cookie: refresh_token (7d)

┌──────────────┐          3. GET /admin (Page Navigation)    ┌─────────────────┐
│ Browser Client│ ─────────────────────────────────────────> │ Next.js proxy.ts│
│              │                                            │ (Server-side)   │
│              │ <───────────────────────────────────────── │                 │
└──────────────┘      4. Validates access_token cookie       └─────────────────┘
                         & grants access / redirects
```

---

## 7. Donation & PhonePe Payment Gateway Flow

1. **Initiation**: Donor submits amount & details ➔ Backend calls PhonePe `standardcheckout.Pay` API ➔ Returns PhonePe redirect URL.
2. **Payment Completion**: Donor pays on PhonePe ➔ PhonePe redirects donor to `FRONTEND_URL/donation/status?transactionId=...`.
3. **Webhook Processing**: PhonePe sends asynchronous HTTP POST webhook to `/api/payments/webhook` ➔ Backend verifies Basic Auth ➔ Updates `Payment` status to `SUCCESS` ➔ Triggers atomic receipt sequence generation (`GetNextReceiptNumber`).
4. **Receipt & 80G Certificate**: Background goroutine renders official PDF ➔ Uploads to Cloudinary ➔ Updates `Receipt` record with Cloudinary URL. Donors can view and download receipts directly from their dashboard.

---

## 8. Production Deployment & CI/CD Pipeline

- **GitHub Actions (`.github/workflows/deploy.yml`)**:
  - `build-and-push` job: Compiles backend & frontend inside Docker Buildx, pushing tagged production images to **GitHub Container Registry (GHCR)** (`ghcr.io/...`).
  - `deploy` job: SSHs into AWS EC2, pulls updated images from GHCR, and restarts containers via `docker compose up -d --remove-orphans` with **zero downtime**.
