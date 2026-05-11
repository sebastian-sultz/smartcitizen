# Smart Citizen Admin Panel - Legacy Audit & Modernization Blueprint

# Project Overview

*   **Website Purpose**: The Global Smart Citizens Foundation (GSCF) platform is designed to promote social awareness, civic engagement, and community support through activities, quizzes, and expert-led initiatives.
*   **NGO/Business Domain**: Non-Governmental Organization (NGO) focusing on social awareness, global citizenship, and community empowerment.
*   **Admin Panel Purpose**: To manage awareness content, user contributions (donations), educational quizzes, support enquiries, and expert verification.
*   **Technology Assumptions**:
    *   **Backend**: ASP.NET WebForms (.aspx)
    *   **Frontend**: Legacy HTML/CSS with server-side postbacks.
    *   **UI Framework**: Likely a custom or basic Bootstrap-based theme for ASP.NET.
    *   **Architecture**: Monolithic, server-side rendered.
*   **Legacy Architecture Observations**:
    *   Relies heavily on `ViewState` and postbacks for form submissions.
    *   URL structure is flat (e.g., `/admin/add_quize.aspx`).
    *   Navigation is a fixed sidebar with dropdowns.
    *   Table actions are often postback-driven rather than client-side interactions.

# Authentication System

*   **Login Flow**: `https://globalsmartcitizensfoundation.org/adminLogin.aspx`
    *   Fields: Username, Password.
    *   Validation: Required fields.
    *   Logic: Server-side credential check.
*   **Forgot Password flow**: Not prominently visible on the admin login page; likely managed via database or manual reset.
*   **Session behavior**: Standard ASP.NET session management.
*   **Timeout behavior**: Re-directs to login page after session expiry.
*   **Role handling**: Single 'Admin' role observed for the provided credentials.
*   **Redirect logic**: Redirects to `admin/Home.aspx` upon successful login.

# Navigation Architecture

*   **Sidebar Structure**:
    *   **Home**
    *   **Awareness Activities** (Dropdown)
    *   **Help & Support** (Dropdown)
    *   **Organization** (Dropdown)
    *   **Quizzes** (Dropdown)
    *   **Smart Citizen Activity** (Dropdown)
    *   **Smart Citizen Engagement** (Dropdown)
    *   **Support Contribution** (Dropdown)
    *   **Logout**
*   **Topbar structure**: Minimal; contains logo and likely a logout shortcut.
*   **Breadcrumbs**: Not implemented in the legacy system.
*   **Access conditions**: Requires active admin session.

# Module Documentation

## 1. Awareness Activities

### Purpose
To manage educational and social awareness content, categories, and experts.

### Route/Page URL
Multiple pages under `/admin/`:
- `add_awareness_category.aspx`
- `Add_Designation.aspx`
- `Add_Awareness_Activity.aspx`
- `Add_News.aspx`
- `Awareness_Images.aspx`
- `Add_Banner.aspx`
- `Add_Popup.aspx`
- `Awareness_Experts.aspx`
- `User_KYC_Details.aspx`
- `Add_Expert_Category.aspx`
- `Global_Citizen_Verification.aspx`

### User Roles Allowed
Admin

### UI Layout Structure
Table at the top or bottom, with an "Add New" form usually present on the same page or a separate modal.

### Tables
- **Awareness Categories**: ID, Category Name, Status, Action (Edit/Delete).
- **Activities**: ID, Title, Category, Date, Status, Action.
- **Experts**: ID, Name, Category, Photo, Action.

### Filters
Basic keyword search on some list pages.

### Form Fields (General)
- Category Name (Text)
- Title (Text)
- Description (Rich Text/TextArea)
- Image/File Upload
- Status (Dropdown: Active/Inactive)

### Validation Rules
- Required: Title, Category, Images.
- File Types: .jpg, .png.

---

## 2. Quizzes

### Purpose
To create and manage educational quizzes for users.

### Route/Page URL
- `add_quize.aspx`
- `view_quize_result.aspx`

### Tables
- **Quiz List**: ID, Quiz Topic, Created Date, Action.
- **Quiz Results**: ID, User Name, Quiz Topic, Score, Date.

### Form Fields
- Quiz Topic Name (Text)
- Question (Text)
- Option A, B, C, D (Text)
- Correct Answer (Dropdown)

---

## 3. Help & Support

### Purpose
To handle user communications, complaints, and suggestions.

### Route/Page URL
- `AdminComplain.aspx`
- `AdminSuggestion.aspx`
- `View_Enquiry.aspx`

### Tables
- **Complaints**: ID, User Name, Message, Date, Status.
- **Enquiries**: ID, Name, Email, Subject, Message, Date.

### Actions
- Mark as Read
- Reply (Not fully functional in all views)

---

## 4. Support Contribution

### Purpose
To monitor and manage financial contributions/donations.

### Route/Page URL
- `View_Donation.aspx`

### Tables
- **Donations**: ID, Donor Name, Amount, Transaction ID, Date, Status.

