import { useAppTheme } from '@/context/ThemeContext';
import { MermaidDiagram } from '@/components/documentacao/MermaidDiagram';
import { GOLD } from './FlowData';

const CHART = `graph LR
    Api["Api"]
    App["Application"]
    Dom["Domain"]
    IoC["IoC"]
    Inf["Infra.Data"]
    Sh["Shared"]

    Api -->|chama| App
    Api -->|usa DI| IoC
    IoC -->|registra| App
    IoC -->|registra| Dom
    IoC -->|registra| Inf
    App -->|usa interfaces| Dom
    Inf -->|implementa| Dom
    Api -.->|usa| Sh
    App -.->|usa| Sh
    Dom -.->|usa| Sh`;

export function DacorationGraph() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <div style={{
      padding: '24px 28px',
      borderRadius: 16,
      background: isDark ? 'rgba(13,17,23,0.6)' : 'rgba(255,255,255,0.8)',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
    }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        color: GOLD,
        marginBottom: 4,
      }}>
        🗺️ Dependências entre Projetos
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        marginBottom: 16,
      }}>
        Setas sólidas = dependência direta · Tracejadas = uso de Shared
      </div>

      <MermaidDiagram chart={CHART} />

      {/* Legenda de camadas */}
      <div style={{
        marginTop: 16,
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px 20px',
      }}>
        {[
          { label: 'Api',          desc: 'Endpoints + Middleware',    color: '#6C3483' },
          { label: 'Application',  desc: 'AppServices + ViewModels',  color: '#1E8449' },
          { label: 'Domain',       desc: 'Handlers + Models',         color: '#2C3E50' },
          { label: 'IoC',          desc: 'DI Composition Root',       color: '#922B21' },
          { label: 'Infra.Data',   desc: 'EF Core + Repositories',    color: '#935116' },
          { label: 'Shared',       desc: 'ResponseData envelope',     color: '#7D6608' },
        ].map(p => (
          <div key={p.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: 2,
              background: p.color, opacity: 0.75, flexShrink: 0,
            }} />
            <span style={{ color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)', fontWeight: 600 }}>
              {p.label}
            </span>
            <span style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
              — {p.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
