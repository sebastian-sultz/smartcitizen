# Graph Report - .  (2026-05-17)

## Corpus Check
- Large corpus: 183 files · ~2,431,797 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder, or use --no-semantic to run AST-only.

## Summary
- 314 nodes · 451 edges · 22 communities (17 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

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
- [[_COMMUNITY_Root Layout & Fonts|Root Layout & Fonts]]
- [[_COMMUNITY_Admin Login Page|Admin Login Page]]
- [[_COMMUNITY_ESLint Configuration|ESLint Configuration]]
- [[_COMMUNITY_PostCSS Configuration|PostCSS Configuration]]
- [[_COMMUNITY_Next.js Configuration|Next.js Configuration]]

## God Nodes (most connected - your core abstractions)
1. `Card` - 18 edges
2. `CardContent` - 18 edges
3. `compilerOptions` - 16 edges
4. `CardHeader` - 16 edges
5. `CardTitle` - 15 edges
6. `useAdminStore` - 13 edges
7. `Button` - 12 edges
8. `cn()` - 12 edges
9. `Input` - 8 edges
10. `scripts` - 5 edges

## Surprising Connections (you probably didn't know these)
- `cn()` --calls--> `clsx`  [INFERRED]
  lib/utils.ts → package.json
- `EventsTable()` --calls--> `useAdminStore`  [EXTRACTED]
  features/admin/components/EventsTable.tsx → features/admin/store/useAdminStore.ts
- `VolunteerAppsTable()` --calls--> `useAdminStore`  [EXTRACTED]
  features/admin/components/VolunteerAppsTable.tsx → features/admin/store/useAdminStore.ts
- `UsersTable()` --calls--> `useAdminStore`  [EXTRACTED]
  features/admin/components/UsersTable.tsx → features/admin/store/useAdminStore.ts
- `ModerationTable()` --calls--> `useAdminStore`  [EXTRACTED]
  features/admin/components/ModerationTable.tsx → features/admin/store/useAdminStore.ts

## Communities (22 total, 5 thin omitted)

### Community 0 - "Public Pages & Policies"
Cohesion: 0.05
Nodes (7): RegisterForm(), helpAreas, PageHeroProps, programs, policies, refundPolicies, sections

### Community 1 - "Forms & Citizen Dashboard"
Cohesion: 0.16
Nodes (14): ContactFormProps, mockDonations, categories, mockProfessionals, ProfessionalCard(), ProfessionalCardProps, Button, ButtonProps (+6 more)

### Community 2 - "Home & Impact Sections"
Cohesion: 0.06
Nodes (8): amounts, CounterProps, impactItems, partners, priorities, featuredPrograms, events, reasons

### Community 3 - "Admin Dashboard & Tables"
Cohesion: 0.07
Nodes (18): CampaignsTable(), DashboardOverview(), EventsTable(), ModerationTable(), UsersTable(), VolunteerAppsTable(), AdminStore, Campaign (+10 more)

### Community 4 - "Package Dependencies & Scripts"
Cohesion: 0.07
Nodes (28): dependencies, clsx, formik, framer-motion, lucide-react, next, react, react-dom (+20 more)

### Community 5 - "Layout & Navigation Utilities"
Cohesion: 0.11
Nodes (9): Header(), documents, NavItem, navItems, Sidebar(), MissionVisionCardProps, aboutLinks, activityLinks (+1 more)

### Community 6 - "TypeScript Configuration"
Cohesion: 0.1
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 7 - "Community Activities & Highlights"
Cohesion: 0.11
Nodes (4): ContentGridProps, ContentItem, EventRegisterButton(), EmptyStateProps

### Community 8 - "Awareness Activities & Forms"
Cohesion: 0.17
Nodes (9): AwarenessFeature(), metadata, AwarenessForm(), AwarenessFormProps, validationSchema, AwarenessList(), mockActivities, AwarenessActivity (+1 more)

### Community 12 - "Root Layout & Fonts"
Cohesion: 0.4
Nodes (3): figtree, metadata, urbanist

## Knowledge Gaps
- **96 isolated node(s):** `config`, `name`, `version`, `private`, `dev` (+91 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Layout & Navigation Utilities` to `Awareness Activities & Forms`, `Forms & Citizen Dashboard`, `Admin Dashboard & Tables`, `Package Dependencies & Scripts`?**
  _High betweenness centrality (0.250) - this node is a cross-community bridge._
- **Why does `clsx` connect `Package Dependencies & Scripts` to `Layout & Navigation Utilities`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **What connects `config`, `name`, `version` to the rest of the system?**
  _96 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Public Pages & Policies` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `Home & Impact Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Admin Dashboard & Tables` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies & Scripts` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._