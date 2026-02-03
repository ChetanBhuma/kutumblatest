# Kutumb Portal - CTO Technical Documentation

**Delhi Police Senior Citizen Welfare Portal**
**Version:** 1.0
**Date:** February 2026
**Classification:** Internal Technical Reference

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Backend Architecture](#4-backend-architecture)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Database Design](#6-database-design)
7. [API Documentation](#7-api-documentation)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Business Logic & Workflows](#9-business-logic--workflows)
10. [Security Architecture](#10-security-architecture)
11. [Deployment & Infrastructure](#11-deployment--infrastructure)
12. [Appendices](#12-appendices)

---

## 1. Executive Summary

### 1.1 Purpose

The Kutumb Portal is a comprehensive digital platform developed for Delhi Police to manage senior citizen welfare through systematic registration, verification, regular welfare visits, emergency SOS alerts, and vulnerability assessment.

### 1.2 Key Objectives

- **Citizen Registration**: Enable senior citizens to register for welfare services
- **Visit Management**: Schedule and track welfare visits by beat officers
- **Emergency Response**: Provide SOS alert system with real-time location tracking
- **Vulnerability Assessment**: Risk scoring system to prioritize high-need citizens
- **Administrative Oversight**: Dashboard and reporting for police management

### 1.3 System Users

| User Type | Description | Portal Access |
|-----------|-------------|---------------|
| Senior Citizen | Registered beneficiaries (60+ years) | Citizen Portal |
| Beat Officer | Ground-level officers conducting visits | Officer App |
| Station House Officer (SHO) | Police station in-charge | Admin Portal |
| Sub-Divisional Officer | Sub-division level supervision | Admin Portal |
| Admin/Super Admin | System administrators | Admin Portal |

### 1.4 Key Metrics

- **Database Models**: 40+ Prisma models
- **API Endpoints**: 150+ REST endpoints
- **Backend Controllers**: 43 controllers
- **Frontend Pages**: 35+ unique routes
- **Police Hierarchy**: 7 Ranges, 16 Districts, 67 Sub-Divisions, 224 Police Stations

---

## 2. System Architecture Overview

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────┬─────────────────┬─────────────────────────────┤
│  Admin Portal   │  Officer App    │     Citizen Portal          │
│  (Next.js)      │  (Next.js PWA)  │     (Next.js)               │
└────────┬────────┴────────┬────────┴────────────┬────────────────┘
         │                 │                      │
         └─────────────────┼──────────────────────┘
                           │ HTTPS/REST API
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │Rate Limit│ │  CORS    │ │ Security │ │  Authentication  │   │
│  │Middleware│ │  Config  │ │ Headers  │ │    JWT/Sessions  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    Express.js Server                     │    │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────────────┐   │    │
│  │  │ Controllers│ │  Services  │ │    Middleware      │   │    │
│  │  │  (43)      │ │   (24)     │ │      (20)          │   │    │
│  │  └────────────┘ └────────────┘ └────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────────┐    │
│  │  PostgreSQL  │ │    Redis     │ │   File Storage       │    │
│  │  (Prisma ORM)│ │   (Cache)    │ │   (S3/Local)         │    │
│  └──────────────┘ └──────────────┘ └──────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 Monorepo Structure

```
kutumbfinal/
├── backend/                 # Express.js API Server
│   ├── src/
│   │   ├── controllers/     # Request handlers (43 files)
│   │   ├── routes/          # API route definitions (32 files)
│   │   ├── services/        # Business logic services (24 files)
│   │   ├── middleware/      # Express middleware (20 files)
│   │   ├── config/          # Configuration files
│   │   └── utils/           # Utility functions
│   └── prisma/
│       ├── schema.prisma    # Database schema (1081 lines)
│       ├── migrations/      # Database migrations
│       └── seeds/           # Seed data scripts
│
├── frontend/                # Next.js Application
│   ├── app/                 # App Router pages (35+ routes)
│   ├── components/          # React components (108 files)
│   ├── contexts/            # React contexts (auth, master-data)
│   ├── lib/                 # Utility libraries (20 files)
│   ├── hooks/               # Custom React hooks
│   └── types/               # TypeScript type definitions
│
└── docs/                    # Documentation
```

---

## 3. Technology Stack

### 3.1 Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Runtime | Node.js | 20.x | JavaScript runtime |
| Framework | Express.js | 4.18.2 | Web application framework |
| Language | TypeScript | 5.3.3 | Type-safe JavaScript |
| ORM | Prisma | 5.22.0 | Database ORM and migrations |
| Database | PostgreSQL | 15.x | Primary relational database |
| Cache | Redis/IORedis | 5.8.2 | Caching and session storage |
| Queue | Bull | 4.16.5 | Background job processing |
| WebSocket | Socket.io | 4.8.1 | Real-time communication |
| Auth | JSON Web Token | 9.0.2 | JWT authentication |
| Validation | Express Validator | 7.0.1 | Request validation |
| Security | Helmet | 7.1.0 | Security headers |
| Logging | Winston | 3.11.0 | Application logging |
| Monitoring | Sentry | 7.91.0 | Error tracking |
| Documentation | Swagger | 6.2.8 | API documentation |

### 3.2 Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | Next.js | 15.5.9 | React framework with App Router |
| Library | React | 19.2.3 | UI component library |
| Language | TypeScript | 5.9.3 | Type-safe JavaScript |
| Styling | Tailwind CSS | 4.1.18 | Utility-first CSS |
| Components | Radix UI | latest | Accessible component primitives |
| Forms | React Hook Form | latest | Form state management |
| Validation | Zod | 4.3.6 | Schema validation |
| Charts | Recharts | latest | Data visualization |
| Maps | Google Maps API | 2.20.8 | Geolocation and mapping |
| Icons | Lucide React | 0.562.0 | Icon library |

### 3.3 Infrastructure

| Component | Technology | Purpose |
|-----------|------------|---------|
| Containerization | Docker | Container deployment |
| Cloud Storage | AWS S3 | File storage |
| Process Manager | PM2 | Node.js process management |
| Reverse Proxy | Nginx | Load balancing, SSL termination |

---

## 4. Backend Architecture

### 4.1 Directory Structure

```
backend/src/
├── app.ts                   # Express application setup
├── server.ts                # Server entry point
├── config/
│   ├── index.ts             # Environment configuration
│   ├── database.ts          # Database connection
│   ├── prisma.ts            # Prisma client instance
│   ├── redis.ts             # Redis client configuration
│   ├── swagger.ts           # API documentation (760 lines)
│   ├── logger.ts            # Winston logger setup
│   ├── multer.ts            # File upload configuration
│   └── sentry.ts            # Error monitoring
├── controllers/             # 43 controller files
├── routes/                  # 32 route files
├── services/                # 24 service files
├── middleware/              # 20 middleware files
├── utils/                   # Utility functions
└── types/                   # TypeScript types
```

### 4.2 Controllers (43 Total)

| Controller | Purpose | Key Endpoints |
|------------|---------|---------------|
| `authController.ts` | User authentication | login, logout, refresh |
| `citizenController.ts` | Citizen CRUD operations | create, read, update, delete |
| `citizenPortalController.ts` | Citizen self-service | registration, profile |
| `citizenProfileController.ts` | Profile management | view, update profile |
| `visitController.ts` | Visit management | schedule, complete, cancel |
| `sosController.ts` | Emergency alerts | trigger, respond, resolve |
| `officerController.ts` | Officer management | CRUD, assignments |
| `officerDashboardController.ts` | Officer metrics | dashboard data |
| `roleController.ts` | Role management | CRUD, permissions |
| `userController.ts` | User administration | CRUD, role assignment |
| `reportController.ts` | Analytics & reports | statistics, exports |
| `vulnerabilityController.ts` | Risk assessment | calculate, configure |
| `beatController.ts` | Beat management | CRUD, assignments |
| `policeStationController.ts` | PS management | CRUD operations |
| `districtController.ts` | District management | CRUD operations |
| `rangeController.ts` | Range management | CRUD operations |
| `subDivisionController.ts` | Sub-division mgmt | CRUD operations |
| `notificationController.ts` | Notifications | send, list, mark read |
| `leaveController.ts` | Officer leave | apply, approve, reject |
| `feedbackController.ts` | Visit feedback | submit, view |
| `verificationController.ts` | Identity verification | process, status |
| `auditController.ts` | Audit logging | view logs |
| `exportController.ts` | Data exports | CSV, PDF generation |
| `bulkOperationsController.ts` | Bulk imports | CSV import |

### 4.3 Services (24 Total)

| Service | Purpose |
|---------|---------|
| `citizenAuthService.ts` | Citizen authentication logic |
| `vulnerabilityService.ts` | Risk score calculation |
| `notificationService.ts` | Push/SMS notifications |
| `verificationService.ts` | Identity verification workflows |
| `officerTransferService.ts` | Officer transfer handling |
| `cacheService.ts` | Redis caching operations |
| `redisService.ts` | Redis connection management |
| `exportService.ts` | Data export generation |
| `workflowEngine.ts` | Approval workflow processing |
| `websocketService.ts` | Real-time communications |
| `schedulerService.ts` | Cron job scheduling |
| `visitScheduler.ts` | Auto-scheduling visits |
| `duplicateDetectionService.ts` | Duplicate citizen detection |
| `cloudStorageService.ts` | S3 file operations |
| `tokenService.ts` | JWT token management |
| `passwordService.ts` | Password hashing |
| `otpService.ts` | OTP generation/verification |
| `ipBanService.ts` | IP blocking for security |
| `apiKeyService.ts` | API key management |
| `AuditService.ts` | Audit log recording |

### 4.4 Middleware (20 Total)

| Middleware | Purpose |
|------------|---------|
| `authenticate.ts` | JWT token verification |
| `authorize.ts` | Role-based access control |
| `citizenAuth.ts` | Citizen-specific auth |
| `dataScopeMiddleware.ts` | Jurisdiction-based data filtering |
| `rateLimiter.ts` | API rate limiting |
| `validate.ts` | Request validation |
| `validation.ts` | Schema validation |
| `errorHandler.ts` | Global error handling |
| `auditMiddleware.ts` | Automatic audit logging |
| `securityHeaders.ts` | HTTP security headers |
| `securityValidation.ts` | Input sanitization |
| `sessionActivity.ts` | Session tracking |
| `performanceMonitor.ts` | Request timing |
| `requestLogger.ts` | HTTP request logging |
| `ipBan.ts` | IP ban checking |
| `csrf.ts` | CSRF protection |
| `apiKeyAuth.ts` | API key authentication |
| `asyncHandler.ts` | Async error wrapper |
| `notFoundHandler.ts` | 404 handling |
| `prismaMiddleware.ts` | Prisma extensions |

---

## 5. Frontend Architecture

### 5.1 Directory Structure

```
frontend/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── globals.css          # Global styles
│   ├── admin/               # Admin panel routes
│   ├── officer-app/         # Officer mobile app
│   ├── citizen-portal/      # Citizen self-service
│   ├── citizens/            # Citizen management
│   ├── visits/              # Visit management
│   ├── sos/                 # SOS alerts
│   ├── reports/             # Analytics
│   ├── roster/              # Officer roster
│   └── users/               # User management
├── components/              # 108 component files
│   ├── ui/                  # Base UI components (52)
│   ├── auth/                # Authentication components
│   ├── dashboard/           # Dashboard widgets
│   ├── citizens/            # Citizen-related
│   ├── officer/             # Officer-related
│   ├── visits/              # Visit-related
│   ├── reports/             # Report components
│   └── maps/                # Map components
├── contexts/
│   ├── auth-context.tsx     # Authentication state
│   └── master-data-context.tsx # Master data cache
├── lib/
│   ├── api-client.ts        # API client (35754 bytes)
│   ├── utils.ts             # Utility functions
│   ├── security.ts          # Security utilities
│   └── performance.ts       # Performance monitoring
├── hooks/                   # Custom React hooks
└── types/                   # TypeScript definitions
```

### 5.2 App Router Pages

| Route | Description | Access |
|-------|-------------|--------|
| `/` | Landing page with login | Public |
| `/admin/dashboard` | Admin dashboard | Admin |
| `/admin/users` | User management | Admin |
| `/admin/masters` | Master data config | Admin |
| `/citizens` | Citizen list & search | Officers+ |
| `/citizens/[id]` | Citizen details | Officers+ |
| `/citizens/map` | Geographic view | Officers+ |
| `/visits` | Visit management | Officers+ |
| `/visits/calendar` | Visit calendar | Officers+ |
| `/sos` | SOS alert management | Officers+ |
| `/reports` | Analytics & reports | SHO+ |
| `/roster` | Officer roster | SHO+ |
| `/officer-app/dashboard` | Officer mobile dashboard | Officers |
| `/officer-app/citizens` | Officer's assigned citizens | Officers |
| `/citizen-portal/dashboard` | Citizen dashboard | Citizens |
| `/citizen-portal/profile` | Citizen profile | Citizens |
| `/citizen-portal/visits` | Citizen visit history | Citizens |
| `/citizen-portal/sos` | SOS trigger | Citizens |

### 5.3 Context Providers

#### Auth Context (`auth-context.tsx`)

```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  verifyOTP: (mobile: string, otp: string) => Promise<void>;
  loginCitizen: (credentials: CitizenCredentials) => Promise<void>;
  checkPermission: (resource: string, action: string) => boolean;
  checkPermissionByCode: (permissionCode: string) => boolean;
}
```

#### Master Data Context (`master-data-context.tsx`)

```typescript
interface MasterDataContextType {
  ranges: Range[];
  districts: District[];
  subDivisions: SubDivision[];
  policeStations: PoliceStation[];
  beats: Beat[];
  designations: Designation[];
  roles: Role[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}
```

### 5.4 API Client

The `api-client.ts` (35KB) provides a centralized HTTP client:

```typescript
const apiClient = {
  // Authentication
  auth: { login, logout, refreshToken, verifyOTP },

  // Citizens
  citizens: { list, get, create, update, delete, search },

  // Visits
  visits: { list, get, create, complete, cancel, schedule },

  // SOS
  sos: { list, trigger, respond, resolve },

  // Officers
  officers: { list, get, transfer, assignBeat },

  // Master Data
  masters: { ranges, districts, subDivisions, policeStations, beats },

  // Reports
  reports: { dashboard, demographics, performance }
};
```

---

## 6. Database Design

### 6.1 Schema Overview

The Prisma schema (`schema.prisma`) contains **1081 lines** defining **40+ models**.

### 6.2 Core Entity Models

#### User Model
```prisma
model User {
  id             String         @id @default(cuid())
  email          String         @unique
  phone          String         @unique
  passwordHash   String
  role           String         @default("CITIZEN")
  isActive       Boolean        @default(true)
  lastLogin      DateTime?
  mfaEnabled     Boolean        @default(false)
  officerId      String?        @unique
  officerProfile BeatOfficer?   @relation(...)
  SeniorCitizen  SeniorCitizen?
  Session        Session[]
  AuditLog       AuditLog[]
  Notification   Notification[]
}
```

#### SeniorCitizen Model (Primary Entity)
```prisma
model SeniorCitizen {
  id                    String   @id @default(cuid())
  fullName              String
  dateOfBirth           DateTime
  age                   Int
  gender                String
  mobileNumber          String   @unique
  aadhaarNumber         String?  @unique
  permanentAddress      String
  gpsLatitude           Float?
  gpsLongitude          Float?

  // Jurisdiction References
  rangeId               String?
  districtId            String?
  subDivisionId         String?
  policeStationId       String?
  beatId                String?

  // Health Information
  bloodGroup            String?
  healthConditions      String[]
  mobilityConstraints   String?
  livingArrangementId   String?

  // Status & Verification
  vulnerabilityLevel    String   @default("Low")
  idVerificationStatus  IdentityStatus @default(Pending)
  status                String   @default("Pending")
  isActive              Boolean  @default(true)

  // Relations
  Document             Document[]
  EmergencyContact     EmergencyContact[]
  FamilyMember         FamilyMember[]
  HouseholdHelp        HouseholdHelp[]
  SOSAlert             SOSAlert[]
  Visit                Visit[]
  ServiceRequest       ServiceRequest[]
  VulnerabilityHistory VulnerabilityHistory[]
}
```

#### BeatOfficer Model
```prisma
model BeatOfficer {
  id              String   @id @default(cuid())
  name            String
  rank            String
  badgeNumber     String   @unique
  mobileNumber    String   @unique
  policeStationId String?
  beatId          String?
  designationId   String?
  isActive        Boolean  @default(true)

  // Jurisdiction Relations
  rangeId         String?
  districtId      String?
  subDivisionId   String?

  // Dynamic Jurisdiction (Many-to-Many)
  managedRanges         Range[]
  managedDistricts      District[]
  managedSubDivisions   SubDivision[]
  managedPoliceStations PoliceStation[]
  managedBeats          Beat[]

  // Activity Relations
  Visit           Visit[]
  Leave           OfficerLeave[]
  TransferHistory OfficerTransferHistory[]
}
```

### 6.3 Police Hierarchy Models

```
┌─────────────────────────────────────────────────────────────┐
│                     RANGE (7 total)                          │
│  Example: CENTRAL, NORTHERN, SOUTHERN, EASTERN, WESTERN     │
└─────────────────────────┬───────────────────────────────────┘
                          │ 1:N
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    DISTRICT (16 total)                       │
│  Example: CENTRAL, NORTH, SOUTH, EAST, WEST                 │
└─────────────────────────┬───────────────────────────────────┘
                          │ 1:N
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUB_DIVISION (67 total)                     │
│  Example: KAROL BAGH, CIVIL LINES, HAUZ KHAS                │
└─────────────────────────┬───────────────────────────────────┘
                          │ 1:N
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                POLICE_STATION (224 total)                    │
│  Example: PS KAROL BAGH, PS CIVIL LINES                     │
└─────────────────────────┬───────────────────────────────────┘
                          │ 1:N
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      BEAT                                    │
│  Smallest patrol unit with GeoJSON boundaries               │
└─────────────────────────────────────────────────────────────┘
```

### 6.4 Visit & SOS Models

```prisma
model Visit {
  id              String      @id @default(cuid())
  seniorCitizenId String
  officerId       String
  policeStationId String
  beatId          String?
  scheduledDate   DateTime
  completedDate   DateTime?
  status          VisitStatus @default(SCHEDULED)
  visitType       String
  priority        String?     @default("NORMAL")
  photoUrl        String?
  gpsLatitude     Float?
  gpsLongitude    Float?
  duration        Int?
  assessmentData  Json?
  riskScore       Float?
}

model SOSAlert {
  id              String      @id @default(cuid())
  seniorCitizenId String
  latitude        Float
  longitude       Float
  address         String?
  batteryLevel    Int?
  deviceInfo      Json?
  status          AlertStatus @default(Active)
  respondedBy     String?
  respondedAt     DateTime?
  resolvedAt      DateTime?
  notes           String?
  locationUpdates SOSLocationUpdate[]
}
```

### 6.5 Permission System Models

```prisma
model Role {
  id                String       @id @default(cuid())
  code              String       @unique
  name              String
  permissions       Permission[] @relation("RolePermissions")
  jurisdictionLevel String       @default("NONE")
  isMultiSelect     Boolean      @default(false)
}

model Permission {
  id           String  @id @default(cuid())
  code         String  @unique  // e.g., "citizens.read"
  name         String
  categoryId   String?
  parentId     String?
  menuPath     String?          // e.g., "/citizens"
  menuLabel    String?
  menuIcon     String?
  isMenuItem   Boolean @default(false)
  roles        Role[]  @relation("RolePermissions")
}

model PermissionCategory {
  id           String       @id @default(cuid())
  code         String       @unique
  name         String
  icon         String?
  displayOrder Int          @default(0)
  permissions  Permission[]
}
```

### 6.6 Database Enums

```prisma
enum VisitStatus {
  SCHEDULED
  COMPLETED
  CANCELLED
  IN_PROGRESS
  MISSED
}

enum AlertStatus {
  Active
  Responded
  Resolved
  FalseAlarm
}

enum IdentityStatus {
  Pending
  FieldVerified
  Verified
  Rejected
  Suspended
}

enum RegistrationStatus {
  IN_PROGRESS
  PENDING_REVIEW
  APPROVED
  REJECTED
}

enum RequestStatus {
  Pending
  In_Progress
  Resolved
  Closed
  Rejected
}

enum LeaveStatus {
  Pending
  Approved
  Rejected
  Cancelled
}

enum VerificationStatus {
  PENDING
  APPROVED
  REJECTED
  IN_PROGRESS
}
```

### 6.7 Database Indexes

Critical indexes for performance:

```prisma
// SeniorCitizen indexes
@@index([mobileNumber])
@@index([aadhaarNumber])
@@index([policeStationId])
@@index([beatId])
@@index([vulnerabilityLevel])
@@index([isActive])
@@index([policeStationId, isActive])  // Composite

// Visit indexes
@@index([officerId])
@@index([seniorCitizenId])
@@index([status])
@@index([scheduledDate])
@@index([officerId, status])          // Composite
@@index([status, scheduledDate])      // Composite

// SOSAlert indexes
@@index([seniorCitizenId])
@@index([status])
@@index([createdAt])
@@index([status, createdAt])          // Composite
```

---

## 7. API Documentation

### 7.1 API Base URL

```
Development: http://localhost:5000/api/v1
Production:  https://api.seniorcare.delhipolice.gov.in/api/v1
```

### 7.2 Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/otp/send` | Send OTP to mobile |
| POST | `/auth/otp/verify` | Verify OTP and login |
| POST | `/auth/refresh` | Refresh JWT token |
| POST | `/auth/logout` | Logout and invalidate session |
| POST | `/auth/forgot-password` | Request password reset |

### 7.3 Citizen Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/citizens` | List citizens (paginated) |
| GET | `/citizens/:id` | Get citizen details |
| POST | `/citizens` | Create new citizen |
| PUT | `/citizens/:id` | Update citizen |
| DELETE | `/citizens/:id` | Soft delete citizen |
| GET | `/citizens/search` | Advanced search |
| GET | `/citizens/map` | Map view data |
| POST | `/citizens/bulk-import` | CSV import |

### 7.4 Visit Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/visits` | List visits |
| GET | `/visits/:id` | Get visit details |
| POST | `/visits` | Schedule new visit |
| POST | `/visits/:id/start` | Start visit |
| POST | `/visits/:id/officer-complete` | Complete visit |
| PUT | `/visits/:id/cancel` | Cancel visit |
| GET | `/visits/officer/assignments` | Officer's assignments |
| POST | `/visits/auto-schedule` | Auto-schedule visits |

### 7.5 SOS Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sos` | List all alerts |
| GET | `/sos/active` | Active alerts only |
| GET | `/sos/:id` | Alert details |
| POST | `/sos` | Create alert |
| PATCH | `/sos/:id/status` | Update status |
| POST | `/sos/:id/respond` | Mark as responding |
| POST | `/sos/:id/resolve` | Resolve alert |

### 7.6 Master Data Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ranges` | List ranges |
| GET | `/districts` | List districts |
| GET | `/sub-divisions` | List sub-divisions |
| GET | `/police-stations` | List police stations |
| GET | `/beats` | List beats |
| GET | `/designations` | List designations |
| GET | `/roles` | List roles |
| GET | `/health-conditions` | Health condition masters |
| GET | `/living-arrangements` | Living arrangement masters |

### 7.7 Report Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/dashboard` | Dashboard statistics |
| GET | `/reports/demographics` | Demographic analysis |
| GET | `/reports/performance` | Officer performance |
| GET | `/reports/visits` | Visit analytics |
| GET | `/reports/sos` | SOS analytics |
| GET | `/export` | Export data (CSV/PDF) |

### 7.8 API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ],
  "code": "VALIDATION_ERROR"
}
```

---

## 8. Authentication & Authorization

### 8.1 Authentication Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │      │   Server    │      │  Database   │
└──────┬──────┘      └──────┬──────┘      └──────┬──────┘
       │                    │                    │
       │  POST /auth/login  │                    │
       │ ──────────────────>│                    │
       │                    │  Query User        │
       │                    │ ──────────────────>│
       │                    │                    │
       │                    │  User + Role       │
       │                    │ <──────────────────│
       │                    │                    │
       │                    │  Generate JWT      │
       │                    │  + Refresh Token   │
       │                    │                    │
       │   JWT + Refresh    │                    │
       │ <──────────────────│                    │
       │                    │                    │
       │  API Request       │                    │
       │  + Bearer Token    │                    │
       │ ──────────────────>│                    │
       │                    │                    │
       │                    │  Verify JWT        │
       │                    │  Check Permissions │
       │                    │                    │
       │   Response         │                    │
       │ <──────────────────│                    │
```

### 8.2 JWT Token Structure

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  officerId?: string;
  citizenId?: string;
  jurisdictionLevel: string;
  iat: number;
  exp: number;
}
```

### 8.3 Role Hierarchy

| Role | Level | Jurisdiction | Access |
|------|-------|--------------|--------|
| SUPER_ADMIN | 1 | State | Full system access |
| ADMIN | 2 | State | Administrative functions |
| DCP | 3 | Range | Range-level oversight |
| ACP | 4 | District | District management |
| SHO | 5 | Police Station | Station management |
| INSPECTOR | 6 | Sub-Division | Supervision |
| SI | 7 | Police Station | Operations |
| ASI | 8 | Beat | Field operations |
| CONSTABLE | 9 | Beat | Field visits |
| CITIZEN | 10 | Self | Self-service only |

### 8.4 Permission System

#### Permission Code Format
```
{resource}.{action}

Examples:
- citizens.read
- citizens.write
- visits.create
- sos.respond
- reports.view
- admin.users.manage
```

#### Authorization Check (Backend)
```typescript
// Middleware usage
router.get('/citizens',
  authenticate,
  authorize(['citizens.read']),
  citizenController.list
);
```

#### Authorization Check (Frontend)
```typescript
// Context hook usage
const { checkPermissionByCode } = useAuth();

if (checkPermissionByCode('citizens.write')) {
  // Show edit button
}
```

### 8.5 Data Scoping Middleware

The `dataScopeMiddleware` automatically filters data based on user's jurisdiction:

```typescript
// Example: Officer sees only their beat's citizens
req.dataScope = {
  rangeId: user.rangeId,
  districtId: user.districtId,
  subDivisionId: user.subDivisionId,
  policeStationId: user.policeStationId,
  beatId: user.beatId
};

// Applied in queries
const citizens = await prisma.seniorCitizen.findMany({
  where: {
    ...req.dataScope,
    ...otherFilters
  }
});
```

---

## 9. Business Logic & Workflows

### 9.1 Citizen Registration Workflow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   START      │──>│  OTP Verify  │──>│  Fill Form   │──>│   Submit     │
│  Register    │   │   Mobile     │   │  (Multi-step)│   │  for Review  │
└──────────────┘   └──────────────┘   └──────────────┘   └──────┬───────┘
                                                                 │
                                                                 ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   ACTIVE     │<──│  ID Card     │<──│   Admin      │<──│ Verification │
│   Citizen    │   │   Issued     │   │   Approval   │   │    Visit     │
└──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘
```

**Status Transitions:**
1. `IN_PROGRESS` → `PENDING_REVIEW` (citizen submits)
2. `PENDING_REVIEW` → `APPROVED` / `REJECTED` (admin action)
3. `APPROVED` → `CARD_ISSUED` (automatic)

### 9.2 Visit Lifecycle

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│  SCHEDULED   │──>│ IN_PROGRESS  │──>│  COMPLETED   │
│              │   │  (Started)   │   │  (Submitted) │
└──────┬───────┘   └──────────────┘   └──────────────┘
       │
       ├──> CANCELLED (Admin/Officer cancels)
       │
       └──> MISSED (Auto-marked if past date)
```

**Visit Types:**
- `ROUTINE` - Regular welfare check
- `VERIFICATION` - Identity verification
- `FOLLOW_UP` - Follow-up on previous issues
- `EMERGENCY` - Urgent response
- `RE_VERIFICATION` - Address change verification

### 9.3 SOS Alert Workflow

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   ACTIVE     │──>│  RESPONDED   │──>│   RESOLVED   │
│ (Triggered)  │   │ (Officer ACK)│   │  (Closed)    │
└──────┬───────┘   └──────────────┘   └──────────────┘
       │
       └──> FALSE_ALARM (If determined false)
```

**SOS Processing:**
1. Citizen triggers SOS with GPS location
2. System identifies assigned beat officer
3. Notification sent (SMS + Push + WebSocket)
4. Officer marks as "Responding"
5. Officer marks as "Resolved" with notes
6. Audit log created

### 9.4 Vulnerability Scoring

The vulnerability score is calculated based on weighted factors:

```typescript
const VULNERABILITY_FACTORS = {
  age: { weight: 15, threshold: { 80: 15, 75: 10, 70: 5 } },
  livingAlone: { weight: 20 },
  noFamilyNearby: { weight: 15 },
  physicalDisability: { weight: 15 },
  chronicIllness: { weight: 10 },
  mobilityIssues: { weight: 10 },
  noRegularVisits: { weight: 10 },
  economicVulnerability: { weight: 5 }
};

// Score ranges
const VULNERABILITY_BANDS = [
  { name: 'LOW', min: 0, max: 25, visitFrequencyDays: 30 },
  { name: 'MEDIUM', min: 26, max: 50, visitFrequencyDays: 14 },
  { name: 'HIGH', min: 51, max: 75, visitFrequencyDays: 7 },
  { name: 'CRITICAL', min: 76, max: 100, visitFrequencyDays: 3 }
];
```

### 9.5 Auto-Scheduling Algorithm

```typescript
async function autoScheduleVisits() {
  // 1. Get all active citizens due for visit
  const dueForVisit = await getCitizensDueForVisit();

  // 2. Group by beat
  const byBeat = groupBy(dueForVisit, 'beatId');

  // 3. For each beat, get assigned officer
  for (const [beatId, citizens] of Object.entries(byBeat)) {
    const officer = await getOfficerForBeat(beatId);

    // 4. Calculate officer's workload
    const workload = await getOfficerWorkload(officer.id);

    // 5. Schedule visits based on priority
    const prioritized = citizens.sort((a, b) =>
      b.vulnerabilityScore - a.vulnerabilityScore
    );

    // 6. Create scheduled visits
    for (const citizen of prioritized.slice(0, MAX_DAILY_VISITS)) {
      await createVisit({
        citizenId: citizen.id,
        officerId: officer.id,
        scheduledDate: getNextAvailableSlot(officer),
        visitType: 'ROUTINE'
      });
    }
  }
}
```

---

## 10. Security Architecture

### 10.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 1: NETWORK                              │
│  • HTTPS/TLS 1.3                                                │
│  • WAF (Web Application Firewall)                               │
│  • DDoS Protection                                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 2: APPLICATION                          │
│  • Rate Limiting (100 req/15min)                                │
│  • IP Ban Service                                               │
│  • CORS Configuration                                           │
│  • Security Headers (Helmet)                                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 3: AUTHENTICATION                       │
│  • JWT Token Validation                                         │
│  • Session Management                                           │
│  • OTP Verification                                             │
│  • MFA Support                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 4: AUTHORIZATION                        │
│  • Role-Based Access Control                                    │
│  • Permission Checking                                          │
│  • Data Scope Filtering                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 5: DATA                                 │
│  • Input Validation                                             │
│  • SQL Injection Prevention                                     │
│  • XSS Protection                                               │
│  • Sensitive Data Encryption                                    │
│  • Audit Logging                                                │
└─────────────────────────────────────────────────────────────────┘
```

### 10.2 Security Headers (Helmet Configuration)

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.seniorcare.delhipolice.gov.in"]
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
```

### 10.3 Rate Limiting

```typescript
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: { success: false, message: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts
  message: { success: false, message: 'Too many login attempts' }
});
```

### 10.4 Input Validation

```typescript
// Express Validator example
const citizenValidation = [
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 100 })
    .matches(/^[a-zA-Z\s]+$/),
  body('mobileNumber')
    .isMobilePhone('en-IN')
    .isLength({ min: 10, max: 10 }),
  body('aadhaarNumber')
    .optional()
    .isLength({ min: 12, max: 12 })
    .isNumeric(),
  body('dateOfBirth')
    .isISO8601()
    .custom((value) => {
      const age = calculateAge(value);
      if (age < 60) throw new Error('Must be 60+ years');
      return true;
    })
];
```

### 10.5 Audit Logging

All critical actions are logged:

```typescript
interface AuditLog {
  id: string;
  userId: string;
  action: string;       // CREATE, UPDATE, DELETE, LOGIN, etc.
  resource: string;     // citizens, visits, users, etc.
  resourceId: string;
  changes: string;      // JSON diff of changes
  ipAddress: string;
  userAgent: string;
  timestamp: DateTime;
}

// Automatic logging via middleware
app.use(auditMiddleware);
```

### 10.6 Sensitive Data Handling

| Data Type | Protection Method |
|-----------|-------------------|
| Passwords | bcrypt hash (12 rounds) |
| Aadhaar | Last 4 digits shown, full encrypted |
| Mobile | OTP verification required |
| JWT Tokens | Short expiry (4h), refresh mechanism |
| Session | Redis storage, automatic expiry |
| File Uploads | Authenticated access only |

---

## 11. Deployment & Infrastructure

### 11.1 Environment Configuration

**Backend `.env`:**
```env
DATABASE_URL=postgresql://user:pass@host:5432/kutumb
DIRECT_URL=postgresql://user:pass@host:5432/kutumb
REDIS_URL=redis://localhost:6379
JWT_SECRET=<256-bit-secret>
JWT_EXPIRES_IN=4h
REFRESH_TOKEN_EXPIRES_IN=7d
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_REGION=ap-south-1
AWS_S3_BUCKET=kutumb-uploads
SENTRY_DSN=<sentry-dsn>
```

**Frontend `.env`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=<maps-key>
```

### 11.2 Docker Configuration

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"

  postgres:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=kutumb
      - POSTGRES_PASSWORD=<password>
      - POSTGRES_DB=kutumb

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 11.3 PM2 Configuration

```json
{
  "apps": [{
    "name": "kutumb-backend",
    "script": "dist/server.js",
    "instances": "max",
    "exec_mode": "cluster",
    "env": {
      "NODE_ENV": "production"
    }
  }]
}
```

### 11.4 Nginx Configuration

```nginx
upstream backend {
    server 127.0.0.1:5000;
}

server {
    listen 443 ssl http2;
    server_name api.seniorcare.delhipolice.gov.in;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 12. Appendices

### 12.1 API Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| AUTH_REQUIRED | 401 | No valid token provided |
| AUTH_EXPIRED | 401 | Token has expired |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| VALIDATION_ERROR | 400 | Invalid input data |
| DUPLICATE_ENTRY | 409 | Resource already exists |
| RATE_LIMITED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal server error |

### 12.2 Swagger API Documentation

Access interactive API documentation at:
- Development: http://localhost:5000/api-docs
- Production: https://api.seniorcare.delhipolice.gov.in/api-docs

### 12.3 Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@delhipolice.gov.in | Admin@123 |
| Admin | admin@delhipolice.gov.in | Admin@123 |
| SHO | sho@delhipolice.gov.in | Officer@123 |
| Constable | constable@delhipolice.gov.in | Officer@123 |

### 12.4 Database Migration Commands

```bash
# Generate Prisma client
npm run prisma:generate

# Create migration
npx prisma migrate dev --name <migration_name>

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio
npm run prisma:studio
```

### 12.5 Useful Scripts

```bash
# Backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed:all     # Seed all data

# Frontend
npm run dev          # Start Next.js dev server
npm run build        # Build for production
npm run start        # Start production server
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | February 2026 | Development Team | Initial document |

---

*End of CTO Technical Documentation*
