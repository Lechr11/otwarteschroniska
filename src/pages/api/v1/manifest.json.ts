// src/pages/api/v1/manifest.json.ts
// /api/v1/manifest.json, metadata + coverage stats.

import type { APIRoute } from 'astro';
import { loadMasterData, loadShelters } from '../../../lib/data';
import { computeCoverage } from '../../../lib/manifest';

export const GET: APIRoute = () => {
  const master = loadMasterData();
  const shelters = loadShelters();
  const coverage = computeCoverage(shelters);

  const manifest = {
    schema_version: master.schema_version,
    generated_at: master.generated_at,
    total_shelters: master.total_shelters,
    license: master.license,
    endpoints: {
      manifest: '/api/v1/manifest.json',
      shelters_all: '/api/v1/shelters.json',
      shelters_by_wojewodztwo: '/api/v1/shelters/{wojewodztwo}.json',
      shelter_by_id: '/api/v1/shelters/by-id/{id}.json',
      schema: '/api/v1/schema.json',
      types: '/api/v1/types.d.ts',
    },
    coverage,
    documentation: 'https://otwarteschroniska.org.pl/docs/',
    license_url: 'https://creativecommons.org/licenses/by/4.0/',
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
