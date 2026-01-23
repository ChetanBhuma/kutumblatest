# Role & Permission Matrix

**Date Generated:** December 30, 2025
**Source:** `backend/src/types/auth.ts` (Application Defaults)

This matrix outlines the standard roles defined in the application and their associated permissions.

## 1. Role Summary

| Role Code | Role Name | Description | Key Access |
| :--- | :--- | :--- | :--- |
| **SUPER_ADMIN** | Super Admin | Full System Access | Everything (`*`) |
| **ADMIN** | Administrator | Operational Management | Users, Reports, Approvals, System Settings |
| **SUPERVISOR** | Supervisor | Field Oversight | Officers, Visits, SOS Resolution |
| **OFFICER** | Beat Officer | Field Operations | Assigned Visits, Citizen Data (Read) |
| **CONTROL_ROOM** | Control Room | Emergency Response | SOS Live Monitor, Dispatch |
| **DATA_ENTRY** | Data Entry | Data Digitization | Citizen Registration, Document Upload |
| **VIEWER** | Viewer | Audit / Inspection | Read-Only Access to most modules |
| **CITIZEN** | Senior Citizen | Self-Service | Own Profile, Own Visits, SOS |

---

## 2. Detailed Permission Matrix

### Legend
*   ✅ = Access Granted
*   ❌ = Access Denied

### Module: Citizen Management

| Permission | ADMIN | OFFICER | SUPERVISOR | DATA_ENTRY | VIEWER | CONTROL_ROOM |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Read Citizens** (`citizens.read`) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Create/Edit Citizens** (`citizens.write`) | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ |
| **Delete Citizens** (`citizens.delete`) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Module: Visits & Beats

| Permission | ADMIN | OFFICER | SUPERVISOR | DATA_ENTRY | VIEWER | CONTROL_ROOM |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Read Visits** (`visits.read`) | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| **Schedule Visits** (`visits.schedule`) | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| **Complete Visits** (`visits.complete`) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |

### Module: Officer Management

| Permission | ADMIN | OFFICER | SUPERVISOR | DATA_ENTRY | VIEWER | CONTROL_ROOM |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Read Officers** (`officers.read`) | ✅ | ❌ | ✅ | ❌ | ✅ | ✅ |
| **Manage/Transfer** (`officers.manage`) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### Module: SOS & Emergencies

| Permission | ADMIN | OFFICER | SUPERVISOR | DATA_ENTRY | VIEWER | CONTROL_ROOM |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **View Alerts** (`sos.read`) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Respond** (`sos.respond`) | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Resolve/Close** (`sos.resolve`) | ✅ | ❌ | ✅ | ❌ | ❌ | ✅ |

### Module: System & Reports

| Permission | ADMIN | OFFICER | SUPERVISOR | DATA_ENTRY | VIEWER | CONTROL_ROOM |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Read Reports** (`reports.read`) | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Export Data** (`reports.export`) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **System Settings** (`system.settings`) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Audit Logs** (`audit.logs`) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## 3. Citizen (App User) Permissions

The `CITIZEN` role is distinct as it is scoped to the user's own data (`.own`).

| Permission | Description |
| :--- | :--- |
| `profile.read.own` | View own personal details |
| `profile.update.own` | Edit permitted fields (e.g., phone, basic info) |
| `visits.read.own` | View history of visits to *their* residence |
| `visits.request` | Request a new visit from the police |
| `sos.create` | Trigger a Panic/SOS Alert |
| `documents.upload` | Upload ID/Medical documents |
