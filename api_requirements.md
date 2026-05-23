# API Gaps & Requirements: Frontend Dynamic Integration

This document outlines the API gaps between the React/Next.js frontend and the Go/Gin backend of the **Global Smart Citizen Foundation** platform. Implementing these endpoints and database schemas in the backend will allow the platform to transition from static mock data to a completely dynamic web application.

---

## 1. Executive Summary of API Gaps

The Go backend currently supports three core modules:
1. **User/Auth (`/api/auth`)**: Register, Login, Forget Password, Refresh Token, Profile (Me), Profile Photo Upload, and System Stats.
2. **Events (`/api/events`)**: CRUD operations, Event image uploads.
3. **Volunteers (`/api/volunteers`)**: Volunteer registration, details, updates, image uploads, deletion.

However, several advanced features on the frontend (including parts of the admin dashboard, user directories, and donation system) currently rely on hardcoded states or mock mockups.

The following modules must be implemented in the backend to ensure a 100% dynamic application.

---

## 2. Detail of Required Modules & Endpoints

### A. Donation & Tax Benefit (80G) Module
* **Frontend Component**: [DonationForm.tsx](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/donation/components/DonationForm.tsx), [ContributionHistory.tsx](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/citizen/components/ContributionHistory.tsx)
* **Current Status**: Submissions wait for a 2-second timeout and show a mock success UI. Past transactions in the citizen dashboard are static.
* **Backend Database Gaps**: No table for donations, payment history, or receipt records.
* **Proposed Schema**:
  ```sql
  CREATE TABLE donations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Nullable for guest donations
      donor_name VARCHAR(255) NOT NULL,
      donor_email VARCHAR(255) NOT NULL,
      donor_phone VARCHAR(20) NOT NULL,
      amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
      payment_mode VARCHAR(50) NOT NULL, -- IMPS, PhonePe, GooglePay, Paytm, etc.
      transaction_id VARCHAR(100) UNIQUE NOT NULL, -- UTR / Reference
      pan_number VARCHAR(10), -- Mandatory for 80G tax benefit receipt
      receipt_url VARCHAR(512), -- Cloudinary URL for payment receipt upload
      receipt_public_id VARCHAR(255),
      status VARCHAR(20) DEFAULT 'Pending', -- Pending, Verified, Rejected
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  ```
* **Required Endpoints**:
  1. `POST /api/donations`
     - **Access**: Guest or Authenticated Citizen.
     - **Payload (Multipart Form)**:
       ```json
       {
         "name": "Rajesh Kumar",
         "email": "rajesh@example.com",
         "mobileNumber": "9876543210",
         "amount": 5000,
         "paymentMode": "IMPS",
         "transactionId": "UTR123456789",
         "pan": "ABCDE1234F"
       }
       ```
       Plus optional file upload for the receipt image/PDF.
     - **Response**: `201 Created` with created donation ID and status.
  2. `GET /api/donations/my`
     - **Access**: Authenticated Citizen.
     - **Response**: List of logged-in user's past donations for the history view.
  3. `GET /api/admin/donations`
     - **Access**: Admin only.
     - **Query params**: `?status=Pending&search=Rajesh` (supports pagination).
     - **Response**: List of all donations for admin review.
  4. `PUT /api/admin/donations/:id/status`
     - **Access**: Admin only.
     - **Payload**: `{"status": "Verified"}` or `{"status": "Rejected"}`.
     - **Response**: Updated donation object.
  5. `GET /api/donations/:id/receipt`
     - **Access**: Authenticated owner or Admin.
     - **Response**: PDF download containing official 80G Tax Exemption receipt details.

---

### B. Awareness Campaigns Module
* **Frontend Component**: [AwarenessList.tsx](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/awareness/components/AwarenessList.tsx), [CampaignsTable.tsx](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/admin/components/CampaignsTable.tsx)
* **Current Status**: Lists campaigns from a static array (`mockActivities`) and uses a client-side filter.
* **Backend Database Gaps**: No campaigns or awareness activities tables.
* **Proposed Schema**:
  ```sql
  CREATE TABLE campaigns (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      category_name VARCHAR(100) NOT NULL, -- Environment, Health, Education, etc.
      campaign_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'Active', -- Active, Inactive, Ended
      participant_count INT DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  ```
* **Required Endpoints**:
  1. `GET /api/campaigns`
     - **Access**: Guest or Authenticated.
     - **Query Params**: `?category=Environment&status=Active&q=clean`
     - **Response**: List of matching campaigns (paginated).
  2. `GET /api/campaigns/:id`
     - **Access**: Guest or Authenticated.
  3. `POST /api/campaigns`
     - **Access**: Admin only.
     - **Payload**: `{"title": "Clean City Campaign", "description": "...", "category_name": "Environment", "campaign_date": "2024-05-15", "status": "Active"}`
  4. `PUT /api/campaigns/:id`
     - **Access**: Admin only.
  5. `DELETE /api/campaigns/:id`
     - **Access**: Admin only.

---

