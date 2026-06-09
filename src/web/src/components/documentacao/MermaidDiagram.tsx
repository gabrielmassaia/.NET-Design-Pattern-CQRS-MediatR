import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { useAppTheme } from '@/context/ThemeContext';
import { ZoomInOutlined, ZoomOutOutlined, FullscreenExitOutlined } from '@ant-design/icons';

const THEME_CONFIG = {
  dark: {
    background: '#1E2535',
    primaryColor: '#161B27',
    primaryTextColor: '#E8EAF0',
    primaryBorderColor: '#2A3345',
    lineColor: '#D4A843',
    secondaryColor: '#0F1117',
    tertiaryColor: '#2A3345',
    edgeLabelBackground: '#1E2535',
    nodeBorder: '#D4A843',
  },
  light: {
    background: '#FFFFFF',
    primaryColor: '#F5F5F5',
    primaryTextColor: '#1A1A2E',
    primaryBorderColor: '#D9D9D9',
    lineColor: '#1565C0',
    secondaryColor: '#FAFAFA',
    tertiaryColor: '#F0F0F0',
    edgeLabelBackground: '#FFFFFF',
    nodeBorder: '#1565C0',
  },
} as const;

interface MermaidDiagramProps {
  chart: string;
}

let sequence = 0;

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef(`m-${++sequence}-${Date.now()}`);
  const { appTheme } = useAppTheme();
  const [zoom, setZoom] = useState(1);
  const isDark = appTheme === 'dark';

  useEffect(() => {
    if (!ref.current) return;

    const vars = THEME_CONFIG[appTheme];
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      themeVariables: {
        background: vars.background,
        primaryColor: vars.primaryColor,
        primaryTextColor: vars.primaryTextColor,
        primaryBorderColor: vars.primaryBorderColor,
        lineColor: vars.lineColor,
        secondaryColor: vars.secondaryColor,
        tertiaryColor: vars.tertiaryColor,
        fontSize: '13px',
        fontFamily: 'DM Mono, monospace',
        edgeLabelBackground: vars.edgeLabelBackground,
        nodeBorder: vars.nodeBorder,
      },
      flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
      sequence: { useMaxWidth: true, showSequenceNumbers: false },
    });

    mermaid.render(id.current, chart)
      .then(({ svg }) => {
        if (ref.current) {
          ref.current.innerHTML = svg;
          const svgEl = ref.current.querySelector('svg');
          if (svgEl) {
            svgEl.style.maxWidth = '100%';
            svgEl.style.height = 'auto';
          }
        }
      })
      .catch(() => {
        if (ref.current) {
          ref.current.innerHTML = `<div style="color:${isDark ? '#C0392B' : '#C0392B'}; padding:20px; text-align:center; font-family:'DM Mono',monospace; font-size:12px;">
            ⚠ Erro ao renderizar diagrama
          </div>`;
        }
      });
  }, [chart, appTheme]);

  const applyZoom = (z: number) => {
    const zapped = Math.max(0.25, Math.min(3, z));
    setZoom(zapped);
    if (ref.current) {
      const svgEl = ref.current.querySelector('svg');
      if (svgEl) {
        svgEl.style.transform = `scale(${zapped})`;
        svgEl.style.transformOrigin = 'top left';
      }
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      applyZoom(zoom + (e.deltaY > 0 ? -0.1 : 0.1));
    }
  };

  const btnBase: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 6,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'}`,
    background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
    color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
    cursor: 'pointer',
    fontSize: 12,
    transition: 'all 0.15s ease',
  };

  return (
    <div
      style={{
        background: isDark ? '#161B27' : '#FAFAFA',
        borderRadius: 12,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{
        position: 'absolute',
        top: 6,
        right: 6,
        zIndex: 10,
        display: 'flex',
        gap: 3,
        opacity: 0.85,
      }}>
        <button title="Aumentar zoom" onClick={() => applyZoom(zoom + 0.25)} style={btnBase}
          onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
        ><ZoomInOutlined /></button>
        <button title="Reduzir zoom" onClick={() => applyZoom(zoom - 0.25)} style={btnBase}
          onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
        ><ZoomOutOutlined /></button>
        <button title="Resetar zoom" onClick={() => applyZoom(1)} style={{
          ...btnBase, fontFamily: "'DM Mono', monospace", fontSize: 10, fontWeight: 600,
          width: 'auto', padding: '0 7px',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
        ><FullscreenExitOutlined style={{ marginRight: 3 }} />{Math.round(zoom * 100)}%</button>
      </div>

      <div
        onWheel={handleWheel}
        style={{ overflow: zoom > 1 ? 'auto' : 'hidden', padding: '20px 16px', cursor: 'grab' }}
      >
        <div ref={ref} style={{ display: 'inline-block', minWidth: '100%' }} />
      </div>
    </div>
  );
}
