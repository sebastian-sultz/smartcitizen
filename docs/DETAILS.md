# Technical Product Requirements Document (Technical PRD)
## Global Smart Citizen Foundation Platform

---

# 1. Project Overview

## Project Name
Global Smart Citizen Foundation Platform

## Project Type
NGO-based Citizen Awareness & Volunteer Coordination Platform

## Objective
Build a scalable full-stack web platform for the Global Smart Citizen Foundation that enables:
- Smart Citizen registrations
- Volunteer management
- Community awareness participation
- Need Help directory
- Event & awareness campaign management
- Participation tracking
- Donations/contributions
- Admin operations
- Analytics & moderation

The platform must be:
- Fully responsive
- SEO optimized
- Scalable
- Secure
- Role-based
- Production ready

---

# 2. Tech Stack

## Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Formik
- Yup

- Zustand (if lightweight state needed)

---

## Backend
- Golang
- Gin Framework OR Fiber
- JWT Authentication
- REST APIs
- Clean Architecture
- Repository Pattern

---

## Database
- PostgreSQL

---

## Storage
- AWS S3 OR Cloudinary

---

## Authentication
- Mobile Number + Password
- OTP Verification
- JWT Access Token
- Refresh Token
- HttpOnly Cookies

---

## Payments
- Razorpay
OR
- PhonePe

---

## Hosting
### Frontend
- Vercel

### Backend
- AWS EC2 / DigitalOcean / Railway

### Database
- Supabase PostgreSQL OR AWS RDS

---

# 3. User Roles

## Roles
1. Guest
2. Smart Citizen
3. Active Smart Citizen
4. Volunteer
5. Coordinator
6. Block Coordinator
7. District Coordinator
8. State Coordinator
9. National Coordinator
10. Admin

---

# 4. High-Level System Architecture

## Frontend Architecture
Use:
- App Router architecture
- Server Components where possible
- Client Components only when required
- Route Groups
- Feature-based folder structure

---

## Suggested Frontend Structure

```bash
src/
 ├── app/
 ├── components/
 ├── features/
 ├── services/
 ├── hooks/
 ├── lib/
 ├── store/
 ├── types/
 ├── schemas/
 ├── utils/
 └── constants/
```

---

## Backend Architecture
Use Clean Architecture:

```bash
cmd/
internal/
 ├── handlers/
 ├── services/
 ├── repositories/
 ├── middleware/
 ├── models/
 ├── routes/
 ├── config/
 ├── utils/
 ├── validators/
 └── database/
```

---

# 5. Core Functional Modules

## Modules
1. Public Website
2. Authentication
3. Smart Citizen Registration
4. Dashboard
5. Awareness Participation System
6. Volunteer Management
7. Need Help Module
8. Search & Discovery
9. Donation System
10. Event Management
11. Notifications
12. Admin Panel
13. Consent & Privacy
14. Moderation System
15. Analytics

---

# 6. Public Website Module

## Public Pages

### Required Pages
- Home
- About Us
- Mission & Vision
- Awareness Campaigns
- Events
- Become Smart Citizen
- Need Help
- Contact Us
- Privacy Policy
- Terms & Conditions

---

## Homepage Sections

### Hero Section
- NGO introduction
- Awareness messaging
- CTA buttons

---

### Main CTA Buttons
1. Become a Smart Citizen
2. Need Help?

---

### Awareness Section
- Blogs
- Articles
- Awareness content
- Campaigns

---

### Event Section
- Upcoming events
- Event highlights

---

### Need Help Preview
- Featured volunteers/professionals
- Categories

---

# 7. Authentication Module

## Registration Flow

### Smart Citizen Registration
Fields:
- Full Name
- Mobile Number
- OTP Verification
- Password

Workflow:
1. User submits mobile number
2. OTP sent
3. OTP verified
4. Password created
5. Smart Citizen ID generated
6. Account created

---

## Login Flow
Fields:
- Mobile Number
- Password

---

## Forgot Password
Workflow:
1. Enter mobile number
2. Send OTP
3. Verify OTP
4. Reset password

---

## Security Requirements
- Password hashing using bcrypt
- JWT token authentication
- HttpOnly cookies
- Refresh token support
- Rate limiting
- OTP expiry
- Brute force protection

---

# 8. Smart Citizen Module

## Smart Citizen Features
Users can:
- Login to dashboard
- Upload profile photo
- Update profile
- View Smart Citizen ID
- Participate in awareness campaigns
- Share participation invite links
- View contribution history
- Access Need Help module

---

## Smart Citizen ID Generation
Format Example:

```txt
GSC000523
```

