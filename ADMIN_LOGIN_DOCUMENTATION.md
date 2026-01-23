# Enhanced Admin Login System - Documentation

## Overview
The admin login page has been completely redesigned to provide multiple authentication methods tailored for different user types (Admins and Beat Officers).

## Features

### 1. **Dual Authentication Methods**
- **Password-based Login**: Traditional username/password authentication
- **OTP-based Login**: One-Time Password authentication via SMS

### 2. **User Type Selection**
- **Admin**: For administrative staff
  - Login with Email or Phone + Password
  - Login with Email or Phone + OTP
- **Beat Officer**: For field officers
  - Login with PIS Number + Password
  - Login with PIS Number + OTP (sent to registered mobile)

### 3. **Security Features**
- Password visibility toggle
- OTP verification (6-digit)
- Forgot password functionality
- Error handling with clear messages
- Rate limiting on backend
- Session management

### 4. **User Experience**
- Clean, modern UI with gradient background
- Tab-based navigation between login methods
- Responsive design for all devices
- Loading states and disabled buttons during processing
- Clear error messages
- Easy navigation to citizen portal

## Login Flows

### Admin Login Flow

#### Option 1: Password Login
1. Select "Admin" user type
2. Select "Password" tab
3. Enter email or phone number
4. Enter password
5. Click "Sign In"
6. Redirected to admin dashboard

#### Option 2: OTP Login
1. Select "Admin" user type
2. Select "OTP" tab
3. Enter email or phone number
4. Click "Send OTP"
5. Enter 6-digit OTP received
6. Click "Verify & Login"
7. Redirected to admin dashboard

### Beat Officer Login Flow

#### Option 1: Password Login (PIS-based)
1. Select "Beat Officer" user type
2. Select "Password" tab
3. Enter PIS Number
4. Enter password
5. Click "Sign In"
6. Redirected to admin dashboard

#### Option 2: OTP Login (PIS-based)
1. Select "Beat Officer" user type
2. Select "OTP" tab
3. Enter PIS Number
4. Click "Send OTP"
5. OTP sent to registered mobile number
6. Enter 6-digit OTP received
7. Click "Verify & Login"
8. Redirected to admin dashboard

### Forgot Password Flow
1. Click "Forgot password?" link
2. Enter email address
3. Click "Send Reset Link"
4. Check email for password reset link
5. Follow link to reset password

## Technical Implementation

### Frontend Components
- **File**: `/app/admin/login/page.tsx`
- **Framework**: Next.js 15 with React
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

### Backend Integration
- **API Client**: `/lib/api-client.ts`
- **Endpoints Used**:
  - `POST /api/v1/auth/login` - Password login
  - `POST /api/v1/auth/otp/send` - Send OTP
  - `POST /api/v1/auth/otp/verify` - Verify OTP
  - `POST /api/v1/auth/forgot-password` - Forgot password

### State Management
```typescript
// Authentication states
- loginMethod: 'password' | 'otp'
- userType: 'admin' | 'officer'
- identifier: string (email/phone/PIS)
- password: string
- pisNumber: string
- otp: string
- otpSent: boolean
- isLoading: boolean
- error: string
```

### Error Handling
- Network errors
- Invalid credentials
- Invalid OTP
- Expired OTP
- Rate limiting errors
- Server errors

## API Integration

### Login with Password
```typescript
POST /api/v1/auth/login
Body: {
  identifier: string, // email, phone, or PIS number
  password: string
}
Response: {
  success: boolean,
  data: {
    user: User,
    tokens: {
      accessToken: string,
      refreshToken: string
    }
  }
}
```

### Send OTP
```typescript
POST /api/v1/auth/otp/send
Body: {
  identifier: string // email, phone, or PIS number
}
Response: {
  success: boolean,
  message: string
}
```

### Verify OTP
```typescript
POST /api/v1/auth/otp/verify
Body: {
  identifier: string,
  otp: string
}
Response: {
  success: boolean,
  data: {
    user: User,
    tokens: {
      accessToken: string,
      refreshToken: string
    }
  }
}
```

### Forgot Password
```typescript
POST /api/v1/auth/forgot-password
Body: {
  email: string
}
Response: {
  success: boolean,
  message: string
}
```

## Security Considerations

### Frontend Security
- Password masking with toggle visibility
- OTP input sanitization (digits only, max 6)
- Form validation before submission
- CSRF protection via tokens
- Secure token storage in localStorage
- Automatic token refresh

### Backend Security
- Rate limiting on login attempts
- OTP expiration (typically 5-10 minutes)
- Password hashing with bcrypt
- JWT token authentication
- Session management
- IP-based blocking for suspicious activity

## Testing

### Manual Testing Checklist
- [ ] Admin password login works
- [ ] Admin OTP login works
- [ ] Officer password login works (PIS-based)
- [ ] Officer OTP login works (PIS-based)
- [ ] Forgot password sends email
- [ ] Invalid credentials show error
- [ ] Invalid OTP shows error
- [ ] OTP resend works
- [ ] Password visibility toggle works
- [ ] Navigation to citizen portal works
- [ ] Responsive design on mobile
- [ ] Loading states display correctly
- [ ] Error messages are clear

### Test Credentials
```
Admin:
- Email: admin@delhipolice.gov.in
- Password: [Set in database]

Beat Officer:
- PIS Number: [From user master]
- Password: [Set in database]
```

## Deployment Notes

### Environment Variables Required
```env
# Backend
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=7d
OTP_EXPIRY_MINUTES=10

# Email Service (for forgot password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# SMS Service (for OTP)
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=DLHPOL
```

### Database Requirements
- User table with PIS number field
- OTP storage table
- Password reset token table
- Session management

## Troubleshooting

### Common Issues

**Issue**: OTP not received
- Check if mobile number is registered
- Verify SMS service is configured
- Check SMS service logs
- Ensure OTP hasn't expired

**Issue**: Login fails with valid credentials
- Check if user account is active
- Verify password hasn't expired
- Check rate limiting logs
- Ensure backend is running

**Issue**: Forgot password email not received
- Check spam folder
- Verify email service configuration
- Check SMTP logs
- Ensure email is registered

## Future Enhancements

1. **Biometric Authentication**: Fingerprint/Face ID for mobile
2. **Multi-Factor Authentication**: Additional security layer
3. **Single Sign-On (SSO)**: Integration with Delhi Police SSO
4. **Remember Me**: Persistent login option
5. **Login History**: Track login attempts and devices
6. **Geolocation Verification**: Verify login location
7. **Device Management**: Manage trusted devices

## Support

For technical support or issues:
- Email: support@delhipolice.gov.in
- Phone: 1800-XXX-XXXX
- Help Desk: Available 24/7

---

**Last Updated**: 2025-11-27
**Version**: 2.0
**Status**: Production Ready ✅
