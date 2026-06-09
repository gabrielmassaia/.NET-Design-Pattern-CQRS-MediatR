import { empresasKeys, obrigacoesKeys, dashboardKeys } from './query-keys';

describe('empresasKeys', () => {
  it('all returns base key', () => {
    expect(empresasKeys.all).toEqual(['empresas']);
  });

  it('search returns key with query', () => {
    expect(empresasKeys.search('teste')).toEqual(['empresas', 'search', 'teste']);
  });
});

describe('obrigacoesKeys', () => {
  it('all returns base key', () => {
    expect(obrigacoesKeys.all).toEqual(['obrigacoes']);
  });

  it('list returns key with params', () => {
    expect(obrigacoesKeys.list({ empresaId: '1', ano: 2026, mes: 6 }))
      .toEqual(['obrigacoes', '1', 2026, 6]);
  });

  it('historico returns key with empresaId', () => {
    expect(obrigacoesKeys.historico('abc')).toEqual(['historico', 'abc']);
  });
});

describe('dashboardKeys', () => {
  it('dashboard returns base key', () => {
    expect(dashboardKeys.dashboard).toEqual(['dashboard']);
  });

  it('alertas returns base key', () => {
    expect(dashboardKeys.alertas).toEqual(['alertas']);
  });
});
