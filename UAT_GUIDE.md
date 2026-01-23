# User Acceptance Testing (UAT) Guide

## Overview
This document provides a comprehensive testing guide for the Senior Citizen Portal (Kutumb Portal) - Delhi Police.

## Test Environment Setup

### Prerequisites
- Browser: Chrome, Firefox, Safari, or Edge (latest versions)
- Test accounts with different roles
- Test data for citizens, officers, and administrators

### Test Accounts
1. **Admin User**
   - Username: admin@test.com
   - Role: Administrator
   - Permissions: Full access

2. **Officer User**
   - Username: officer@test.com
   - Role: Beat Officer
   - Permissions: Citizen management, Visit management

3. **Citizen User**
   - Mobile: Test mobile number
   - Role: Citizen
   - Permissions: Own profile, visits, SOS

## Test Cases

### 1. Citizen Portal Testing

#### 1.1 Registration Flow
**Test Case ID:** CP-REG-001
**Priority:** High
**Objective:** Verify citizen registration process

**Steps:**
1. Navigate to citizen registration page
2. Enter mobile number
3. Request OTP
4. Verify OTP
5. Fill personal information
6. Fill address information
7. Fill emergency contacts
8. Upload documents
9. Submit registration

**Expected Results:**
- OTP sent successfully
- OTP verified correctly
- All form validations work
- Documents uploaded successfully
- Registration submitted for approval
- Confirmation message displayed

**Test Data:**
- Valid mobile number
- Valid Aadhaar number
- Valid address
- Emergency contact details
- Identity proof document

---

#### 1.2 Login/Logout Flow
**Test Case ID:** CP-AUTH-001
**Priority:** High
**Objective:** Verify citizen authentication

**Steps:**
1. Navigate to citizen login page
2. Enter mobile number
3. Enter password
4. Click login
5. Verify dashboard loads
6. Click logout
7. Verify redirected to login

**Expected Results:**
- Login successful with valid credentials
- Login fails with invalid credentials
- Dashboard loads after login
- Logout successful
- Session cleared after logout

---

#### 1.3 Profile Management
**Test Case ID:** CP-PROFILE-001
**Priority:** High
**Objective:** Verify profile view and update

**Steps:**
1. Login as citizen
2. Navigate to profile page
3. View profile information
4. Click edit profile
5. Update information
6. Save changes
7. Verify updates reflected

**Expected Results:**
- Profile information displayed correctly
- Edit form pre-filled with current data
- Validation works on update
- Changes saved successfully
- Updated data displayed

---

#### 1.4 Visit Requests
**Test Case ID:** CP-VISIT-001
**Priority:** High
**Objective:** Verify visit request creation

**Steps:**
1. Login as citizen
2. Navigate to visits page
3. Click request visit
4. Select preferred date
5. Select time slot
6. Add notes
7. Submit request
8. View request status

**Expected Results:**
- Visit request form displayed
- Date picker works
- Time slots available
- Request submitted successfully
- Status shows "Pending"
- Confirmation notification received

---

#### 1.5 SOS Alerts
**Test Case ID:** CP-SOS-001
**Priority:** Critical
**Objective:** Verify SOS alert creation

**Steps:**
1. Login as citizen
2. Navigate to SOS page
3. Click create SOS alert
4. Allow location access
5. Confirm alert
6. View alert status

**Expected Results:**
- Location captured correctly
- Alert created immediately
- Status shows "Active"
- Officer notified
- Alert visible in history

---

#### 1.6 Document Upload
**Test Case ID:** CP-DOC-001
**Priority:** Medium
**Objective:** Verify document upload

**Steps:**
1. Login as citizen
2. Navigate to documents page
3. Click upload document
4. Select file
5. Choose document type
6. Upload file
7. View uploaded documents

**Expected Results:**
- File picker opens
- File size validation works
- File type validation works
- Upload progress shown
- Document uploaded successfully
- Document visible in list

---

#### 1.7 Feedback Submission
**Test Case ID:** CP-FEEDBACK-001
**Priority:** Medium
**Objective:** Verify feedback submission

**Steps:**
1. Login as citizen
2. Navigate to completed visit
3. Click submit feedback
4. Rate visit (1-5 stars)
5. Add comments
6. Submit feedback

**Expected Results:**
- Feedback form displayed
- Rating selection works
- Comments field accepts input
- Feedback submitted successfully
- Confirmation message shown

---

#### 1.8 Notifications
**Test Case ID:** CP-NOTIF-001
**Priority:** Medium
**Objective:** Verify notification system

**Steps:**
1. Login as citizen
2. View notifications
3. Click on notification
4. Mark as read
5. Update notification preferences

**Expected Results:**
- Notifications displayed
- Unread count accurate
- Clicking opens details
- Mark as read works
- Preferences saved

---

### 2. Admin Portal Testing

#### 2.1 Citizen Management
**Test Case ID:** AP-CIT-001
**Priority:** High
**Objective:** Verify citizen management

**Steps:**
1. Login as admin
2. Navigate to citizens page
3. View citizen list
4. Search for citizen
5. Filter by status
6. View citizen details
7. Update verification status

