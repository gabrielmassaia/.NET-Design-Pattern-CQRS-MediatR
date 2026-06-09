import { DownloadOutlined } from '@ant-design/icons';
import { Button, message } from 'antd';
import { useState } from 'react';
import { obrigacaoService } from '@/application/services';
import { triggerDownload } from '@/shared/utils/export';
import { ExportFormato } from '@/domain/types';
import type { ExportObrigacoesParams } from '@/domain/types';

interface ExportButtonProps {
  params: ExportObrigacoesParams;
  disabled?: boolean;
}

export function ExportButton({ params, disabled = false }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  async function handleExport(formato: ExportFormato) {
    setIsExporting(true);
    try {
      const blob = await obrigacaoService.exportObrigacoes({ ...params, formato });
      const filename = `obrigacoes-${params.ano}-${String(params.mes).padStart(2, '0')}.${formato}`;
      triggerDownload(blob, filename);
    } catch {
      message.error('Erro ao exportar. Tente novamente.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Button.Group>
      <Button icon={<DownloadOutlined />} loading={isExporting} disabled={disabled} onClick={() => handleExport(ExportFormato.XLSX)}>XLSX</Button>
      <Button icon={<DownloadOutlined />} loading={isExporting} disabled={disabled} onClick={() => handleExport(ExportFormato.CSV)}>CSV</Button>
      <Button icon={<DownloadOutlined />} loading={isExporting} disabled={disabled} onClick={() => handleExport(ExportFormato.PDF)}>PDF</Button>
    </Button.Group>
  );
}
