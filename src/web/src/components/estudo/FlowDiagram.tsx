import { Fragment, useState } from 'react';
import { Grid } from 'antd';
import { useAppTheme } from '@/context/ThemeContext';
import { PHASES, PHASE_COLORS } from './FlowData';

const { useBreakpoint } = Grid;

interface FlowDiagramProps {
  activePhase: number;
  onPhaseChange: (phase: number) => void;
}

export function FlowDiagram({ activePhase, onPhaseChange }: FlowDiagramProps) {
  const { appTheme } = useAppTheme();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isDark = appTheme === 'dark';
  const [hoveredPhase, setHoveredPhase] = useState<number | null>(null);

  const getArrowColor = (phaseIdx: number) => {
    if (activePhase === phaseIdx + 1 || activePhase === phaseIdx) {
      return PHASE_COLORS[phaseIdx].border;
    }
    return isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      alignItems: 'stretch',
      gap: isMobile ? 0 : 4,
      padding: isMobile ? '12px' : '16px 20px',
      background: isDark ? 'rgba(13,17,23,0.6)' : 'rgba(255,255,255,0.8)',
      borderRadius: 16,
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
      backdropFilter: 'blur(8px)',
    }}>
      {PHASES.map((phase, idx) => {
        const isActive = activePhase === phase.phase;
        const isHovered = hoveredPhase === phase.phase;
        const colors = PHASE_COLORS[idx];

        return (
          <Fragment key={phase.id}>
            {/* Phase card */}
            <div
              onClick={() => onPhaseChange(phase.phase)}
              onMouseEnter={() => setHoveredPhase(phase.phase)}
              onMouseLeave={() => setHoveredPhase(null)}
              style={{
                flex: 1,
                cursor: 'pointer',
                padding: isMobile ? '10px 14px' : '14px 12px',
                borderRadius: 12,
                background: isActive
                  ? colors.bg
                  : isHovered
                    ? (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)')
                    : 'transparent',
                border: `1px solid ${isActive ? colors.border : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')}`,
                boxShadow: isActive ? `0 0 18px ${colors.glow}` : 'none',
                transition: 'all 0.25s ease',
              }}
            >
              <div style={{
                display: isMobile ? 'flex' : 'block',
                alignItems: 'center',
                gap: 12,
              }}>
                {/* Phase circle */}
                <div style={{
                  width: isMobile ? 28 : 34,
                  height: isMobile ? 28 : 34,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: isMobile ? '0' : '0 auto 10px',
                  fontSize: isMobile ? 14 : 17,
                  background: isActive ? colors.bg : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'),
                  border: `2px solid ${isActive ? colors.border : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')}`,
                  transition: 'all 0.3s ease',
                  flexShrink: 0,
                }}>
                  {phase.emoji}
                </div>

                <div style={{ flex: 1, ...(isMobile ? { minWidth: 0 } : {}) }}>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 9,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: isActive ? colors.border : (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'),
                    marginBottom: isMobile ? 0 : 4,
                    transition: 'color 0.2s ease',
                  }}>
                    {phase.label}
                  </div>

                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: isMobile ? 10 : 11,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#E8EAF0' : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'),
                    lineHeight: 1.3,
                    transition: 'all 0.2s ease',
                  }}>
                    {phase.title.split(' — ').map((part, i) => (
                      <span key={i}>
                        {i > 0 && <span style={{ opacity: 0.4, margin: '0 3px' }}>—</span>}
                        {part}
                      </span>
                    ))}
                  </div>

                  {(isActive || isHovered) && (
                    <div style={{
                      marginTop: isMobile ? 2 : 8,
                      fontSize: 10,
                      color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
                      lineHeight: 1.4,
                      fontFamily: "'DM Mono', monospace",
                      animation: 'fadeIn 0.2s ease',
                    }}>
                      {phase.summary}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Arrow between phases — sibling of card, not nested inside */}
            {idx < PHASES.length - 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                padding: isMobile ? '2px 0' : '0 2px',
              }}>
                <svg
                  width={isMobile ? 16 : 18}
                  height={isMobile ? 16 : 18}
                  viewBox="0 0 20 20"
                  style={{ transform: isMobile ? 'rotate(90deg)' : 'none' }}
                >
                  <defs>
                    <marker id={`arrow-${idx}`} markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <path d="M0,0 L8,3 L0,6 Z" fill={getArrowColor(idx)} />
                    </marker>
                  </defs>
                  <line
                    x1="2" y1="10" x2="16" y2="10"
                    stroke={getArrowColor(idx)}
                    strokeWidth="2"
                    strokeDasharray={activePhase === idx + 1 || activePhase > idx + 1 ? 'none' : '4,3'}
                    markerEnd={`url(#arrow-${idx})`}
                    style={{ transition: 'stroke 0.3s ease' }}
                  />
                  {(activePhase === idx + 1 || activePhase > idx + 1) && (
                    <circle r="2.5" fill={PHASE_COLORS[idx].border}>
                      <animateMotion dur="1.5s" repeatCount="indefinite" path="M2,10 L16,10" />
                    </circle>
                  )}
                </svg>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
