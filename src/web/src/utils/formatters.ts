export function formatCnpj(cnpj: string): string {
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  );
}

export function formatDate(iso: string | undefined | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('pt-BR');
}

export function regimeLabel(regime: number): string {
  const map: Record<number, string> = {
    1: 'Simples Nacional',
    2: 'Lucro Presumido',
    3: 'Lucro Real',
    4: 'Imunidade / Isenção',
  };
  return map[regime] ?? '—';
}
