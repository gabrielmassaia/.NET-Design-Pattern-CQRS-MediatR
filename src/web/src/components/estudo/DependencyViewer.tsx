import { useState } from 'react';
import { Grid } from 'antd';
import { useAppTheme } from '@/context/ThemeContext';
import { DI_REGISTRATIONS, GOLD } from './FlowData';

const { useBreakpoint } = Grid;

const LAYER_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  'Application': { bg: 'rgba(76,175,80,0.12)', border: '#4CAF50', text: '#4CAF50' },
  'Infrastructure.Data': { bg: 'rgba(255,152,0,0.12)', border: '#FF9800', text: '#FF9800' },
  'Infrastructure.IoC': { bg: 'rgba(156,39,176,0.12)', border: '#9C27B0', text: '#CE93D8' },
  'Domain': { bg: 'rgba(33,150,243,0.12)', border: '#2196F3', text: '#64B5F6' },
};

export function DependencyViewer() {
  const { appTheme } = useAppTheme();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isDark = appTheme === 'dark';
  const [selectedReg, setSelectedReg] = useState<string | null>(null);

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
        🏗️ Injeção de Dependência
      </div>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        marginBottom: 20,
      }}>
        Como o DI conecta interfaces e implementações — clique para detalhes
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DI_REGISTRATIONS.map((reg) => {
          const isSelected = selectedReg === reg.interface;
          const layerColor = LAYER_COLORS[reg.layer] || { bg: 'transparent', border: '#666', text: '#666' };

          return (
            <div key={reg.interface}>
            <div
              onClick={() => setSelectedReg(isSelected ? null : reg.interface)}
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'stretch' : 'center',
                gap: isMobile ? 8 : 12,
                padding: isMobile ? '10px 12px' : '12px 16px',
                borderRadius: isSelected ? '10px 10px 0 0' : 10,
                cursor: 'pointer',
                background: isSelected
                  ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)')
                  : 'transparent',
                border: `1px solid ${isSelected ? GOLD : 'transparent'}`,
                borderBottom: isSelected ? 'none' : undefined,
                transition: 'all 0.2s ease',
              }}
            >
              {/* Interface + Implementation row */}
              <div style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'flex-start' : 'center',
                gap: isMobile ? 4 : 12,
                flex: 1,
                minWidth: 0,
              }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  fontWeight: 500,
                  color: isDark ? '#E8EAF0' : '#1A1A2E',
                  wordBreak: 'break-word',
                }}>
                  {reg.interface}
                </div>

                <div style={{
                  color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)',
                  fontSize: 11,
                  transform: isMobile ? 'rotate(90deg)' : 'none',
                  alignSelf: isMobile ? 'center' : 'auto',
                }}>
                  → {isMobile ? '' : ''}
                </div>

                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  fontWeight: 600,
                  color: layerColor.text,
                  wordBreak: 'break-word',
                }}>
                  {reg.implementation}
                </div>
              </div>

              {/* Badges row */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                alignItems: 'center',
              }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: reg.lifetime === 'Singleton'
                    ? (isDark ? 'rgba(156,39,176,0.15)' : 'rgba(156,39,176,0.1)')
                    : (isDark ? 'rgba(33,150,243,0.15)' : 'rgba(33,150,243,0.1)'),
                  color: reg.lifetime === 'Singleton' ? '#CE93D8' : '#64B5F6',
                  whiteSpace: 'nowrap',
                }}>
                  {reg.lifetime}
                </span>

                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9,
                  fontWeight: 600,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: layerColor.bg,
                  color: layerColor.text,
                  whiteSpace: 'nowrap',
                }}>
                  {reg.layer}
                </span>

                <span style={{
                  color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                  fontSize: 10,
                  transition: 'transform 0.2s ease',
                  transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)',
                }}>
                  ▼
                </span>
              </div>
            </div>

            {/* Detalhe inline — aparece abaixo da linha clicada */}
            {isSelected && (
              <div style={{
                padding: isMobile ? '12px 14px' : '14px 20px',
                borderRadius: '0 0 10px 10px',
                background: isDark ? 'rgba(13,17,23,0.8)' : 'rgba(245,245,245,0.8)',
                border: `1px solid ${GOLD}`,
                borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                animation: 'fadeIn 0.2s ease',
              }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, lineHeight: 1.8 }}>
                  <div style={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    gap: isMobile ? 4 : 24,
                  }}>
                    <div>
                      <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>Registrado em: </span>
                      <span style={{ color: GOLD, fontWeight: 600, wordBreak: 'break-word' }}>{reg.file}</span>
                    </div>
                    <div>
                      <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>Lifetime: </span>
                      <span style={{ color: '#64B5F6', fontWeight: 600 }}>{reg.lifetime}</span>
                    </div>
                  </div>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>Propósito: </span>
                    <span style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>{reg.purpose}</span>
                  </div>
                </div>
              </div>
            )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
