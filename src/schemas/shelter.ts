// src/schemas/shelter.ts
// Zod schema dla rekordu schroniska + master.json (top-level package).
// Schema mirror Phase 1 master.json schema v1.0 — sync wymaga ręcznego update gdy bumpujemy schema_version.

import { z } from 'zod';

// Schema pojedynczego schroniska (rekord w `shelters[]`).
// Permissive constraints — Phase 1 scraper data ma occasional polish chars w IDs + www bez schemy.
// Zluzowane vs spec wstępny: id (pozwala diacritics), www (string, nie strict URL).
export const ShelterSchema = z.object({
  id: z.string().min(1),  // luźne — Phase 1 IDs mogą mieć diacritics (do poprawy w Phase 2.5)
  nazwa: z.string().min(1),
  wojewodztwo: z.string().min(1),
  miasto: z.string().min(1),
  kod_pocztowy: z.string().regex(/^\d{2}-\d{3}$/).nullable().optional(),
  adres: z.string().nullable().optional(),
  telefon: z.string().nullable().optional(),
  telefon_dodatkowy: z.string().nullable().optional(),
  godziny: z.string().nullable().optional(),
  email: z.string().nullable().optional(),  // luźne — niektóre emaile mają nietypowe formaty
  www: z.string().nullable().optional(),  // luźne — niektóre WWW bez https:// schemy (np. "www.example.pl")
  geo: z.object({
    lat: z.number(),
    lng: z.number(),
  }).nullable().optional(),
  zrodla: z.array(z.string()).optional(),
  data_quality_score: z.number().min(0).max(1).optional(),  // float 0-1 (Phase 1 scraper scale)
  notatki: z.string().nullable().optional(),
  opt_out: z.boolean().optional(),
});

// Schema całego master.json (z metadata + tablicą schronisk).
export const MasterDataSchema = z.object({
  schema_version: z.string(),
  generated_at: z.string(),
  total_shelters: z.number().int().positive(),
  license: z.string(),
  shelters: z.array(ShelterSchema),
});

export type Shelter = z.infer<typeof ShelterSchema>;
export type MasterData = z.infer<typeof MasterDataSchema>;
