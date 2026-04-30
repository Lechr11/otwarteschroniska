// src/pages/api/v1/shelters.json.ts
// /api/v1/shelters.json, cały dataset (127 schronisk).

import type { APIRoute } from 'astro';
import { loadShelters } from '../../../lib/data';

export const GET: APIRoute = () => {
  const shelters = loadShelters();
  return new Response(JSON.stringify(shelters, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
