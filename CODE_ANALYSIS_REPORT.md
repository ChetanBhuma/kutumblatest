# Code Analysis Report: Repeated & Disconnected Logic

**Generated:** 2025-11-26  
**Project:** Delhi Police Senior Citizen Portal (Kutumb Portal)

---

## Executive Summary

This report identifies **repeated patterns**, **disconnected logic**, and **architectural inconsistencies** across the frontend and backend codebases. The analysis covers authentication, data fetching, state management, API patterns, and more.

---

## 🔴 CRITICAL ISSUES

### 1. **Duplicate Authentication Context** ⚠️ HIGH PRIORITY

**Problem:** Two separate AuthContext implementations exist:
- `/app/contexts/AuthContext.tsx` (166 lines) - Simple implementation
- `/contexts/auth-context.tsx` (340 lines) - Full-featured implementation with OTP

**Impact:**
- Confusion about which to use
- Inconsistent authentication behavior
- Potential bugs from mixed imports
- Maintenance nightmare

**Evidence:**
```typescript
// File 1: /app/contexts/AuthContext.tsx
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    // Uses fetch() directly
    const res = await fetch('/api/v1/auth/me', {...});
}

// File 2: /contexts/auth-context.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    // Uses apiClient
    const response = await apiClient.getCurrentUser();
}
```

**Current Usage:**
- Most pages import from `/contexts/auth-context` (correct)
- Login page uses `/contexts/auth-context`
- Layout uses `/contexts/auth-context`

**Recommendation:**
- ✅ **DELETE** `/app/contexts/AuthContext.tsx`
- ✅ **KEEP** `/contexts/auth-context.tsx` (more complete)
- Update any remaining imports

---

### 2. **Inconsistent API Client Usage** ⚠️ HIGH PRIORITY

**Problem:** Mixed usage of API calling patterns:

**Pattern 1: Direct fetch() calls**
```typescript
// app/contexts/AuthContext.tsx
const res = await fetch('/api/v1/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
});
```

**Pattern 2: apiClient (Correct)**
```typescript
// contexts/auth-context.tsx
const response = await apiClient.getCurrentUser();
```

**Pattern 3: Inline fetch in components**
```typescript
// Found in some map components
const response = await fetch(`/api/v1/geo/districts`);
```

**Impact:**
- No centralized error handling
- Token refresh logic bypassed
- Inconsistent request interceptors
- Harder to maintain

**Recommendation:**
- ✅ Use `apiClient` everywhere
- ❌ Remove direct `fetch()` calls
- Add missing methods to apiClient if needed

---

### 3. **Repeated Token Management Logic** ⚠️ MEDIUM PRIORITY

**Problem:** Token storage/retrieval duplicated across files:

**Locations:**
1. `/lib/api-client.ts` (Lines 83-110)
2. `/app/contexts/AuthContext.tsx` (Lines 70, 82, 86, 108, 121, 127)
3. `/contexts/auth-context.tsx` (Lines 140, 152, 163, 167, 241, 277, 305)

**Repeated Code:**
```typescript
// Repeated in 3+ places
localStorage.getItem('accessToken')
localStorage.setItem('accessToken', token)
localStorage.removeItem('accessToken')
```

**Recommendation:**
- Centralize in `apiClient` only
- Other components should use `apiClient` methods
- Create a `TokenManager` service if needed

---

## 🟡 MODERATE ISSUES

### 4. **Repeated Data Fetching Patterns**

**Problem:** Every page implements its own data fetching with similar patterns:

**Example Pattern (Repeated 30+ times):**
```typescript
const [data, setData] = useState<Type[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await apiClient.getSomething();
            setData(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);
```

**Found in:**
- `/app/citizens/page.tsx`
- `/app/officers/page.tsx`
- `/app/visits/page.tsx`
- `/app/approvals/page.tsx`
- `/app/sos/page.tsx`
- 25+ more pages

**Recommendation:**
Create custom hooks:
```typescript
// hooks/use-api-query.ts
export function useApiQuery<T>(queryFn: () => Promise<T>) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        queryFn()
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);
    
    return { data, loading, error, refetch };
}
```

---

### 5. **Repeated Master Data Fetching**

**Problem:** Districts, Police Stations, Beats fetched repeatedly:

