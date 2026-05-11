# Admin System Skill File: Global Smart Citizens Foundation

## System Overview
The GSCF Admin Panel is a legacy ASP.NET WebForms application (`.aspx`) used for managing an NGO platform. It features a monolithic architecture with server-side postbacks, heavily reliant on `ViewState`.

## Business Rules
*   **Awareness First**: All content must be categorized under specific Awareness Categories or Expert Categories.
*   **Verification Requirement**: Experts must be verified before appearing in the public directory (Global Citizen Verification).
*   **Donation Transparency**: All donations are recorded with Transaction IDs and linked to specific donors.
*   **Engagement Loop**: Quizzes are used to drive user engagement and test awareness.

## User Roles
*   **Super Admin**: Full access to all modules.
*   **Role Management (Planned)**: The system has placeholders for Role and Staff management (currently 404), suggesting an intent for granular permissions.

## Core Workflows
1.  **Content Creation**: Add Category -> Add Activity/News -> Upload Media -> Publish.
2.  **User Support**: Receive Enquiry/Complaint -> View Details -> Mark as Resolved.
3.  **Educational Flow**: Create Quiz Topic -> Add Questions -> Monitor Results.
4.  **Financial Monitoring**: View Donation List -> Verify Transaction -> Export for Audit.

## Important Dependencies
*   **Database**: Likely SQL Server (MSSQL) given the ASP.NET stack.
*   **Media Storage**: Files are likely stored on the local file system (relative paths observed in `Awareness_Images.aspx`).

## Critical Behaviors
*   **Postback Submission**: Forms refresh the entire page upon submission.
*   **Status Management**: Most entities (Categories, Activities) have an 'Active/Inactive' status toggle.

## Validation Rules
*   **Required Fields**: Category Name, Quiz Topic, Question, Option A/B, Amount.
*   **Media**: Images usually require specific formats (.jpg, .png).

## Table Behaviors
*   **Pagination**: Handled server-side via ASP.NET DataGrid/GridView.
*   **Actions**: Edit and Delete are the primary row actions.

## Legacy Constraints
*   **Broken Modules**: Organization and Smart Citizen Activity modules are currently defunct (404). Do not attempt to link to these in a modernized version without rebuilding the underlying logic.
*   **Non-Responsive**: The UI does not scale well to mobile devices.

## Required Modernization Rules
*   **API-First**: All data interactions must move to an async REST API built in **Go**.
*   **Database**: Transition from MSSQL to **PostgreSQL**.
*   **Optimistic UI**: Use loading states and optimistic updates for row actions (Edit/Delete).
*   **Responsive Tables**: Use horizontal scrolling or card-view transformations for mobile.
*   **Client-Side Validation**: Implement Zod validation to prevent unnecessary server trips.

## Design System Guidelines
*   **Color Palette**: Use a clean, professional NGO-style palette (Vibrant but trustworthy).
*   **Typography**: Inter or Roboto for readability.
*   **Components**: Use shadcn/ui (Button, Input, Table, Card, Dialog).

## API Expectations (Go Backend)
*   `GET /v1/awareness/categories` -> Returns JSON array of categories.
*   `POST /v1/awareness/activities` -> Accepts multipart/form-data for images + JSON.
*   `GET /v1/donations` -> Protected endpoint (Admin only).
*   `GET /v1/quizzes/:id/results` -> Returns user scores and analytics.

## Security Requirements
*   JWT-based authentication with Bcrypt password hashing in Go.
*   Role-based Access Control (RBAC) middleware.
*   Input sanitization and SQL injection prevention via prepared statements (using `sqlx` or `gorm`).
*   Rate limiting for the `/v1/auth/login` endpoint.

