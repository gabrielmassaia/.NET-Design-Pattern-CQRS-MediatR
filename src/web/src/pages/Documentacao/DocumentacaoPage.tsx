import { useAppTheme } from '@/context/ThemeContext';
import { DocsLayout } from '@/components/documentacao/DocsLayout';
import {
  OverviewSection,
  ArchitectureSection,
  TechStackSection,
  RequestFlowSection,
  FrontendSection,
  BackendSection,
  TributaryEngineSection,
  RedisSection,
  MeilisearchSection,
  SecuritySection,
  TradeoffsSection,
  ApiReferenceSection,
  TestsSection,
  InfrastructureSection,
} from '@/components/documentacao';

const gold = '#D4A843';

const BANNER = (
  <div style={{ marginBottom: 28, flexShrink: 0 }}>
    <div style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 10,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.15em',
      marginBottom: 8,
    }}>
      case e-Auditoria
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 6 }}>
      <span style={{
        fontSize: 26,
        fontWeight: 700,
        letterSpacing: '-0.5px',
      }}>
        Documentação do Sistema
      </span>
      <span style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: gold,
        background: 'rgba(212,168,67,0.12)',
        padding: '2px 10px',
        borderRadius: 4,
        fontWeight: 500,
      }}>
        v1.0.0
      </span>
    </div>
    <div style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: 11,
    }}>
      Painel de Obrigações Acessórias — Clean Architecture · .NET 9 · React 19
    </div>
  </div>
);

export default function DocumentacaoPage() {
  const { appTheme } = useAppTheme();

  return (
    <DocsLayout banner={BANNER}>
      <OverviewSection />
      <ArchitectureSection />
      <TechStackSection />
      <BackendSection />
      <RequestFlowSection />
      <FrontendSection />
      <TributaryEngineSection />
      <RedisSection />
      <MeilisearchSection />
      <SecuritySection />
      <TradeoffsSection />
      <ApiReferenceSection />
      <TestsSection />
      <InfrastructureSection />
    </DocsLayout>
  );
}
