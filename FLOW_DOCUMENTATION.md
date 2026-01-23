# 📘 Senior Citizen & Officer Flow Documentation

This document outlines the complete end-to-end flow for Senior Citizens and Officers within the Delhi Police Senior Citizen Welfare Portal, covering both frontend user experience and backend API interactions.

---

## 👴 Senior Citizen Flow

### 1. Registration (New User)
**Goal:** A senior citizen registers themselves or is registered by a family member.

*   **Frontend URL:** `/citizen-portal/register`
*   **User Action:**
    1.  Enters Mobile Number & Name.
    2.  Verifies OTP.
    3.  Completes Multi-step Wizard:
        *   **Personal Details:** Name, DOB, Address.
        *   **Medical Info:** Doctor, Conditions, Mobility.
        *   **Emergency Contacts:** Family members, Neighbors.
        *   **Documents:** Upload Aadhaar, Medical records.
    4.  Submits for approval.
*   **Backend API:**
    *   `POST /api/v1/citizen-portal/registrations/start` - Initiate registration.
    *   `PATCH /api/v1/citizen-portal/registrations/:id` - Save draft steps.
    *   `POST /api/v1/citizen-portal/registrations/:id/submit` - Final submission.
        *   **Action:** Creates `SeniorCitizen` record (Status: Pending) and `VisitRequest` (Type: Verification).
*   **Verification Gate:** The system **blocks** Admin approval until the assigned Officer completes the 'Verification' visit.
*   **Database:** `SeniorCitizen` record is created *immediately* upon submission but remains 'Pending' until approved. `srCitizenUniqueId` is generated at submission.

### 2. Authentication (Login)
**Goal:** Access the portal to manage profile and requests.

*   **Frontend URL:** `/citizen/login`
*   **User Action:** Enters Mobile Number and Password.
*   **Backend API:** `POST /api/v1/citizen-auth/login`
    *   **Payload:** `{ mobileNumber, password }`
    *   **Response:** JWT Token containing `userId`, `role: CITIZEN`, and `citizenId`.
*   **Key Logic:** The backend fetches the linked `SeniorCitizen` profile and embeds the `citizenId` in the token, which is crucial for subsequent API calls.

### 3. Dashboard
**Goal:** View summary of status, upcoming visits, and quick actions.

*   **Frontend URL:** `/citizen-portal/dashboard`
*   **Backend API:**
    *   `GET /api/v1/citizen-profile/profile` - Fetches name, status, beat officer details.
    *   `GET /api/v1/citizen-profile/visits` - Fetches recent visits.
    *   `GET /api/v1/citizen-profile/sos` - Fetches recent alerts.

### 4. Visit Management
**Goal:** View visit history and request new visits.

*   **Frontend URL:** `/citizen-portal/visits`
*   **User Action:**
    *   **View History:** Lists past and upcoming visits.
    *   **Request Visit:** Clicks "Request Visit", selects date/type (Routine/Emergency).
*   **Backend API:**
    *   `GET /api/v1/citizen-profile/visits` - Returns list of `Visit` and `VisitRequest` records.
    *   `POST /api/v1/citizen-profile/visits/request` - Creates a `VisitRequest`.

### 5. SOS Emergency
**Goal:** Trigger an immediate distress signal.

*   **Frontend URL:** `/citizen-portal/sos` (or Dashboard SOS button)
*   **User Action:** Clicks the big red SOS button.
*   **Backend API:** `POST /api/v1/citizen-profile/sos`
    *   **Payload:** `{ latitude, longitude, address }`
    *   **Logic:** Creates `SOSAlert`, triggers notifications (SMS/Push) to assigned Beat Officer and Emergency Contacts.

---

## 👮 Officer Flow

### 1. Authentication
**Goal:** Log in to the Officer App/Portal.

*   **Frontend URL:** `/admin/login`
*   **User Action:**
    *   **Option A:** Email/Password (e.g., `officer1@delhipolice.gov.in`).
    *   **Option B:** OTP Login (Mobile Number).
*   **Backend API:** `POST /api/v1/auth/login` or `/api/v1/auth/otp/verify`
    *   **Response:** JWT Token with `role: OFFICER` and permissions.

### 2. Dashboard
**Goal:** View assigned beat, pending visits, and active alerts.

*   **Frontend URL:** `/admin/dashboard` (Officer View)
*   **Backend API:**
    *   `GET /api/v1/officer-app/dashboard/metrics` - Stats on assigned citizens, pending visits.
    *   `GET /api/v1/officer-app/dashboard/nearby` - Map view of citizens in beat.
    *   `GET /api/v1/officer-app/dashboard/suggestions` - AI-driven visit recommendations.

### 3. Visit Assignments & Execution
**Goal:** View daily roster and complete visits.

