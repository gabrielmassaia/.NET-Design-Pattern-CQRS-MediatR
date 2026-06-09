import { formatCnpj, formatDate, regimeLabel } from './formatters';

describe('formatCnpj', () => {
  it('formats 14-digit string to CNPJ pattern', () => {
    expect(formatCnpj('11222333000181')).toBe('11.222.333/0001-81');
  });

  it('passes through already formatted CNPJ', () => {
    expect(formatCnpj('11.222.333/0001-81')).toBe('11.222.333/0001-81');
  });
});

describe('formatDate', () => {
  it('returns formatted date string for valid ISO', () => {
    const result = formatDate('2026-06-15T10:00:00Z');
    expect(result).toBe('15/06/2026');
  });

  it('returns em dash for null/undefined', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate(undefined)).toBe('—');
  });
});

describe('regimeLabel', () => {
  it('returns Simples Nacional for regime 1', () => {
    expect(regimeLabel(1)).toBe('Simples Nacional');
  });

  it('returns Lucro Presumido for regime 2', () => {
    expect(regimeLabel(2)).toBe('Lucro Presumido');
  });

  it('returns Lucro Real for regime 3', () => {
    expect(regimeLabel(3)).toBe('Lucro Real');
  });

  it('returns Imunidade / Isenção for regime 4', () => {
    expect(regimeLabel(4)).toBe('Imunidade / Isenção');
  });

  it('returns em dash for unknown regime', () => {
    expect(regimeLabel(99)).toBe('—');
  });
});
