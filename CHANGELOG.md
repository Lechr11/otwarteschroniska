# Changelog

All notable changes to this dataset will be documented in this file.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-04-30

### Added
- Initial release: 127 animal shelters from 16 voivodeships
- Schema v1.0 (Polish field names, EN documentation in schema.json + types.d.ts)
- 5 API endpoints: `/manifest`, `/shelters`, `/shelters/[wojewodztwo]`, `/shelters/by-id/[slug]`, `/schema`
- License: CC-BY 4.0 (data) + MIT (code)
- Hosting: Vercel hobby + GitHub public repo
- Live playground on landing page
- Docs: schema, quality, changelog

### Coverage (v1.0)
- Phone: ~99%
- Address: 100% (Phase 1 hard gate)
- Website: ~44%
- Email: ~15%
- Geo coordinates: ~17%

### Known issues (carried over from Phase 1 scraper)
- 3 IDs contain Polish diacritics or cyrillic chars (slugifier bug — fix in Phase 2.5)
- 7 WWW entries lack `https://` schema prefix (fix in Phase 2.5)
- `data_quality_score` is float 0.0-1.0 (not 1-6 integer as initially planned)

### Future
See `/docs/changelog/` roadmap section.
