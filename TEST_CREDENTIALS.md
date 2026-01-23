# 🔐 Test Credentials & Access Guide

## 👮 Admin & Staff Login
**URL:** `/admin/login`

### Super Admin
- **Email:** `admin@delhipolice.gov.in`
- **Phone:** `9876543210`
- **Password:** `Admin@123`

### District Admin
- **Email:** `district.admin@delhipolice.gov.in`
- **Phone:** `9876543211`
- **Password:** `Admin@123`

### Beat Officer 1
- **Name:** Constable Rajesh Kumar
- **Email:** `officer1@delhipolice.gov.in`
- **Phone:** `9876543220`
- **PIS No.:** `28120039`
- **Password:** `Officer@123`

### Beat Officer 2
- **Name:** Head Constable Priya Sharma
- **Email:** `officer2@delhipolice.gov.in`
- **Phone:** `9876543221`
- **PIS No.:** `28911777`
- **Password:** `Officer@123`

### Beat Officer 3
- **Name:** Sub-Inspector Amit Singh
- **Email:** `officer3@delhipolice.gov.in`
- **Phone:** `9876543222`
- **PIS No.:** `16970205`
- **Password:** `Officer@123`

> **Note:** For Password login, use Email or Phone as the identifier. For PIS login, use PIS No. as the identifier.

## 👴 Citizen Login
**URL:** `/citizen/login`

### Citizen 1 (Mr. Ram Prasad)
- **Phone:** `9876543230`
- **Email:** `citizen1@test.com`
- **Password:** `Citizen@123`
- **Status:** Verified

### Citizen 2 (Mrs. Kamla Devi)
- **Phone:** `9876543231`
- **Email:** `citizen2@test.com`
- **Password:** `Citizen@123`
- **Status:** Verified

## 📱 OTP Login (Development Mode)
**OTP for ALL numbers:** `000000` (or `123456` if using mock service)

Use these numbers for quick OTP login testing:
- **Super Admin:** `9876543210`
- **Officer 1:** `9876543220`
- **Citizen 1:** `9876543230`

## 📝 Notes
- **Environment:** Development
- **Database:** PostgreSQL (Seeded via `seed-test-users.ts`)
- **Cache:** Redis (Active)
