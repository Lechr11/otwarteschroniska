// src/pages/api/v1/shelters/[wojewodztwo].json.ts
// /api/v1/shelters/{wojewodztwo}.json — schroniska per województwo (16 endpointów).

import type { APIRoute, GetStaticPaths } from 'astro';
import { loadShelters, getSheltersByWojewodztwo, getUniqueWojewodztwa } from '../../../../lib/data';

export const getStaticPaths: GetStaticPaths = () => {
  return getUniqueWojewodztwa().map((wojewodztwo) => ({ params: { wojewodztwo } }));
};

export const GET: APIRoute = ({ params }) => {
  const woj = params.wojewodztwo as string;
  const shelters = getSheltersByWojewodztwo(woj);
  return new Response(JSON.stringify(shelters, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
