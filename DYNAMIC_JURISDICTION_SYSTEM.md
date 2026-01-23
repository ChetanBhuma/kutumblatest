# Dynamic Jurisdiction Scoping System

## 🎯 **Overview**

The jurisdiction scoping system is now **FULLY DYNAMIC**! It reads the `jurisdictionLevel` from the `Role` table in the database, so you can create new roles without modifying any code.

---

## 🔄 **How It Works**

### **1. Database-Driven Configuration**

The `Role` table has a `jurisdictionLevel` field:

```prisma
model Role {
  id                String   @id @default(cuid())
  code              String   @unique
  name              String
  jurisdictionLevel String   @default("NONE")  // ← THIS CONTROLS DATA SCOPE!
  // ... other fields
}
```

### **2. Middleware Flow**

```typescript
// 1. Fetch role configuration from database
const roleConfig = await prisma.role.findUnique({
    where: { code: userRole },
    select: { jurisdictionLevel: true }
});

// 2. Apply jurisdiction based on the database value
switch (jurisdictionLevel) {
    case 'RANGE': // User sees Range-level data
    case 'DISTRICT': // User sees District-level data
    case 'SUBDIVISION': // User sees Sub-Division-level data
    case 'POLICE_STATION': // User sees Police Station-level data
    case 'BEAT': // User sees Beat-level data
    case 'ALL': // User sees everything
    case 'NONE': // User sees nothing
}
```

---

## ✅ **Supported Jurisdiction Levels**

| Level | Description | Example Roles |
|-------|-------------|---------------|
| **ALL** / **STATE** | Full access to all data across Delhi | SUPER_ADMIN, COMMISSIONER, ADMIN |
| **RANGE** | Access to all data within a Range | JOINT_CP, SPECIAL_CP |
| **DISTRICT** | Access to all data within a District | DCP, ADDL_DCP |
| **SUBDIVISION** / **SUB_DIVISION** | Access to all data within a Sub-Division | ACP |
| **POLICE_STATION** | Access to all data within a Police Station | SHO, INSPECTOR |
| **BEAT** | Access to all data within a Beat | SUB_INSPECTOR, CONSTABLE, HEAD_CONSTABLE |
| **NONE** | No access to list endpoints | CITIZEN, DATA_ENTRY |

---

## 🆕 **How to Add a New Role (DYNAMIC!)**

### **Example: Adding a "DEPUTY_COMMISSIONER" Role**

#### **Step 1: Create the Role in Database**

```sql
INSERT INTO "Role" (id, code, name, "jurisdictionLevel", "isActive")
VALUES (
    'cuid_here',
    'DEPUTY_COMMISSIONER',
    'Deputy Commissioner',
    'DISTRICT',  -- ← This determines data scope!
    true
);
```

#### **Step 2: Assign Permissions**

```sql
-- Link permissions to the role
INSERT INTO "_RolePermissions" ("A", "B")
SELECT 'role_id_here', id FROM "Permission"
WHERE code IN ('citizens.read', 'officers.read', 'reports.read');
```

#### **Step 3: Create a User with This Role**

```sql
INSERT INTO "User" (id, email, password, role)
VALUES (
    'user_id_here',
    'deputy@delhipolice.gov.in',
    'hashed_password',
    'DEPUTY_COMMISSIONER'  -- ← Uses the new role!
);
```

#### **Step 4: That's It! ✅**

**NO CODE CHANGES NEEDED!** The middleware will automatically:
1. Look up `DEPUTY_COMMISSIONER` in the `Role` table
2. Find `jurisdictionLevel = 'DISTRICT'`
3. Apply district-level filtering to all queries

---

## 📊 **Real-World Example**

### **Scenario: Creating a "TRAFFIC_INSPECTOR" Role**

```sql
-- 1. Create the role with POLICE_STATION level access
INSERT INTO "Role" (id, code, name, description, "jurisdictionLevel", "isActive")
VALUES (
    gen_random_uuid(),
    'TRAFFIC_INSPECTOR',
    'Traffic Inspector',
    'Handles traffic-related cases within a police station',
    'POLICE_STATION',  -- ← Police Station level access
    true
);

-- 2. Assign relevant permissions
INSERT INTO "_RolePermissions" ("A", "B")
SELECT
    (SELECT id FROM "Role" WHERE code = 'TRAFFIC_INSPECTOR'),
    id
FROM "Permission"
WHERE code IN ('citizens.read', 'visits.read', 'sos.read');

-- 3. Create officer profile
INSERT INTO "BeatOfficer" (id, name, rank, "badgeNumber", "policeStationId", "districtId", "rangeId")
VALUES (
    gen_random_uuid(),
    'Inspector Sharma',
    'Traffic Inspector',
    'TI-12345',
    'ps_dwarka_id',
    'district_dwarka_id',
    'range_west_id'
);

-- 4. Create user account
INSERT INTO "User" (id, email, password, role, "officerId")
VALUES (
    gen_random_uuid(),
    'sharma@delhipolice.gov.in',
    'hashed_password',
    'TRAFFIC_INSPECTOR',
    'officer_id_from_step_3'
);
```

