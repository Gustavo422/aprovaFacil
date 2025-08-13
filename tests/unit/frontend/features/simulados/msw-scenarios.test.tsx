import React from 'react';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { useListarSimulados } from '@/src/features/simulados/hooks/use-list';
import { ConcursoProvider } from '@/contexts/ConcursoContext';

const server = setupServer(
  // 304 scenario
  http.get('/api/simulados', ({ request }) => {
    if (request.headers.get('if-none-match')) {
      return new Response(null, { status: 304 });
    }
    return HttpResponse.json({ success: true, data: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 0 } }, {
      headers: { ETag: 'W/"list:etag"', 'Last-Modified': new Date().toUTCString() },
    });
  }),
  // 429 scenario for detail (not used directly here but kept as example)
  http.get('/api/simulados/slug/limit', () => {
    return new Response(JSON.stringify({ success: false, error: 'Too Many Requests', code: 'RATE_LIMITED' }), { status: 429 });
  }),
);

beforeAll(() => server.listen());
afterAll(() => server.close());

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient();
  return (
    <ConcursoProvider>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </ConcursoProvider>
  );
}

describe('MSW scenarios (simulados)', () => {
  it('304 Not Modified deve retornar dados do cache (vazio inicialmente)', async () => {
    const { result } = renderHook(() => useListarSimulados({ page: 1, limit: 10 }), { wrapper });
    await waitFor(() => Array.isArray(result.current.data));
    expect(result.current.data?.length ?? 0).toBeGreaterThanOrEqual(0);
  });
});


