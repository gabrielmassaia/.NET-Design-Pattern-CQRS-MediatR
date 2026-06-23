import { useState } from 'react';
import { Grid } from 'antd';
import { useAppTheme } from '@/context/ThemeContext';
import { ERROR_FLOWS, GOLD } from './FlowData';

const { useBreakpoint } = Grid;

type SubSection = 'errors' | 'query' | 'uow';

const STATUS_COLORS: Record<number, string> = {
  400: '#F44336',
  409: '#FF9800',
  404: '#9C27B0',
  500: '#E91E63',
};

export function AlternativeFlowsPanel() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [sub, setSub] = useState<SubSection>('errors');

  const subsections: { key: SubSection; label: string }[] = [
    { key: 'errors', label: '⚠️ Fluxos de Erro' },
    { key: 'query', label: '📖 Query vs Command' },
    { key: 'uow', label: '🔒 UnitOfWork: Tudo ou Nada' },
  ];

  return (
    <div>
      {/* Sub-tabs */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 20,
        padding: 4,
        borderRadius: 10,
        background: isDark ? 'rgba(13,17,23,0.5)' : 'rgba(245,245,245,0.7)',
        overflowX: isMobile ? 'auto' : 'visible',
        WebkitOverflowScrolling: 'touch',
      }}>
        {subsections.map(s => (
          <button
            key={s.key}
            onClick={() => setSub(s.key)}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: `1px solid ${sub === s.key ? GOLD + '40' : 'transparent'}`,
              background: sub === s.key ? 'rgba(212,168,67,0.1)' : 'transparent',
              color: sub === s.key ? GOLD : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              fontWeight: sub === s.key ? 700 : 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.18s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ animation: 'fadeIn 0.25s ease' }}>
        {sub === 'errors' && <ErrorFlowsSection isDark={isDark} isMobile={isMobile} />}
        {sub === 'query' && <QueryVsCommandSection isDark={isDark} isMobile={isMobile} />}
        {sub === 'uow' && <UnitOfWorkSection isDark={isDark} isMobile={isMobile} />}
      </div>
    </div>
  );
}

// ─── Fluxos de Erro ──────────────────────────────────────────────────────────