**Found in:**
- `/app/citizens/register/page.tsx` (Lines 37-44)
- `/app/citizens/[id]/edit/page.tsx` (Lines 40-44)
- `/app/citizens/map/page.tsx` (Lines 53-56)
- `/app/citizens/map/pending/page.tsx` (Lines 54-57)
- `/app/admin/masters/beats/page.tsx` (Lines 22-24)
- 10+ more locations

**Repeated Code:**
```typescript
const [districts, setDistricts] = useState<any[]>([]);
const [policeStations, setPoliceStations] = useState<any[]>([]);
const [beats, setBeats] = useState<any[]>([]);

useEffect(() => {
    // Fetch districts
    apiClient.getDistricts().then(res => setDistricts(res.data));
}, []);

useEffect(() => {
    // Fetch police stations
    if (selectedDistrict) {
        apiClient.getPoliceStations({ districtId: selectedDistrict })
            .then(res => setPoliceStations(res.data));
    }
}, [selectedDistrict]);
```

**Recommendation:**
Create a master data context:
```typescript
// contexts/master-data-context.tsx
export function MasterDataProvider({ children }) {
    const [districts, setDistricts] = useState([]);
    const [policeStations, setPoliceStations] = useState([]);
    const [beats, setBeats] = useState([]);
    
    // Load once on mount
    useEffect(() => {
        loadMasterData();
    }, []);
    
    return <MasterDataContext.Provider value={{...}}>
        {children}
    </MasterDataContext.Provider>;
}

// Usage
const { districts, policeStations, beats } = useMasterData();
```

---

### 6. **Repeated Pagination Logic**

**Problem:** Pagination implemented manually in 15+ controllers:

**Backend Pattern (Repeated):**
```typescript
// citizenController.ts, visitController.ts, officerController.ts, etc.
const { page = 1, limit = 20 } = req.query;
const skip = (Number(page) - 1) * Number(limit);

const total = await prisma.model.count({ where });
const items = await prisma.model.findMany({
    where,
    skip,
    take: Number(limit),
    // ...
});

res.json({
    success: true,
    data: {
        items,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit))
        }
    }
});
```

**Recommendation:**
Create a pagination utility:
```typescript
// backend/src/utils/pagination.ts
export async function paginatedQuery<T>(
    model: any,
    options: PaginationOptions
) {
    const { page = 1, limit = 20, where, include, orderBy } = options;
    const skip = (page - 1) * limit;
    
    const [total, items] = await Promise.all([
        model.count({ where }),
        model.findMany({ where, skip, take: limit, include, orderBy })
    ]);
    
    return {
        items,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}
```

---

### 7. **Repeated Audit Logging**

**Problem:** Audit logging pattern repeated in every controller:

**Pattern:**
```typescript
auditLogger.info('Action performed', {
    entityId: entity.id,
    entityName: entity.name,
    actionBy: req.user?.email,
    timestamp: new Date().toISOString()
});
```

**Found in:**
- `citizenController.ts` (Lines 204, 280, 311, 344, 382)
- `visitController.ts` (Lines 231, 397, 498, 538, 585, 619)
- `officerController.ts`
- `sosController.ts`
- 10+ more controllers

**Recommendation:**
Create audit middleware or decorator:
```typescript
// middleware/auditMiddleware.ts
export function auditAction(action: string) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const originalJson = res.json.bind(res);
        res.json = (body: any) => {
            auditLogger.info(action, {
                userId: req.user?.id,
                userEmail: req.user?.email,
                data: body,
                timestamp: new Date().toISOString()
            });
            return originalJson(body);
        };
        next();
    };
}
```

---

### 8. **Repeated Date Initialization (Hydration Risk)**

**Problem:** `new Date()` called during render in multiple pages:

**Locations:**
- `/app/citizens/register/page.tsx` (Lines 150, 157, 636)
- `/app/citizens/[id]/edit/page.tsx` (Lines 140, 203)
- `/app/citizens/[id]/documents/page.tsx` (Lines 47, 55)
- `/app/roster/page.tsx` (Line 24)
- `/app/visits/page.tsx` (Lines 188, 189)

**Risk:** Hydration mismatch errors in Next.js

