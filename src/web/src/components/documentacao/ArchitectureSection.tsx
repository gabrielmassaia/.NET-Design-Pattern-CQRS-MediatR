import { Typography, Row, Col, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { MermaidDiagram } from './MermaidDiagram';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const C4_CONTEXT = `graph LR
    User["👤 Usuário Contábil"]
    System["📋 Painel Obrigações"]
    User -->|"Gerencia obrigações"| System
    System -->|"Alertas de prazos"| User`;

const C4_CONTAINER = `graph LR
    subgraph DockerCompose["🐳 Docker Compose"]
        Nginx["🌐 Nginx Reverse Proxy"]
        Nginx -->|"/api/"| API["⚡ .NET 9 API"]
        Nginx -->|"static files"| SPA["⚛ React SPA"]
        API --> PG[("🗄 PostgreSQL 16")]
        API --> Redis[("⚡ Redis 7")]
        API --> Meili[("🔍 Meilisearch 1.9")]
    end
    User["👤 Usuário"] -->|"HTTPS :3000"| SPA
    Dev["👨‍💻 Dev"] -->|":8080/swagger"| API`;

const LAYERS = `flowchart LR
    subgraph PRES["📡 Presentation"]
        direction LR
        EP["Minimal API<br/>Endpoints"]
        MW["Exception<br/>Middleware"]
    end

    subgraph APP["📋 Application"]
        direction LR
        AS["AppServices<br/>Thin Facades"]
        VM["ViewModels"]
        MP["AutoMapper"]
    end

    subgraph DOM["🧠 Domain (Pure)"]
        direction LR
        CMD["Commands<br/>Queries"]
        HDL["Handlers"]
        VAL["Validators"]
        RI["Repository<br/>Interfaces"]
        DS["Domain<br/>Services"]
        EVT["Events"]
    end

    subgraph INFRA["🔧 Infrastructure"]
        direction LR
        DB["EF Core<br/>DbContext"]
        RP["Repository<br/>Impl"]
        EX["Export<br/>CSV/PDF"]
    end

    EP --> AS
    AS --> CMD
    CMD --> VAL
    VAL --> HDL
    HDL --> RI
    RI --> RP
    RP --> DB
    HDL --> DS
    HDL --> EVT
    MW --> EP`;

const DEP_GRAPH = `flowchart LR
    Api["📦 Api<br/>Minimal API"] --> App["📦 Application<br/>AppServices + VM"]
    Api --> IoC["📦 IoC<br/>DI Bootstrapper"]
    Api --> Shared["📦 Shared<br/>ResponseData"]

    App --> Domain["📦 Domain<br/>Business Rules"]
    App --> Shared

    IoC --> Domain
    IoC --> App
    IoC --> Infra["📦 Infrastructure.Data<br/>EF Core + Repos"]
    IoC --> Services["📦 Infrastructure.Services<br/>Export"]

    Infra --> Domain
    Services --> App

    Domain --> Shared`;

const PROJ_INFO = [
  { color: '#d4e6f1', text: '#2c3e50', label: 'Domain', desc: 'Zero dependências externas. Coração do sistema.' },
  { color: '#d5f5e3', text: '#1e8449', label: 'Application', desc: 'Fachadas finas, ViewModels, AutoMapper.' },
  { color: '#fdebd0', text: '#935116', label: 'Infrastructure', desc: 'EF Core, Repositories, Export.' },
  { color: '#e8daef', text: '#6c3483', label: 'Presentation', desc: 'Minimal API endpoints + Middleware.' },
  { color: '#fadbd8', text: '#922b21', label: 'IoC', desc: 'Composition root. Wires tudo.' },
  { color: '#f9e79f', text: '#7d6608', label: 'Shared', desc: 'ResponseData envelope.' },
];

export function ArchitectureSection() {
  const { appTheme } = useAppTheme();
  const { token } = theme.useToken();
  const isDark = appTheme === 'dark';

  const textCss = { color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', fontSize: 14, lineHeight: 1.7 };

  return (
    <SectionCard
      id="architecture"
      icon="🏛"
      title="Arquitetura"
      subtitle="Clean Architecture · C4 Model · 7 Projetos .NET 9"
    >
      <Text style={{ ...textCss, display: 'block', marginBottom: 20 }}>
        <strong>Clean Architecture</strong> com separação estrita de camadas. O <strong>Domain</strong> é o centro
        — zero dependências de infraestrutura, banco ou HTTP. As dependências sempre apontam para dentro.
      </Text>

      {/* C4 Context */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11,
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
          marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em'
        }}>
          C4 — Diagrama de Contexto
        </div>
        <MermaidDiagram chart={C4_CONTEXT} />
      </div>

      {/* C4 Containers */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11,
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
          marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em'
        }}>
          C4 — Diagrama de Containers
        </div>
        <MermaidDiagram chart={C4_CONTAINER} />
      </div>

      {/* Clean Architecture Layers */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11,
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
          marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em'
        }}>
          Clean Architecture — Camadas
        </div>
        <MermaidDiagram chart={LAYERS} />

        <Row gutter={[8, 8]} style={{ marginTop: 16 }}>
          {PROJ_INFO.map((p) => (
            <Col key={p.label} xs={12} sm={8} lg={4}>
              <div style={{
                background: p.color,
                borderRadius: 8,
                padding: '10px 12px',
                textAlign: 'center',
              }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: p.text }}>{p.label}</div>
                <div style={{ fontSize: 10, color: p.text, opacity: 0.8, marginTop: 2 }}>{p.desc}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Project Dependencies */}
      <div>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: 11,
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)',
          marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em'
        }}>
          Dependências entre Projetos
        </div>
        <MermaidDiagram chart={DEP_GRAPH} />
        <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontSize: 12, marginTop: 12 }}>
          Domain e Shared são os únicos projetos que não dependem de ninguém. Todas as setas apontam para dentro.
        </Paragraph>
      </div>
    </SectionCard>
  );
}
