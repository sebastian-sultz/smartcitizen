# Graph Report - smartcitizen  (2026-05-18)

## Corpus Check
- 137 files · ~2,434,966 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 773 nodes · 1090 edges · 103 communities (75 shown, 28 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6b5764f2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Public Pages & Policies|Public Pages & Policies]]
- [[_COMMUNITY_Forms & Citizen Dashboard|Forms & Citizen Dashboard]]
- [[_COMMUNITY_Home & Impact Sections|Home & Impact Sections]]
- [[_COMMUNITY_Admin Dashboard & Tables|Admin Dashboard & Tables]]
- [[_COMMUNITY_Package Dependencies & Scripts|Package Dependencies & Scripts]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Community Activities & Highlights|Community Activities & Highlights]]
- [[_COMMUNITY_Awareness Activities & Forms|Awareness Activities & Forms]]
- [[_COMMUNITY_About & Team Content|About & Team Content]]
- [[_COMMUNITY_Public Layout & Footer|Public Layout & Footer]]
- [[_COMMUNITY_Root Layout & Fonts|Root Layout & Fonts]]
- [[_COMMUNITY_Admin Login Page|Admin Login Page]]
- [[_COMMUNITY_Citizen Layout|Citizen Layout]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]
- [[_COMMUNITY_PostCSS Configuration|PostCSS Configuration]]
- [[_COMMUNITY_Next.js Configuration|Next.js Configuration]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 71|Community 71]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 94|Community 94]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 100|Community 100]]
- [[_COMMUNITY_Community 101|Community 101]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]

## God Nodes (most connected - your core abstractions)
1. `Button` - 35 edges
2. `cn()` - 26 edges
3. `Card` - 18 edges
4. `CardContent` - 18 edges
5. `compilerOptions` - 16 edges
6. `CardHeader` - 16 edges
7. `CardTitle` - 15 edges
8. `useAdminStore` - 13 edges
9. `Badge()` - 12 edges
10. `Header` - 11 edges

## Surprising Connections (you probably didn't know these)
- `cn()` --calls--> `clsx`  [INFERRED]
  lib/utils.ts → package.json
- `UsersTable()` --calls--> `getUsersColumns()`  [EXTRACTED]
  features/admin/components/UsersTable.tsx → features/admin/components/UsersColumns.tsx
- `EventsTable()` --calls--> `useAdminStore`  [EXTRACTED]
  features/admin/components/EventsTable.tsx → features/admin/store/useAdminStore.ts
- `EventsTable()` --calls--> `getEventsColumns()`  [EXTRACTED]
  features/admin/components/EventsTable.tsx → features/admin/components/EventsColumns.tsx
- `VolunteerAppsTable()` --calls--> `useAdminStore`  [EXTRACTED]
  features/admin/components/VolunteerAppsTable.tsx → features/admin/store/useAdminStore.ts

## Communities (103 total, 28 thin omitted)

### Community 1 - "Forms & Citizen Dashboard"
Cohesion: 0.06
Nodes (42): mockActivities, campaignsColumns, CampaignsTable(), ContactFormProps, mockDonations, DashboardOverview(), amounts, getEventsColumns() (+34 more)

### Community 2 - "Home & Impact Sections"
Cohesion: 0.04
Nodes (10): priorities, amounts, CounterProps, impactItems, partners, priorities, featuredPrograms, teamMembers (+2 more)

### Community 3 - "Admin Dashboard & Tables"
Cohesion: 0.29
Nodes (7): Table(), TableBody(), TableCell(), TableHead(), TableHeader(), TableRow(), TableComponentProps

