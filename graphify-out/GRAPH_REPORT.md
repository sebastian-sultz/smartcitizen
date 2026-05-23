# Graph Report - smartcitizen  (2026-05-23)

## Corpus Check
- 181 files · ~2,449,135 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1118 nodes · 1591 edges · 117 communities (86 shown, 31 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `87d7d165`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Public Pages & Policies|Public Pages & Policies]]
- [[_COMMUNITY_Forms & Citizen Dashboard|Forms & Citizen Dashboard]]
- [[_COMMUNITY_Home & Impact Sections|Home & Impact Sections]]
- [[_COMMUNITY_Admin Dashboard & Tables|Admin Dashboard & Tables]]
- [[_COMMUNITY_Package Dependencies & Scripts|Package Dependencies & Scripts]]
- [[_COMMUNITY_Layout & Navigation Utilities|Layout & Navigation Utilities]]
- [[_COMMUNITY_TypeScript Configuration|TypeScript Configuration]]
- [[_COMMUNITY_Community Activities & Highlights|Community Activities & Highlights]]
- [[_COMMUNITY_Awareness Activities & Forms|Awareness Activities & Forms]]
- [[_COMMUNITY_About & Team Content|About & Team Content]]
- [[_COMMUNITY_Public Layout & Footer|Public Layout & Footer]]
- [[_COMMUNITY_Contact Info Components|Contact Info Components]]
- [[_COMMUNITY_Root Layout & Fonts|Root Layout & Fonts]]
- [[_COMMUNITY_Admin Login Page|Admin Login Page]]
- [[_COMMUNITY_Member Login Page|Member Login Page]]
- [[_COMMUNITY_Citizen Dashboard Page|Citizen Dashboard Page]]
- [[_COMMUNITY_Citizen Settings Page|Citizen Settings Page]]
- [[_COMMUNITY_Citizen Layout|Citizen Layout]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]
- [[_COMMUNITY_PostCSS Configuration|PostCSS Configuration]]
- [[_COMMUNITY_Next.js Configuration|Next.js Configuration]]
- [[_COMMUNITY_Next.js Environment|Next.js Environment]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
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
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 80|Community 80]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 91|Community 91]]
- [[_COMMUNITY_Community 92|Community 92]]
- [[_COMMUNITY_Community 93|Community 93]]
- [[_COMMUNITY_Community 95|Community 95]]
- [[_COMMUNITY_Community 96|Community 96]]
- [[_COMMUNITY_Community 97|Community 97]]
- [[_COMMUNITY_Community 99|Community 99]]
- [[_COMMUNITY_Community 103|Community 103]]
- [[_COMMUNITY_Community 104|Community 104]]
- [[_COMMUNITY_Community 105|Community 105]]
- [[_COMMUNITY_Community 107|Community 107]]
- [[_COMMUNITY_Community 108|Community 108]]
- [[_COMMUNITY_Community 109|Community 109]]
- [[_COMMUNITY_Community 110|Community 110]]
- [[_COMMUNITY_Community 113|Community 113]]
- [[_COMMUNITY_Community 114|Community 114]]
- [[_COMMUNITY_Community 121|Community 121]]
- [[_COMMUNITY_Community 122|Community 122]]
- [[_COMMUNITY_Community 123|Community 123]]
- [[_COMMUNITY_Community 124|Community 124]]
- [[_COMMUNITY_Community 125|Community 125]]
- [[_COMMUNITY_Community 126|Community 126]]
- [[_COMMUNITY_Community 127|Community 127]]
- [[_COMMUNITY_Community 128|Community 128]]
- [[_COMMUNITY_Community 155|Community 155]]
- [[_COMMUNITY_Community 156|Community 156]]
- [[_COMMUNITY_Community 176|Community 176]]

