# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ Actively supported |

## Reporting a Vulnerability

If you discover a security vulnerability in Tagih Dong, please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Send an email to **support@99apps.id** with:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours of your report
- **Assessment**: Within 7 days, we'll assess the severity
- **Fix**: Critical vulnerabilities will be patched within 14 days
- **Disclosure**: We'll coordinate disclosure timing with you

### Scope

The following are in scope:
- Cross-Site Scripting (XSS)
- Authentication bypass
- Data exposure via localStorage
- PDF injection vulnerabilities

The following are **out of scope**:
- Issues in third-party dependencies (report to upstream)
- Social engineering attacks
- Denial of service attacks

## Data Privacy

Tagih Dong stores all user data in the browser's `localStorage`. No user data is transmitted to external servers unless the optional backend API is configured. Users have full control over their data and can clear it at any time by clearing browser storage.

## Admin Access

Admin access is restricted to whitelisted email addresses:
- `99apps.id@gmail.com`
- `support@99apps.id`

These emails are hardcoded in the application source and cannot be changed without modifying the codebase.