### Export Features
- Likely supports CSV/Excel export for donation records (standard legacy requirement).

---

## 5. Broken Modules (Technical Debt)

The following modules/pages are currently returning 404 or are missing files:
*   **Organization**: Add Organization, Organization Details, Add Role, Add Staff, Manage Bank.
*   **Smart Citizen Activity**: Add Activity, List - reported as 404.
*   **Smart Citizen Engagement**: Add Engagement, Engagement List.

---

# UX Audit

*   **UX problems**:
    *   Form-heavy pages with poor visual hierarchy.
    *   No confirmation dialogs for destructive actions.
    *   Poor feedback on submission success (usually just a page reload).
*   **Accessibility issues**:
    *   Low color contrast.
    *   Missing `alt` tags on images.
    *   Non-semantic HTML.
*   **Responsiveness issues**:
    *   Sidebar breaks on mobile.
    *   Tables overflow on small screens without horizontal scroll or card view transformation.
*   **Performance issues**:
    *   Large `ViewState` payloads slowing down page interactions.
    *   Synchronous file uploads.

# Suggested Modern Architecture

### Frontend Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: TanStack Query (Server state), Zustand (Client state)
- **Forms**: React Hook Form + Zod
- **Data Display**: TanStack Table

### Backend Stack (Modernized)
- **Language**: Go (Golang) 1.22+
- **Framework**: Gin-Gonic or Echo
- **Database**: PostgreSQL 16+
- **ORM/Query**: GORM or sqlx
- **Migration Tool**: golang-migrate or GORM Migrations
- **Auth**: JWT with custom middleware + Bcrypt for hashing
- **API Style**: RESTful JSON API

# Migration Strategy

1.  **Phase 1: Database Migration**: Schema extraction from legacy SQL Server and migration to PostgreSQL.
2.  **Phase 2: Go API Development**: Build a high-performance API layer in Go to handle legacy logic.
3.  **Phase 3: Hybrid Shell**: Build the new admin portal shell (Navigation/Auth) in Next.js.
4.  **Phase 4: Module Migration**: Migrate modules one by one (starting with working ones like Awareness Activities).
5.  **Phase 5: Cutover**: Switch DNS to the new system.

# UI Component Inventory

To maintain consistency in the redesign, the following reusable components are identified:

| Component | Legacy Usage | Modern Equivalent (shadcn/ui) |
| :--- | :--- | :--- |
| **Sidebar Navigation** | Static list with JS dropdowns | `Sheet` + `NavigationMenu` |
| **Data Table** | ASP.NET GridView | `TanStack Table` + `Checkbox` (Bulk) |
| **Status Badge** | Text (Active/Inactive) | `Badge` (variant: success/destructive) |
| **Form Input** | `<asp:TextBox>` | `Input` |
| **Rich Text Editor** | Standard `<textarea>` | `Tiptap` or `Quill` |
| **File Upload** | `<asp:FileUpload>` | Custom `Dropzone` component |
| **Action Dropdown** | Inline links (Edit/Delete) | `DropdownMenu` (Row actions) |
| **Modal Dialog** | Popups (rarely used) | `Dialog` |
| **Stat Card** | Dashboard boxes | `Card` with icons and trends |

# Detailed Redesign Implementation Prompt

Use the following prompt to instruct an AI developer to build the new system:

---

### MODERN ADMIN PANEL REBUILD PROMPT (FRONTEND)

**Role**: Senior Frontend Engineer
**Task**: Build a high-performance, responsive admin portal for GSCF.

**Requirements**:
1. **Tech Stack**: Next.js latest (App Router), TypeScript, Tailwind CSS, shadcn/ui.
2. **Layout**: Collapsible sidebar, mobile-responsive nav, and consistent dashboard shell.
3. **Data Management**: Use TanStack Query for all API calls to the Go backend.
4. **Forms**: Implement `react-hook-form` with `zod` schema validation for all awareness and quiz content.
5. **Interactive Elements**: Use `sonner` for notifications and skeleton states for loading.

---

### MODERN ADMIN PANEL REBUILD PROMPT (BACKEND)

**Role**: Senior Backend Engineer (Go/Golang)
**Task**: Build a scalable, secure REST API in Go with a PostgreSQL backend.

**Requirements**:
1. **Tech Stack**: Go 1.22+, PostgreSQL, Gin or Echo framework.
2. **Architecture**: Clean Architecture (Handlers -> Services -> Repositories).
3. **Database**: Implement PostgreSQL schema matching the legacy GSCF entities (Awareness, Quizzes, Donations).
4. **Authentication**: Implement JWT-based auth with refresh tokens and role-based middleware.
5. **Features**:
   - CRUD endpoints for all Awareness activities.
   - Quiz management logic (Validation of answers, result storage).
   - Donation tracking API with support for transaction logging.
   - Automated DB migrations using `golang-migrate`.
6. **Performance**: Ensure optimized queries and proper indexing for PostgreSQL.

---

