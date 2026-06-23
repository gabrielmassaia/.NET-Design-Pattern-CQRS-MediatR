import { useState } from 'react';
import { Grid } from 'antd';
import { useAppTheme } from '@/context/ThemeContext';
import { CodeBlock } from './CodeBlock';
import { MEDIATR_STEPS, GOLD } from './FlowData';

const { useBreakpoint } = Grid;

export function MediatRPipelineViewer() {
  const { appTheme } = useAppTheme();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isDark = appTheme === 'dark';
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <div style={{
      padding: isMobile ? '16px' : '24px 28px',
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
        🔀 Pipeline do MediatR
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        marginBottom: 20,
      }}>
        O caminho que o Command percorre — clique em cada etapa
      </div>

      {/* Pipeline steps: horizontal on desktop, vertical on mobile */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: isMobile ? 8 : 0,
        marginBottom: 24,
      }}>
        {MEDIATR_STEPS.map((step, idx) => {
          const isActive = activeStep === idx;
          const isPast = activeStep > idx;

          return (
            <div key={idx} style={{
              display: 'flex',
              flexDirection: isMobile ? 'row' : 'column',
              alignItems: 'center',
              flex: isMobile ? '0 0 auto' : 1,
              gap: isMobile ? 8 : 0,
            }}>
              <div
                onClick={() => setActiveStep(idx)}
                style={{
                  flex: 1,
                  width: isMobile ? '100%' : 'auto',
                  padding: isMobile ? '10px 14px' : '12px 10px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  textAlign: 'center',
                  background: isActive
                    ? 'rgba(212,168,67,0.12)'
                    : isPast
                      ? (isDark ? 'rgba(76,175,80,0.1)' : 'rgba(76,175,80,0.08)')
                      : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
                  border: `1px solid ${
                    isActive ? GOLD
                    : isPast ? '#4CAF50'
                    : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')
                  }`,
                  transition: 'all 0.25s ease',
                }}
              >
                <div style={{
                  display: isMobile ? 'flex' : 'block',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <span style={{ fontSize: isMobile ? 18 : 20 }}>{step.icon}</span>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: isMobile ? 10 : 9,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? GOLD : isPast ? '#4CAF50' : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
                    lineHeight: 1.3,
                    transition: 'color 0.2s ease',
                    marginTop: isMobile ? 0 : 6,
                  }}>
                    {step.step}
                  </div>
                </div>
              </div>

              {/* Arrow between steps */}
              {idx < MEDIATR_STEPS.length - 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: isMobile ? '0' : '0 4px',
                  color: isActive || isPast ? GOLD : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
                  fontSize: 12,
                  flexShrink: 0,
                  transform: isMobile ? 'rotate(90deg)' : 'none',
                }}>
                  ▶
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Active step detail */}
      {MEDIATR_STEPS[activeStep] && (
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          gap: 16,
          animation: 'fadeIn 0.2s ease',
        }}>
          <div style={{
            flex: isMobile ? '0 0 auto' : 1,
            padding: isMobile ? '14px 16px' : '16px 20px',
            borderRadius: 10,
            background: isDark ? 'rgba(22,27,39,0.8)' : '#FFFFFF',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
            order: isMobile ? 2 : 0,
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: GOLD,
              marginBottom: 10,
            }}>
              📖 Explicação
            </div>
            <div style={{
              fontSize: 12,
              lineHeight: 1.7,
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              whiteSpace: 'pre-wrap',
            }}>
              {MEDIATR_STEPS[activeStep].explanation}
            </div>
          </div>
          <div style={{
            flex: isMobile ? '0 0 auto' : 1.5,
            minWidth: 0,
            order: isMobile ? 1 : 0,
          }}>
            <CodeBlock
              code={MEDIATR_STEPS[activeStep].code}
              fileName=""
            />
          </div>
        </div>
      )}
    </div>
  );
}
