import dayjs from 'dayjs';
import type { Empresa, StatusObrigacao } from '@/domain/types';
import { RegimeTributario } from '@/domain/types';
import { regimeLabel } from '@/utils/formatters';
import { FilterBar, type FilterConfig } from '@/components/ui';

interface CalendarFiltersProps {
  empresas: Empresa[];
  values: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

export function CalendarFilters({ empresas, values, onChange }: CalendarFiltersProps) {
  const empresaOptions = empresas.map((e) => ({
    value: e.id,
    label: `${e.razaoSocial} — ${regimeLabel(e.regime)}`,
  }));

  const filterConfigs: FilterConfig[] = [
    {
      key: 'empresaId',
      type: 'select',
      placeholder: 'Selecione uma empresa...',
      options: empresaOptions,
      showSearch: true,
      span: { xs: 24, md: 10 },
    },
    {
      key: 'competencia',
      type: 'month',
      span: { xs: 12, md: 7 },
    },
    {
      key: 'status',
      type: 'select',
      placeholder: 'Todos os status',
      options: [
        { value: null,                      label: 'Todos os status' },
        { value: 1 /* Pendente */,           label: 'Pendente'        },
        { value: 2 /* Atrasada */,           label: 'Atrasada'        },
        { value: 3 /* Entregue */,           label: 'Entregue'        },
      ],
      span: { xs: 12, md: 7 },
    },
  ];

  return (
    <FilterBar filters={filterConfigs} values={values} onChange={onChange} />
  );
}
