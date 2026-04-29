// public/api/v1/types.d.ts
// Polish Animal Shelters Open Dataset v1.0 — TypeScript types
// License: CC-BY 4.0 (data) | https://otwarteschroniska.org.pl
//
// Usage:
//   import type { Shelter } from 'https://otwarteschroniska.org.pl/api/v1/types.d.ts';

/** Voivodeship slug (Polish administrative region), lowercased without diacritics */
export type Wojewodztwo =
  | 'dolnoslaskie' | 'kujawsko-pomorskie' | 'lubelskie' | 'lubuskie'
  | 'lodzkie' | 'malopolskie' | 'mazowieckie' | 'opolskie'
  | 'podkarpackie' | 'podlaskie' | 'pomorskie' | 'slaskie'
  | 'swietokrzyskie' | 'warminsko-mazurskie' | 'wielkopolskie' | 'zachodniopomorskie';

/** Geo coordinates (WGS84) */
export interface GeoCoordinates {
  /** Latitude */
  lat: number;
  /** Longitude */
  lng: number;
}

/** Single animal shelter record */
export interface Shelter {
  /** Stable identifier, format: {city}-{street-number} or {city}-{name-slug}.
   *  Note: some Phase 1 IDs may contain Polish diacritics (slugifier bug, will be fixed in Phase 2.5). */
  id: string;
  /** Official shelter name */
  nazwa: string;
  /** Voivodeship (administrative region) */
  wojewodztwo: Wojewodztwo;
  /** City */
  miasto: string;
  /** Polish postal code in format XX-XXX */
  kod_pocztowy?: string | null;
  /** Street address */
  adres?: string | null;
  /** Primary phone number */
  telefon?: string | null;
  /** Secondary phone number (e.g., adoption-specific) */
  telefon_dodatkowy?: string | null;
  /** Opening hours (free-form Polish string, e.g., "pn-pt 10:00-15:00") */
  godziny?: string | null;
  /** Contact email */
  email?: string | null;
  /** Website URL (note: some entries may lack 'https://' prefix) */
  www?: string | null;
  /** Geographic coordinates (WGS84). Coverage: ~17% of dataset. */
  geo?: GeoCoordinates | null;
  /** Source URLs (provenance, attribution to original sources) */
  zrodla?: string[];
  /** Quality score 0.0-1.0, see /docs/quality. Higher = more complete data. */
  data_quality_score?: number;
  /** Internal notes (e.g., "kontakt prywatny" for opt-out cases) */
  notatki?: string | null;
  /** True if shelter requested RODO opt-out (record retained but signaled) */
  opt_out?: boolean;
}

/** Top-level dataset structure (master.json shape) */
export interface MasterData {
  schema_version: string;
  generated_at: string;
  total_shelters: number;
  license: string;
  shelters: Shelter[];
}

/** API manifest endpoint response (/api/v1/manifest.json) */
export interface Manifest {
  schema_version: string;
  generated_at: string;
  total_shelters: number;
  license: string;
  endpoints: {
    manifest: string;
    shelters_all: string;
    shelters_by_wojewodztwo: string;
    shelter_by_id: string;
    schema: string;
    types: string;
  };
  coverage: {
    telefon_pct: number;
    email_pct: number;
    www_pct: number;
    geo_pct: number;
  };
  documentation: string;
  license_url: string;
}
