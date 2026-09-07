# Test Credentials (03 Jan)

This document contains all test credentials found in the project seed scripts.

## 🔐 Core Test Users (from seed-test-users.ts)

These users are fully seeded with profiles, police stations, and beat data.

| Role | Email / Phone | Password | Details |
|------|---------------|----------|---------|
| **Super Admin** | `admin@delhipolice.gov.in` | `Admin@123` | Full Access |
| **District Admin** | `district.admin@delhipolice.gov.in` | `Admin@123` | Central District Admin |
| **Beat Officer 1** | `officer1@delhipolice.gov.in` | `Officer@123` | Badge: 28120039, Connaught Place PS |
| **Beat Officer 2** | `officer2@delhipolice.gov.in` | `Officer@123` | Badge: 28911777, Connaught Place PS |
| **Citizen 1** | Phone: `9876543230` | `Citizen@123` | Verified Senior Citizen |
| **Citizen 2** | Phone: `9876543231` | `Citizen@123` | Verified Senior Citizen |

**Test OTP for all phone numbers:** `123456`

---

## 🌎 Neon Production Seed (from seed-neon-minimal.ts)

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | `superadmin@delhipolice.gov.in` | `Admin@123` |

---

## 🎭 Additional Role Testing (from create-test-users.ts)

These users may exist if `create-test-users.ts` was run.
**Default Password:** `Test@123`

| Role | Email |
|------|-------|
| **Super Admin** | `superadmin@delhipolice.gov.in` |
| **Admin** | `admin@delhipolice.gov.in` |
| **Officer** | `officer@delhipolice.gov.in` |
| **Supervisor** | `supervisor@delhipolice.gov.in` |
| **Control Room** | `controlroom@delhipolice.gov.in` |
| **Data Entry** | `dataentry@delhipolice.gov.in` |
| **Viewer** | `viewer@delhipolice.gov.in` |
| **Citizen** | `citizen@gmail.com` |

---

## 📝 Important Notes

- **OTP Bypass:** In development mode, `123456` is often used as a universal OTP.
- **Environment:** Test credentials work in `Development` (Supabase). For `Production` (Neon), ensure the seed script has been run (`scripts/seed-neon-minimal.ts` or similar).
