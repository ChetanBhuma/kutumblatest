# Project Changelog (Dec 23, 2025 - Jan 14, 2026)

This document outlines the detailed timeline of tasks, fixes, and improvements implemented in the application.

## January 14, 2026 (Today)
- **Citizen Profile Photo**: Fixed the issue where uploaded profile photos were not showing a preview. Implemented immediate local preview and secure fetching for existing photos.
- **Document Viewing**: Added "View" buttons for Address Proof and Staff ID documents in the Citizen Profile, ensuring secure access with authentication tokens.
- **Staff Display**: Fixed a bug where domestic help names were not appearing in the profile card (corrected property binding).
- **UI Notifications**: Reduced the auto-dismiss delay for toast notifications to 2 seconds for quicker cleanup.
- **Digital Identity Card**: Corrected a layout issue where the citizen's details were overlapping with the profile photograph.

## January 13, 2026
- **Admin Uploads**: Resolved a critical issue where profile photos and address proof documents uploaded via the Admin Citizen Registration form were not being saved or linked correctly.

## January 12, 2026
- **Geofence Validation**: Enhanced the map view in the verification modal by adding clear, color-coded text labels for "Officer Location" and "Citizen Location".

## January 11, 2026
- **Admin Dashboard**: Fixed the "Recent Activities" widget which was previously failing to load inspection audit logs.

## January 09, 2026
- **Visit Management**: Conducted end-to-end testing and fixes for the visit lifecycle (scheduling, geofencing checks, status updates).
- **Officers Page**: Resolved a `ChunkLoadError` that prevented the Officers list page from loading; fixed API integration for fetching district/station data.
- **Investment Selector**: Fixed broken "Contact Us" navigation links to ensure smooth scrolling to the contact section.

## January 08, 2026
- **Campaign Management**: Integrated WhatsApp message templates into the campaign creation flow, allowing template selection and real-time preview.
- **Digital Card Design**: Standardized the Digital Identity Card UI in the Citizen Portal to align with the official design used in the Admin View.

## January 06, 2026
- **WhatsApp Integration**: Debugged and fixed authentication and endpoint configuration for the `CampaignService` to enable successful message sending via Meta API.
- **Admin UI Layout**: Fixed missing sidebar and header components on the SOS Alert and Profile pages to ensure consistency with the main admin layout.
- **GPS & Location**:
  - Fixed incorrect auto-filling of address fields caused by inaccurate browser GPS.
  - Implemented manual Pincode override to correctly fetch jurisdiction (District/Police Station).
  - Analyzed GeoJSON hierarchy for better spatial mapping.

## January 05, 2026
- **Location Auto-fill**: Fixed logic in the Profile Completion form to correctly auto-populate the District field based on the selected or detected Police Station.

## January 02, 2026
- **Role Management**: Fixed a 403 Permission Denied error when saving role permissions and verified full CRUD functionality for User Roles.

## December 30, 2025
- Officer App Login: Debugged and fixed a redirection loop issue where authenticated officers were being sent back to the login screen.

## December 25, 2025
- **Environment Setup**: Validated local development environment and application build process.

## December 24, 2025
- **Admin UI**: Addressed and resolved various visual inconsistencies and layout issues across the admin dashboard pages.

## December 23, 2025
- **Admin Approvals**: Fixed a visual discrepancy where citizen applications showed a "pending" tick mark even after being fully verified and approved.
