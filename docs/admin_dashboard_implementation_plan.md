# NGO Admin Dashboard - Complete Implementation Plan

This document outlines the complete implementation plan for extending the Coordinator Admin Portal. It addresses all gaps in **Donation Management**, **Member & Volunteer Lifecycles**, and **Network Hierarchy tracking** for the network-driven NGO platform.

---

## 1. Backend Implementation

All administrative API endpoints must require authentication via the Go backend's `middleware.AuthMiddleware()` and `middleware.AdminMiddleware()` to guarantee security.

### 💳 A. Donation & Payment Management

1. **Global Donation History Endpoint**
   * **Route:** `GET /api/payments/history` (Modify existing endpoint in [handler.go](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/backend/modules/payment/handler.go#L85))
   * **Behavior:** Check the `userType` of the caller.
     * If the user is an **Admin**, retrieve payments globally (do not filter by the admin's personal user ID).
     * Allow filtering by a specific `userId` query parameter if the admin is auditing a single member.
     * If the user is a **Member**, restrict results strictly to their own payment record.
   * **Query Capabilities:** Update the GORM repository query in `ListPayments` to support:
     * **Search:** Matches `merchant_order_id`, `provider_reference_id`, or `donor_name` (case-insensitive).
     * **Filters:**
       * `status`: Filter by payment status (`SUCCESS`, `PENDING`, `FAILED`).
       * `taxExemption`: Boolean filter for payments where `donor_pan` is present (tax-eligible) vs. absent.
       * `startDate` & `endDate`: Filter by transaction timestamp ranges.
     * **Sorting:** Order by `created_at` or `amount` in ascending/descending order.
     * **Pagination:** Standard `limit` and `page` parameters.

2. **CSV Data Export Endpoint**
   * **Route:** `GET /api/admin/payments/export`
   * **Behavior:** Applies the same query filters (search, status, date range) and streams a CSV file.
   * **CSV Fields:** `Transaction ID`, `Order ID`, `Donor Name`, `Email`, `Phone`, `PAN`, `Address`, `Amount (INR)`, `Status`, `Payment Mode`, `Date Created`, `Receipt Number`.

3. **Form 10BD Government Compliance Export Endpoint**
   * **Route:** `GET /api/admin/payments/export-10bd`
   * **Parameters:** `financialYear` (e.g. `2025-2026`).
   * **Behavior:** Queries all successful (`SUCCESS`) transactions within the specified fiscal year (April 1st to March 31st) where the donor PAN is present.
   * **CSV Output Layout (Strict government portal structure):**
     * **Serial Number:** Sequential number (1, 2, 3...)
     * **Pre-acknowledgement Number:** Leave empty (default placeholder)
     * **ID Code:** `1` (denoting PAN)
     * **Unique Identification Number:** Donor PAN
     * **Section Code:** `Section 80G`
     * **Donation Type:** `Others` (standard category)
     * **Mode of Receipt:** Dynamic mapping based on transaction: `Electronic` (for Netbanking, Card, UPI) or `Cash` / `Others`
     * **Amount of Donation (INR):** Transaction amount

---

### 🕸️ B. Member Referral & Network Hierarchy

1. **Recursive Downline Retrieve API**
   * **Route:** `GET /api/admin/users/:id/network`
   * **Behavior:** Fetches a paginated list of all members referred by the given user. 
   * **Downline Search:** Support fetching immediate Level 1 children, or recursively generating a complete list of members in their downline tree.
   * **Response Payload:**
     ```json
     {
       "userId": "uuid-string",
       "referrals": [
         {
           "id": "child-uuid",
           "name": "Member Name",
           "phone": "Mobile",
           "level": 1,
           "totalDirectDonations": 5000.00,
           "totalNetworkDonations": 125000.00,
           "joinedAt": "timestamp"
         }
       ]
     }
     ```

2. **Recursive Network Metrics Calculation**
   * **Route:** `GET /api/admin/users/:id/network-stats`
   * **Behavior:** Recursively traverses the referral graph to calculate total fundraising metrics for a coordinator's network.
   * **Calculation Logic:**
     * **Direct Referrals Count:** Immediate Level 1 children count.
     * **Total Downline Count:** Total size of the recursive referrer tree.
     * **Direct Referral Donation Amount:** Total amount donated directly by Level 1 referrals.
     * **Total Network Donation Amount:** Total sum of all successful donations made by the user's entire recursive downline network.

---

### 🤝 C. Volunteer Application Lifecycle

1. **Database Schema Update**
   * Update the `Volunteer` GORM model in the database ([model.go](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/backend/modules/payment/model.go) or equivalent) to transition from flat tables to an status state tracking:
     * Add `Status` field (Type: `string`, default: `PENDING`).
     * Status values: `PENDING` (needs review), `APPROVED` (active volunteer/public search visibility enabled), `REJECTED` (application rejected), `SUSPENDED` (temporarily hidden from public search).

2. **Status Update Endpoint**
   * **Route:** `PUT /api/admin/volunteers/:id/status`
   * **Payload:** `{"status": "APPROVED" | "REJECTED" | "SUSPENDED"}`
   * **Logic:** Updates the status. If approved, the volunteer profile is marked eligible for the public "Need Help" matching directory.

3. **Admin Profile Modification Endpoint**
   * **Route:** `PUT /api/admin/volunteers/:id/profile`
   * **Behavior:** Allows coordinators to override public consent flags, update volunteer category tags (e.g., Doctor, Lawyer), or add administrative review notes.

---

### 📈 D. NGO Operations & Analytics

1. **Operational Summary Endpoint**
   * **Route:** `GET /api/admin/analytics`
   * **Metrics Returned:**
     * **Registration Growth:** Counts of members joined grouped by month for the past 12 months.
     * **Donation Growth:** Totals donated (in INR) grouped by month.
     * **Geographic Segmentation:** Total members and total donations grouped by Pincode, City, and District.
     * **Volunteer Activity:** Split counts of volunteers by category (Education, Medical, Legal) and status.
     * **Receipt Generation Stats:** Count of success payments where a PDF receipt has been generated vs. pending/failed generations.

---

## 2. Frontend Implementation

All custom components must utilize standard design library tokens and comply with tailwind guidelines.

### 🏠 A. Shell Navigation Update
* **File:** [Sidebar.tsx](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/admin/shell/Sidebar.tsx)
* **Addition:** Add two new items to `navItems`:
  ```typescript
  { title: "Donation Audit", href: "/admin/donations", icon: <CreditCard className="w-5 h-5" /> },
  { title: "Network Tree", href: "/admin/networks", icon: <GitFork className="w-5 h-5" /> }
  ```

---

### 💳 B. Donation Audit Center (`/admin/donations`)
* **Page Layout:** A full-width layout with search and filter inputs on top and a paginated table.
* **Filter Bar:**
  * Search input (UTR ID / Order ID / Donor Name).
  * Status Select (Success, Pending, Failed).
  * Tax Eligible Select (Yes, No - checks PAN presence).
  * Date Pickers (Start and End dates).
  * **"Export CSV" Button:** Downloads raw transaction log CSV.
  * **"Export Form 10BD" Button:** Opens a modal dialog prompting the admin for the "Financial Year" (e.g. `2025-2026`) and calls the corresponding backend compliance endpoint to download the formatted government CSV.
* **Data Table:**
  * Columns: Date, Donor Name, Amount (₹), Payment Mode, UTR / Gateway Reference, Status (colored badge), Receipt Status (e.g., Compiled/Pending).
  * Row Actions: A "View details" eye icon opening a modal containing metadata, transaction payloads, and a manual download button for the generated receipt.

---

### 🕸️ C. Member Network Tree Inspector
1. **Network Directory Page (`/admin/networks`)**
   * Displays a table of all active coordinators. Clicking a coordinator opens a hierarchical tree or nested collapsible list displaying their referrals.
2. **User Profile Modal Extensions (`UserDetailModal.tsx`)**
   * Replace the current static metadata list with a tabbed panel:
     * **Tab 1: Profile Info** (shows standard metadata).
     * **Tab 2: Donations List** (displays a paginated table of all donations made directly by the user).
     * **Tab 3: Downline Network** (lists all referred members with signup dates, direct donations, and their downline size).
     * **Tab 4: Network Impact** (displays total direct referrals, recursive network size, and total fundraising metrics accumulated across their network).

---

### 🤝 D. Volunteer Lifecycle Management
* **Volunteer Application Table (`VolunteerAppsTable.tsx`)**
  * Display a dynamic status badge based on the volunteer's lifecycle status:
    * `Pending` (yellow badge)
    * `Approved` (green badge)
    * `Suspended` (orange badge)
* **Application Actions:**
  * Add "Approve" (check icon) and "Suspend" (pause icon) buttons.
  * Clicking "Approve" transitions their profile status to active and updates their status immediately without reloading.
  * Clicking "Reject" or "Suspend" opens a confirmation modal before modifying the record.
* **Detail Modal:** Includes editable fields for administrators to update categorization, expertise tags, and admin notes.

---

### 📈 E. Visual NGO Analytics Dashboard (`/admin`)
* **Analytics Upgrades:** Replace flat cards with charts.
* **Charts Panel:**
  * **Monthly Contributions Chart:** A line chart showing monthly donation totals.
  * **User Onboarding Chart:** A bar chart displaying user registration growth over time.
  * **Geographic Segmentation Table:** A table sorting the most active regions by zip code, city, and volume of members.
  * **Receipt Audit Alerts:** A warning box identifying any successful transactions where PDF receipt compilation failed, allowing admins to trigger manual regenerations.
