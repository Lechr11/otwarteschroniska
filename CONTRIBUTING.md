# Contributing to otwarteschroniska.org.pl

Thank you for your interest! This is a non-profit, single-maintainer project, so response times may be 1-7 days.

## Reporting data corrections

Found an error in shelter data (wrong phone, outdated address, wrong opening hours)?

**2 ways to report:**

### Option 1: Email (preferred)
Send to `kontakt@otwarteschroniska.org.pl` with:
- Shelter ID (e.g., `krotoszyn-ceglarska-11`)
- URL of the shelter on https://otwarteschroniska.vercel.app/api/v1/shelters/by-id/{id}.json
- What needs to be corrected
- Source of correct information (link, document, your role at shelter)

### Option 2: GitHub Issue
[Open new issue](https://github.com/Lechr11/otwarteschroniska/issues/new) with the same info.

## RODO opt-out (Polish data protection)

If you are a representative of a shelter and want your shelter removed from the dataset, send email to `kontakt@otwarteschroniska.org.pl` with:
- Shelter ID
- Confirmation of your role (admin email or document)

We will process within ≤5 business days. Two outcomes:
1. Record removed completely
2. Record retained with `opt_out: true` flag (signals to consumers but preserves transparency)

## Adding new shelter

If you know an animal shelter not in our dataset, please email with:
- Name, address, voivodeship, city
- Phone (preferred) and any other contact info
- Source of information (shelter's own website, registry document)

## Code contributions

Currently the code is single-maintainer (Lech). For substantial changes, please open an issue first to discuss.
For small fixes (typos, doc improvements), PRs welcome.

## License reminder

By contributing data, you confirm:
- Data is from public sources or your authorization
- You agree to license your contribution under CC-BY 4.0 (data) or MIT (code)
