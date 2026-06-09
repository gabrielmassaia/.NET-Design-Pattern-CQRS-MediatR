import { ClearOutlined } from '@ant-design/icons';
import { Alert, Button, Space } from 'antd';
import dayjs, { type Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/ui';
import { CalendarFilters, ObrigacaoTable, ExportButton } from '@/components/calendario';
import { useEmpresas } from '@/hooks/useEmpresas';
import { useObrigacoes, useRegistrarEntrega } from '@/hooks/useObrigacoes';
import { RegimeTributario, StatusObrigacao } from '@/domain/types';

export default function CalendarioPage() {
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({
    empresaId: '',
    competencia: dayjs(),
    status: null,
  });

  const empresaId    = (filterValues.empresaId    as string)                  ?? '';
  const competencia  = (filterValues.competencia   as Dayjs)                   ?? dayjs();
  const statusFiltro = (filterValues.status         as StatusObrigacao | null) ?? null;

  const { data: empresas = [] } = useEmpresas();
  const { data: obrigacoes = [], isLoading } = useObrigacoes({
    empresaId,
    ano: competencia.year(),
    mes: competencia.month() + 1,
  });
  const { mutate: registrar, isPending: isRegistrando } = useRegistrarEntrega();

  const empresaSelecionada = useMemo(
    () => empresas.find((e) => e.id === empresaId),
    [empresas, empresaId],
  );
  const isImune = empresaSelecionada?.regime === RegimeTributario.ImunidadeIsencao;

  const obrigacoesFiltradas = useMemo(
    () => statusFiltro !== null ? obrigacoes.filter((o) => o.status === statusFiltro) : obrigacoes,
    [obrigacoes, statusFiltro],
  );

  function handleChange(key: string, value: unknown) {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleLimparStatus() {
    handleChange('status', null);
  }

  const canExport = !!empresaId && !isImune && obrigacoesFiltradas.length > 0;

  const headerActions = (
    <Space>
      {statusFiltro !== null && (
        <Button icon={<ClearOutlined />} onClick={handleLimparStatus}>
          Limpar filtro
        </Button>
      )}
      <ExportButton
        params={{
          empresaId,
          ano: competencia.year(),
          mes: competencia.month() + 1,
        }}
        disabled={!canExport}
      />
    </Space>
  );

  return (
    <>
      <PageHeader
        title="Calendário de Obrigações"
        subtitle="Visualize e registre as obrigações por empresa e competência"
        actions={headerActions}
      />
      <CalendarFilters empresas={empresas} values={filterValues} onChange={handleChange} />

      {!empresaId && (
        <Alert
          type="info"
          message="Selecione uma empresa para visualizar as obrigações do período."
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      {empresaId && isImune && (
        <Alert
          type="warning"
          showIcon
          message="Regime Imunidade / Isenção"
          description="Empresas com este regime estão dispensadas de obrigações acessórias. Nenhuma obrigação é gerada — status: Não Aplicável."
          style={{ marginBottom: 16 }}
        />
      )}
      {empresaId && !isImune && (
        <ObrigacaoTable
          data={obrigacoesFiltradas}
          loading={isLoading}
          statusFiltro={statusFiltro}
          isRegistrando={isRegistrando}
          onRegistrar={(id) => registrar({ id, payload: {} })}
          onLimparStatus={handleLimparStatus}
        />
      )}
    </>
  );
}
