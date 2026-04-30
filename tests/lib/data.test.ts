// tests/lib/data.test.ts
import { describe, it, expect } from 'vitest';
import { MasterDataSchema } from '../../src/schemas/shelter';
import {
  loadShelters,
  getShelter,
  getSheltersByWojewodztwo,
  getUniqueWojewodztwa,
} from '../../src/lib/data';
import data from '../../src/data/master.json';

describe('master.json schema validation', () => {
  it('parses without errors', () => {
    const result = MasterDataSchema.safeParse(data);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    expect(result.success).toBe(true);
  });

  it('contains 127 shelters', () => {
    const parsed = MasterDataSchema.parse(data);
    expect(parsed.shelters.length).toBe(127);
  });

  it('all shelters have unique IDs', () => {
    const parsed = MasterDataSchema.parse(data);
    const ids = parsed.shelters.map((s) => s.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('Krotoszyn record has fresh data (post pre-launch update)', () => {
    const parsed = MasterDataSchema.parse(data);
    const krot = parsed.shelters.find((s) => s.id === 'krotoszyn-ceglarska-11');
    expect(krot?.nazwa).toBe('TOZ Krotoszyn');
    expect(krot?.telefon).toBe('+48 660 662 191');
    expect(krot?.telefon_dodatkowy).toBe('+48 660 662 171');
    expect(krot?.email).toBe('krotoszyn@eadopcje.org');
    expect(krot?.godziny).toBe('pn-pt 10:00-15:00');
  });
});

describe('lib/data · getters', () => {
  it('loadShelters returns 127 records', () => {
    const shelters = loadShelters();
    expect(shelters.length).toBe(127);
  });

  it('getShelter returns Krotoszyn record', () => {
    const shelter = getShelter('krotoszyn-ceglarska-11');
    expect(shelter).not.toBeNull();
    expect(shelter?.nazwa).toBe('TOZ Krotoszyn');
    expect(shelter?.miasto).toBe('Krotoszyn');
  });

  it('getShelter returns null for unknown id', () => {
    expect(getShelter('nieistnieje-xyz-999')).toBeNull();
  });

  it('getSheltersByWojewodztwo returns wielkopolskie subset', () => {
    const shelters = getSheltersByWojewodztwo('wielkopolskie');
    expect(shelters.length).toBeGreaterThan(0);
    expect(shelters.every((s) => s.wojewodztwo === 'wielkopolskie')).toBe(true);
    expect(shelters.some((s) => s.id === 'krotoszyn-ceglarska-11')).toBe(true);
  });

  it('getSheltersByWojewodztwo returns empty array for unknown', () => {
    expect(getSheltersByWojewodztwo('nieistnieje').length).toBe(0);
  });

  it('getUniqueWojewodztwa returns 16 województw sorted', () => {
    const woj = getUniqueWojewodztwa();
    expect(woj.length).toBe(16);
    // Sorted alphabetically
    const sorted = [...woj].sort();
    expect(woj).toEqual(sorted);
  });
});
