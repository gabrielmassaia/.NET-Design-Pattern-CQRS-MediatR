import { Typography, Table, Tag, theme } from 'antd';
import { SectionCard } from './SectionCard';
import { MermaidDiagram } from './MermaidDiagram';
import { useAppTheme } from '@/context/ThemeContext';

const { Text, Paragraph } = Typography;

const ENGINE_FLOW = `flowchart LR
    E["🏢 EmpresaModel<br/>Regime Tributário"] --> ENGINE["🧮 TributaryRulesEngine"]
    ENGINE --> O["📋 Lista de ObrigaçãoModel"]
    ENGINE --> D["📅 DueDateCalculator"]
    D --> A["📆 BusinessDayAdjuster"]
    A --> H["🎌 BrazilianHolidayProvider"]`;

const MATRIX = `flowchart LR
    subgraph "Simples Nacional"
        SN_M["DAS (mensal)<br/>eSocial (mensal)"]
        SN_A["DEFIS (jan)<br/>DIRF (jan)<br/>RAIS (jan)"]
    end

    subgraph "Lucro Presumido / Lucro Real"
        LR_M["DCTF (mensal)<br/>EFD ICMS/IPI (mensal)<br/>EFD Contribuições (mensal)<br/>EFD Reinf (mensal)<br/>eSocial (mensal)"]
        LR_A["SPED ECD (jan)<br/>SPED ECF (jan)<br/>DIRF (jan)<br/>RAIS (jan)"]
    end

    subgraph "Imunidade / Isenção"
        IM["Nenhuma obrigação"]
    end`;

const DUE_DATES = `flowchart LR
    T["TipoObrigação"] --> D["DueDateCalculator"]
    D --> R{Rule}

    R -->|DAS| D1["Dia 20 do mês seguinte<br/>Ajuste dia útil"]
    R -->|DCTF| D2["Dia 15 do segundo mês"]
    R -->|EFD_ICMS_IPI| D3["Dia 15 do mês seguinte"]
    R -->|EFD_Contribuições| D3
    R -->|EFD_Reinf| D3
    R -->|eSocial| D4["Dia 7 do mês seguinte"]
    R -->|SPED_ECD| A1["31 de maio do ano seguinte"]
    R -->|SPED_ECF| A2["31 de julho do ano seguinte"]
    R -->|DIRF| A3["Último dia de fevereiro"]
    R -->|RAIS| A4["31 de março"]
    R -->|DEFIS| A4`;

const MATRIX_TABLE = [
  { regime: 'Simples Nacional',       monthly: 'DAS, eSocial',                   annual: 'DEFIS, DIRF, RAIS',                  icon: '🏪' },
  { regime: 'Lucro Presumido',        monthly: 'DCTF, EFD_ICMS_IPI, EFD_Contribuições, EFD_Reinf, eSocial', annual: 'SPED_ECD, SPED_ECF, DIRF, RAIS',    icon: '🏢' },
  { regime: 'Lucro Real',             monthly: 'DCTF, EFD_ICMS_IPI, EFD_Contribuições, EFD_Reinf, eSocial', annual: 'SPED_ECD, SPED_ECF, DIRF, RAIS',    icon: '🏦' },
  { regime: 'Imunidade / Isenção',    monthly: 'Nenhuma',                        annual: 'Nenhuma',                              icon: '🏛' },
];

const MATRIX_COL = [
  { title: '', dataIndex: 'icon', key: 'icon', width: 40 },
  { title: 'Regime', dataIndex: 'regime', key: 'regime', render: (v: string) => <Text strong>{v}</Text> },
  { title: 'Obrigações Mensais', dataIndex: 'monthly', key: 'monthly' },
  { title: 'Obrigações Anuais (Janeiro)', dataIndex: 'annual', key: 'annual' },
];

export function TributaryEngineSection() {
  const { appTheme } = useAppTheme();
  const isDark = appTheme === 'dark';

  return (
    <SectionCard
      id="tributary-engine"
      icon="🧮"
      title="Engine Tributária"
      subtitle="TributaryRulesEngine · DueDateCalculator · BusinessDayAdjuster"
    >
      <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.75)', fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
        O coração do sistema. A <Text code>TributaryRulesEngine</Text> reside no domínio puro (zero dependências externas)
        e decide quais obrigações cada empresa deve entregar com base no regime tributário.
        Utiliza <Text code>DueDateCalculator</Text> para calcular vencimentos precisos, aplicando ajustes de dia útil
        para fins de semana e feriados nacionais brasileiros.
      </Paragraph>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Visão Geral da Engine
        </div>
        <MermaidDiagram chart={ENGINE_FLOW} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Matriz de Obrigações por Regime
        </div>
        <Table dataSource={MATRIX_TABLE} columns={MATRIX_COL} pagination={false} size="small" rowKey="regime" style={{ marginBottom: 16 }} />
        <MermaidDiagram chart={MATRIX} />
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Regras de Vencimento
        </div>
        <MermaidDiagram chart={DUE_DATES} />
      </div>

      <div>
        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Ajuste de Dia Útil
        </div>
        <Paragraph style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontSize: 13, lineHeight: 1.7 }}>
          O <Text code>DAS</Text> é o único tipo que sofre ajuste de dia útil. Se o vencimento cair em
          sábado → segunda-feira (+2 dias), domingo → segunda-feira (+1 dia).
          Feriados nacionais fixos e móveis (Páscoa, Carnaval, Corpus Christi via algoritmo de Gauss)
          são calculados pelo <Text code>BrazilianHolidayProvider</Text>.
        </Paragraph>
      </div>
    </SectionCard>
  );
}
