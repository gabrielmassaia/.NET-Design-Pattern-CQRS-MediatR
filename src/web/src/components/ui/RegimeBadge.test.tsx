import { RegimeTributario } from '@/domain/types';
import { renderWithProviders, screen } from '@/test/render';
import { RegimeBadge } from './RegimeBadge';

describe('RegimeBadge', () => {
  it.each([
    { regime: RegimeTributario.SimplesNacional, label: 'Simples Nacional' },
    { regime: RegimeTributario.LucroPresumido, label: 'Lucro Presumido' },
    { regime: RegimeTributario.LucroReal, label: 'Lucro Real' },
    { regime: RegimeTributario.ImunidadeIsencao, label: 'Imunidade / Isenção' },
  ])('renders $label for regime $regime', ({ regime, label }) => {
    renderWithProviders(<RegimeBadge regime={regime} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });
});
