# Server Services Documentation

This directory contains all backend service modules used for the ProStar application.

## Modules

### 📧 emailService.ts
SMTP email sending with retry logic.

**Exports:**
- `isEmailServiceConfigured()` - Check if email credentials are set
- `sendCourseAccessEmail(data)` - Send welcome email with access code
- `sendEmail(data)` - Generic email sending function

**Features:**
- 3 attempts with exponential backoff
- HTML template with responsive design
- Tracking pixel for open rate monitoring
- Gmail SMTP integration

**Environment:**
- `EMAIL_USER` - Gmail address
- `EMAIL_PASSWORD` - Gmail app password
- `EMAIL_FROM` - Sender email (defaults to EMAIL_USER)
- `SITE_URL` - For links in emails (defaults to http://localhost:3000)

---

### 🔐 courseService.ts
Course registration and access code verification.

**Exports:**
- `generateAccessKey(email)` - Create unique 90-day access code
- `registerForCourse(data)` - Register user and generate code
- `verifyAccessKey(email, accessKey)` - Verify code is valid

**Features:**
- Email tag security (code tied to email)
- 90-day expiration
- Dev mode auto-acceptance
- Consistent email tag validation

**Returns:**
```typescript
// registerForCourse
{ success: true, accessKey, expiresAt, registration }

// verifyAccessKey
{ valid: true, name, email, courseName, expiresAt }
{ valid: false, error: "message" }
```

---

### 💾 registrationCache.ts
In-memory registration storage (fallback when DB offline).

**Exports:**
- `registrationCache` - Singleton instance
- `logRegistrationCache()` - Print cache statistics

**Methods:**
- `set(key, registration)` - Store registration + index by email
- `get(key)` - Lookup by access key
- `getByEmail(email)` - Get all codes for email
- `update(key, partial)` - Partial update
- `clear()` - Delete all entries
- `stats()` - Count metrics

**Important:**
- Only for development/testing
- Clears on server restart
- Production must use persistent database

---

### 📚 index.ts
Centralized exports for all services.

Simplifies imports:
```typescript
// Instead of:
import { registerForCourse } from './courseService';
import { sendCourseAccessEmail } from './emailService';
import { registrationCache } from './registrationCache';

// You can use:
import { registerForCourse, sendCourseAccessEmail, registrationCache } from './index';
```

---

## Architecture

```
Browser
   ↓
API Route (tRPC or Express)
   ↓
courseService.registerForCourse() → registrationCache.set()
   ↓
emailService.sendCourseAccessEmail() → SMTP/Gmail
   ↓
Client email receives code
   ↓
courseService.verifyAccessKey() → registrationCache.get()
```

## Error Handling

All services return consistent response objects:

**Success:**
```typescript
{ success: true, messageId: "...", ... }
```

**Failure:**
```typescript
{ success: false, error: "Human-readable error message" }
```

## Debugging

### Check cache state
```typescript
import { registrationCache, logRegistrationCache } from './services';

logRegistrationCache(); // Print statistics
registrationCache.getAll(); // Get all registrations
```

### Check email config
```typescript
import { isEmailServiceConfigured } from './services';

if (!isEmailServiceConfigured()) {
  console.log('Email not configured');
}
```

### Run E2E test
```bash
pnpm run e2e:run                           # Random email
pnpm run e2e:run -- --email=test@x.de    # Custom email
pnpm run e2e:run -- --name=John           # Custom name
```

## Dev Mode

When `NODE_ENV=development`:
- `verifyAccessKey()` accepts any code if email tag matches
- Useful for testing without SMTP

To disable:
```bash
NODE_ENV=production pnpm run e2e:run
```
