# Documentation Index

This directory contains comprehensive technical documentation for the Chemical Sector Economics Dashboard.

## Available Documentation

### 📊 [METRICS.md](./METRICS.md)
**Complete Metrics Catalog**
- 20 economic indicators documented in detail
- Metric IDs, units, expected ranges
- Category organization (6 categories)
- Use cases and applications
- Modeling approaches and characteristics
- Metric relationships and correlations
- Real data source recommendations

**Who should read:** Anyone wanting to understand what metrics are tracked, their meanings, and how they're used.

---

### 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md)
**Technical Architecture Guide**
- DataProvider abstraction pattern
- Synthetic data generation algorithms
  - Multi-component additive modeling
  - Autocorrelated noise generation
  - Cyclical pattern modeling
- Event injection system (shock events)
- Chart system architecture
- Export functionality (PNG/JSON)
- State management with Zustand
- Component structure and organization
- Guide to swapping to real open data sources
- Performance considerations

**Who should read:** Developers implementing similar systems, technical evaluators, anyone extending the codebase.

---

### 🛡️ [SECURITY.md](./SECURITY.md)
**Security & Portfolio Protection**
- Zero secrets policy
- No production endpoints
- Portfolio protection strategies
- Production deployment separation
- Environment variable best practices
- Data mode configuration security
- Deployment security checklist
- Dependency security
- Compliance considerations (GDPR, licenses)
- Incident response procedures

**Who should read:** Security-conscious users, deployment engineers, anyone evaluating production readiness.

---

## Quick Navigation

### For Developers
1. Start with [ARCHITECTURE.md](./ARCHITECTURE.md) to understand system design
2. Reference [METRICS.md](./METRICS.md) when working with specific metrics
3. Review [SECURITY.md](./SECURITY.md) before deployment

### For Portfolio Reviewers
1. Read the main [README.md](../README.md) for project overview
2. Check [METRICS.md](./METRICS.md) to see domain knowledge depth
3. Skim [ARCHITECTURE.md](./ARCHITECTURE.md) for technical sophistication
4. Review [SECURITY.md](./SECURITY.md) for security awareness

### For Users
1. Main [README.md](../README.md) for getting started
2. [METRICS.md](./METRICS.md) to understand what data means
3. [ARCHITECTURE.md](./ARCHITECTURE.md) → "Swapping to Real Open Data" if integrating real APIs

---

## Documentation Statistics

- **Total Documentation:** ~2,500 lines
- **METRICS.md:** 340 lines - Complete metric catalog
- **ARCHITECTURE.md:** 853 lines - Technical deep dive
- **SECURITY.md:** 740 lines - Security & deployment
- **README.md:** 621 lines - Project overview & guide

---

## Contributing to Documentation

Documentation improvements welcome:
1. Keep consistent formatting (Markdown)
2. Use clear section headers
3. Include code examples where helpful
4. Cross-reference related sections
5. Update table of contents when adding sections

---

## License

Documentation is part of the project and covered by the MIT License. See [../LICENSE](../LICENSE).