*   **Frontend URL:** `/admin/visits` (or Officer App Roster)
*   **User Action:**
    1.  **View List:** Sees assigned visits for the day.
    2.  **Start Visit:** Clicks "Start" when arriving at location.
    3.  **Complete Visit:** Fills assessment form, uploads photo, submits.
*   **Backend API:**
    *   `GET /api/v1/visits/officer/assignments` - Fetches assigned visits.
    *   `POST /api/v1/visits/:id/start` - Marks status as 'In Progress', logs start time & location.
    *   `POST /api/v1/visits/:id/officer-complete` - Marks as 'Completed', saves assessment data, risk score, and photos.

### 4. SOS Response
**Goal:** Respond to emergency alerts.

*   **Frontend URL:** `/admin/sos`
*   **User Action:** Receives notification, views alert details/map, updates status.
*   **Backend API:**
    *   `GET /api/v1/sos/active` - Lists active alerts in beat.
    *   `PATCH /api/v1/sos/:id/status` - Updates status to 'Responding' or 'Resolved'.

### 5. Citizen Management
**Goal:** View details of citizens in assigned beat.

*   **Frontend URL:** `/admin/citizens`
*   **Backend API:**
    *   `GET /api/v1/citizens` - Filtered by Officer's Beat ID.
    *   `GET /api/v1/citizens/:id` - Detailed view including medical info and history.

---

## 🔄 Key Interactions

1.  **Visit Request -> Assignment:**
    *   **Auto-Assignment:** If a Citizen's address maps to a known Beat with an active Officer, the Verification Visit is **automatically created and assigned** to that Officer upon registration.
    *   **Manual Assignment:** If no Beat Officer is found, the request remains 'Pending' for an Admin/Supervisor to manually assign.
2.  **SOS -> Response:**
    *   Citizen triggers SOS -> Officer gets alert -> Officer responds -> Incident logged.
3.  **Registration -> Verification:**
    *   Citizen registers -> Officer visits for physical verification -> Admin approves -> Citizen gets digital card.

---

## 🛡️ Admin Flow

### 1. Dashboard & Analytics
**Goal:** High-level oversight of the entire system.

*   **Frontend URL:** `/admin/dashboard`
*   **Backend API:** `GET /api/v1/reports/dashboard`
    *   **Data:** Real-time counters for Citizens (Total/Verified/Vulnerable), Officers (Active/Total), Visits (Pending/Completed), and SOS Alerts.

### 2. User & Role Management
**Goal:** Manage staff access and hierarchy.

*   **Frontend URL:** `/admin/users`
*   **Backend API:**
    *   `GET /api/v1/users` - List all staff.
    *   `POST /api/v1/users` - Create new Officer/Supervisor.
    *   `PUT /api/v1/users/:id/role` - Promote/Demote.
    *   `PATCH /api/v1/users/:id` - Deactivate user.

### 3. Master Data Management
**Goal:** Configure the organizational structure.

*   **Frontend URL:** `/admin/masters`
*   **Backend API:**
    *   `GET/POST /api/v1/districts`
    *   `GET/POST /api/v1/police-stations`
    *   `GET/POST /api/v1/beats`
    *   `GET/POST /api/v1/roles`

### 4. Approvals & Workflow
**Goal:** Review and approve citizen registrations.

*   **Frontend URL:** `/admin/approvals` (or `/citizens/inbox`)
*   **Backend API:**
    *   `GET /api/v1/citizen-portal/registrations` - List pending applications.
    *   `GET /api/v1/citizen-portal/registrations/:id/details` - View full details + timeline.
    *   `PATCH /api/v1/citizen-portal/registrations/:id/status` - Approve/Reject (Enforces Verification Gate).

### 5. Reports & Exports
**Goal:** Generate data for external reporting.

*   **Frontend URL:** `/admin/reports`
*   **Backend API:**
    *   `GET /api/v1/reports/demographics`
    *   `GET /api/v1/reports/performance`
    *   `GET /api/v1/export?type=citizens&format=csv`

### 6. System Administration (New)
**Goal:** Maintain system health and configuration.

*   **Frontend URL:** `/admin/settings`, `/admin/audit`
*   **Backend API:**
    *   `GET /api/v1/audit/logs` - View system audit logs.
    *   `GET/PUT /api/v1/settings` - Manage dynamic system configuration.

---

## ✅ Completed Enhancements

1.  **Audit Log Viewer:** Implemented `AuditController` to expose `AuditLog` data.
2.  **Real Workflow Status:** `WorkflowController` now queries real `CitizenRegistration` status instead of mocking.
3.  **System Settings:** Added `SystemSetting` model and controller for dynamic configuration.
4.  **Automated Digital Card:** Registration approval now automatically issues a Digital Card.
