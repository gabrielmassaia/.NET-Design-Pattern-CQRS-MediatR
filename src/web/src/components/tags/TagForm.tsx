import { ColorPicker, Form, Input, Modal } from 'antd';
import { useCreateTag } from '@/hooks';
import type { CreateTagPayload } from '@/domain/types';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function TagForm({ open, onClose }: Props) {
  const [form] = Form.useForm<CreateTagPayload>();
  const { mutate: criar, isPending } = useCreateTag();

  const handleOk = () => {
    form.validateFields().then((values) => {
      criar(values, {
        onSuccess: () => {
          form.resetFields();
          onClose();
        },
      });
    });
  };

  return (
    <Modal
      title="Nova Etiqueta"
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={isPending}
      okText="Criar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          name="nome"
          label="Nome"
          rules={[{ required: true, message: 'Informe o nome da etiqueta' }]}
        >
          <Input placeholder="Ex: Urgente" maxLength={50} />
        </Form.Item>
        <Form.Item
          name="cor"
          label="Cor"
          rules={[{ required: true, message: 'Selecione uma cor' }]}
          getValueFromEvent={(color) => color?.toHexString()}
        >
          <ColorPicker showText />
        </Form.Item>
      </Form>
    </Modal>
  );
}
