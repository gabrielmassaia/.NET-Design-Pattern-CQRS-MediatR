import { Grid, Modal, Table, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { useBreakpoint } = Grid;

interface ObligationInfo { code: string; name: string; period: string; }

const ALL_OBLIGATIONS: ObligationInfo[] = [
  { code: 'DAS', name: 'Documento de Arrecadação do Simples Nacional', period: 'Mensal' },
  { code: 'DCTF', name: 'Declaração de Débitos e Créditos Tributários Federais', period: 'Mensal' },
  { code: 'EFD_ICMS_IPI', name: 'Escrituração Fiscal Digital ICMS/IPI', period: 'Mensal' },
  { code: 'EFD_Contribuicoes', name: 'Escrituração Fiscal Digital de Contribuições', period: 'Mensal' },
  { code: 'EFD_Reinf', name: 'Escrituração Fiscal Digital de Retenções', period: 'Mensal' },
  { code: 'eSocial', name: 'Sistema de Escrituração Digital das Obrigações Trabalhistas', period: 'Mensal' },
  { code: 'DEFIS', name: 'Declaração de Informações Socioeconômicas e Fiscais', period: 'Anual' },
  { code: 'SPED_ECD', name: 'Escrituração Contábil Digital', period: 'Anual' },
  { code: 'SPED_ECF', name: 'Escrituração Contábil Fiscal', period: 'Anual' },
  { code: 'DIRF', name: 'Declaração do Imposto de Renda Retido na Fonte', period: 'Anual' },
  { code: 'RAIS', name: 'Relação Anual de Informações Sociais', period: 'Anual' },
];

const REGIME_MATRIX: Record<string, string[]> = {
  'Simples Nacional': ['DAS', 'eSocial', 'DEFIS', 'DIRF', 'RAIS'],
  'Lucro Presumido': ['DCTF', 'EFD_ICMS_IPI', 'EFD_Contribuicoes', 'EFD_Reinf', 'eSocial', 'SPED_ECD', 'SPED_ECF', 'DIRF', 'RAIS'],
  'Lucro Real': ['DCTF', 'EFD_ICMS_IPI', 'EFD_Contribuicoes', 'EFD_Reinf', 'eSocial', 'SPED_ECD', 'SPED_ECF', 'DIRF', 'RAIS'],
  'Imunidade / Isenção': [],
};

interface MatrixRow { obrigacao: string; descricao: string; periodo: string; [regime: string]: string; }

const columns: ColumnsType<MatrixRow> = [
  {
    title: 'Obrigação', dataIndex: 'obrigacao', key: 'obrigacao', width: 140,
    render: (v: string) => <strong>{v}</strong>,
  },
  {
    title: 'Descrição', dataIndex: 'descricao', key: 'descricao',
  },
  {
    title: 'Período', dataIndex: 'periodo', key: 'periodo', width: 90,
    render: (v: string) => (
      <Tag color={v === 'Mensal' ? 'blue' : 'orange'}>{v}</Tag>
    ),
  },
  ...Object.keys(REGIME_MATRIX).map((regime) => ({
    title: regime.replace(' / ', '\n'),
    dataIndex: regime,
    key: regime,
    width: 130,
    render: (v: string) => {
      if (v === '✓') return <span style={{ color: '#52c41a', fontSize: 18 }}>✓</span>;
      if (v === '—') return <span style={{ color: '#d9d9d9' }}>—</span>;
      return v;
    },
  })),
];

const dataSource: MatrixRow[] = ALL_OBLIGATIONS.map((obl) => {
  const row: MatrixRow = {
    obrigacao: obl.code,
    descricao: obl.name,
    periodo: obl.period,
  };
  for (const [regime, codes] of Object.entries(REGIME_MATRIX)) {
    row[regime] = codes.includes(obl.code) ? '✓' : '—';
  }
  return row;
});

interface Props { open: boolean; onClose: () => void; }

export function RegimeMatrixModal({ open, onClose }: Props) {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  return (
    <Modal
      title={
        <span>
          <QuestionCircleOutlined style={{ color: '#1677ff', marginRight: 8 }} />
          Matriz de Obrigações por Regime Tributário
        </span>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={isMobile ? '100%' : 900}
    >
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="obrigacao"
        pagination={false}
        size="small"
        bordered
      />
    </Modal>
  );
}
