# Security Documentation

This document outlines the security approach, portfolio protection strategies, and deployment recommendations for the Chemical Sector Economics Dashboard.

---

## Table of Contents

1. [Security Philosophy](#security-philosophy)
2. [No Secrets or API Keys](#no-secrets-or-api-keys)
3. [No Production Endpoints](#no-production-endpoints)
4. [Portfolio Protection Strategy](#portfolio-protection-strategy)
5. [Recommended Production Separation](#recommended-production-separation)
6. [Environment Variable Usage](#environment-variable-usage)
7. [Data Mode Configuration](#data-mode-configuration)
8. [Deployment Security](#deployment-security)
9. [Secure Development Practices](#secure-development-practices)
10. [Compliance Considerations](#compliance-considerations)

---

## Security Philosophy

This dashboard is designed with **security by default** and **portfolio protection** as core principles:

1. **No Secrets Committed:** Zero API keys, tokens, or credentials in source code or Git history
2. **Synthetic-First:** Default to synthetic data that exposes no real business information
3. **Clean Separation:** Clear boundaries between portfolio demo and production deployment
4. **Environment-Based Config:** All sensitive configuration via environment variables
5. **Defensive Defaults:** Safe defaults that require explicit opt-in to risky behaviors

**Portfolio Context:**
This project is a **technical demonstration** of software engineering capabilities, not a production data pipeline. It showcases architectural skills without exposing proprietary data or infrastructure.

---

## No Secrets or API Keys

### Current State: Zero Secrets

The repository contains **no secrets, API keys, tokens, or credentials**:

✅ **Clean repository:**
- No hardcoded API keys
- No database credentials
- No authentication tokens
- No OAuth secrets
- No private endpoints

✅ **Git history clean:**
- No secrets in commit history
- `.env` files properly gitignored
- `.env.example` contains only documentation, no real values

### Git Ignore Configuration

`.gitignore` properly excludes:
```
# Environment files
.env
.env.local
.env.production

# Build artifacts
dist/
build/
*.log

# Dependencies
node_modules/
```

### Verification

To verify no secrets are present:

```bash
# Check Git history for common secret patterns
git log -p | grep -i "api_key\|token\|secret\|password" || echo "No secrets found"

# Check current files
grep -r "api_key\|token\|secret" --exclude-dir=node_modules --exclude-dir=.git . || echo "No secrets in code"
```

---

## No Production Endpoints

### Synthetic Mode Only

The default configuration connects to **zero external services**:

- ❌ No external APIs
- ❌ No databases
- ❌ No authentication services
- ❌ No analytics/tracking services
- ❌ No third-party SaaS integrations

### Data Sources

**Synthetic Mode (Default):**
- All data generated in-browser using pure TypeScript functions
- No network requests
- No data leaves the client
- No backend required

**Open Data Mode (Stub):**
- Currently returns empty data
- Requires explicit implementation (see [docs/ARCHITECTURE.md](./ARCHITECTURE.md))
- Must be configured before use
- Intended for public APIs only (EIA, FRED, etc.)

### Network Activity

In default configuration, the application makes **zero network requests** after initial page load:

```typescript
// No API client initialized in synthetic mode
export class SyntheticDataProvider implements DataProvider {
  // All data generated locally
  async getSeries(metricId: string): Promise<TimeSeries> {
    return this.generateLocally(metricId);  // No network call
  }
}
```

---

## Portfolio Protection Strategy

### Why Portfolio Projects Need Protection

Portfolio projects demonstrate capabilities while protecting:
1. **Employer IP:** No proprietary business logic or data
2. **Career Reputation:** Professional code quality and security practices
3. **Future Opportunities:** Shows security awareness to potential employers
4. **Personal Information:** No PII or personal infrastructure exposed

### Protection Mechanisms

#### 1. Synthetic Data Barrier

Real data is **never** included:
- All metrics algorithmically generated
- No real company data
- No real customer information
- No real financial data
- No real strategic information

#### 2. Generic Industry Focus

The chemical sector is used as a **representative industry domain** to demonstrate:
- Economic modeling capabilities
- Data visualization skills
- TypeScript/React expertise
- **NOT** specific employer knowledge

#### 3. Public Attribution

Clear labeling throughout:
```typescript
sourceNote: "Synthetic Data - Portfolio Mode"
notes: "Synthetic data generated for portfolio demonstration"
```

#### 4. Documentation Transparency

All documentation clearly states:
- This is a portfolio demonstration
- Data is synthetic
- Architecture is generalizable, not employer-specific
- Skills demonstrated are transferable

---

## Recommended Production Separation

### Do NOT Deploy This As-Is to Production

This portfolio project is **not production-ready** without significant modifications:

❌ **Missing for Production:**
- Authentication and authorization
- Rate limiting
- API key rotation
- Audit logging
- HTTPS enforcement
- CORS configuration
- Input validation at API layer
- Error handling for production scenarios
- Monitoring and alerting
- Database connections
- Session management
- CSRF protection

### Production Deployment Approach

If adapting this architecture for production:

#### 1. Separate Repository

Create a **new private repository** for production:
```bash
# DO NOT clone portfolio repo directly to production
# Instead, extract architecture patterns and rebuild
```

#### 2. Backend API Layer

Add a proper backend (portfolio uses client-only):
```
portfolio-app/          production-app/
├── src/                ├── frontend/
│   ├── data/           │   └── src/
│   └── components/     ├── backend/
└── ...                 │   ├── api/
                        │   ├── auth/
                        │   └── data/
                        └── infrastructure/
```

#### 3. Secret Management

Use proper secret management:
- **Development:** Environment variables via `.env`
- **Production:** Secret management service (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault)

```typescript
// Production backend example
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

async function getApiKey(secretName: string): Promise<string> {
  const client = new SecretsManager({ region: 'us-east-1' });
  const response = await client.getSecretValue({ SecretId: secretName });
  return JSON.parse(response.SecretString!).apiKey;
}
```

#### 4. Access Control

Implement proper authentication:
```typescript
// Production backend route
app.get('/api/series/:metricId', 
  authenticate,           // Verify JWT/session
  authorize(['analyst']), // Check role/permission
  rateLimit,             // Prevent abuse
  async (req, res) => {
    // Validated, authorized data access
  }
);
```

---

## Environment Variable Usage

### Current Configuration

`.env.example` documents available variables:
```bash
# Data Mode Configuration
VITE_DATA_MODE=synthetic

# Future API Configuration (not currently used)
# VITE_API_BASE_URL=https://api.example.com
# VITE_ENABLE_ANALYTICS=false
```

### Local Development Setup

1. Copy example file:
```bash
cp .env.example .env
```

2. Edit `.env` (this file is gitignored):
```bash
# Safe default for portfolio demonstration
VITE_DATA_MODE=synthetic

# For testing open data mode (requires implementation)
# VITE_DATA_MODE=open
```

3. Never commit `.env`:
```bash
# Verify .env is gitignored
git check-ignore .env  # Should output: .env
```

### Production Environment Variables

For production deployment, set via platform:

**Vercel:**
```bash
vercel env add VITE_DATA_MODE production
vercel env add VITE_API_KEY production  # Via Vercel dashboard (encrypted)
```

**Netlify:**
```
Site Settings → Environment Variables → Add Variable
```

**Docker:**
```dockerfile
# Pass at runtime, not baked into image
docker run -e VITE_DATA_MODE=open -e VITE_API_KEY=$SECRET_KEY app:latest
```

**Kubernetes:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  api-key: <base64-encoded-key>
---
# Reference in deployment
env:
  - name: VITE_API_KEY
    valueFrom:
      secretKeyRef:
        name: app-secrets
        key: api-key
```

---

## Data Mode Configuration

### Synthetic Mode (Default)

**Security profile:**
- ✅ No external connections
- ✅ No secrets required
- ✅ No data leakage possible
- ✅ Safe for public portfolio
- ✅ Works offline

**Use cases:**
- Portfolio demonstration
- Development and testing
- Training and education
- Architecture examples

### Open Mode (Requires Implementation)

**Security profile:**
- ⚠️ Connects to external APIs
- ⚠️ May require API keys
- ⚠️ Subject to rate limits
- ⚠️ Data source terms of service apply

**Required before use:**
1. Implement `OpenDataProvider.ts` (currently stub)
2. Configure API credentials
3. Review data source licenses
4. Implement rate limiting
5. Add error handling
6. Test thoroughly

**Recommended API security:**
```typescript
export class OpenDataProvider implements DataProvider {
  private apiKey: string;
  
  constructor() {
    // Load from environment, never hardcode
    this.apiKey = import.meta.env.VITE_API_KEY;
    
    if (!this.apiKey) {
      throw new Error('VITE_API_KEY required for open data mode');
    }
  }
  
  async getSeries(metricId: string): Promise<TimeSeries> {
    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'User-Agent': 'ChemicalDashboard/1.0',  // Identify your app
      },
    });
    
    // Handle rate limits
    if (response.status === 429) {
      throw new Error('Rate limit exceeded');
    }
    
    return response.json();
  }
}
```

---

## Deployment Security

### Client-Side Security

Even though this is a client-side app, follow security best practices:

#### 1. Content Security Policy (CSP)

Add to `index.html` or via headers:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;">
```

#### 2. Subresource Integrity (SRI)

For CDN dependencies:
```html
<script src="https://cdn.example.com/lib.js"
        integrity="sha384-hash..."
        crossorigin="anonymous"></script>
```

#### 3. HTTPS Only

**Never** deploy without HTTPS:
```javascript
// Redirect HTTP to HTTPS (if using custom server)
if (window.location.protocol !== 'https:' && 
    window.location.hostname !== 'localhost') {
  window.location.protocol = 'https:';
}
```

#### 4. Secure Headers

Configure hosting platform to send:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### Dependency Security

#### Regular Updates

```bash
# Check for vulnerabilities
npm audit

# Fix automatically where possible
npm audit fix

# Review breaking changes before major updates
npm outdated
```

#### Dependency Scanning

Enable GitHub Dependabot:
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

#### Minimal Dependencies

Current production dependencies:
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "recharts": "^3.7.0",
  "zustand": "^5.0.11",
  "zod": "^4.3.6",
  "html-to-image": "^1.11.13",
  "tailwindcss": "^4.1.18"
}
```

**Principle:** Fewer dependencies = smaller attack surface

---

## Secure Development Practices

### Code Review Checklist

Before committing:
- [ ] No hardcoded credentials or secrets
- [ ] No sensitive comments (company names, internal URLs)
- [ ] No debug code with sensitive logging
- [ ] No commented-out secrets
- [ ] Environment variables used for all config
- [ ] `.env` not committed
- [ ] Error messages don't leak sensitive info

### Input Validation

Even for synthetic data, validate inputs:
```typescript
import { z } from 'zod';

const QueryParamsSchema = z.object({
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  geography: z.string().max(10).optional(),
});

export async function getSeries(metricId: string, params?: QueryParams) {
  // Validate before processing
  const validated = QueryParamsSchema.parse(params);
  // ... proceed with validated data
}
```

### Error Handling

Don't leak sensitive information in errors:
```typescript
// ❌ BAD - Exposes internal paths, versions
catch (error) {
  console.error('Database connection failed:', error);
  throw error;
}

// ✅ GOOD - Generic user-facing message, detailed logging elsewhere
catch (error) {
  logger.error('Data fetch failed', { metricId, error });
  throw new Error('Unable to load data. Please try again.');
}
```

---

## Compliance Considerations

### Data Privacy (GDPR, CCPA)

Since this portfolio uses **synthetic data only**:
- ✅ No personal data collected
- ✅ No tracking cookies (unless added)
- ✅ No user accounts or profiles
- ✅ No data retention concerns

**If adding analytics:**
- Disclose in privacy policy
- Provide opt-out mechanism
- Respect Do Not Track
- Use privacy-focused analytics (Plausible, Fathom)

### Open Source License (MIT)

The project uses MIT License:
- ✅ Permits commercial use
- ✅ Permits modification
- ✅ Permits distribution
- ✅ No warranty provided
- ⚠️ Must include license and copyright notice

**Using in your own portfolio:**
You may fork and customize, but:
1. Include original copyright notice
2. Don't claim original authorship
3. Customize to reflect your own skills
4. Remove any references specific to original author

### Third-Party API Terms

When implementing open data mode:
- **EIA API:** Free, no API key required, public domain data
- **FRED API:** Free with API key, cite Federal Reserve
- **Census Bureau:** Free, cite U.S. Census Bureau
- **World Bank:** Open license, attribution required

**Always:**
1. Read terms of service
2. Respect rate limits
3. Provide attribution
4. Cache appropriately
5. Don't resell data

---

## Security Incident Response

### If You Accidentally Commit a Secret

**Immediate actions:**

1. **Revoke the secret immediately:**
   - API keys: Regenerate in provider dashboard
   - Tokens: Invalidate and create new
   - Passwords: Change immediately

2. **Remove from Git history:**
   ```bash
   # Use git-filter-repo (safer than git-filter-branch)
   pip install git-filter-repo
   git-filter-repo --path .env --invert-paths
   git push --force --all
   ```

3. **Verify removal:**
   ```bash
   git log --all --full-history -- .env
   # Should return nothing
   ```

4. **Notify stakeholders:**
   - Your team
   - Security team (if employer repo)
   - API provider (if key was for paid service)

5. **Learn and prevent:**
   - Add pre-commit hooks
   - Use tools like `git-secrets`, `truffleHog`
   - Review `.gitignore` configuration

### GitHub Secret Scanning

GitHub automatically scans for leaked secrets. If notified:
1. Take it seriously - secret is compromised
2. Follow remediation steps above
3. Don't just delete the file - history still contains it

---

## Pre-Commit Security Hooks

### Recommended Setup

Install pre-commit framework:
```bash
# Install pre-commit
pip install pre-commit

# Create .pre-commit-config.yaml
cat > .pre-commit-config.yaml << EOF
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: check-added-large-files
      - id: check-merge-conflict
      - id: detect-private-key
      
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
EOF

# Install hooks
pre-commit install

# Run on all files
pre-commit run --all-files
```

This prevents committing:
- Large files (accidental data dumps)
- Merge conflicts
- Private keys
- Potential secrets

---

## Security Summary

### Current Security Posture: Excellent for Portfolio

✅ **Strengths:**
- No secrets or credentials in code
- Synthetic data by default
- No production endpoints
- Clean Git history
- Environment variable configuration
- Clear separation from production use
- MIT licensed and transparent

⚠️ **Limitations (By Design):**
- Client-side only (no backend security)
- No authentication/authorization
- No rate limiting
- Not production-ready without modification

### Production Deployment: Requires Enhancement

To use this architecture in production, add:
1. Backend API layer with authentication
2. Proper secret management service
3. Rate limiting and quota management
4. Audit logging
5. Error monitoring
6. Secure CI/CD pipeline
7. Penetration testing
8. Security review

---

## Security Contact

For security concerns related to this portfolio project:
- Review security practices documented here
- Check Git history for accidental commits
- Verify `.env` is properly gitignored
- Ensure synthetic mode is enabled for portfolio use

For production deployments (outside portfolio context):
- Conduct security review before deployment
- Implement authentication and authorization
- Use enterprise secret management
- Follow your organization's security policies

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01 | Initial security documentation |

---

**Remember:** This is a portfolio demonstration showcasing software engineering capabilities. Security practices are documented to show awareness and professionalism, not because this specific portfolio app requires production-grade security.
