# Role Management System Analysis Report

## 1. Executive Summary

This report provides a comprehensive analysis of the User Role Management and Access Control system in the **Kutumb** application.

**Current Status:** The system uses a **Hybrid RBAC (Role-Based Access Control)** model.
- **Backend:** robustly supports dynamic roles stored in the database, with a fallback to hardcoded system roles.
- **Frontend:** uses a mix of dynamic permission checks (Correct) and hardcoded role checks (Legacy/Fragile).

**Recent Critical Fix:** The `ACP` role was failing because it was missing from strict frontend route guards. These have been patched to explicitly allow `ACP`. However, a fundamental discrepancy remains: **The `ACP` role is missing from the backend TypeScript `Role` enum**, making it a "second-class citizen" in the codebase's type system, although it functions correctly in the runtime database environment.

---

## 2. Business Logic & Architecture

### 2.1 Core Concepts
*   **Users:** Entities accessing the system. Linked to a `Role`.
*   **Roles:** Define a set of capabilities (`Permissions`).
    *   **System Roles:** Hardcoded in codebase (e.g., `SUPER_ADMIN`, `CITIZEN`).
    *   **Custom Roles:** Stored in `Role` table (e.g., `ACP`), allowing dynamic permission assignment.
*   **Permissions:** Granular actions (e.g., `visits.read`, `sos.resolve`).

### 2.2 Data Model (Database)
*   **`Role` Model:**
    *   `code` (String, Unique): The identifier (e.g., "ACP").
    *   `permissions` (String[]): Array of permission strings.
    *   *Note:* Acts as the source of truth for Custom Roles.
*   **`User` Model:**
    *   `role` (String): Stores the role code.
    *   *Gap:* This is a simple string, not a foreign key relation to `Role`. This allows for "System Roles" that might not exist in the `Role` table, but risks data integrity.

### 2.3 Authorization Flow
1.  **Login:** User authenticates via `LoginController`.
2.  **Token Generation:** JWT is signed containing `userId`, `email`, and `role`.
3.  **Request Authentication (`authenticate` middleware):**
    *   Verifies JWT.
    *   **Crucial Step:** Fetches the *latest* permissions for the user's role from the Database (`prisma.role.findUnique`).
    *   Attaches `user` + `permissions` to `req.user`.
4.  **Access Control:**
    *   **Backend:** `requireRole` or `requirePermission` middleware checks `req.user.permissions`.
    *   **Frontend:** `ProtectedRoute` component checks internal auth state.

---

## 3. Page-wise Access Description

| Page / Module | URL | Protection Type | Logic Description |
| :--- | :--- | :--- | :--- |
| **Admin Login** | `/login` | Public | Open access. |
| **Admin Shell** | `/admin/*` | **Role-Based** (Fixed) | `AdminLayout` restricts access. **Was:** `['ADMIN', 'SUPER_ADMIN']`. **Now:** Includes `ACP`. |
| **Dashboard** | `/admin` | **Role-Based** (Fixed) | Shows stats widgets. Access strictly limited to high-level admins and ACP. |
| **User Mgmt** | `/users` | **Role-Based** (Fixed) | CRUD for users. Restricted to `SUPER_ADMIN`, `ADMIN`, `ACP`. |
| **Role Master** | `/admin/masters/roles` | **Permission-Based** | Uses `requiredPermission={{ resource: 'system', action: 'settings' }}`. Correctly allows any role with this permission. |
| **Reports** | `/admin/reports` | **Role-Based** (Fixed) | Analytics dashboard. Now allows `ACP`. |
| **Visits** | `/visits` | **Permission-Based** | Checks for `visits.read`. **Best Practice Implementation.** |
| **Officers** | `/officers` | **Permission-Based** | Checks for `officers.read`. **Best Practice Implementation.** |
| **SOS** | `/sos` | **Role-Based** (Fixed) | Monitoring active alerts. Now allows `ACP`. |

---

## 4. Broken Business Logic & Gap Analysis

### 4.1 Missing Type Definition (CRITICAL)
The file `backend/src/types/auth.ts` defines the `Role` enum:
```typescript
export enum Role { SUPER_ADMIN, ADMIN, OFFICER, ... } // Missing ACP
```
**Impact:** The TypeScript compiler and IDEs do not know `ACP` exists. This leads to developers forgetting to include it in switch cases or manual lists (like the ones fixed in this session).
**Recommendation:** Update the `Role` enum to include `ACP` and any other custom roles that are treated as "standard" by the business.

### 4.2 Inconsistent Frontend Protection
The application uses two different methods for route protection:
1.  **Permission-Based (Recommended):** `<ProtectedRoute requiredPermission={{ resource: 'visits', action: 'read' }}>`
    *   *Used in:* Visits, Officers.
    *   *Pros:* Future-proof. If you give a new role "Visits Read" permission in the DB, they strictly get access without code changes.
2.  **Role-Based (Legacy/Brittle):** `<ProtectedRoute roles={['ADMIN', 'ACP']}>`
    *   *Used in:* Dashboard, Users, Reports, SOS.
    *   *Cons:* Every time a new role is created (like ACP), you must manually edit the code in multiple files to grant access.

### 4.3 Database Integrity Risk
The `User.role` field is a `String` and not a Relation.
*   **Risk:** Values in `User.role` are case-sensitive strings (`ACP` vs `acp`).
*   **Mitigation:** The `createRole` controller forces uppercase, but manual DB edits or bugs could introduce mismatches where a user has a role "acp" that matches nothing in the `Role` table or the code.

---

## 5. Verification of Smooth Operation

Following the fixes applied in this session:
1.  **User `acp@gmail.com` (Role: ACP)** can now successfully log in.
2.  **Navigation:** They can access the Admin Dashboard, Reports, User Management, and SOS pages which were previously blocked.
3.  **Functionality:**
    *   **Role Management:** Works smoothly using the `/admin/masters/roles` page.
    *   **Permissions:** Custom permissions assigned to the `ACP` role in the database are correctly respected by the backend middleware.

## 6. Recommendations for Future Stability

1.  **Refactor Frontend to Permission-Based Access:**
    *   Replace `roles={['ADMIN', 'ACP']}` with specific permissions like `requiredPermission={{ resource: 'dashboard', action: 'view' }}`.
    *   This will eliminate the need for code changes when adding new roles.
2.  **Sync Types:** Add `ACP` to `backend/src/types/auth.ts`.
3.  **Strict Typing:** Ensure the frontend `ProtectedRoute` and backend `authorize` middleware log a warning when an unknown role (one not in Enums/DB) is encountered.
