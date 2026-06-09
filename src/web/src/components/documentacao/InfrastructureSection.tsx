import { Typography, Table, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { MermaidDiagram } from './MermaidDiagram';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const DOCKER_ARCH = `graph LR
    subgraph "🐳 Docker Compose"
        subgraph "External"
            Browser["🌐 Browser<br/>localhost:3000"]
        end

        subgraph "Host Network"
            Nginx["🌐 Nginx<br/>Port 80 / 443"]
        end

        subgraph "Internal Network (painel_network)"
            API["⚡ .NET 9 API<br/>Port 8080"]
            PG[("🗄 PostgreSQL 16<br/>Port 5432")]
            Redis[("⚡ Redis 7<br/>Port 6379")]
            Meili[("🔍 Meilisearch 1.9<br/>Port 7700")]
        end

        Browser -->|HTTP| Nginx
        Nginx -->|"/api/"| API
        Nginx -->|"static files"| Nginx

        API --> PG
        API --> Redis
        API --> Meili
    end

    Dev["👨‍💻 Desenvolvedor"] -->|"localhost:8080"| API
    Dev -->|"localhost:7700"| Meili`;

const SERVICES = [
  { name: 'db', image: 'postgres:16-alpine', port: '5432', purpose: 'Banco de dados relacional', limits: '0.5 CPU / 256MB' },
  { name: 'redis', image: 'redis:7-alpine', port: '6379', purpose: 'Cache das queries de dashboard', limits: '0.25 CPU / 128MB' },
  { name: 'meilisearch', image: 'getmeili/meilisearch:v1.9', port: '7700', purpose: 'Motor de busca textual', limits: '0.5 CPU / 256MB' },
  { name: 'api', image: 'custom (.NET 9)', port: '8080', purpose: 'API REST (Minimal APIs)', limits: '1.0 CPU / 512MB' },
  { name: 'web', image: 'custom (Nginx)', port: '80 / 443', purpose: 'SPA React + Reverse Proxy', limits: '0.5 CPU / 256MB' },
];

const SVC_COL = [
  { title: 'Serviço', dataIndex: 'name', key: 'name', render: (v: string) => <Text strong style={{ fontFamily: "'DM Mono', monospace" }}>{v}</Text> },
  { title: 'Imagem', dataIndex: 'image', key: 'image', render: (v: string) => <Text code style={{ fontSize: 11 }}>{v}</Text> },
  { title: 'Porta', dataIndex: 'port', key: 'port', render: (v: string) => <Tag>{v}</Tag> },
  { title: 'Propósito', dataIndex: 'purpose', key: 'purpose' },
  { title: 'Recursos', dataIndex: 'limits', key: 'limits', render: (v: string) => <Text code style={{ fontSize: 10 }}>{v}</Text> },
];

export function InfrastructureSection() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard id="infrastructure" icon="🐳" title="Infraestrutura" subtitle="Docker Compose · Nginx · Resource Limits · Health Checks">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Arquitetura Docker
        </div>
        <MermaidDiagram chart={DOCKER_ARCH} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <Table dataSource={SERVICES} columns={SVC_COL} pagination={false} size="small" rowKey="name" />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Health Checks & Startup Order
        </div>
        <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, lineHeight: 1.7 }}>
          Cada serviço possui health check configurado. A API depende de <Tag>db</Tag>, <Tag>redis</Tag> e
          <Tag>meilisearch</Tag> estarem saudáveis antes de iniciar. O script <Text code>start.ps1</Text>
          aguarda todos os serviços e exibe as URLs de acesso.
        </Paragraph>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Nginx — Reverse Proxy & Security
        </div>
        <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, lineHeight: 1.7 }}>
          O Nginx serve os arquivos estáticos do React (build otimizado) e faz proxy reverso para a API
          .NET na rota <Text code>/api/</Text>. Inclui rate limiting (30 req/s com burst 20),
          HTTPS com certificado autoassinado, HSTS, e todos os security headers.
        </Paragraph>
      </div>

      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Volumes Persistentes
        </div>
        <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, lineHeight: 1.7 }}>
          Dois volumes Docker são criados:<br />
          • <Text code>pgdata</Text> — dados do PostgreSQL (persiste entre restart)<br />
          • <Text code>meilidata</Text> — índice do Meilisearch
        </Paragraph>
      </div>
    </SectionCard>
  );
}