Requirements:
- Unique
- Permanent
- Non-editable
- Auto-generated

---

# 9. Dashboard Module

## Dashboard Sections

### Personal Profile Card
Display:
- Profile photo
- Full name
- Mobile number
- Smart Citizen ID
- Role
- Registration date

---

### Participation Stats
Display:
- Awareness participation count
- Participation Invite Network count
- Volunteer eligibility status
- Contribution statistics

---

### Contribution History
Display:
- Amount
- Date
- Transaction ID
- Payment status
- Download receipt option

---

### Notifications
Display:
- Campaign notifications
- Event notifications
- Admin announcements

---

# 10. Awareness Participation System

## Purpose
Track awareness participation and community engagement.

---

## Participation Invite Link
Each Smart Citizen gets:
- Unique participation invite link

Example:

```txt
/gsc/invite/abc123
```

---

## Tracking Requirements
Track:
- Invited users
- Registration conversions
- Community participation activity
- Awareness campaign participation

---

## Important Restriction
The system must NOT:
- Mention earnings
- Mention commissions
- Mention financial recruitment

---

# 11. Volunteer Management System

## Volunteer Application

### Eligibility Indicators
System should internally track:
- Participation Invite Network activity
- Awareness participation
- Community engagement
- Participation duration

---

## Volunteer Application Form

### Personal Information
- Full name
- Mobile number
- Alternate mobile number
- Email
- Address (optional)
- State (optional)
- District (optional)
- Pin code (optional)

---

### Professional Information
- Profession category
- Specialization
- Experience
- Public description

---

### Media Upload
- Profile image

---

### Consent Fields
Checkboxes:
- Agree to volunteer guidelines
- Consent to public profile visibility
- Consent for Need Help visibility
- Show phone publicly toggle

---

## Volunteer Approval Flow
1. User submits form
2. Admin review
3. Approve/reject
4. Volunteer profile activated

---

# 12. Need Help Module

## Purpose
Professional/community support discovery module.

---

## Accessible By
Only authenticated Smart Citizens.

---

## Volunteer Visibility Rules
Only volunteers who:
- Are approved
- Have enabled public visibility
- Have given consent

shall appear.

---

## Search Categories
- Teachers
- Lawyers
- Doctors
- Educators
- Consultants
- Social workers

---

## Search Filters
- Profession
- Expertise
- Name
- State
- District
- City
- Pin code

---

## Volunteer Public Profile
Fields:
- Name
- Photo
- Profession
- Expertise
- Description
- Contact options
- Optional address

---

## Contact Methods
- WhatsApp redirect
- Platform contact request
- Public phone number (optional)

---

# 13. Event Management System

## Event Features
Admins can:
- Create events
- Update events
- Delete events
- Publish events

---

## Event Fields
- Title
- Description
- Banner image
- Event date
- Location
- Event category
- Registration limit

---

## User Features
Users can:
- View events
- Register for events
- Receive reminders

---

# 14. Donation System

## Donation Features
Users can:
- Make donations
- View donation history
- Download receipts
- Print acknowledgements

---

## Payment Gateway Integration
Support:
- Razorpay
- PhonePe

---

## Store Payment Details
Store:
- Amount
- Transaction ID
- Payment status
- Gateway response
- Receipt number
- Timestamp

---

## Donation Rules
Donations are:
- Voluntary
- Non-refundable (unless admin policy allows)
- Not investment-based

---

# 15. Search & Discovery System

## Search Engine Requirements
Users should search volunteers by:
- Profession
- Expertise
- State
- District
- Pin code
- Name

---

## Backend Search Optimization
Use:
- PostgreSQL indexes
- Full-text search
- Optimized queries

---

# 16. Consent & Privacy Module

## Privacy Controls
Users can:
- Control profile visibility
- Hide/show phone number
- Request profile removal
- Manage public information

---

## Consent Requirements
Store:
- Consent timestamps
- Consent type
- Consent status

---

## GDPR-style Compliance
Support:
- Data deletion request
- Consent withdrawal
- Profile visibility control

---

# 17. Abuse & Moderation Module

## Features
Users can:
- Report profile
- Block user

---

## Admin Features
Admins can:
- Moderate reports
- Suspend users
- Delete abusive profiles
- Restrict visibility

---

## Spam Protection
Implement:
- Rate limiting
- Captcha (optional)
- Abuse detection

---

# 18. Notification System

## Channels
- SMS
- WhatsApp
- Email (future)

---

## Notification Types
- Registration success
- OTP
- Event reminders
- Donation receipts
- Volunteer approval
- Campaign announcements

---

# 19. Role & Permission System

