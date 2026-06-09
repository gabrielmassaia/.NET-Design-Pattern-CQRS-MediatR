import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useCallback, useState } from 'react';
import { PageHeader } from '@/components/ui';
import { EmpresaFilters, EmpresaTable, EmpresaForm, HistoricoDrawer } from '@/components/empresa';
import { useDeleteEmpresa, useEmpresaSearch, useEmpresas } from '@/hooks/useEmpresas';
import type { Empresa } from '@/domain/types';

export default function EmpresasPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [historicoEmpresa, setHistoricoEmpresa] = useState<Empresa | null>(null);

  const isSearching = debouncedQuery.trim().length >= 2;
  const { data: empresas = [], isLoading } = useEmpresas();
  const { data: searchResults = [], isFetching: isSearchFetching } = useEmpresaSearch(debouncedQuery);
  const { mutate: deletar, isPending: isDeleting } = useDeleteEmpresa();

  const displayData = isSearching ? searchResults : empresas;
  const displayLoading = isSearching ? isSearchFetching : isLoading;

  const handleSearch = useCallback((query: string) => {
    setDebouncedQuery(query);
  }, []);

  return (
    <>
      <PageHeader
        title="Empresas"
        subtitle={`${empresas.length} empresa(s) cadastrada(s)`}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Nova Empresa
          </Button>
        }
      />
      <EmpresaFilters onSearch={handleSearch} />
      <EmpresaTable
        data={displayData}
        loading={displayLoading}
        onDelete={(id) => deletar(id)}
        isDeleting={isDeleting}
        onHistorico={(empresa) => setHistoricoEmpresa(empresa)}
      />
      <EmpresaForm open={modalOpen} onClose={() => setModalOpen(false)} />
      <HistoricoDrawer
        empresa={historicoEmpresa}
        onClose={() => setHistoricoEmpresa(null)}
      />
    </>
  );
}
