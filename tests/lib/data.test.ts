// tests/lib/data.test.ts
import { describe, it, expect } from 'vitest';
import { MasterDataSchema } from '../../src/schemas/shelter';
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
