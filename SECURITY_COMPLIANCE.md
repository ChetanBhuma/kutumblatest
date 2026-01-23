
# Security Compliance Report
## Kutumb - Senior Citizen Safety Platform
This document outlines the security compliance standards and implementations currently active in the project.

### 1. HTTP Security Headers
**Middleware:** `securityHeaders.ts` (Helmet)
We utilize `helmet` to set comprehensive HTTP headers that protect against common web vulnerabilities.
- **Content Security Policy (CSP)**: Restricts sources for scripts, styles, images, and other resources (`default-src: 'self'`).
- **HSTS (HTTP Strict Transport Security)**: Enforces HTTPS connections (`max-age: 1 year`, `includeSubDomains`, `preload`).
- **X-content-Type-Options**: Prevents MIME-sniffing attacks (`nosniff`).
- **X-Frame-Options**: Prevents Clickjacking attacks (`DENY`).
- **X-XSS-Protection**: Enables browser-side XSS filtering (`1; mode=block`).
- **Referrer-Policy**: Controls referrer information (`strict-origin-when-cross-origin`).
- **Permissions-Policy**: Restricts access to sensitive browser features (geolocation, camera, microphone, payment).

### 2. Input Validation & Sanitization
**Middleware:** `validation.ts`, `securityValidation.ts`
Robust validation layers ensure data integrity and prevent injection attacks.
- **SQL Injection Prevention**: Regex-based detection blocks common SQL injection patterns (e.g., `UNION`, `--`, `1=1`).
- **XSS (Cross-Site Scripting) Prevention**: `securityValidation.ts` detects and blocks script tags, javascript URIs, and event handlers. `sanitizeInput` strips dangerous content from request bodies.
- **NoSQL Injection Prevention**: Recursively sanitizes input to remove MongoDB operators (keys starting with `$`).
- **Path Traversal Prevention**: Blocks directory traversal attempts (`../`, `%2e%2e%2f`).
- **Field-Level Validation**: Uses `express-validator` for strict typing and format checking (Email, Phone, Aadhaar, Password complexity).

### 3. Rate Limiting & DoS Protection
**Middleware:** `rateLimiter.ts`
Layered rate limiting strategy to prevent Denial of Service (DoS) and Brute Force attacks.
- **General API Limiter**: 100 requests / 15 mins per IP.
- **Auth Endpoint Limiter**: Strict limit of 5 failed login attempts / 15 mins.
- **OTP Limiter**: 3 OTP requests / 10 mins per identifier.
- **Password Reset Limiter**: 3 requests / hour.
- **Trusted IPs**: Configurable whitelist to bypass rate limits for internal services.

### 4. Authentication & Session Management
**Service:** `TokenService`, `SessionService`
**Middleware:** `authenticate.ts`, `sessionActivity.ts`
- **JWT (JSON Web Tokens)**: Stateless authentication with short-lived access tokens and secure refresh tokens.
- **Session Tracking**: Active session monitoring via Redis.
- **Session Timeout**: Auto-logout after 30 minutes of inactivity.
- **Suspicious Activity Detection**: Alerts on IP address or User-Agent changes during an active session.
- **IP Banning**: `ipBan.ts` automatically bans IPs after repeated failed authentication attempts or malicious input detection.

### 5. CSRF Protection
**Middleware:** `csrf.ts`
- **Double-Submit Cookie Pattern**: Implemented using `csurf` middleware.
- **Secure Cookies**: HTTPOnly, Secure (in production), and SameSite=Strict cookies.

### 6. Audit Logging & Monitoring
**Middleware:** `auditMiddleware.ts`, `performanceMonitor.ts`
- **Comprehensive Audit Logs**: Tracks all critical actions (`CREATE`, `UPDATE`, `DELETE`) with user context (ID, IP, Role).
- **Performance Monitoring**: Real-time tracking of request duration, memory usage, and status codes. Alerts on slow requests (>1s).
- **Sensitive Data Redaction**: Automatically redacts passwords, tokens, and PII from logs.

### 7. Data Privacy (Proposed/Active)
- **Data Encryption**: Passwords hashed using `bcryptjs`.
- **RBAC (Role-Based Access Control)**: Strict permission enforcement via `authorize.ts` (Roles: CITIZEN, OFFICER, ADMIN).
