# Module: Backend Dynamic RBAC

**Date:** December 30, 2025
**Status:** ✅ Implemented & Verified

## Overview
This module is the core security engine that transitions the application from a "Static" permission model to a "Dynamic" one. It ensures that role changes in the Database are immediately reflected in the Application Logic.

## Key Components

### 1. Authentication (Login Flow)
*   **File**: `backend/src/controllers/auth/loginController.ts`
*   **Change**: Updated the `login` method to:
    1.  Fetch the user's `Role` from the `User` table.
    2.  Query the `Role` table (Prisma) to get the specific `permissions` array (e.g., `['citizens.read', 'visits.write']`).
    3.  Inject this dynamic array into the JSON response (`data.user.permissions`).

### 2. Profile Synchronization
*   **File**: `backend/src/controllers/auth/profileController.ts`
*   **Change**: Updated the `me` (Get Current User) endpoint to perform the same logic as Login.
*   **Impact**: Ensures that if a user reloads the page (triggering a profile fetch), they receive their *current* permissions from the DB, not a hardcoded fallback.

### 3. Authorization Middleware
*   **Files**: `authenticate.ts` and `authorize.ts`
*   **Logic**:
    *   `authenticate.ts`: Attaches the DB permissions to `req.user`.
    *   `authorize.ts`: Checks `req.user.permissions` FIRST.
    *   **Fallback**: Only if DB permissions are missing does it check the legacy `RolePermissions` object.

## Data Flow
```
[Database (Role Table)] -> [LoginController] -> [JWT/Response] -> [Frontend AuthContext]
```
This direct pipeline eliminates the previous "Disconnect" where the backend ignored DB changes.
