import { Typography, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { MermaidDiagram } from './MermaidDiagram';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const SEARCH_FLOW = `sequenceDiagram
    participant User as "👤 Usuário"
    participant Page as "📄 EmpresasPage"
    participant Hook as "🎣 useEmpresaSearch"
    participant API as "⚡ REST API"
    participant Handler as "🔍 SearchEmpresasQueryHandler"
    participant Meili as "🔎 Meilisearch"
    participant DB as "🗄 PostgreSQL"

    User->>Page: Digita "padaria" no search
    Page->>Hook: enable=true, q="padaria"
    Hook->>API: GET /api/empresas/search?q=padaria
    API->>Handler: Send(SearchEmpresasQuery)
    Handler->>Meili: Search("padaria")
    Meili-->>Handler: [IDs: 1, 3]
    Handler->>DB: WHERE Id IN (1, 3)
    DB-->>Handler: [EmpresaModels]
    Handler-->>API: List<EmpresaModel>
    API-->>Hook: ResponseData
    Hook-->>Page: Re-render with results`;

const INDEX_FLOW = `sequenceDiagram
    participant Handler as "⚡ CreateEmpresaCommandHandler"
    participant UoW as "📝 IUnitOfWork"
    participant Event as "📢 EmpresaCreatedEvent"
    participant EH as "🔊 EmpresaCreatedHandler"
    participant Meili as "🔎 Meilisearch"
    participant Redis as "⚡ Redis"

    Handler->>UoW: CompleteAsync()
    UoW-->>Handler: OK
    Handler->>Event: Publish(EmpresaCreatedEvent)
    Event->>EH: Handle(event)
    par Index in Meilisearch
        EH->>Meili: IndexDocument(empresa)
        Meili-->>EH: OK
    and Invalidate Cache
        EH->>Redis: Remove("painel:dashboard:*")
        EH->>Redis: Remove("painel:alertas:current")
    end`;

export function MeilisearchSection() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard id="meilisearch" icon="🔍" title="Meilisearch" subtitle="Full-text Search · Indexação por Eventos · Typo-tolerant">
      <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
        O Meilisearch 1.9 é o motor de busca textual para empresas. Ele permite busca typo-tolerant
        por razão social e CNPJ, com filtro por regime tributário. A indexação e remoção são feitas
        de forma assíncrona via eventos de domínio do MediatR.
      </Paragraph>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Fluxo de Busca
        </div>
        <MermaidDiagram chart={SEARCH_FLOW} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Indexação Automática (via Eventos)
        </div>
        <MermaidDiagram chart={INDEX_FLOW} />
      </div>

      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Configuração do Índice
        </div>
        <div style={{
          background: isDark ? '#0F1117' : '#F5F5F5',
          borderRadius: 8,
          padding: '16px 20px',
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          lineHeight: 1.8,
          color: isDark ? '#E8EAF0' : '#1A1A2E',
        }}>
          <div><span style={{ color: '#D4A843' }}>Índice</span>: "empresas"</div>
          <div><span style={{ color: '#4A7FC1' }}>searchableAttributes</span>: ["razaoSocial", "cnpj"]</div>
          <div><span style={{ color: '#4A7FC1' }}>filterableAttributes</span>: ["regime"]</div>
          <div style={{ marginTop: 8 }}>
            <span style={{ color: '#D4A843' }}>Eventos que indexam</span>:
            <Tag style={{ marginLeft: 8 }} color="green">EmpresaCreatedEvent</Tag>
          </div>
          <div>
            <span style={{ color: '#C0392B' }}>Eventos que removem</span>:
            <Tag style={{ marginLeft: 8 }} color="red">EmpresaDeletedEvent</Tag>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