**Recommendation:**
```typescript
// ❌ Bad
const [date, setDate] = useState(new Date().toISOString());

// ✅ Good
const [date, setDate] = useState<string>('');
useEffect(() => {
    setDate(new Date().toISOString());
}, []);
```

---

## 🟢 MINOR ISSUES

### 9. **Repeated Error Handling Patterns**

**Problem:** Try-catch blocks with similar error handling:

```typescript
try {
    // operation
} catch (error) {
    next(error);
}
```

**Recommendation:**
Use async handler wrapper (already exists at `/backend/src/middleware/asyncHandler.ts` but not used consistently)

---

### 10. **Repeated Where Clause Building**

**Problem:** Query filter building repeated in controllers:

```typescript
const where: any = {};
if (search) where.OR = [...];
if (policeStationId) where.policeStationId = String(policeStationId);
if (beatId) where.beatId = String(beatId);
```

**Recommendation:**
Create query builder utility

---

## 📊 DISCONNECTED LOGIC

### 1. **Unused MapComponent Duplicate**

**Files:**
- `/components/MapComponent.tsx`
- `/app/components/MapComponent.tsx`

**Status:** Likely one is unused

---

### 2. **Disconnected Services**

**Backend services that may not be fully integrated:**
- `/backend/src/services/webhookService.ts`
- `/backend/src/services/workflowEngine.ts`
- `/backend/src/services/cloudStorageService.ts`

**Action:** Verify if these are actually used in routes/controllers

---

### 3. **Unused Middleware**

**File:** `/backend/src/middleware/csrf.ts`

**Status:** Not imported in `app.ts`

---

## 🎯 PRIORITY RECOMMENDATIONS

### Immediate (Week 1)
1. ✅ **Remove duplicate AuthContext** (`/app/contexts/AuthContext.tsx`)
2. ✅ **Standardize on apiClient** (remove direct fetch calls)
3. ✅ **Fix hydration issues** (move Date() to useEffect)

### Short-term (Week 2-3)
4. ✅ **Create custom hooks** (`useApiQuery`, `useMasterData`)
5. ✅ **Create pagination utility** (backend)
6. ✅ **Implement audit middleware**

### Medium-term (Month 1)
7. ✅ **Create MasterDataContext** (districts, police stations, beats)
8. ✅ **Refactor data fetching** (use custom hooks)
9. ✅ **Clean up unused files**

### Long-term (Month 2+)
10. ✅ **Consider React Query** or SWR for data fetching
11. ✅ **Implement proper caching strategy**
12. ✅ **Add comprehensive error boundaries**

---

## 📈 METRICS

| Category | Count | Severity |
|----------|-------|----------|
| Duplicate Auth Logic | 2 files | 🔴 Critical |
| Repeated Data Fetching | 30+ pages | 🟡 Moderate |
| Repeated Master Data | 10+ pages | 🟡 Moderate |
| Repeated Pagination | 15+ controllers | 🟡 Moderate |
| Repeated Audit Logs | 10+ controllers | 🟡 Moderate |
| Hydration Risks | 5+ pages | 🟡 Moderate |
| Unused Files | 3+ files | 🟢 Minor |

---

## 🛠️ PROPOSED REFACTORING

### New File Structure

```
/lib
  /hooks
    - use-api-query.ts       (NEW)
    - use-master-data.ts     (NEW)
    - use-pagination.ts      (NEW)
  /utils
    - token-manager.ts       (NEW - extract from apiClient)

/contexts
  - auth-context.tsx         (KEEP)
  - master-data-context.tsx  (NEW)

/backend/src/utils
  - pagination.ts            (NEW)
  - query-builder.ts         (NEW)
  - audit-helper.ts          (NEW)

/backend/src/middleware
  - audit-middleware.ts      (NEW)
```

---

## ✅ CONCLUSION

The codebase has **significant repeated logic** that can be consolidated to improve:
- **Maintainability**: Single source of truth
- **Consistency**: Uniform patterns
- **Performance**: Shared caching
- **Developer Experience**: Less boilerplate

**Estimated Effort:**
- Critical fixes: 2-3 days
- Short-term refactoring: 1 week
- Medium-term improvements: 2-3 weeks
- Long-term optimization: 1 month

**ROI:** High - Will significantly reduce bugs and development time for new features.

---

*End of Report*