**Expected Results:**
- Citizen list displayed
- Search works correctly
- Filters work correctly
- Details page loads
- Status update successful

---

#### 2.2 Visit Management
**Test Case ID:** AP-VISIT-001
**Priority:** High
**Objective:** Verify visit management

**Steps:**
1. Login as admin
2. Navigate to visits page
3. View visit calendar
4. Create new visit
5. Assign officer
6. Update visit status
7. View visit details

**Expected Results:**
- Calendar displays visits
- Visit creation successful
- Officer assignment works
- Status update successful
- Details page accurate

---

#### 2.3 SOS Management
**Test Case ID:** AP-SOS-001
**Priority:** Critical
**Objective:** Verify SOS alert management

**Steps:**
1. Login as admin
2. Navigate to SOS alerts
3. View active alerts
4. Click on alert
5. View location on map
6. Update alert status
7. Add response notes

**Expected Results:**
- Active alerts displayed
- Alert details shown
- Map shows location
- Status update works
- Notes saved successfully

---

#### 2.4 User/Role Management
**Test Case ID:** AP-USER-001
**Priority:** High
**Objective:** Verify user and role management

**Steps:**
1. Login as admin
2. Navigate to users page
3. Create new user
4. Assign role
5. Update permissions
6. Deactivate user
7. View audit log

**Expected Results:**
- User creation successful
- Role assignment works
- Permissions updated
- User deactivated
- Audit log accurate

---

#### 2.5 Master Data Management
**Test Case ID:** AP-MASTER-001
**Priority:** Medium
**Objective:** Verify master data management

**Steps:**
1. Login as admin
2. Navigate to master data
3. Add new district
4. Add police station
5. Add beat
6. Update existing data
7. Delete data

**Expected Results:**
- Data creation successful
- Hierarchical relationships work
- Updates saved correctly
- Deletion works (if no dependencies)
- Validation prevents invalid operations

---

### 3. Cross-Browser Testing

#### Test Browsers
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

#### Test Scenarios
- [ ] Login/Logout
- [ ] Form submissions
- [ ] File uploads
- [ ] Map interactions
- [ ] Notifications
- [ ] Responsive design

---

### 4. Mobile Responsiveness

#### Test Devices
- [ ] iPhone (iOS Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)

#### Test Scenarios
- [ ] Navigation menu
- [ ] Form inputs
- [ ] Touch interactions
- [ ] Map gestures
- [ ] Image uploads
- [ ] Layout adaptation

---

### 5. Accessibility Testing

#### Screen Reader Testing
- [ ] NVDA (Windows)
- [ ] JAWS (Windows)
- [ ] VoiceOver (Mac/iOS)

#### Keyboard Navigation
- [ ] Tab order logical
- [ ] All interactive elements accessible
- [ ] Keyboard shortcuts work
- [ ] Focus indicators visible

#### Color Contrast
- [ ] Text readable
- [ ] Buttons distinguishable
- [ ] Links identifiable
- [ ] Error messages clear

---

## Test Execution

### Test Cycle 1: Smoke Testing
**Duration:** 2 hours
**Focus:** Critical paths
**Coverage:** High-priority test cases

### Test Cycle 2: Functional Testing
**Duration:** 1 day
**Focus:** All features
**Coverage:** All test cases

### Test Cycle 3: Regression Testing
**Duration:** 4 hours
**Focus:** Bug fixes
**Coverage:** Failed test cases + related areas

---

## Bug Reporting

### Bug Template
```
**Bug ID:** [Auto-generated]
**Title:** [Brief description]
**Severity:** Critical/High/Medium/Low
**Priority:** P1/P2/P3/P4
**Environment:** [Browser, OS, Device]
**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:** [What should happen]
**Actual Result:** [What actually happened]
**Screenshots:** [Attach if applicable]
**Logs:** [Console errors, network errors]
```

### Severity Definitions
- **Critical:** System crash, data loss, security vulnerability
- **High:** Major feature broken, no workaround
- **Medium:** Feature partially broken, workaround available
- **Low:** Minor issue, cosmetic problem

---

## Test Sign-off Criteria

### Acceptance Criteria
- [ ] All critical test cases passed
- [ ] No critical/high severity bugs open
- [ ] All medium severity bugs documented
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness verified

### Performance Benchmarks
- Page load time < 3 seconds
- API response time < 1 second
- Time to interactive < 5 seconds
- No memory leaks
- Smooth animations (60 FPS)

---

## Test Results Template

### Summary
- Total Test Cases: [Number]
- Passed: [Number]
- Failed: [Number]
- Blocked: [Number]
- Not Executed: [Number]
- Pass Rate: [Percentage]

### Defects Summary
- Critical: [Number]
- High: [Number]
- Medium: [Number]
- Low: [Number]

### Recommendations
[List any recommendations for improvements]

---

## Appendix

### Test Data
See `test-data.json` for sample test data

### Known Issues
See `KNOWN_ISSUES.md` for documented known issues

### Test Automation
See `__tests__/` directory for automated test scripts
