import { useState, useEffect } from 'react';
import { Grid } from 'antd';
import { useAppTheme } from '@/context/ThemeContext';
import {
  FlowDiagram,
  PhaseDetailPanel,
  DependencyViewer,
  MediatRPipelineViewer,
  DacorationGraph,
  InterviewQuizPanel,
  CSharpConceptsPanel,
  AlternativeFlowsPanel,
} from '@/components/estudo';
import { PHASES, GOLD } from '@/components/estudo/FlowData';

const { useBreakpoint } = Grid;

export default function EstudoPage() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [activePhase, setActivePhase] = useState(1);
  const [showAnim, setShowAnim] = useState(false);
  const [activeSection, setActiveSection] = useState<'flow' | 'diagrama' | 'pipeline' | 'quiz' | 'csharp' | 'errors'>('flow');

  useEffect(() => {
    setShowAnim(true);
    const t = setTimeout(() => setShowAnim(false), 500);
    return () => clearTimeout(t);
  }, [activePhase]);

  return (
    <div style={{
      padding: isMobile ? '16px' : '28px 40px',
      animation: 'fadeIn 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: isMobile ? 20 : 28,
        animation: 'slideDown 0.3s ease',
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: GOLD,
          marginBottom: 6,
        }}>
          🎓 Estudo de Caso — Clean Architecture + CQRS
        </div>
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'baseline',
          gap: isMobile ? 6 : 12,
          marginBottom: 6,
        }}>
          <span style={{
            fontSize: isMobile ? 20 : 24,
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: isDark ? '#E8EAF0' : '#1A1A2E',
          }}>
            Fluxo: Criar Empresa
          </span>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            padding: '2px 10px',
            borderRadius: 4,
            background: 'rgba(212,168,67,0.12)',
            color: GOLD,
            fontWeight: 500,
            display: isMobile ? 'inline-block' : 'inline',
          }}>
            POST /api/empresas
          </span>
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
        }}>
          Clique em cada fase para ver o código e a explicação
        </div>
      </div>

      {/* Flow Diagram */}
      <FlowDiagram activePhase={activePhase} onPhaseChange={setActivePhase} />

      {/* Phase Detail */}
      <div style={{
        opacity: showAnim ? 0 : 1,
        transform: showAnim ? 'translateY(10px)' : 'translateY(0)',
        transition: 'all 0.3s ease',
      }}>
        <PhaseDetailPanel phaseId={activePhase} />

        {/* Help tip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          marginTop: 16,
          padding: '10px 16px',
          borderRadius: 8,
          background: isDark ? 'rgba(212,168,67,0.06)' : 'rgba(212,168,67,0.04)',
          border: `1px solid ${isDark ? 'rgba(212,168,67,0.12)' : 'rgba(212,168,67,0.08)'}`,
          flexWrap: 'wrap',
          textAlign: 'center',
        }}>
          <span style={{ fontSize: 12 }}>💡</span>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          }}>
            Você pode navegar entre as fases clicando nos cards acima ou usar as teclas ← →
          </span>
        </div>
      </div>

      {/* Section tabs */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginTop: 40,
        marginBottom: 20,
        padding: 4,
        borderRadius: 10,
        background: isDark ? 'rgba(13,17,23,0.6)' : 'rgba(245,245,245,0.8)',
        overflowX: isMobile ? 'auto' : 'visible',
        WebkitOverflowScrolling: 'touch',
      }}>
        {[
          { key: 'flow', label: '🏗️ Injeção de Dependência' },
          { key: 'diagrama', label: '🗺️ Dependências' },
          { key: 'pipeline', label: '🔀 Pipeline MediatR' },
          { key: 'quiz', label: '🎯 Quiz Entrevista' },
          { key: 'csharp', label: '⚙️ C# Conceitos' },
          { key: 'errors', label: '⚠️ Fluxos Alternativos' },
        ].map(section => (
          <div
            key={section.key}
            onClick={() => setActiveSection(section.key as typeof activeSection)}
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              whiteSpace: 'nowrap',
              fontWeight: activeSection === section.key ? 700 : 500,
              color: activeSection === section.key
                ? GOLD
                : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
              background: activeSection === section.key
                ? (isDark ? 'rgba(212,168,67,0.12)' : 'rgba(212,168,67,0.08)')
                : 'transparent',
              border: activeSection === section.key
                ? `1px solid ${isDark ? 'rgba(212,168,67,0.2)' : 'rgba(212,168,67,0.15)'}`
                : '1px solid transparent',
              transition: 'all 0.2s ease',
            }}
          >
            {section.label}
          </div>
        ))}
      </div>

      {/* Section content */}
      <div style={{ animation: 'fadeIn 0.25s ease' }}>
        {activeSection === 'flow' && <DependencyViewer />}
        {activeSection === 'diagrama' && <DacorationGraph />}
        {activeSection === 'pipeline' && <MediatRPipelineViewer />}
        {activeSection === 'quiz' && <InterviewQuizPanel />}
        {activeSection === 'csharp' && <CSharpConceptsPanel />}
        {activeSection === 'errors' && <AlternativeFlowsPanel />}
      </div>

      {/* Keyboard shortcut hint */}
      <div style={{
        marginTop: 40,
        padding: isMobile ? '12px 14px' : '16px 20px',
        borderRadius: 12,
        background: isDark ? 'rgba(13,17,23,0.4)' : 'rgba(245,245,245,0.6)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}`,
        textAlign: 'center',
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
        }}>
          Pressione <kbd>←</kbd> e <kbd>→</kbd> para navegar entre as fases
        </div>
      </div>

      {/* Global key handler */}
      <KeyHandler activePhase={activePhase} onPhaseChange={setActivePhase} maxPhase={PHASES.length} />
    </div>
  );
}

function KeyHandler({ activePhase, onPhaseChange, maxPhase }: {
  activePhase: number;
  onPhaseChange: (p: number) => void;
  maxPhase: number;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && activePhase < maxPhase) {
        onPhaseChange(activePhase + 1);
      } else if (e.key === 'ArrowLeft' && activePhase > 1) {
        onPhaseChange(activePhase - 1);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activePhase, onPhaseChange, maxPhase]);

  return null;
}