## God Nodes (most connected - your core abstractions)
1. `Button` - 38 edges
2. `cn()` - 27 edges
3. `handleApiError()` - 22 edges
4. `useAlert()` - 21 edges
5. `Card` - 18 edges
6. `CardContent` - 17 edges
7. `compilerOptions` - 16 edges
8. `CardHeader` - 16 edges
9. `CardTitle` - 15 edges
10. `mapToResponse()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `cn()` --calls--> `clsx`  [INFERRED]
  frontend/lib/utils.ts → frontend/package.json
- `main()` --calls--> `InitCloudinary()`  [INFERRED]
  backend/main.go → backend/pkg/cloudinary/cloudinary.go
- `main()` --calls--> `Connect()`  [INFERRED]
  backend/main.go → backend/infrastructure/database/database.go
- `main()` --calls--> `CORSMiddleware()`  [INFERRED]
  backend/main.go → backend/infrastructure/middleware/cors.go
- `RootLayout()` --calls--> `parseJwt()`  [INFERRED]
  frontend/app/layout.tsx → frontend/proxy.ts

## Communities (117 total, 31 thin omitted)

### Community 0 - "Public Pages & Policies"
Cohesion: 0.09
Nodes (22): 18. Notification System, 1. Project Overview, 24. Security Requirements, 26. SEO Requirements, 28. Scalability Requirements, 30. Future Scope, 31. Final Development Notes, 3. User Roles (+14 more)

### Community 1 - "Forms & Citizen Dashboard"
Cohesion: 0.11
Nodes (18): 14. Search & Discovery System, 17. Recognition & Appreciation System, 18. Operational Support & Volunteer Assistance, 24. Security Requirements, 28. Conclusion, 4. Platform Positioning, 6. Platform Modules, Core Modules (+10 more)

### Community 2 - "Home & Impact Sections"
Cohesion: 0.06
Nodes (15): UploadImage(), Handler, mapToResponse(), mapToResponse(), NewHandler(), Claims, GenerateTokens(), ParseToken() (+7 more)

### Community 3 - "Admin Dashboard & Tables"
Cohesion: 0.05
Nodes (14): main(), stringPtr(), DeleteImage(), InitCloudinary(), Connect(), Event, EventType, Service (+6 more)

### Community 4 - "Package Dependencies & Scripts"
Cohesion: 0.08
Nodes (4): Repository, NewRepository(), Repository, Repository

### Community 5 - "Layout & Navigation Utilities"
Cohesion: 0.1
Nodes (21): 5.1 Guest Visitor, 5.2 Smart Citizen, 5.3 Active Smart Citizen, 5.4 Volunteer, 5.5 Coordinator Roles, 5.6 Admin, 5. User Roles & Organizational Structure, Admin Permissions (+13 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.18
Nodes (11): 2. Tech Stack, Authentication, Backend, Backend, Database, Database, Frontend, Frontend (+3 more)

### Community 7 - "Community Activities & Highlights"
Cohesion: 0.2
Nodes (10): 22. Database Design (High Level), abuse_reports, Core Tables, donations, event_registrations, events, notifications, participation_invites (+2 more)

### Community 8 - "Awareness Activities & Forms"
Cohesion: 0.2
Nodes (10): 8. Public Website Requirements, About Foundation, Awareness Campaigns, Community Support Directory, Contact & Footer, Hero Section, Homepage Goals, Homepage Sections (+2 more)

### Community 9 - "About & Team Content"
Cohesion: 0.22
Nodes (9): 6. Public Website Module, Awareness Section, Event Section, Hero Section, Homepage Sections, Main CTA Buttons, Need Help Preview, Public Pages (+1 more)

### Community 10 - "Public Layout & Footer"
Cohesion: 0.22
Nodes (9): 11. Volunteer Management System, Consent Fields, Eligibility Indicators, Media Upload, Personal Information, Professional Information, Volunteer Application, Volunteer Application Form (+1 more)

### Community 12 - "Root Layout & Fonts"
Cohesion: 0.25
Nodes (8): 12. Need Help Module, Accessible By, Contact Methods, Purpose, Search Categories, Search Filters, Volunteer Public Profile, Volunteer Visibility Rules

### Community 13 - "Admin Login Page"
Cohesion: 0.25
Nodes (8): 23. API Standards, API Rules, code:txt (/api/v1/), code:json ({), code:json ({), Error Response, Response Structure, Success Response

### Community 14 - "Member Login Page"
Cohesion: 0.25
Nodes (8): 13. Volunteer Management System, Eligibility Indicators, Media Uploads, Personal Information, Professional Information, Volunteer Application Process, Volunteer Approval Workflow, Volunteer Form Fields

### Community 15 - "Citizen Dashboard Page"
Cohesion: 0.22
Nodes (8): 1. Preferred UI Components, 2. Next.js Image Optimization, 3. Styling with Tailwind CSS, 4. General React & TypeScript Standards, 5. Mobile-First and Theme Responsive Design, 6. Next.js 16+ Routing and Proxy (No middleware.ts), code:tsx (import Image from "next/image";), Frontend Coding Rules

### Community 16 - "Citizen Settings Page"
Cohesion: 0.06
Nodes (35): forgetPassword(), getSystemStats(), loginUser(), registerUser(), updateProfilePhoto(), AuthResponse, ForgetPasswordPayload, ForgetPasswordResponse (+27 more)

### Community 17 - "Citizen Layout"
Cohesion: 0.29
Nodes (7): 7. Need Help Functionality, Contact Options, Module Purpose, Privacy Controls, Supported Profiles, User Access, Visibility Rules

### Community 18 - "ESLint Configuration"
Cohesion: 0.29
Nodes (7): 10. Smart Citizen Registration Module, Optional Future Fields, Registration Fields, Registration Workflow, Required Fields, Rules, Smart Citizen ID

### Community 19 - "PostCSS Configuration"
Cohesion: 0.29
Nodes (7): 11. User Dashboard, Contribution History, Dashboard Purpose, Dashboard Sections, Notification Center, Participation Overview, Personal Profile

### Community 20 - "Next.js Configuration"
Cohesion: 0.05
Nodes (29): createEvent(), deleteEvent(), getAllEvents(), updateEventImage(), CreateEventPayload, EventResponse, UpdateEventPayload, CreateEventModal() (+21 more)

### Community 21 - "Next.js Environment"
Cohesion: 0.06
Nodes (30): AwarenessFeature(), metadata, AwarenessForm(), AwarenessFormProps, validationSchema, AwarenessList(), mockActivities, campaignsColumns (+22 more)

### Community 22 - "Community 22"
Cohesion: 0.33
Nodes (6): 4. High-Level System Architecture, Backend Architecture, code:bash (src/), code:bash (cmd/), Frontend Architecture, Suggested Frontend Structure

### Community 23 - "Community 23"
Cohesion: 0.33
Nodes (6): 7. Authentication Module, Forgot Password, Login Flow, Registration Flow, Security Requirements, Smart Citizen Registration

### Community 24 - "Community 24"
Cohesion: 0.33
Nodes (6): 10. Awareness Participation System, code:txt (/gsc/invite/abc123), Important Restriction, Participation Invite Link, Purpose, Tracking Requirements

### Community 25 - "Community 25"
Cohesion: 0.33
Nodes (6): 21. Admin Panel Requirements, Admin Dashboard, Campaign Management, Role Management, User Management, Volunteer Management

### Community 26 - "Community 26"
Cohesion: 0.33
Nodes (6): 26. Suggested Technology Stack, Authentication, Backend, Database, File Storage, Frontend

### Community 28 - "Community 28"
Cohesion: 0.06
Nodes (35): dependencies, axios, class-variance-authority, clsx, formik, framer-motion, lucide-react, next (+27 more)

### Community 30 - "Community 30"
Cohesion: 0.4
Nodes (3): Base, User, UserType

### Community 31 - "Community 31"
Cohesion: 0.4
Nodes (5): 15. Transparency & Participation Tracking, Access Restriction Rules, Admin-Level Transparency, User-Level Transparency, Volunteer/Coordinator-Level Transparency

### Community 32 - "Community 32"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 33 - "Community 33"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 34 - "Community 34"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 36 - "Community 36"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 37 - "Community 37"
Cohesion: 0.29
Nodes (7): 21. Admin Panel, Admin Dashboard Widgets, Campaign Management, Event Management, Moderation Panel, User Management, Volunteer Management

### Community 38 - "Community 38"
Cohesion: 0.5
Nodes (3): ForgetPassword, LoginUser, RegisterUser

### Community 39 - "Community 39"
Cohesion: 0.33
Nodes (6): 9. Dashboard Module, Contribution History, Dashboard Sections, Notifications, Participation Stats, Personal Profile Card

### Community 40 - "Community 40"
Cohesion: 0.33
Nodes (6): 1. Document Information, Document Type, Organization, Project Name, Purpose of this Document, Version

### Community 41 - "Community 41"
Cohesion: 0.4
Nodes (5): 14. Donation System, Donation Features, Donation Rules, Payment Gateway Integration, Store Payment Details

### Community 42 - "Community 42"
Cohesion: 0.5
Nodes (3): Answer, Q: Why does cn() connect Layout & Navigation Utilities to Awareness Activities & Forms, Forms & Citizen Dashboard, Admin Dashboard & Tables, Package Dependencies & Scripts?, Source Nodes

### Community 43 - "Community 43"
Cohesion: 0.5
Nodes (3): Answer, Q: all the code components are completely mobile responsive?, Source Nodes

### Community 46 - "Community 46"
Cohesion: 0.67
Nodes (3): 22. Notification System, Communication Channels, Notification Types

### Community 47 - "Community 47"
Cohesion: 0.4
Nodes (5): 16. Donation & Contribution System, Compliance Note, Contribution Features, Contribution Records, Purpose

### Community 49 - "Community 49"
Cohesion: 0.5
Nodes (4): 13. Event Management System, Event Features, Event Fields, User Features

### Community 50 - "Community 50"
Cohesion: 0.5
Nodes (4): 16. Consent & Privacy Module, Consent Requirements, GDPR-style Compliance, Privacy Controls

### Community 54 - "Community 54"
Cohesion: 0.5
Nodes (4): 17. Abuse & Moderation Module, Admin Features, Features, Spam Protection

### Community 55 - "Community 55"
Cohesion: 0.22
Nodes (4): Header(), NavItem, navItems, Sidebar()

### Community 64 - "Community 64"
Cohesion: 0.67
Nodes (3): 15. Search & Discovery System, Backend Search Optimization, Search Engine Requirements

### Community 65 - "Community 65"
Cohesion: 0.5
Nodes (4): 9. Authentication System, Authentication Flow, Forgot Password Functionality, Login Method

### Community 66 - "Community 66"
Cohesion: 0.05
Nodes (36): getProfile(), priorities, Campaign, CampaignsTable(), initialCampaigns, CitizenDashboard(), ContactForm(), ContentGridProps (+28 more)

### Community 68 - "Community 68"
Cohesion: 0.08
Nodes (21): figtree, metadata, RootLayout(), sourceSans3, config, parseJwt(), proxy(), AuthContext (+13 more)

### Community 70 - "Community 70"
Cohesion: 0.5
Nodes (4): 20. Coordinator System, Coordinator Responsibilities, Coordinator Roles, Internal Participation Metrics

### Community 74 - "Community 74"
Cohesion: 0.5
Nodes (4): 25. Frontend UI Requirements, Component Requirements, Styling, UI Guidelines

### Community 81 - "Community 81"
Cohesion: 0.5
Nodes (4): 27. Deployment Requirements, Backend Deployment, CI/CD, Frontend Deployment

### Community 82 - "Community 82"
Cohesion: 0.5
Nodes (4): 8. Smart Citizen Module, code:txt (GSC000523), Smart Citizen Features, Smart Citizen ID Generation

### Community 89 - "Community 89"
Cohesion: 0.5
Nodes (4): 12. Awareness Participation System, Community Participation System, Important Compliance Note, Purpose

### Community 91 - "Community 91"
Cohesion: 0.17
Nodes (4): documents, cn(), Separator(), Switch()

### Community 92 - "Community 92"
Cohesion: 0.5
Nodes (4): 19. Consent & Privacy Management, Compliance Standards, Consent Management, Privacy Controls

### Community 93 - "Community 93"
Cohesion: 0.2
Nodes (8): Spinner(), Table(), TableBody(), TableCell(), TableHead(), TableHeader(), TableRow(), TableComponentProps

### Community 95 - "Community 95"
Cohesion: 0.5
Nodes (4): 20. Abuse & Moderation System, Admin Moderation Rights, Features, Purpose

### Community 96 - "Community 96"
Cohesion: 0.5
Nodes (4): 25. Non-Functional Requirements, Performance, Scalability, SEO Requirements

### Community 97 - "Community 97"
Cohesion: 0.5
Nodes (4): 2. Foundation Overview, Core Vision, Mission, Organization Name

### Community 99 - "Community 99"
Cohesion: 0.67
Nodes (3): 29. Logging & Monitoring, Logging, Monitoring Tools

### Community 103 - "Community 103"
Cohesion: 0.67
Nodes (3): 23. Coordinator Responsibilities, Coordinator Functions, Internal Participation Thresholds (Administrative Reference)

### Community 107 - "Community 107"
Cohesion: 0.67
Nodes (3): 27. Legal & Compliance Considerations, Important Compliance Principle, Mandatory Legal Review Areas

### Community 108 - "Community 108"
Cohesion: 0.67
Nodes (3): 3. Platform Objectives, Primary Objectives, Secondary Objectives

### Community 114 - "Community 114"
Cohesion: 0.5
Nodes (4): 19. Role & Permission System, Admin Access, RBAC (Role-Based Access Control), Volunteer Access

## Knowledge Gaps
- **380 isolated node(s):** `config`, `name`, `version`, `private`, `dev` (+375 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **31 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Community 91` to `Community 66`, `Community 68`, `Contact Info Components`, `Community 44`, `Citizen Settings Page`, `Community 61`, `Next.js Configuration`, `Next.js Environment`, `Community 87`, `Community 55`, `Community 28`, `Community 93`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **Why does `Button` connect `Next.js Environment` to `Community 66`, `Community 35`, `Contact Info Components`, `Citizen Settings Page`, `Next.js Configuration`, `Community 55`, `Community 91`, `Community 61`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `clsx` connect `Community 28` to `Community 91`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `config`, `name`, `version` to the rest of the system?**
  _380 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Public Pages & Policies` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._
- **Should `Forms & Citizen Dashboard` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Home & Impact Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._