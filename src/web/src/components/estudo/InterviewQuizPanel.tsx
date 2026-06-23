import { useState } from 'react';
import { Grid } from 'antd';
import { useAppTheme } from '@/context/ThemeContext';
import { INTERVIEW_QUESTIONS, GOLD } from './FlowData';

const { useBreakpoint } = Grid;

const CATEGORY_COLORS: Record<string, string> = {
  'Arquitetura': '#2196F3',
  'CQRS': '#9C27B0',
  'C#': '#4CAF50',
  'Infraestrutura': '#FF9800',
};

export function InterviewQuizPanel() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [current, setCurrent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);

  const filtered = filter
    ? INTERVIEW_QUESTIONS.filter(q => q.category === filter)
    : INTERVIEW_QUESTIONS;

  const question = filtered[current];
  const total = filtered.length;
  const categories = ['Arquitetura', 'CQRS', 'C#', 'Infraestrutura'];

  function goTo(idx: number) {
    setCurrent(idx);
    setRevealed(false);
  }

  function next() {
    if (current < total - 1) goTo(current + 1);
  }

  function prev() {
    if (current > 0) goTo(current - 1);
  }

  return (
    <div>
      {/* Header + filtros */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 10,
          color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          marginBottom: 10,
        }}>
          Filtrar por categoria
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button
            onClick={() => { setFilter(null); goTo(0); }}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              padding: '4px 12px',
              borderRadius: 6,
              border: `1px solid ${filter === null ? GOLD : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)')}`,
              background: filter === null ? 'rgba(212,168,67,0.12)' : 'transparent',
              color: filter === null ? GOLD : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            Todas ({INTERVIEW_QUESTIONS.length})
          </button>
          {categories.map(cat => {
            const count = INTERVIEW_QUESTIONS.filter(q => q.category === cat).length;
            const color = CATEGORY_COLORS[cat];
            const active = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => { setFilter(cat); goTo(0); }}
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  padding: '4px 12px',
                  borderRadius: 6,
                  border: `1px solid ${active ? color : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.12)')}`,
                  background: active ? `${color}18` : 'transparent',
                  color: active ? color : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Progresso */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 6,
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
          }}>
            {current + 1} / {total}
          </span>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 4,
            background: `${CATEGORY_COLORS[question.category]}18`,
            color: CATEGORY_COLORS[question.category],
            border: `1px solid ${CATEGORY_COLORS[question.category]}30`,
          }}>
            {question.category}
          </span>
        </div>
        <div style={{
          height: 3,
          borderRadius: 2,
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${((current + 1) / total) * 100}%`,
            background: CATEGORY_COLORS[question.category],
            borderRadius: 2,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Card da Pergunta */}
      <div style={{
        borderRadius: 14,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
        overflow: 'hidden',
        marginBottom: 16,
      }}>
        {/* Pergunta */}
        <div style={{
          padding: isMobile ? '20px 16px' : '28px 32px',
          background: isDark ? 'rgba(22,27,39,0.8)' : '#FFFFFF',
          minHeight: 100,
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 9,
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
            marginBottom: 12,
          }}>
            Pergunta #{question.id}
          </div>
          <div style={{
            fontSize: isMobile ? 15 : 17,
            fontWeight: 600,
            lineHeight: 1.5,
            color: isDark ? '#E8EAF0' : '#1A1A2E',
          }}>
            {question.question}
          </div>
        </div>

        {/* Resposta */}
        <div style={{
          borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          background: isDark ? 'rgba(13,17,23,0.5)' : 'rgba(248,248,250,0.8)',
          padding: isMobile ? '16px' : '24px 32px',
        }}>
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: 8,
                border: `1px solid ${GOLD}30`,
                background: 'rgba(212,168,67,0.08)',
                color: GOLD,
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                letterSpacing: '0.05em',
              }}
            >
              👁 Ver resposta
            </button>
          ) : (
            <div style={{
              animation: 'fadeIn 0.3s ease',
            }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 9,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
                marginBottom: 10,
              }}>
                ✅ Resposta
              </div>
              <div style={{
                fontSize: isMobile ? 13 : 14,
                lineHeight: 1.7,
                color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
              }}>
                {question.answer}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navegação */}
      <div style={{
        display: 'flex',
        gap: 8,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button
          onClick={prev}
          disabled={current === 0}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
            background: 'transparent',
            color: current === 0
              ? (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')
              : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)'),
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            cursor: current === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          ← Anterior
        </button>

        {/* Dots */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center', flex: 1 }}>
          {filtered.map((_, i) => (
            <div
              key={i}
              onClick={() => goTo(i)}
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === current
                  ? CATEGORY_COLORS[question.category]
                  : (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current === total - 1}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: `1px solid ${current === total - 1 ? 'transparent' : GOLD + '40'}`,
            background: current === total - 1 ? 'transparent' : 'rgba(212,168,67,0.1)',
            color: current === total - 1
              ? (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)')
              : GOLD,
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            fontWeight: 600,
            cursor: current === total - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          Próxima →
        </button>
      </div>
    </div>
  );
}
