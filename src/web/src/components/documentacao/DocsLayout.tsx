import { useEffect, useRef } from 'react';
import React from 'react';
import { BookOutlined } from '@ant-design/icons';
import { useAppTheme } from '@/context/ThemeContext';

interface Section {
  id: string;
  label: string;
  icon: string;
}

const SECTIONS: Section[] = [
  { id: 'overview',        label: 'Visão Geral',         icon: '📖' },
  { id: 'architecture',    label: 'Arquitetura',          icon: '🏛' },
  { id: 'tech-stack',      label: 'Stack Tecnológica',    icon: '⚙' },
  { id: 'request-flow',    label: 'Fluxo de Requisição',  icon: '🔄' },
  { id: 'frontend',        label: 'Frontend',             icon: '🖥' },
  { id: 'backend',         label: 'Backend',              icon: '⚡' },
  { id: 'tributary-engine',label: 'Engine Tributária',    icon: '🧮' },
  { id: 'redis-cache',     label: 'Redis Cache',          icon: '💾' },
  { id: 'meilisearch',     label: 'Meilisearch',          icon: '🔍' },
  { id: 'security',        label: 'Segurança',            icon: '🛡' },
  { id: 'tradeoffs',       label: 'Trade-offs & ADRs',    icon: '⚖' },
  { id: 'api-reference',   label: 'API Reference',        icon: '📡' },
  { id: 'tests',           label: 'Testes',               icon: '✅' },
  { id: 'infrastructure',  label: 'Infraestrutura',       icon: '🐳' },
];

interface DocsLayoutProps {
  banner: React.ReactNode;
  children: React.ReactNode;
}

export function DocsLayout({ banner, children }: DocsLayoutProps) {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  const sidebarW = 260;

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 120px)', overflow: 'hidden', borderRadius: 14 }}>
      <aside style={{
        width: sidebarW,
        minWidth: sidebarW,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRight: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 12,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
          marginBottom: 16,
          paddingTop: 4,
          textAlign: 'center',
          flexShrink: 0,
        }}>
          <BookOutlined style={{ marginRight: 6 }} />
          Documentação
        </div>
        <nav style={{ flex: 1, overflowY: 'auto', paddingRight: 4 }}>
          {SECTIONS.map(({ id, label, icon }) => (
            <DocsNavItem key={id} sectionId={id} label={label} icon={icon} isDark={isDark} />
          ))}
        </nav>
      </aside>

      <main style={{
        flex: 1,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '0 40px 48px 40px',
      }}>
        {banner}
        {children}
      </main>
    </div>
  );
}

/* ─── Nav item com IntersectionObserver individual ─── */
function DocsNavItem({ sectionId, label, icon, isDark }: {
  sectionId: string;
  label: string;
  icon: string;
  isDark: boolean;
}) {
  const [active, setActive] = React.useState(false);

  useEffect(() => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [sectionId]);

  const scrollTo = () => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      onClick={scrollTo}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '13px 16px',
        marginBottom: 3,
        borderRadius: 10,
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: active ? 700 : 500,
        letterSpacing: '0.02em',
        color: active
          ? (isDark ? '#D4A843' : '#1565C0')
          : (isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.7)'),
        background: active
          ? (isDark ? 'rgba(212,168,67,0.12)' : 'rgba(21,101,192,0.08)')
          : 'transparent',
        transition: 'all 0.15s ease',
        border: active
          ? `1px solid ${isDark ? 'rgba(212,168,67,0.2)' : 'rgba(21,101,192,0.15)'}`
          : '1px solid transparent',
      }}
    >
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