function ErrorFlowsSection({ isDark, isMobile }: { isDark: boolean; isMobile: boolean }) {
  const [selected, setSelected] = useState(0);
  const flow = ERROR_FLOWS[selected];

  return (
    <div>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        marginBottom: 16,
        lineHeight: 1.6,
      }}>
        Nenhum endpoint tem try/catch. Qualquer exceção sobe o call stack até o <strong style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>ExceptionMiddleware</strong>, que a converte em uma resposta padronizada.
      </p>

      {/* Seletor de erro */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {ERROR_FLOWS.map((f, i) => {
          const color = STATUS_COLORS[f.statusCode];
          return (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: `1px solid ${i === selected ? color + '60' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')}`,
                background: i === selected ? `${color}14` : 'transparent',
                color: i === selected ? color : (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'),
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                fontWeight: i === selected ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.18s',
              }}
            >
              {f.statusCode} {f.httpStatus}
            </button>
          );
        })}
      </div>

      {/* Visualização do fluxo */}
      <div style={{
        borderRadius: 12,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
        overflow: 'hidden',
      }}>
        {/* Cabeçalho */}
        <div style={{
          padding: '14px 20px',
          background: `${STATUS_COLORS[flow.statusCode]}14`,
          borderBottom: `1px solid ${STATUS_COLORS[flow.statusCode]}25`,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
        }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            fontWeight: 700,
            color: STATUS_COLORS[flow.statusCode],
          }}>
            {flow.exception}
          </span>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 4,
            background: STATUS_COLORS[flow.statusCode] + '20',
            color: STATUS_COLORS[flow.statusCode],
          }}>
            HTTP {flow.statusCode} {flow.httpStatus}
          </span>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            padding: '2px 8px',
            borderRadius: 4,
            background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
          }}>
            errorCode: {flow.errorCode}
          </span>
        </div>

        {/* Diagrama do fluxo */}
        <div style={{
          padding: isMobile ? '16px' : '20px 24px',
          background: isDark ? 'rgba(13,17,23,0.4)' : '#FAFAFA',
        }}>
          {/* Onde é lançado */}
          <FlowStep
            isDark={isDark}
            color={STATUS_COLORS[flow.statusCode]}
            label="Lançado em"
            value={flow.thrownIn}
            sub={`Quando: ${flow.thrownWhen}`}
            icon="💥"
          />
          <FlowArrow isDark={isDark} color={STATUS_COLORS[flow.statusCode]} label="sobe o call stack" />

          {/* Camadas que a exceção atravessa */}
          {['CommandHandler', 'MediatR Pipeline', 'MediatrService', 'AppService', 'Endpoint'].map((layer, i) => (
            <div key={i}>
              <FlowStep
                isDark={isDark}
                color={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'}
                label={layer}
                value="sem try/catch — exceção passa direto"
                icon="⬆️"
                muted
              />
              <FlowArrow isDark={isDark} color={STATUS_COLORS[flow.statusCode]} label="" />
            </div>
          ))}

          <FlowStep
            isDark={isDark}
            color={STATUS_COLORS[flow.statusCode]}
            label="Capturado por"
            value={flow.caughtBy}
            icon="🛡️"
          />

          {/* Resposta */}
          <div style={{ marginTop: 16 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)',
              marginBottom: 8,
            }}>
              Resposta JSON
            </div>
            <pre style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: isMobile ? 11 : 12,
              lineHeight: 1.6,
              padding: '12px 16px',
              borderRadius: 8,
              background: isDark ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
              color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)',
              overflowX: 'auto',
              margin: 0,
            }}>
              {flow.example}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlowStep({ isDark, color, label, value, sub, icon, muted }: {
  isDark: boolean; color: string; label: string; value: string;
  sub?: string; icon: string; muted?: boolean;
}) {
  return (
    <div style={{
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
      padding: '10px 12px',
      borderRadius: 8,
      background: muted
        ? (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)')
        : `${color}10`,
      border: `1px solid ${muted
        ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
        : color + '25'}`,
    }}>
      <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          color: muted
            ? (isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)')
            : color,
          marginBottom: 2,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: muted
            ? (isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)')
            : (isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)'),
        }}>
          {value}
        </div>
        {sub && (
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
            marginTop: 3,
          }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function FlowArrow({ isDark, color, label }: { isDark: boolean; color: string; label: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 14px',
      color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
    }}>
      <div style={{ width: 2, height: 16, background: color + '40', borderRadius: 1, marginLeft: 6 }} />
      {label && (
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: color + '80' }}>
          {label}
        </span>
      )}
    </div>
  );
}

// ─── Query vs Command ─────────────────────────────────────────────────────────

