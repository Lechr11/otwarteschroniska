// src/lib/manifest.ts
// Compute coverage statistics z dataset (telefon%, email%, www%, geo%).
// Wynik używany w manifest endpoint + bar charts na landingu.

import type { Shelter } from '../schemas/shelter';

export interface Coverage {
  telefon_pct: number;
  email_pct: number;
  www_pct: number;
  geo_pct: number;
}

/** Procent rekordów z niepustym polem (rounded to 1 decimal). */
export function computeCoverage(shelters: Shelter[]): Coverage {
  const total = shelters.length;
  if (total === 0) {
    return { telefon_pct: 0, email_pct: 0, www_pct: 0, geo_pct: 0 };
  }
  const pct = (count: number) => Math.round((count / total) * 1000) / 10;
  return {
    telefon_pct: pct(shelters.filter((s) => !!s.telefon).length),
    email_pct: pct(shelters.filter((s) => !!s.email).length),
    www_pct: pct(shelters.filter((s) => !!s.www).length),
    geo_pct: pct(shelters.filter((s) => !!s.geo).length),
  };
}
