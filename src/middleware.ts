// src/middleware.ts
// Wstawia CORS + Cache-Control headers dla wszystkich /api/* odpowiedzi.
// Backup do vercel.json (które działa na produkcji); middleware = dev mode + SSR support.

import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();

  if (context.url.pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  }

  return response;
});
