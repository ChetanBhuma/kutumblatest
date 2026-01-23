# Database Tables Storing Citizen Data

Based on the project's Prisma schema, the following tables store data directly related to Senior Citizens:

## Core Profile
*   **`SeniorCitizen`**: The primary table storing the core profile information (personal details, address, preferences, etc.).

## Related Entities (Foreign Key: `seniorCitizenId`)
*   **`SpouseDetails`**: Stores specific details about the citizen's spouse.
*   **`FamilyMember`**: Stores information about family members.
*   **`EmergencyContact`**: Stores emergency contact details.
*   **`HouseholdHelp`**: Stores details of domestic help/maid/etc.
*   **`MedicalHistory`**: Stores medical conditions and history.
*   **`Document`**: Stores metadata and URLs for uploaded documents (Photo, ID proofs, etc.).

## Authentication & Registration
*   **`CitizenAuth`**: Stores authentication credentials (mobile number, password hash, OTP logs) for the citizen portal.
*   **`CitizenRegistration`**: Stores temporary or in-progress registration data and status validation.
*   **`User`**: If the citizen has a login account for the main app (less common for pure citizens, but linked via `SeniorCitizen.userId`), this table stores user account info.

## Service & Activity Data
*   **`Visit`**: Stores records of visits made by officers to the citizen.
*   **`VisitRequest`**: Stores requests for visits initiated by the citizen.
*   **`ServiceRequest`**: Stores requests for specific services (e.g., medical, legal).
*   **`SOSAlert`**: Stores emergency SOS alerts triggered by the citizen.
*   **`SOSLocationUpdate`**: Stores location history during an active SOS alert.
*   **`VisitFeedback`**: Stores feedback provided by the citizen regarding a visit.

## Process & Workflow
*   **`VerificationRequest`**: Stores requests for identity or address verification.
*   **`VulnerabilityHistory`**: Tracks changes in the citizen's calculated vulnerability score over time.

## System & Logs
*   **`AuditLog`**: Contains logs of actions performed by or on behalf of the citizen (key: `resourceId` or `userId`).
