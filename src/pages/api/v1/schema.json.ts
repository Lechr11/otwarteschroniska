// src/pages/api/v1/schema.json.ts
// /api/v1/schema.json, JSON Schema draft 2020-12 z opisami EN per pole.

import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://otwarteschroniska.org.pl/api/v1/schema.json',
    title: 'Polish Animal Shelters Open Dataset',
    description: 'Open dataset of animal shelters in Poland (CC-BY 4.0). First-mover open data initiative.',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'Stable identifier, format: {city}-{street-number} or {city}-{name-slug}. Some Phase 1 IDs may contain Polish diacritics (slugifier bug, will be fixed in Phase 2.5).',
      },
      nazwa: {
        type: 'string',
        minLength: 1,
        description: 'Official shelter name in Polish.',
      },
      wojewodztwo: {
        type: 'string',
        enum: [
          'dolnoslaskie', 'kujawsko-pomorskie', 'lubelskie', 'lubuskie',
          'lodzkie', 'malopolskie', 'mazowieckie', 'opolskie',
          'podkarpackie', 'podlaskie', 'pomorskie', 'slaskie',
          'swietokrzyskie', 'warminsko-mazurskie', 'wielkopolskie', 'zachodniopomorskie',
        ],
        description: 'Voivodeship slug (Polish administrative region), lowercased without diacritics.',
      },
      miasto: {
        type: 'string',
        description: 'City name in Polish.',
      },
      kod_pocztowy: {
        type: ['string', 'null'],
        pattern: '^\\d{2}-\\d{3}$',
        description: 'Polish postal code in format XX-XXX.',
      },
      adres: {
        type: ['string', 'null'],
        description: 'Street address.',
      },
      telefon: {
        type: ['string', 'null'],
        description: 'Primary phone number (international format preferred).',
      },
      telefon_dodatkowy: {
        type: ['string', 'null'],
        description: 'Secondary phone number (e.g., adoption-specific).',
      },
      godziny: {
        type: ['string', 'null'],
        description: 'Opening hours (free-form Polish string, e.g., "pn-pt 10:00-15:00").',
      },
      email: {
        type: ['string', 'null'],
        description: 'Contact email.',
      },
      www: {
        type: ['string', 'null'],
        description: 'Website URL. Note: some entries may lack "https://" prefix.',
      },
      geo: {
        type: ['object', 'null'],
        properties: {
          lat: { type: 'number', description: 'Latitude (WGS84).' },
          lng: { type: 'number', description: 'Longitude (WGS84).' },
        },
        required: ['lat', 'lng'],
        description: 'Geographic coordinates (WGS84). Coverage: ~17% of dataset.',
      },
      zrodla: {
        type: 'array',
        items: { type: 'string' },
        description: 'Source URLs (provenance, attribution to original sources).',
      },
      data_quality_score: {
        type: 'number',
        minimum: 0,
        maximum: 1,
        description: 'Quality score 0.0-1.0 (higher = more complete data). See /docs/quality.',
      },
      notatki: {
        type: ['string', 'null'],
        description: 'Internal notes (e.g., "kontakt prywatny" for opt-out cases).',
      },
      opt_out: {
        type: 'boolean',
        description: 'True if shelter requested RODO opt-out (record retained for transparency, but signaled).',
      },
    },
    required: ['id', 'nazwa', 'wojewodztwo', 'miasto'],
  };

  return new Response(JSON.stringify(schema, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
