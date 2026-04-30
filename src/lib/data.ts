// src/lib/data.ts
// Load + query helpers dla master.json (parsowanie + walidacja Zod w build-time).
// Cached przez moduł, 1 parse per build.

import { MasterDataSchema, type Shelter, type MasterData } from '../schemas/shelter';
import rawData from '../data/master.json';

let _cache: MasterData | null = null;

/** Załaduj cały dataset (Zod parsed, cached). Pada przy invalid schema. */
export function loadMasterData(): MasterData {
  if (_cache) return _cache;
  _cache = MasterDataSchema.parse(rawData);
  return _cache;
}

/** Tablica wszystkich schronisk (127 rekordów). */
export function loadShelters(): Shelter[] {
  return loadMasterData().shelters;
}

/** Pojedyncze schronisko po ID (stable). Zwraca null jeśli nie znalezione. */
export function getShelter(id: string): Shelter | null {
  return loadShelters().find((s) => s.id === id) ?? null;
}

/** Schroniska w danym województwie (slug, np. "dolnoslaskie"). */
export function getSheltersByWojewodztwo(wojewodztwo: string): Shelter[] {
  return loadShelters().filter((s) => s.wojewodztwo === wojewodztwo);
}

/** Unikalne województwa obecne w datasecie (sortowane alfabetycznie). */
export function getUniqueWojewodztwa(): string[] {
  return Array.from(new Set(loadShelters().map((s) => s.wojewodztwo))).sort();
}
