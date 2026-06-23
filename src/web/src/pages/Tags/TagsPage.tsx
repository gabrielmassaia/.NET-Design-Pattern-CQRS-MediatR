import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import { PageHeader } from '@/components/ui';
import { TagForm, TagTable } from '@/components/tags';
import { useDeleteTag, useTags } from '@/hooks';

export default function TagsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: tags = [], isLoading } = useTags();
  const { mutate: deletar, isPending: isDeleting } = useDeleteTag();

  return (
    <>
      <PageHeader
        title="Etiquetas"
        subtitle={`${tags.length} etiqueta(s) cadastrada(s)`}
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            Nova Etiqueta
          </Button>
        }
      />
      <TagTable
        data={tags}
        loading={isLoading}
        onDelete={(id) => deletar(id)}
        isDeleting={isDeleting}
      />
      <TagForm open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
