import { Typography, Collapse, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const ADR_DATA = [
  {
    key: '1',
    label: 'Clean Architecture com 7 projetos .NET',
    decision: 'Adotar Clean Architecture com separação estrita de 6 projetos + Shared.',
    rationale: 'Separação clara entre API, aplicação, domínio e infraestrutura — extensibilidade e testabilidade. O Domain fica puro, sem dependências de banco ou HTTP.',
    tradeoff: 'Mais projetos para navegar vs. um monolito. Overhead inicial de setup compensado pela manutenibilidade em longo prazo.',
    reference: 'docs/decisions/ADR-001-clean-architecture.md',
  },
  {
    key: '2',
    label: 'MediatR + CQRS + FluentValidation Pipeline',
    decision: 'Commands/Queries separados com MediatR 12, ValidationBehavior como pipeline.',
    rationale: 'Separa reads de writes naturalmente. Pipeline de validação desacoplada dos handlers. Fácil adicionar behaviors (logging, audit) sem tocar nos handlers.',
    tradeoff: 'Indireção adicional. Para CRUD simples, pode ser excessivo. Compensado pela consistência em operações complexas como CreateEmpresa (que gera obrigações + indexa + invalida cache).',
    reference: 'docs/decisions/ADR-002-mediatr-cqrs.md',
  },
  {
    key: '3',
    label: 'PostgreSQL 16 + EF Core 9',
    decision: 'Banco relacional PostgreSQL 16 com EF Core 9 como ORM.',
    rationale: 'PostgreSQL é o banco relacional mais robusto open-source. EF Core 9 provê type safety, migrations, LINQ queries e é o ORM padrão do ecossistema .NET.',
    tradeoff: 'EF Core abstrai o SQL mas pode gerar queries sub-ótimas. SplitQuery usado para evitar cartesian explosion. Para relatórios complexos, SQL raw seria mais performático.',
    reference: 'docs/decisions/ADR-003-postgresql-efcore.md',
  },
  {
    key: '4',
    label: 'Redis para Dashboard Caching (Decorator Pattern)',
    decision: 'Cache das queries de dashboard/alerts em Redis via decorador CachedDashboardAppService.',
    rationale: 'Dashboard requer agregacão de dados (COUNT, WHERE) que é custosa. Cache-aside reduz carga no PostgreSQL. Decorator isola a lógica de cache do serviço real. Invalidação por eventos de domínio garante consistência eventual.',
    tradeoff: 'Cache introduz complexidade (stale data, invalidação). TTL de 30s é seguro mas consultas podem mostrar dados com até 30s de atraso. MemoryCache seria mais simples mas não escala horizontalmente.',
    reference: 'docs/decisions/ADR-004-redis-cache.md',
  },
  {
    key: '5',
    label: 'Meilisearch para Busca Full-Text',
    decision: 'Motor de busca dedicado Meilisearch 1.9 para busca textual de empresas.',
    rationale: 'Demonstra busca typo-tolerant com baixa latência. Indexação automática por eventos de domínio (CQRS puro).',
    tradeoff: 'Para ~4 empresas, PostgreSQL + pg_trgm seria suficiente. Meilisearch adiciona um container e complexidade operacional. Escolha proposital para demonstrar integração com motor de busca dedicado em um case técnico.',
    reference: 'docs/decisions/ADR-005-meilisearch.md',
  },
  {
    key: '6',
    label: 'Docker Compose com 5 Serviços',
    decision: 'Orquestração completa via Docker Compose: PostgreSQL, Redis, Meilisearch, API, Web.',
    rationale: 'Setup zero para qualquer avaliador. Um comando sobe o sistema completo. Health checks garantem ordem de inicialização.',
    tradeoff: 'Consumo de memória (~2GB). Para desenvolvimento local leve, serviços poderiam ser opcionais. Recursos limitados por container via deploy.resources.',
    reference: 'docs/decisions/ADR-006-docker-compose.md',
  },
  {
    key: '7',
    label: 'Status Dinâmico (não persistido)',
    decision: 'Status (Pendente/Atrasada/Entregue) é calculado em tempo de query, não armazenado.',
    rationale: 'Evita dados inconsistentes se a data atual passar do vencimento. O campo DataEntrega é a source of truth.',
    tradeoff: 'Toda query de obrigações recalcula o status. Para milhares de registros, pode impactar performance. Uma coluna computada ou materializada seria alternativa.',
    reference: 'Domain/Obrigacoes/QueryHandlers/FindObrigacoesQueryHandler.cs',
  },
  {
    key: '8',
    label: 'Geração de Obrigações a partir do Mês Corrente',
    decision: 'Ao cadastrar empresa, gera obrigações apenas do mês atual até dezembro.',
    rationale: 'Evita criar obrigações passadas artificiais que poderiam gerar alertas falsos de atraso.',
    tradeoff: 'O DatabaseSeeder gera ano completo para demonstração. Em produção, pode ser necessário gerar competências retroativa (ex: empresa aberta em janeiro, cadastrada em junho).',
    reference: 'Domain/Empresas/CommandHandlers/CreateEmpresaCommandHandler.cs',
  },
  {
    key: '9',
    label: 'Obrigações Não Aplicáveis Não Persistidas',
    decision: 'A engine gera apenas obrigações devidas por regime. Ex: Simples Nacional não recebe DCTF.',
    rationale: 'Banco enxuto, queries mais simples, calendário limpo. O status NaoAplicavel existe no enum para evolução futura.',
    tradeoff: 'Impossível ver "o que não se aplica" no calendário. A RegimeMatrixModal no frontend compensa mostrando a matriz completa.',
    reference: 'docs/tributary-rules-engine.md',
  },
  {
    key: '10',
    label: 'Zero Autenticação / Autorização',
    decision: 'Não implementar login, JWT, ou multitenancy.',
    rationale: 'Case técnico de demonstração. Autenticação não agrega valor ao escopo. Sistema assume gateway/VPN em produção.',
    tradeoff: 'Inviável para uso real. Qualquer pessoa com acesso à URL pode usar o sistema. JWT + [Authorize] seria o primeiro upgrade em produção.',
    reference: 'docs/security.md',
  },
];

export function TradeoffsSection() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard id="tradeoffs" icon="⚖" title="Trade-offs & ADRs" subtitle="Architecture Decision Records · Decisões Técnicas">
      <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
        Cada decisão arquitetural foi calibrada para demonstrar organização, extensibilidade e domínio de
        arquitetura em um escopo reduzido de case técnico. Em um produto real, cada escolha seria
        reavaliada conforme volume, custo operacional, time e prazo.
      </Paragraph>

      <Collapse
        items={ADR_DATA.map((adr) => ({
          key: adr.key,
          label: (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag color="gold">ADR</Tag>
              <span style={{ fontWeight: 600 }}>{adr.label}</span>
            </div>
          ),
          children: (
            <div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Decisão
                </div>
                <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)', margin: 0 }}>
                  {adr.decision}
                </Paragraph>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Justificativa
                </div>
                <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', margin: 0 }}>
                  {adr.rationale}
                </Paragraph>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Trade-off
                </div>
                <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', margin: 0, fontStyle: 'italic' }}>
                  {adr.tradeoff}
                </Paragraph>
              </div>
              <div>
                <Text code style={{ fontSize: 11, color: isDark ? '#D4A843' : '#1565C0' }}>
                  {adr.reference}
                </Text>
              </div>
            </div>
          ),
        }))}
        style={{
          background: 'transparent',
          border: 'none',
        }}
        size="small"
      />
    </SectionCard>
  );
}
