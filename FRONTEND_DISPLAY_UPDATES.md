# Frontend Display Updates - Verification Status

## Overview
Updated the frontend to properly display the new `FieldVerified` status throughout the application, providing clear visibility to both citizens and admins about the verification progress.

## Changes Made

### 1. Citizen Workflow Component
**File**: `components/citizen/citizen-workflow.tsx`

**Updates**:
- Added logic to handle `FieldVerified` status
- Updated step descriptions to be more informative
- Workflow now shows 4 distinct stages:
  1. **Registration** - Always completed when viewing profile
  2. **Field Verification** - Completed when officer verifies (FieldVerified or Verified)
  3. **Admin Approval** - Current/active when FieldVerified, completed when Verified
  4. **Digital Card** - Only completed when actually issued

**Visual States**:
```typescript
// Registration: Always "completed"
// Field Verification:
//   - "completed" if FieldVerified or Verified
//   - "current" if Pending
//   - "rejected" if Rejected
// Admin Approval:
//   - "completed" if Verified
//   - "current" if FieldVerified (awaiting admin)
//   - "pending" if still Pending
//   - "rejected" if Rejected
// Digital Card:
//   - "completed" if digitalCardIssued
//   - "current" if Verified but not issued
//   - "pending" otherwise
```

### 2. Citizen Profile Page
**File**: `app/citizen-portal/profile/page.tsx`

**Updates**:
- Enhanced verification status badge with three-tier coloring:
  - **Green** (Verified): Full verification complete
  - **Blue** (FieldVerified): Officer verified, awaiting admin approval
  - **Amber** (Pending): Not yet verified

**Badge Display**:
```tsx
{citizen.idVerificationStatus === 'FieldVerified'
    ? '✓ Field Verified - Pending Admin'
    : `${citizen.idVerificationStatus || 'Pending'} Verification`}
```

**Visual Feedback**:
- Citizens with `FieldVerified` status see a blue badge with checkmark
- Clear message: "Field Verified - Pending Admin"
- Workflow progress bar shows they're in the "Admin Approval" stage

### 3. Admin Approval Pages
**Files**:
- `app/approvals/page.tsx` (List view)
- `app/approvals/[id]/page.tsx` (Detail view)

**Current Behavior**:
- Admin sees citizens with `FieldVerified` status in the approval queue
- The `reviewGuard` logic determines if approval is allowed
- When field verification is complete, the "Approve" button becomes enabled

**Status Display**:
The existing status badge system already handles various statuses. The backend `reviewGuard` logic will show:
- ✅ Green message: "Verification completed. Ready for approval" when `FieldVerified`
- ⚠️ Yellow message: "Verification Pending" when still `Pending`

## User Experience Flow

### For Citizens:

#### Stage 1: Registration Complete
```
Status: Pending
Badge: "Pending Verification" (Amber)
Workflow: [✓ Registration] → [● Field Verification] → [○ Admin Approval] → [○ Digital Card]
```

#### Stage 2: Officer Completed Verification
```
Status: Pending
Verification: FieldVerified
Badge: "✓ Field Verified - Pending Admin" (Blue)
Workflow: [✓ Registration] → [✓ Field Verification] → [● Admin Approval] → [○ Digital Card]
Message: "Officer has completed field verification. Awaiting admin approval."
```

#### Stage 3: Admin Approved
```
Status: Active
Verification: Verified
Badge: "Verified Verification" (Green)
Workflow: [✓ Registration] → [✓ Field Verification] → [✓ Admin Approval] → [● Digital Card]
Digital Card: Issued with unique number
```

### For Admins:

#### Approval Queue View
Citizens with `FieldVerified` status appear in the pending approvals list with:
- Status badge showing current state
- Can click "Review" to see full details
- Officer's verification notes visible

#### Detail View
When reviewing a `FieldVerified` citizen:
- Green success message: "Verification completed. Ready for approval"
- "Approve Application" button is **enabled**
- Can see officer's verification notes and assessment
- Timeline shows field verification completion

## Color Coding System

| Status | Color | Badge Text | Meaning |
|--------|-------|------------|---------|
| `Pending` | Amber/Yellow | "Pending Verification" | Not yet verified by officer |
| `FieldVerified` | Blue | "✓ Field Verified - Pending Admin" | Officer completed, awaiting admin |
| `Verified` | Green | "Verified Verification" | Admin approved |
| `Rejected` | Red | "Rejected Verification" | Application rejected |

## Technical Notes

### Workflow Component Logic
The component uses computed booleans for clarity:
```typescript
const isFieldVerified = verificationStatus === "FieldVerified" || verificationStatus === "Verified";
const isFullyVerified = verificationStatus === "Verified";
const isRejected = verificationStatus === "Rejected" || status === "Rejected";
```

### Badge Styling
Three-tier conditional styling:
```typescript
className={`... ${
    citizen.idVerificationStatus === 'Verified'
        ? 'text-green-600 border-green-200 bg-green-50'
        : citizen.idVerificationStatus === 'FieldVerified'
        ? 'text-blue-600 border-blue-200 bg-blue-50'
        : 'text-amber-600 border-amber-200 bg-amber-50'
}`}
```

## Testing Checklist

### Citizen Portal
- [ ] Profile page shows correct badge color for each status
- [ ] Workflow progress bar updates correctly
- [ ] FieldVerified status shows blue badge with checkmark
- [ ] Workflow descriptions are clear and informative
- [ ] Digital ID button only shows when Verified

### Admin Panel
- [ ] FieldVerified citizens appear in approval queue
- [ ] Detail view shows "Ready for approval" message
- [ ] Approve button is enabled for FieldVerified status
- [ ] Timeline shows field verification completion
- [ ] Officer's notes are visible

### Status Transitions
- [ ] Pending → FieldVerified (after officer completes visit)
- [ ] FieldVerified → Verified (after admin approves)
- [ ] Verified → Digital card issued
- [ ] Each transition updates UI immediately

## Files Modified

1. `components/citizen/citizen-workflow.tsx` - Enhanced workflow visualization
2. `app/citizen-portal/profile/page.tsx` - Updated status badge display

## Related Backend Changes

These frontend changes work in conjunction with:
- `backend/prisma/schema.prisma` - Added `FieldVerified` enum value
- `backend/src/controllers/visitController.ts` - Sets `FieldVerified` on visit completion
- `backend/src/services/verificationService.ts` - Removed auto digital card issuance

## Next Steps

If additional admin panel enhancements are needed:
1. Add filter for "Field Verified" citizens in approval list
2. Add bulk approval capability for field-verified citizens
3. Add notification to admin when field verification completes
4. Add dashboard widget showing count of field-verified citizens awaiting approval
