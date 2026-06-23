import { useState } from 'react';
import { Grid } from 'antd';
import { useAppTheme } from '@/context/ThemeContext';
import { CSHARP_CONCEPTS, GOLD } from './FlowData';
import { CodeBlock } from './CodeBlock';

const { useBreakpoint } = Grid;

export function CSharpConceptsPanel() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const isWide = !!screens.lg;

  const [active, setActive] = useState(0);
  const concept = CSHARP_CONCEPTS[active];

  return (
    <div style={{ display: 'flex', flexDirection: isWide ? 'row' : 'column', gap: 16 }}>
      {/* Sidebar de conceitos */}
      <div style={{
        flexShrink: 0,
        width: isWide ? 200 : '100%',
      }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
          marginBottom: 8,
        }}>
          Conceitos ({CSHARP_CONCEPTS.length})
        </div>

        <div style={{
          display: isWide ? 'block' : 'flex',
          gap: 4,
          flexWrap: 'wrap',
          overflowX: isWide ? 'visible' : 'auto',
          WebkitOverflowScrolling: 'touch',
        }}>
          {CSHARP_CONCEPTS.map((c, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                display: isWide ? 'block' : 'inline-block',
                width: isWide ? '100%' : 'auto',
                textAlign: 'left',
                padding: isMobile ? '6px 12px' : '8px 12px',
                marginBottom: isWide ? 3 : 0,
                borderRadius: 8,
                border: `1px solid ${i === active
                  ? GOLD + '40'
                  : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)')}`,
                background: i === active
                  ? 'rgba(212,168,67,0.1)'
                  : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.18s',
                whiteSpace: 'nowrap',
              }}
            >
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                fontWeight: i === active ? 700 : 500,
                color: i === active
                  ? GOLD
                  : (isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)'),
              }}>
                {c.keyword}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo do conceito ativo */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Título */}
        <div style={{
          padding: isMobile ? '16px' : '20px 24px',
          borderRadius: '12px 12px 0 0',
          background: isDark ? 'rgba(22,27,39,0.9)' : '#FFFFFF',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
          borderBottom: 'none',
        }}>
          <div style={{
            display: 'inline-block',
            fontFamily: "'DM Mono', monospace",
            fontSize: 11,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 6,
            background: 'rgba(212,168,67,0.12)',
            color: GOLD,
            border: `1px solid ${GOLD}25`,
            marginBottom: 10,
          }}>
            {concept.keyword}
          </div>
          <div style={{
            fontSize: isMobile ? 15 : 17,
            fontWeight: 700,
            color: isDark ? '#E8EAF0' : '#1A1A2E',
            marginBottom: 10,
          }}>
            {concept.name}
          </div>
          <div style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
          }}>
            {concept.explanation}
          </div>
        </div>

        {/* Código */}
        <CodeBlock
          code={concept.code}
          fileName={concept.file}
        />

        {/* Por que */}
        <div style={{
          marginTop: 10,
          padding: '12px 16px',
          borderRadius: 8,
          background: isDark ? 'rgba(33,150,243,0.07)' : 'rgba(33,150,243,0.04)',
          border: `1px solid ${isDark ? 'rgba(33,150,243,0.18)' : 'rgba(33,150,243,0.12)'}`,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>💡</span>
          <div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#2196F3',
              marginBottom: 4,
            }}>
              Por que essa escolha?
            </div>
            <div style={{
              fontSize: 12,
              lineHeight: 1.6,
              color: isDark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.65)',
            }}>
              {concept.why}
            </div>
          </div>
        </div>

        {/* Navegação */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 14,
          gap: 8,
        }}>
          <button
            onClick={() => setActive(a => Math.max(0, a - 1))}
            disabled={active === 0}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
              background: 'transparent',
              color: active === 0
                ? (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')
                : (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'),
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              cursor: active === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Anterior
          </button>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            alignSelf: 'center',
          }}>
            {active + 1} / {CSHARP_CONCEPTS.length}
          </span>
          <button
            onClick={() => setActive(a => Math.min(CSHARP_CONCEPTS.length - 1, a + 1))}
            disabled={active === CSHARP_CONCEPTS.length - 1}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: `1px solid ${active === CSHARP_CONCEPTS.length - 1 ? 'transparent' : GOLD + '40'}`,
              background: active === CSHARP_CONCEPTS.length - 1 ? 'transparent' : 'rgba(212,168,67,0.1)',
              color: active === CSHARP_CONCEPTS.length - 1
                ? (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')
                : GOLD,
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: 600,
              cursor: active === CSHARP_CONCEPTS.length - 1 ? 'not-allowed' : 'pointer',
            }}
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
}