function QueryVsCommandSection({ isDark, isMobile }: { isDark: boolean; isMobile: boolean }) {
  const commandSteps = [
    { icon: '🔵', label: 'Endpoint', desc: 'POST /api/empresas', detail: 'Recebe JSON, chama AppService' },
    { icon: '🟢', label: 'AppService', desc: 'ViewModel → Command', detail: 'AutoMapper + _mediator.SendCommand()' },
    { icon: '✅', label: 'ValidationBehavior', desc: 'Valida campos', detail: 'FluentValidation antes do handler' },
    { icon: '🟡', label: 'CommandHandler', desc: 'REGRA DE NEGÓCIO', detail: 'Valida negócio, cria model, gera obrigações' },
    { icon: '🟠', label: 'Repository', desc: 'ChangeTracker', detail: 'Marca entities como Added — sem SaveChanges' },
    { icon: '🔒', label: 'UnitOfWork', desc: 'SaveChangesAsync()', detail: 'COMMIT ÚNICO — tudo ou nada' },
    { icon: '📢', label: 'Domain Event', desc: 'Publica EmpresaCreatedEvent', detail: 'Indexa Meilisearch, invalida Redis' },
    { icon: '🔴', label: 'Resposta', desc: 'Model → ViewModel', detail: '200 OK com EmpresaResultViewModel' },
  ];

  const querySteps = [
    { icon: '🔵', label: 'Endpoint', desc: 'GET /api/empresas', detail: 'Recebe querystring, chama AppService' },
    { icon: '🟢', label: 'AppService', desc: 'Params → Query', detail: 'AutoMapper + _mediator.SendQuery()' },
    { icon: '✅', label: 'ValidationBehavior', desc: 'Valida params', detail: 'Mesma estrutura do Command' },
    { icon: '🟡', label: 'QueryHandler', desc: 'SÓ LEITURA', detail: 'Busca no Redis → Meilisearch → Banco' },
    { icon: '🔴', label: 'Resposta', desc: 'Model → ViewModel', detail: '200 OK com lista de empresas' },
  ];

  const boxStyle = (color: string, highlight = false): React.CSSProperties => ({
    padding: '8px 12px',
    borderRadius: 8,
    background: highlight ? `${color}14` : (isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'),
    border: `1px solid ${highlight ? color + '30' : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)')}`,
    marginBottom: 4,
  });

  const diffSteps = ['UnitOfWork', 'Domain Event', 'Repository'];

  return (
    <div>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        marginBottom: 20,
        lineHeight: 1.6,
      }}>
        CQRS separa escrita (Command) de leitura (Query). Queries <strong style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>NUNCA mutam estado</strong> — sem UnitOfWork, sem Domain Events, sem ChangeTracker de escrita.
      </p>

      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 16,
      }}>
        {/* Command */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            color: '#FF9800',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 10,
            padding: '4px 10px',
            background: 'rgba(255,152,0,0.1)',
            borderRadius: 6,
            display: 'inline-block',
          }}>
            ✏️ Command (POST — Escrita)
          </div>
          {commandSteps.map((s, i) => {
            const isDiff = diffSteps.includes(s.label);
            return (
              <div key={i} style={boxStyle('#FF9800', isDiff)}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 12 }}>{s.icon}</span>
                  <div>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 11,
                      fontWeight: 600,
                      color: isDiff ? '#FF9800' : (isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)'),
                    }}>
                      {s.label}
                    </span>
                    <span style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: 10,
                      color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                      marginLeft: 8,
                    }}>
                      {s.desc}
                    </span>
                    {isDiff && (
                      <div style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 10,
                        color: '#FF9800',
                        marginTop: 2,
                      }}>
                        ← exclusivo de escrita
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Query */}
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            fontWeight: 700,
            color: '#4CAF50',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: 10,
            padding: '4px 10px',
            background: 'rgba(76,175,80,0.1)',
            borderRadius: 6,
            display: 'inline-block',
          }}>
            📖 Query (GET — Leitura)
          </div>
          {querySteps.map((s, i) => (
            <div key={i} style={boxStyle('#4CAF50')}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
                <span style={{ fontSize: 12 }}>{s.icon}</span>
                <div>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)',
                  }}>
                    {s.label}
                  </span>
                  <span style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)',
                    marginLeft: 8,
                  }}>
                    {s.desc}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Diferenças */}
          <div style={{
            marginTop: 12,
            padding: '10px 14px',
            borderRadius: 8,
            background: 'rgba(76,175,80,0.07)',
            border: '1px solid rgba(76,175,80,0.2)',
          }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#4CAF50',
              marginBottom: 6,
            }}>
              ✅ Query não tem:
            </div>
            {['UnitOfWork (sem SaveChanges)', 'Domain Events (sem side effects)', 'ChangeTracker de escrita (AsNoTracking)', 'Repository mutations (Create, Delete)'].map((item, i) => (
              <div key={i} style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 11,
                color: isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.55)',
                marginBottom: 3,
              }}>
                ❌ {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Unit of Work ─────────────────────────────────────────────────────────────

function UnitOfWorkSection({ isDark, isMobile }: { isDark: boolean; isMobile: boolean }) {
  const [scenario, setScenario] = useState<'sem' | 'com'>('sem');

  const semUoW = [
    { icon: '📝', label: 'empresaRepository.Create(model)', color: '#4CAF50', ok: true, desc: 'SaveChanges() aqui ✅ empresa salva' },
    { icon: '📝', label: 'rulesEngine.GenerateObrigacoes()', color: '#2196F3', ok: true, desc: 'calcula obrigações...' },
    { icon: '💥', label: 'obrigacaoRepository.CreateRange()', color: '#F44336', ok: false, desc: 'SaveChanges() FALHA ❌ timeout no banco' },
    { icon: '😱', label: 'ESTADO INCONSISTENTE', color: '#F44336', ok: false, desc: 'Empresa existe no banco, obrigações não. Dados corrompidos.' },
  ];

  const comUoW = [
    { icon: '📝', label: 'empresaRepository.Create(model)', color: '#4CAF50', ok: true, desc: 'só rastreia no ChangeTracker — sem SQL' },
    { icon: '📝', label: 'rulesEngine.GenerateObrigacoes()', color: '#2196F3', ok: true, desc: 'calcula obrigações...' },
    { icon: '📝', label: 'obrigacaoRepository.CreateRange()', color: '#4CAF50', ok: true, desc: 'só rastreia no ChangeTracker — sem SQL' },
    { icon: '🔒', label: 'unitOfWork.CompleteAsync()', color: '#FF9800', ok: true, desc: 'UM único SaveChangesAsync() — INSERT empresa + INSERT obrigações' },
    { icon: '💥', label: 'Se falhar aqui...', color: '#9C27B0', ok: true, desc: 'EF Core faz ROLLBACK automático. Nada foi salvo. Dados consistentes ✅' },
  ];

  const steps = scenario === 'sem' ? semUoW : comUoW;

  return (
    <div>
      <p style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
        marginBottom: 20,
        lineHeight: 1.6,
      }}>
        O Unit of Work garante que múltiplas operações no banco formam uma <strong style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)' }}>transação atômica</strong>: ou tudo persiste, ou nada persiste.
      </p>

      {/* Toggle */}
      <div style={{
        display: 'flex',
        gap: 4,
        marginBottom: 20,
        padding: 4,
        borderRadius: 10,
        background: isDark ? 'rgba(13,17,23,0.5)' : 'rgba(245,245,245,0.7)',
        width: 'fit-content',
      }}>
        {(['sem', 'com'] as const).map(s => (
          <button
            key={s}
            onClick={() => setScenario(s)}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: `1px solid ${scenario === s
                ? (s === 'sem' ? '#F44336' : '#4CAF50') + '50'
                : 'transparent'}`,
              background: scenario === s
                ? (s === 'sem' ? 'rgba(244,67,54,0.12)' : 'rgba(76,175,80,0.12)')
                : 'transparent',
              color: scenario === s
                ? (s === 'sem' ? '#F44336' : '#4CAF50')
                : (isDark ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)'),
              fontFamily: "'DM Mono', monospace",
              fontSize: 12,
              fontWeight: scenario === s ? 700 : 500,
              cursor: 'pointer',
              transition: 'all 0.18s',
            }}
          >
            {s === 'sem' ? '😱 Sem UnitOfWork' : '✅ Com UnitOfWork'}
          </button>
        ))}
      </div>

      {/* Diagrama */}
      <div style={{
        borderRadius: 12,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
        overflow: 'hidden',
        animation: 'fadeIn 0.25s ease',
      }}>
        <div style={{
          padding: '12px 20px',
          background: scenario === 'sem'
            ? 'rgba(244,67,54,0.08)'
            : 'rgba(76,175,80,0.08)',
          borderBottom: `1px solid ${scenario === 'sem' ? 'rgba(244,67,54,0.2)' : 'rgba(76,175,80,0.2)'}`,
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          color: scenario === 'sem' ? '#F44336' : '#4CAF50',
        }}>
          {scenario === 'sem'
            ? '❌ Sem UnitOfWork — cada Repository chama SaveChanges separado'
            : '✅ Com UnitOfWork — só o UoW chama SaveChanges, uma vez, no final'}
        </div>

        <div style={{ padding: isMobile ? '14px' : '20px 24px', background: isDark ? 'rgba(13,17,23,0.3)' : '#FAFAFA' }}>
          {steps.map((step, i) => (
            <div key={i}>
              <div style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                padding: '10px 14px',
                borderRadius: 8,
                background: `${step.color}12`,
                border: `1px solid ${step.color}30`,
              }}>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{step.icon}</span>
                <div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: isMobile ? 11 : 12,
                    fontWeight: 600,
                    color: step.color,
                    marginBottom: 3,
                  }}>
                    {step.label}
                  </div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                    lineHeight: 1.5,
                  }}>
                    {step.desc}
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 2,
                  height: 12,
                  background: step.color + '30',
                  borderRadius: 1,
                  marginLeft: 21,
                  marginTop: 2,
                  marginBottom: 2,
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Conclusão */}
      <div style={{
        marginTop: 12,
        padding: '12px 16px',
        borderRadius: 8,
        background: isDark ? 'rgba(33,150,243,0.07)' : 'rgba(33,150,243,0.04)',
        border: '1px solid rgba(33,150,243,0.15)',
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
        lineHeight: 1.6,
      }}>
        💡 <strong>O EF Core usa uma transação implícita</strong> quando você tem vários <code>Add()</code>/<code>AddRange()</code> antes de um único <code>SaveChangesAsync()</code>. Se qualquer INSERT falhar, o banco faz ROLLBACK de todos automaticamente.
      </div>
    </div>
  );
}
