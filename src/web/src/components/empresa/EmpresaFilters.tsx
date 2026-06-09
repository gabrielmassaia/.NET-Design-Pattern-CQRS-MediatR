import { useEffect, useState } from 'react';
import { FilterBar, type FilterConfig } from '@/components/ui';

interface EmpresaFiltersProps {
  onSearch: (query: string) => void;
}

const filterConfigs: FilterConfig[] = [
  {
    key: 'busca',
    type: 'search',
    placeholder: 'Buscar por razão social ou CNPJ (mín. 2 caracteres)...',
    span: { xs: 24, md: 6 },
  },
];

export function EmpresaFilters({ onSearch }: EmpresaFiltersProps) {
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>({ busca: '' });
  const [debounced, setDebounced] = useState('');

  const searchInput = (filterValues.busca as string) ?? '';

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    onSearch(debounced);
  }, [debounced, onSearch]);

  return (
    <FilterBar
      filters={filterConfigs}
      values={filterValues}
      onChange={(key, value) => setFilterValues((prev) => ({ ...prev, [key]: value }))}
    />
  );
}
