import { Grid } from 'antd';
import { useAppTheme } from '@/context/ThemeContext';
import { CodeBlock } from './CodeBlock';
import { PHASES, PHASE_COLORS, GOLD } from './FlowData';

const { useBreakpoint } = Grid;

interface PhaseDetailPanelProps {
  phaseId: number;
}

export function PhaseDetailPanel({ phaseId }: PhaseDetailPanelProps) {
  const { appTheme } = useAppTheme();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isWide = !!screens.xl;
  const isDark = appTheme === 'dark';
  const phase = PHASES.find(p => p.phase === phaseId);
  const colors = PHASE_COLORS[phaseId - 1];

  if (!phase) return null;

  return (
    <div style={{
      animation: 'slideUp 0.3s ease',
      marginTop: 20,
    }}>
      {/* Layer badge + files */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '3px 10px',
          borderRadius: 6,
          background: colors.bg,
          color: colors.border,
          border: `1px solid ${colors.border}20`,
          whiteSpace: 'nowrap',
        }}>
          {phase.layer}
        </span>
        {phase.files.map(file => (
          <span key={file} style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
            padding: '3px 8px',
            borderRadius: 4,
            background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
            whiteSpace: isMobile ? 'normal' : 'nowrap',
            wordBreak: 'break-all',
          }}>
            📄 {file}
          </span>
        ))}
      </div>

      {/* Wide: side-by-side (xl+). Narrow: stacked (code first) */}
      <div style={{
        display: 'flex',
        flexDirection: isWide ? 'row' : 'column',
        gap: 20,
        alignItems: 'flex-start',
      }}>
        {/* Left: Explanation — fixed width on wide screens */}
        <div style={{
          flex: isWide ? '0 0 300px' : '0 0 auto',
          width: isWide ? 300 : '100%',
          padding: isMobile ? '16px' : '20px 24px',
          borderRadius: 12,
          background: isDark ? 'rgba(22,27,39,0.8)' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          order: isWide ? 0 : 2,
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: colors.border,
            marginBottom: 12,
          }}>
            🧠 Explicação
          </div>

          <div style={{
            fontSize: isMobile ? 12 : 13,
            lineHeight: 1.7,
            color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)',
            whiteSpace: 'pre-wrap',
          }}>
            {phase.explanation}
          </div>

          {/* Concept tags */}
          <div style={{
            marginTop: 16,
            paddingTop: 16,
            borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              marginBottom: 8,
            }}>
              📌 Conceitos
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {phase.concept.split('·').map((c, i) => (
                <span key={i} style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  padding: '3px 10px',
                  borderRadius: 4,
                  background: isDark ? 'rgba(212,168,67,0.08)' : 'rgba(33,33,33,0.06)',
                  color: isDark ? GOLD : '#555',
                  border: `1px solid ${isDark ? 'rgba(212,168,67,0.15)' : 'rgba(0,0,0,0.08)'}`,
                }}>
                  {c.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Rule */}
          <div style={{
            marginTop: 12,
            padding: '10px 14px',
            borderRadius: 8,
            background: isDark ? 'rgba(192,57,43,0.08)' : 'rgba(192,57,43,0.04)',
            border: `1px solid ${isDark ? 'rgba(192,57,43,0.15)' : 'rgba(192,57,43,0.1)'}`,
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: isDark ? '#E57373' : '#C62828',
            lineHeight: 1.5,
          }}>
            {phase.rule}
          </div>
        </div>

        {/* Right: Code — fills all remaining space */}
        <div style={{
          flex: 1,
          minWidth: 0,
          width: isWide ? undefined : '100%',
          order: isWide ? 0 : 1,
        }}>
          <CodeBlock
            code={phase.code}
            highlightLines={phase.highlightLines}
            fileName={phase.files[0]}
          />
        </div>
      </div>
    </div>
  );
}
