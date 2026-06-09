import { http, HttpResponse } from 'msw';

const BASE = 'http://localhost:8080';

export const handlers = [
  http.get(`${BASE}/api/empresas`, () => {
    return HttpResponse.json({
      success: true,
      message: '',
      data: [
        {
          id: '1',
          cnpj: '11222333000181',
          razaoSocial: 'Empresa Exemplo Ltda',
          regime: 1,
          createdAt: '2026-01-15T10:00:00Z',
        },
        {
          id: '2',
          cnpj: '44555666000199',
          razaoSocial: 'Comércio Brasil S.A.',
          regime: 2,
          createdAt: '2026-03-20T10:00:00Z',
        },
      ],
      errorCode: null,
    });
  }),

  http.get(`${BASE}/api/empresas/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    if (q?.toLowerCase().includes('exemplo')) {
      return HttpResponse.json({
        success: true,
        message: '',
        data: [
          {
            id: '1',
            cnpj: '11222333000181',
            razaoSocial: 'Empresa Exemplo Ltda',
            regime: 1,
            createdAt: '2026-01-15T10:00:00Z',
          },
        ],
        errorCode: null,
      });
    }
    return HttpResponse.json({ success: true, message: '', data: [], errorCode: null });
  }),

  http.post(`${BASE}/api/empresas`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      message: '',
      data: {
        id: '3',
        cnpj: body.cnpj,
        razaoSocial: body.razaoSocial,
        regime: body.regime,
        createdAt: new Date().toISOString(),
      },
      errorCode: null,
    }, { status: 201 });
  }),

  http.delete(`${BASE}/api/empresas/:id`, () => {
    return HttpResponse.json({ success: true, message: '', data: null, errorCode: null });
  }),

  http.get(`${BASE}/api/dashboard`, () => {
    return HttpResponse.json({
      success: true,
      message: '',
      data: {
        totalEmpresas: 5,
        totalObrigacoesMes: 12,
        pendentes: 7,
        entregues: 3,
        atrasadas: 2,
      },
      errorCode: null,
    });
  }),

  http.get(`${BASE}/api/dashboard/alertas`, () => {
    return HttpResponse.json({
      success: true,
      message: '',
      data: [
        {
          id: 'a1',
          empresaId: '1',
          razaoSocial: 'Empresa Exemplo Ltda',
          cnpj: '11222333000181',
          tipoNome: 'DAS',
          dataVencimento: '2026-06-22',
          diasRestantes: 13,
          status: 1,
        },
        {
          id: 'a2',
          empresaId: '2',
          razaoSocial: 'Comércio Brasil S.A.',
          cnpj: '44555666000199',
          tipoNome: 'DCTF',
          dataVencimento: '2026-06-15',
          diasRestantes: 6,
          status: 1,
        },
      ],
      errorCode: null,
    });
  }),

  http.get(`${BASE}/api/obrigacoes`, ({ request }) => {
    const url = new URL(request.url);
    const empresaId = url.searchParams.get('empresaId');
    if (empresaId === '1') {
      return HttpResponse.json({
        success: true,
        message: '',
        data: [
          {
            id: 'o1',
            empresaId: '1',
            tipo: 1,
            tipoNome: 'DAS',
            competencia: '2026-06-01T00:00:00Z',
            dataVencimento: '2026-07-20',
            dataEntrega: undefined,
            status: 1,
          },
          {
            id: 'o2',
            empresaId: '1',
            tipo: 6,
            tipoNome: 'eSocial',
            competencia: '2026-06-01T00:00:00Z',
            dataVencimento: '2026-07-07',
            dataEntrega: undefined,
            status: 1,
          },
        ],
        errorCode: null,
      });
    }
    return HttpResponse.json({ success: true, message: '', data: [], errorCode: null });
  }),

  http.get(`${BASE}/api/obrigacoes/historico/:empresaId`, () => {
    return HttpResponse.json({
      success: true,
      message: '',
      data: [
        {
          id: 'h1',
          empresaId: '1',
          tipo: 1,
          tipoNome: 'DAS',
          competencia: '2026-05-01T00:00:00Z',
          dataVencimento: '2026-06-20',
          dataEntrega: '2026-06-18',
          status: 3,
        },
      ],
      errorCode: null,
    });
  }),

  http.patch(`${BASE}/api/obrigacoes/:id/entrega`, () => {
    return HttpResponse.json({
      success: true,
      message: '',
      data: {
        id: 'o1',
        empresaId: '1',
        tipo: 1,
        tipoNome: 'DAS',
        competencia: '2026-06-01T00:00:00Z',
        dataVencimento: '2026-07-20',
        dataEntrega: '2026-07-15',
        status: 3,
      },
      errorCode: null,
    });
  }),

  http.get(`${BASE}/api/obrigacoes/export`, () => {
    return HttpResponse.text('id,nome\n1,DAS', {
      headers: { 'Content-Type': 'text/csv' },
    });
  }),

  http.get(`${BASE}/api/dashboard/alertas/export`, () => {
    return HttpResponse.text('id,empresa\n1,Exemplo', {
      headers: { 'Content-Type': 'text/csv' },
    });
  }),

  http.get(`${BASE}/api/dashboard/export`, () => {
    return HttpResponse.text('metric,value\ntotalEmpresas,5', {
      headers: { 'Content-Type': 'text/csv' },
    });
  }),
];
