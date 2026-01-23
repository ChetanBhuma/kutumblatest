# Multi-Portal Auth & Role Management Analysis

## Overview
The application uses a **Multi-Portal Architecture** catering to three distinct user groups:
1.  **Officers** (`/officer-app`)
2.  **Admins** (`/admin`)
3.  **Citizens** (`/citizen-portal`)

Each portal has its own entry point (Login Page), but they all share a common authentication infrastructure via `AuthContext` and `apiClient`, while enforcing role-specific boundaries at the Layout level.

---

## 1. Officer App (`/officer-app/login`)
*   **Target Audience**: Beat Officers on the field.
*   **Login Mechanism**:
    *   **Identifier**: Badge Number only (No password/email).
    *   **Auth Flow**:
        1.  Enter Badge Number -> `apiClient.sendOfficerOTP(badgeNumber)`.
        2.  Enter OTP -> `apiClient.verifyOfficerOTP(badgeNumber, otp)`.
    *   **Session**: On success, it redirects to `/officer-app/dashboard`.
*   **Role Management**:
    *   **Frontend**: `OfficerLayoutShell` (`components/officer-app/officer-layout-shell.tsx`) reads the user profile from `localStorage` (`kutumb-app-user`).
    *   **Protection**: The `OfficerLayoutShell` does **NOT** explicitly check `if (role !== 'OFFICER')` before rendering, relying mainly on the fact that only officers can authenticate via the Badge Login flow.
    *   **Navigation**: The sidebar menu is hardcoded for officers (`My Beat Citizens`, `Visits History`, etc.).

## 2. Admin Portal (`/admin/login`)
*   **Target Audience**: Super Admins, Admins, Supervisors, and Officers (Web view).
*   **Login Mechanism**:
    *   **Identifier**: Email, Phone, or PIS Number.
    *   **Auth Flow**: Supports both Password and OTP login.
    *   **Redirect Logic**:
        *   Checks `user.role`.
        *   `CITIZEN` -> Redirects to `/citizen-portal/dashboard`.
        *   `ADMIN`, `SUPER_ADMIN`, `OFFICER`, `SUPERVISOR` -> Redirects to `/admin/dashboard`.
*   **Role Management**:
    *   **Frontend**: Uses `AuthContext` (`contexts/auth-context.tsx`).
    *   **State**: `useAuth()` hook provides `user` and `isAuthenticated` state.
    *   **Permissions**: The `AuthContext` has a `hasPermission` function that checks `user.permissions` (which are now dynamically fetched from backend as per previous fix).

## 3. Citizen Portal (`/citizen-portal/login`)
*   **Target Audience**: Senior Citizens.
*   **Login Mechanism**:
    *   **Identifier**: Mobile Number.
    *   **Auth Flow**: Supports Password or OTP.
    *   **Session**: Sets `userType` to 'citizen' in localStorage upon login.
*   **Role Management**:
    *   **Frontend**: `CitizenPortalLayout` provides the structural shell.
    *   **Protection**: Similar to Officer App, security is enforced by the login endpoint returning a valid token for that user type.

---

## Shared Infrastructure (`AuthContext`)
The `contexts/auth-context.tsx` is the brain of the frontend auth system:
1.  **State Management**: It hydrates the user session from `localStorage` on load.
2.  **Role Normalization**: `mapUserFromResponse` maps raw API responses to a standardized `User` object, including `role` and `permissions`.
3.  **Permission Logic**:
    ```typescript
    const checkPermission = (resource: string, action: string): boolean => {
        if (state.user.role === Role.SUPER_ADMIN) return true;
        // Checks user.permissions array (which comes from DB)
        return permissions.includes(permissionCode);
    }
    ```

## How Roles are Implemented & Managed

### 1. Database (Backend)
*   The `Role` table stores the definition (e.g., `OFFICER` has `['visits.read', 'citizens.view']`).
*   The `User` table links a user to a role code string (e.g., "OFFICER").

### 2. Login (API Handshake)
*   When a user logs in (via any portal), the backend:
    *   Validates credentials.
    *   **Fetches dynamic permissions** from `Role` table for that user's role (My Fix).
    *   Returns the User object + Permissions array in the response.

### 3. Client Side (Frontend)
*   **Storage**: The frontend stores this permission array in `localStorage`.
*   **Checks**: Components use `hasPermission('citizens.delete')` to show/hide buttons.
*   **Routing**:
    *   **Admin**: `admin/login` has explicit redirection logic based on role.
    *   **Officer/Citizen**: Rely on distinct login pages. If an Admin logs into the Officer page, they might theoretically get in if they have a badge number, but the UI is tailored for the Officer role.

## Recommendations
*   **Strict Route Guards**: The `officer-app/layout.tsx` and `citizen-portal/layout.tsx` lack explicit "Role Guards". If a logged-in "Citizen" manually navigates to `/officer-app/dashboard`, they might see a broken page instead of a "Forbidden" page. Adding a `RoleGuard` wrapper component that checks `user.role` would improve security robustness.