## RBAC (Role-Based Access Control)

Permissions should be role-based.

---

## Admin Access
Full platform access.

---

## Volunteer Access
Can:
- Manage own profile
- View authorized analytics
- Access Need Help visibility controls

Cannot:
- Access admin analytics
- Access other volunteer private data

---

# 20. Coordinator System

## Coordinator Roles
- Coordinator
- Block Coordinator
- District Coordinator
- State Coordinator
- National Coordinator

---

## Internal Participation Metrics
System should internally track:
- Participation Invite Network size
- Awareness participation scale
- Community engagement impact

These metrics are for organizational/admin evaluation only.

---

## Coordinator Responsibilities
- Volunteer engagement
- Campaign support
- Regional coordination
- Event coordination
- Community outreach

---

# 21. Admin Panel

## Admin Dashboard Widgets
Display:
- Total users
- Total volunteers
- Total coordinators
- Total donations
- Event statistics
- Participation analytics
- Geographic analytics

---

## User Management
Features:
- Search users
- Edit users
- Suspend users
- Delete users
- Change roles

---

## Volunteer Management
Features:
- Approve/reject volunteers
- Manage volunteer visibility
- Verify profiles

---

## Event Management
Features:
- CRUD operations for events
- Event registrations
- Event analytics

---

## Campaign Management
Features:
- Create campaigns
- Publish awareness content
- Manage campaigns

---

## Moderation Panel
Features:
- Abuse reports
- Spam reports
- Blocked users
- Moderation actions

---

# 22. Database Design (High Level)

## Core Tables

### users
- id
- full_name
- mobile_number
- password_hash
- role
- smart_citizen_id
- created_at

---

### volunteer_profiles
- user_id
- profession
- specialization
- experience
- description
- public_visibility
- show_phone_publicly

---

### participation_invites
- inviter_id
- invited_user_id
- created_at

---

### donations
- id
- user_id
- amount
- payment_status
- transaction_id
- gateway_response

---

### events
- id
- title
- description
- event_date
- location

---

### event_registrations
- user_id
- event_id

---

### notifications
- id
- user_id
- type
- message

---

### abuse_reports
- id
- reporter_id
- reported_user_id
- reason
- status

---

# 23. API Standards

## API Rules
- REST APIs
- Versioned APIs

Example:

```txt
/api/v1/
```

---

## Response Structure

### Success Response
```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

---

### Error Response
```json
{
  "success": false,
  "message": "Error message"
}
```

---

# 24. Security Requirements

## Mandatory Security Features
- JWT authentication
- HttpOnly cookies
- Password hashing
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Input validation
- Role-based middleware
- Audit logs

---

# 25. Frontend UI Requirements

## UI Guidelines
- Professional NGO design
- Fully responsive
- Accessible UI
- Clean dashboard experience
- Mobile-first design

---

## Styling
Use:
- Tailwind CSS
- shadcn/ui components

---

## Component Requirements
Reusable components:
- Buttons
- Forms
- Dialogs
- Drawers
- Tables
- Pagination
- Cards
- Alerts
- Loaders

---

# 26. SEO Requirements

## SEO Implementation
- Dynamic metadata
- Open Graph tags
- Structured data
- Sitemap
- robots.txt
- SSR rendering

---

# 27. Deployment Requirements

## Frontend Deployment
- Vercel

---

## Backend Deployment
- Dockerized Golang API
- Nginx reverse proxy

---

## CI/CD
Recommended:
- GitHub Actions

---

# 28. Scalability Requirements

The system should support:
- Millions of users
- Large traffic spikes
- Horizontal scaling
- CDN support
- Optimized database indexing

---

# 29. Logging & Monitoring

## Monitoring Tools
Recommended:
- Grafana
- Prometheus
- Sentry

---

## Logging
Track:
- Authentication logs
- Admin actions
- Payment logs
- API errors
- Abuse reports

---

# 30. Future Scope

Future features may include:
- Mobile apps
- AI chatbot
- Multi-language support
- Push notifications
- Advanced analytics
- Volunteer badges
- E-learning system
- Community forums

---

# 31. Final Development Notes

## Important Architectural Notes
The platform must:
- Maintain NGO positioning
- Avoid MLM-style wording
- Avoid earnings-based systems
- Maintain admin-controlled governance
- Prioritize privacy & consent
- Maintain scalable architecture

---

## Final Objective
Build a scalable, secure, NGO-focused citizen awareness and volunteer coordination platform with:
- Modern architecture
- Secure authentication
- Robust admin panel
- Community engagement systems
- Need Help discovery functionality
- Event/campaign management
- Volunteer coordination tools
- Pa