### C. Admin User & Role Management Module
* **Frontend Component**: [UsersTable.tsx](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/admin/components/UsersTable.tsx)
* **Current Status**: Displays mock users (`initialUsers`) and has mock status toggles ("Active" / "Suspended") and role switches.
* **Backend Database Gaps**: The backend `user` module only fetches `me` (profile of current user) and fetches static stats. It lacks listing, promoting, or suspending users.
* **Required Endpoints**:
  1. `GET /api/admin/users`
     - **Access**: Admin only.
     - **Query Params**: `?q=Rajesh&role=Volunteer&status=Active`
     - **Response**: Paginated list of users (ID, Name, Mobile, Role/UserType, status, JoinDate).
  2. `PUT /api/admin/users/:id/role`
     - **Access**: Admin only.
     - **Payload**: `{"role": "Coordinator"}` or `{"role": "Volunteer"}` or `{"role": "Smart Citizen"}`.
  3. `PUT /api/admin/users/:id/status`
     - **Access**: Admin only.
     - **Payload**: `{"status": "Suspended"}` or `{"status": "Active"}`.

---

### D. Abuse Reporting & Moderation Module
* **Frontend Component**: [ModerationTable.tsx](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/admin/components/ModerationTable.tsx)
* **Current Status**: Displays hardcoded moderation reports and resolves them in local state.
* **Backend Database Gaps**: No abuse reporting schemas or resolution controllers.
* **Proposed Schema**:
  ```sql
  CREATE TABLE abuse_reports (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      reporter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reported_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      reason TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'Open', -- Open, Resolved
      action_taken VARCHAR(100), -- Warned, Suspended, None
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      resolved_at TIMESTAMP WITH TIME ZONE
  );
  ```
* **Required Endpoints**:
  1. `POST /api/reports`
     - **Access**: Authenticated Citizen/Volunteer.
     - **Payload**: `{"reported_user_id": "...", "reason": "Spam invites"}`
  2. `GET /api/admin/reports`
     - **Access**: Admin only.
     - **Query Params**: `?status=Open`
  3. `PUT /api/admin/reports/:id/resolve`
     - **Access**: Admin only.
     - **Payload**: `{"action_taken": "Suspended"}`

---

### E. Help Directory ("Need Help") Module
* **Frontend Component**: [NeedHelpDirectory.tsx](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/need-help/components/NeedHelpDirectory.tsx)
* **Current Status**: Uses a static client list of professionals (Dr. Anuj Singh, etc.) filtered entirely on the client side.
* **Backend Database Gaps**: No directory listings, search optimization by location, or classification by profession.
* **Required Endpoints**:
  1. `GET /api/directory/helpers`
     - **Access**: Authenticated.
     - **Query Params**: `?q=cybersecurity&profession=IT%20Professional&city=Delhi`
     - **Response**: List of helper profiles (Volunteers/Coordinators who opted in to help others).
  2. `POST /api/directory/opt-in`
     - **Access**: Authenticated Volunteer/Coordinator.
     - **Payload**: `{"show_phone": true, "expertise": "Cybersecurity", "description": "...", "is_listed": true}`

---

### F. Contact & Enquiry Module
* **Frontend Component**: [ContactForm.tsx](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/contact/components/ContactForm.tsx)
* **Current Status**: Submits name, email, phone, message and shows mock alerts.
* **Backend Database Gaps**: No database storage or email trigger for contact enquiries.
* **Proposed Schema**:
  ```sql
  CREATE TABLE enquiries (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'Open', -- Open, InProgress, Resolved
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );
  ```
* **Required Endpoints**:
  1. `POST /api/contact`
     - **Access**: Public.
     - **Payload**: `{"name": "...", "email": "...", "phone": "...", "message": "..."}`
  2. `GET /api/admin/enquiries`
     - **Access**: Admin only.
  3. `PUT /api/admin/enquiries/:id/status`
     - **Access**: Admin only.
     - **Payload**: `{"status": "Resolved"}`

---

### G. Dynamic Leaderboards & Content (CMS) Settings
* **Frontend Component**: [LeaderboardHighlights.tsx](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/features/leaderboard/components/LeaderboardHighlights.tsx), legal page policies, etc.
* **Required Endpoints**:
  1. `GET /api/leaderboards/highlights`
     - Returns top 5 volunteer referrers and top contributors to show on the dynamic leaderboard page.
  2. `GET /api/content/legal/:slug`
     - Retrieves terms, conditions, privacy policy, and rules dynamically from database storage, enabling dynamic legal text administration from the admin panel.

---

## 3. Database Schema Modifications Recap

To implement these APIs, the database schema should include these new tables and references:
1. **`donations`**: Tracks donor details, payment status, UTR numbers, and links to the `users` table.
2. **`campaigns`**: Track awareness activities, dates, categories, and participant counts.
3. **`abuse_reports`**: Moderation system logs for reporting users.
4. **`enquiries`**: Contact queries submitted via the landing page.
5. **`helper_profiles`**: Extra details for volunteers/coordinators who offer services on the "Need Help" directory.

---

## 4. Next Steps for Implementation

1. **Create Backend Models**: Define GORM model structures in new directories in `backend/modules/` (e.g. `donation`, `campaign`, `report`, `enquiry`).
2. **Auto-Migrate Tables**: Register the new structs in `backend/main.go` under `db.AutoMigrate(...)`.
3. **Write GORM Repositories**: Implement standard database queries (pagination, filtering).
4. **Define Services & Handlers**: Add Gin route handlers for the endpoints listed above.
5. **Update Frontend Axios Services**: Create corresponding `api.ts` files inside `donation`, `awareness`, `admin`, `contact`, and `need-help` directories.
6. **Connect Components**: Replace mock arrays and states with dynamic React Query hooks or standard `useEffect` state fetchers.
