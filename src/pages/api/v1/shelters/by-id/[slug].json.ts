// src/pages/api/v1/shelters/by-id/[slug].json.ts
// /api/v1/shelters/by-id/{id}.json — pojedyncze schronisko per stable ID (127 endpointów).

import type { APIRoute, GetStaticPaths } from 'astro';
import { loadShelters, getShelter } from '../../../../../lib/data';

export const getStaticPaths: GetStaticPaths = () => {
  return loadShelters().map((s) => ({ params: { slug: s.id } }));
};

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug as string;
  const shelter = getShelter(slug);
  if (!shelter) {
    return new Response(JSON.stringify({ error: 'Not found', id: slug }), {
      status: 404,
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
    });
  }
  return new Response(JSON.stringify(shelter, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