### Community 4 - "Package Dependencies & Scripts"
Cohesion: 0.05
Nodes (36): dependencies, class-variance-authority, clsx, formik, framer-motion, @hugeicons/core-free-icons, @hugeicons/react, lucide-react (+28 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "Awareness Activities & Forms"
Cohesion: 0.4
Nodes (3): ContentGridProps, ContentItem, EventRegisterButton()

### Community 9 - "About & Team Content"
Cohesion: 0.1
Nodes (21): 5.1 Guest Visitor, 5.2 Smart Citizen, 5.3 Active Smart Citizen, 5.4 Volunteer, 5.5 Coordinator Roles, 5.6 Admin, 5. User Roles & Organizational Structure, Admin Permissions (+13 more)

### Community 10 - "Public Layout & Footer"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 12 - "Root Layout & Fonts"
Cohesion: 0.22
Nodes (4): figtree, metadata, urbanist, TooltipProvider()

### Community 17 - "Citizen Layout"
Cohesion: 0.17
Nodes (11): AdminStore, Campaign, Event, initialApps, initialCampaigns, initialEvents, initialReports, initialUsers (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.11
Nodes (18): 15. Search & Discovery System, 24. Security Requirements, 26. SEO Requirements, 28. Scalability Requirements, 29. Logging & Monitoring, 30. Future Scope, 3. User Roles, 5. Core Functional Modules (+10 more)

### Community 23 - "Community 23"
Cohesion: 0.11
Nodes (18): 14. Search & Discovery System, 18. Operational Support & Volunteer Assistance, 22. Notification System, 27. Legal & Compliance Considerations, 28. Conclusion, 4. Platform Positioning, 6. Platform Modules, Communication Channels (+10 more)

### Community 24 - "Community 24"
Cohesion: 0.18
Nodes (11): 2. Tech Stack, Authentication, Backend, Backend, Database, Database, Frontend, Frontend (+3 more)

### Community 25 - "Community 25"
Cohesion: 0.2
Nodes (10): 22. Database Design (High Level), abuse_reports, Core Tables, donations, event_registrations, events, notifications, participation_invites (+2 more)

### Community 26 - "Community 26"
Cohesion: 0.2
Nodes (10): 8. Public Website Requirements, About Foundation, Awareness Campaigns, Community Support Directory, Contact & Footer, Hero Section, Homepage Goals, Homepage Sections (+2 more)

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (9): 11. Volunteer Management System, Consent Fields, Eligibility Indicators, Media Upload, Personal Information, Professional Information, Volunteer Application, Volunteer Application Form (+1 more)

### Community 28 - "Community 28"
Cohesion: 0.22
Nodes (9): 6. Public Website Module, Awareness Section, Event Section, Hero Section, Homepage Sections, Main CTA Buttons, Need Help Preview, Public Pages (+1 more)

### Community 29 - "Community 29"
Cohesion: 0.25
Nodes (8): 12. Need Help Module, Accessible By, Contact Methods, Purpose, Search Categories, Search Filters, Volunteer Public Profile, Volunteer Visibility Rules

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (8): 23. API Standards, API Rules, code:txt (/api/v1/), code:json ({), code:json ({), Error Response, Response Structure, Success Response

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (8): 13. Volunteer Management System, Eligibility Indicators, Media Uploads, Personal Information, Professional Information, Volunteer Application Process, Volunteer Approval Workflow, Volunteer Form Fields

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (7): 21. Admin Panel, Admin Dashboard Widgets, Campaign Management, Event Management, Moderation Panel, User Management, Volunteer Management

### Community 33 - "Community 33"
Cohesion: 0.29
Nodes (7): 10. Smart Citizen Registration Module, Optional Future Fields, Registration Fields, Registration Workflow, Required Fields, Rules, Smart Citizen ID

### Community 34 - "Community 34"
Cohesion: 0.29
Nodes (7): 11. User Dashboard, Contribution History, Dashboard Purpose, Dashboard Sections, Notification Center, Participation Overview, Personal Profile

### Community 35 - "Community 35"
Cohesion: 0.29
Nodes (7): 7. Need Help Functionality, Contact Options, Module Purpose, Privacy Controls, Supported Profiles, User Access, Visibility Rules

### Community 36 - "Community 36"
Cohesion: 0.5
Nodes (4): 25. Frontend UI Requirements, Component Requirements, Styling, UI Guidelines

### Community 37 - "Community 37"
Cohesion: 0.33
Nodes (6): 10. Awareness Participation System, code:txt (/gsc/invite/abc123), Important Restriction, Participation Invite Link, Purpose, Tracking Requirements

### Community 38 - "Community 38"
Cohesion: 0.33
Nodes (6): 4. High-Level System Architecture, Backend Architecture, code:bash (src/), code:bash (cmd/), Frontend Architecture, Suggested Frontend Structure

### Community 39 - "Community 39"
Cohesion: 0.33
Nodes (6): 7. Authentication Module, Forgot Password, Login Flow, Registration Flow, Security Requirements, Smart Citizen Registration

### Community 40 - "Community 40"
Cohesion: 0.33
Nodes (6): 9. Dashboard Module, Contribution History, Dashboard Sections, Notifications, Participation Stats, Personal Profile Card

### Community 41 - "Community 41"
Cohesion: 0.33
Nodes (6): 1. Document Information, Document Type, Organization, Project Name, Purpose of this Document, Version

### Community 42 - "Community 42"
Cohesion: 0.33
Nodes (6): 21. Admin Panel Requirements, Admin Dashboard, Campaign Management, Role Management, User Management, Volunteer Management

### Community 43 - "Community 43"
Cohesion: 0.33
Nodes (6): 26. Suggested Technology Stack, Authentication, Backend, Database, File Storage, Frontend

### Community 44 - "Community 44"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 45 - "Community 45"
Cohesion: 0.4
Nodes (5): 14. Donation System, Donation Features, Donation Rules, Payment Gateway Integration, Store Payment Details

### Community 46 - "Community 46"
Cohesion: 0.4
Nodes (5): 15. Transparency & Participation Tracking, Access Restriction Rules, Admin-Level Transparency, User-Level Transparency, Volunteer/Coordinator-Level Transparency

### Community 47 - "Community 47"
Cohesion: 0.4
Nodes (5): 16. Donation & Contribution System, Compliance Note, Contribution Features, Contribution Records, Purpose

### Community 50 - "Community 50"
Cohesion: 0.5
Nodes (3): Answer, Q: Why does cn() connect Layout & Navigation Utilities to Awareness Activities & Forms, Forms & Citizen Dashboard, Admin Dashboard & Tables, Package Dependencies & Scripts?, Source Nodes

### Community 51 - "Community 51"
Cohesion: 0.5
Nodes (4): 13. Event Management System, Event Features, Event Fields, User Features

### Community 52 - "Community 52"
Cohesion: 0.5
Nodes (4): 16. Consent & Privacy Module, Consent Requirements, GDPR-style Compliance, Privacy Controls

### Community 53 - "Community 53"
Cohesion: 0.5
Nodes (4): 17. Abuse & Moderation Module, Admin Features, Features, Spam Protection

### Community 54 - "Community 54"
Cohesion: 0.5
Nodes (4): 19. Role & Permission System, Admin Access, RBAC (Role-Based Access Control), Volunteer Access

### Community 55 - "Community 55"
Cohesion: 0.5
Nodes (4): 1. Project Overview, Objective, Project Name, Project Type

### Community 56 - "Community 56"
Cohesion: 0.5
Nodes (4): 20. Coordinator System, Coordinator Responsibilities, Coordinator Roles, Internal Participation Metrics

### Community 57 - "Community 57"
Cohesion: 0.5
Nodes (4): 27. Deployment Requirements, Backend Deployment, CI/CD, Frontend Deployment

### Community 58 - "Community 58"
Cohesion: 0.5
Nodes (4): 8. Smart Citizen Module, code:txt (GSC000523), Smart Citizen Features, Smart Citizen ID Generation

### Community 59 - "Community 59"
Cohesion: 0.5
Nodes (4): 12. Awareness Participation System, Community Participation System, Important Compliance Note, Purpose

### Community 60 - "Community 60"
Cohesion: 0.5
Nodes (4): 19. Consent & Privacy Management, Compliance Standards, Consent Management, Privacy Controls

### Community 61 - "Community 61"
Cohesion: 0.5
Nodes (4): 20. Abuse & Moderation System, Admin Moderation Rights, Features, Purpose

### Community 62 - "Community 62"
Cohesion: 0.5
Nodes (4): 25. Non-Functional Requirements, Performance, Scalability, SEO Requirements

### Community 63 - "Community 63"
Cohesion: 0.5
Nodes (4): 2. Foundation Overview, Core Vision, Mission, Organization Name

### Community 64 - "Community 64"
Cohesion: 0.5
Nodes (4): 9. Authentication System, Authentication Flow, Forgot Password Functionality, Login Method

### Community 76 - "Community 76"
Cohesion: 0.67
Nodes (3): 23. Coordinator Responsibilities, Coordinator Functions, Internal Participation Thresholds (Administrative Reference)

### Community 84 - "Community 84"
Cohesion: 0.67
Nodes (3): 31. Final Development Notes, Final Objective, Important Architectural Notes

### Community 85 - "Community 85"
Cohesion: 0.67
Nodes (3): 18. Notification System, Channels, Notification Types

### Community 86 - "Community 86"
Cohesion: 0.11
Nodes (11): AwarenessFeature(), metadata, AwarenessForm(), AwarenessFormProps, validationSchema, AwarenessList(), Dialog(), DialogContent() (+3 more)

### Community 87 - "Community 87"
Cohesion: 0.67
Nodes (3): 3. Platform Objectives, Primary Objectives, Secondary Objectives

### Community 88 - "Community 88"
Cohesion: 0.67
Nodes (3): 17. Recognition & Appreciation System, Purpose, Recognition Types

### Community 89 - "Community 89"
Cohesion: 0.25
Nodes (4): documents, cn(), cva(), Separator()

### Community 90 - "Community 90"
Cohesion: 0.67
Nodes (3): 24. Security Requirements, Payment Gateway Support, Security Features

### Community 100 - "Community 100"
Cohesion: 0.32
Nodes (4): Header(), NavItem, navItems, Sidebar()

## Knowledge Gaps
- **350 isolated node(s):** `config`, `name`, `version`, `private`, `dev` (+345 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 89` to `Forms & Citizen Dashboard`, `Community 99`, `Community 100`, `Community 101`, `Admin Dashboard & Tables`, `Community 103`, `Community 104`, `Package Dependencies & Scripts`, `Root Layout & Fonts`, `Admin Login Page`, `Community 78`, `Community 86`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Why does `clsx` connect `Package Dependencies & Scripts` to `Community 89`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **What connects `config`, `name`, `version` to the rest of the system?**
  _350 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Forms & Citizen Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Home & Impact Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.04 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies & Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `TypeScript Configuration` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._