// tests/lib/manifest.test.ts
import { describe, it, expect } from 'vitest';
import { computeCoverage } from '../../src/lib/manifest';
import type { Shelter } from '../../src/schemas/shelter';

describe('lib/manifest — computeCoverage', () => {
  it('empty array returns 0%', () => {
    const c = computeCoverage([]);
    expect(c.telefon_pct).toBe(0);
    expect(c.email_pct).toBe(0);
    expect(c.www_pct).toBe(0);
    expect(c.geo_pct).toBe(0);
  });

  it('counts non-null/non-empty correctly', () => {
    const shelters: Shelter[] = [
      { id: 'a', nazwa: 'A', wojewodztwo: 'dolnoslaskie', miasto: 'X', telefon: '+48 1', email: 'a@b.com' },
      { id: 'b', nazwa: 'B', wojewodztwo: 'dolnoslaskie', miasto: 'Y', telefon: '+48 2', email: null, www: 'http://x.pl' },
      { id: 'c', nazwa: 'C', wojewodztwo: 'dolnoslaskie', miasto: 'Z' },
      { id: 'd', nazwa: 'D', wojewodztwo: 'dolnoslaskie', miasto: 'W', geo: { lat: 50, lng: 17 } },
    ];
    const c = computeCoverage(shelters);
    expect(c.telefon_pct).toBe(50.0);  // 2/4
    expect(c.email_pct).toBe(25.0);    // 1/4
    expect(c.www_pct).toBe(25.0);      // 1/4
    expect(c.geo_pct).toBe(25.0);      // 1/4
  });

  it('rounds to 1 decimal', () => {
    const shelters: Shelter[] = Array.from({ length: 7 }, (_, i) => ({
      id: `s${i}`,
      nazwa: `S${i}`,
      wojewodztwo: 'dolnoslaskie',
      miasto: 'X',
      telefon: i < 5 ? '+48 1' : null,
    }));
    const c = computeCoverage(shelters);
    // 5/7 = 0.7142857... → 71.4
    expect(c.telefon_pct).toBe(71.4);
  });
});
