import { Typography, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { MermaidDiagram } from './MermaidDiagram';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const REQ_FLOW = `sequenceDiagram
    participant C as "🌐 Cliente"
    participant E as "📡 Endpoint"
    participant AS as "📋 AppService"
    participant M as "🔀 MediatrService"
    participant VB as "✅ ValidationBehavior"
    participant H as "⚡ Handler"
    participant R as "🗄 Repository"
    participant U as "📝 IUnitOfWork"
    participant DB as "🗃 PostgreSQL"

    C->>E: HTTP Request
    E->>AS: Call method
    AS->>M: SendCommand(command)
    M->>VB: Run validators

    alt Validation fails
        VB-->>M: Throw ValidationException
        M-->>AS: ↑
        AS-->>E: ↑
        E-->>C: 400 BadRequest
    end

    VB->>H: Valid command
    H->>R: Query / persist
    R->>DB: EF Core

    alt Write operation
        H->>U: CompleteAsync()
        U->>DB: SaveChanges
        H->>H: Publish Event
        H->>EH: 📢 INotification
        EH->>Redis: 💾 Cache invalidation
        EH->>Meili: 🔍 Index search
    end

    R-->>H: Result
    H-->>M: CommandResult
    M-->>AS: Result
    AS-->>E: ViewModel
    E-->>C: 200 OK (ResponseData)`;

const CMD_CHAIN = `graph LR
    EP["Endpoint"] --> AS["AppService"]
    AS --> MS["IMediatrService"]
    MS --> VB["ValidationBehavior"]

    VB -->|Write| CH["CommandHandler"]
    VB -->|Read| QH["QueryHandler"]

    CH --> R["Repository<br/>(Domain Interface)"]
    QH --> R

    CH --> U["IUnitOfWork<br/>CompleteAsync()"]
    U --> DB[("PostgreSQL<br/>EF Core")]

    CH --> EV["Domain Events<br/>INotification"]
    EV --> INV["Cache Invalidação"]
    EV --> IND["Indexação Search"]

    style EP fill:#e8daef,stroke:#6c3483,color:#000
    style AS fill:#d5f5e3,stroke:#1e8449,color:#000
    style VB fill:#f9e79f,stroke:#7d6608,color:#000
    style CH fill:#d4e6f1,stroke:#2c3e50,color:#000
    style QH fill:#d4e6f1,stroke:#2c3e50,color:#000
    style R fill:#fdebd0,stroke:#935116,color:#000
    style EV fill:#fadbd8,stroke:#922b21,color:#000`;

export function RequestFlowSection() {
  const { appTheme } = useAppTheme();
  const { token } = theme.useToken();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard
      id="request-flow"
      icon="🔄"
      title="Fluxo de Requisição"
      subtitle="Endpoint → AppService → MediatR → Handler → Repository → IUnitOfWork"
    >
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Fluxo Completo (com validação e side effects)
        </div>
        <MermaidDiagram chart={REQ_FLOW} />
      </div>

      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Cadeia de Comandos (Mandatory Chain)
        </div>
        <MermaidDiagram chart={CMD_CHAIN} />

        <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, marginTop: 16, lineHeight: 1.7 }}>
          <strong>Regra não-negociável:</strong> Endpoint nunca chama Repository diretamente. A cadeia
          completa deve ser respeitada. O <strong>IUnitOfWork.CompleteAsync()</strong> é chamado
          apenas em handlers de escrita — repositórios nunca chamam SaveChanges.
        </Paragraph>
      </div>
    </SectionCard>
  );
}