**Result:**
- Inspector Sharma logs in
- Middleware reads `jurisdictionLevel = 'POLICE_STATION'` from database
- Sharma sees ONLY data from PS Dwarka (his assigned police station)
- **No code deployment needed!**

---

## 🔧 **Changing Jurisdiction Level**

### **Promote a Role to Higher Access**

```sql
-- Promote ACP to District level (from Sub-Division)
UPDATE "Role"
SET "jurisdictionLevel" = 'DISTRICT'
WHERE code = 'ACP';
```

**Effect:** All ACPs immediately get district-level access (next time they login)

### **Restrict a Role**

```sql
-- Restrict DATA_ENTRY to no list access
UPDATE "Role"
SET "jurisdictionLevel" = 'NONE'
WHERE code = 'DATA_ENTRY';
```

**Effect:** Data entry users can no longer see citizen/officer lists

---

## 🎨 **Custom Jurisdiction Levels**

You can even create **custom levels** for special cases:

```sql
-- Create a "ZONE" level (between RANGE and DISTRICT)
INSERT INTO "Role" (id, code, name, "jurisdictionLevel")
VALUES (
    gen_random_uuid(),
    'ZONE_COMMANDER',
    'Zone Commander',
    'ZONE'  -- Custom level!
);
```

Then update the middleware to handle it:

```typescript
case 'ZONE':
    scope = {
        level: 'DISTRICT', // Map to closest existing level
        jurisdictionIds: { districtId: officer.districtId || undefined }
    };
    break;
```

---

## 📋 **Migration Guide for Existing Roles**

If you have existing roles without `jurisdictionLevel` set:

```sql
-- Set jurisdiction levels for existing roles
UPDATE "Role" SET "jurisdictionLevel" = 'ALL' WHERE code IN ('SUPER_ADMIN', 'ADMIN', 'COMMISSIONER');
UPDATE "Role" SET "jurisdictionLevel" = 'RANGE' WHERE code IN ('JOINT_CP', 'SPECIAL_CP');
UPDATE "Role" SET "jurisdictionLevel" = 'DISTRICT' WHERE code IN ('DCP', 'ADDL_DCP');
UPDATE "Role" SET "jurisdictionLevel" = 'SUBDIVISION' WHERE code = 'ACP';
UPDATE "Role" SET "jurisdictionLevel" = 'POLICE_STATION' WHERE code IN ('SHO', 'INSPECTOR');
UPDATE "Role" SET "jurisdictionLevel" = 'BEAT' WHERE code IN ('SUB_INSPECTOR', 'CONSTABLE', 'HEAD_CONSTABLE', 'BEAT_OFFICER');
UPDATE "Role" SET "jurisdictionLevel" = 'NONE' WHERE code = 'CITIZEN';
```

---

## ⚡ **Performance Considerations**

### **Caching (Optional Enhancement)**

For high-traffic systems, you can cache role configurations:

```typescript
// Simple in-memory cache
const roleCache = new Map<string, string>();

const getCachedJurisdictionLevel = async (roleCode: string) => {
    if (roleCache.has(roleCode)) {
        return roleCache.get(roleCode);
    }

    const role = await prisma.role.findUnique({
        where: { code: roleCode },
        select: { jurisdictionLevel: true }
    });

    if (role) {
        roleCache.set(roleCode, role.jurisdictionLevel);
    }

    return role?.jurisdictionLevel;
};
```

---

## ✅ **Benefits of Dynamic System**

1. **No Code Deployment** - Add/modify roles via database only
2. **Instant Changes** - Update takes effect on next login
3. **Flexible** - Support any organizational structure
4. **Auditable** - All changes tracked in database
5. **Scalable** - Works for 10 roles or 1000 roles
6. **Future-Proof** - New jurisdiction levels can be added anytime

---

## 🚀 **Summary**

**BEFORE (Hardcoded):**
```typescript
if (role === 'DCP' || role === 'ADDL_DCP') {
    // District level
}
```
❌ Need code change for every new role

**AFTER (Dynamic):**
```typescript
const roleConfig = await prisma.role.findUnique({ where: { code: userRole } });
switch (roleConfig.jurisdictionLevel) {
    case 'DISTRICT': // Works for ANY role with DISTRICT level
}
```
✅ **Zero code changes needed!**

---

**The system is now 100% dynamic and database-driven!** 🎉
