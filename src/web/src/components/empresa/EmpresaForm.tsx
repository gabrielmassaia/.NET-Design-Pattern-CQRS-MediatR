import { Button, Form, Input, Modal, Select } from 'antd';
import { RegimeTributario, type CreateEmpresaPayload } from '@/domain/types';
import { useCreateEmpresa } from '@/hooks/useEmpresas';
import { regimeLabel } from '@/utils/formatters';

interface EmpresaFormProps { open: boolean; onClose: () => void; }

const REGIME_OPTIONS = (Object.values(RegimeTributario) as number[])
  .filter((v) => typeof v === 'number')
  .map((v) => ({ value: v, label: regimeLabel(v) }));

export function EmpresaForm({ open, onClose }: EmpresaFormProps) {
  const [form] = Form.useForm<CreateEmpresaPayload>();
  const { mutate, isPending } = useCreateEmpresa();

  const handleSubmit = (values: CreateEmpresaPayload) => {
    mutate(values, {
      onSuccess: () => { form.resetFields(); onClose(); },
    });
  };

  return (
    <Modal title="Nova Empresa" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Form form={form} layout="vertical" onFinish={handleSubmit} style={{ marginTop: 16 }}>
        <Form.Item label="CNPJ" name="cnpj" rules={[
          { required: true, message: 'CNPJ é obrigatório' },
          { pattern: /^\d{14}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, message: 'CNPJ inválido' },
        ]}>
          <Input placeholder="00.000.000/0000-00" maxLength={18} />
        </Form.Item>
        <Form.Item label="Razão Social" name="razaoSocial"
          rules={[{ required: true, message: 'Razão Social é obrigatória' }]}>
          <Input placeholder="Nome da empresa" />
        </Form.Item>
        <Form.Item label="Regime Tributário" name="regime"
          rules={[{ required: true, message: 'Selecione o regime' }]}>
          <Select placeholder="Selecione..." options={REGIME_OPTIONS} />
        </Form.Item>
        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>Cancelar</Button>
          <Button type="primary" htmlType="submit" loading={isPending}>Cadastrar</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
