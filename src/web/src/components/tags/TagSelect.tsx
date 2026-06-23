import { Select, Tag } from 'antd';
import { useTags, useTagsByObrigacao, useVincularTags } from '@/hooks';

interface Props {
  obrigacaoId: string;
}

export default function TagSelect({ obrigacaoId }: Props) {
  const { data: allTags = [] } = useTags();
  const { data: selectedTags = [] } = useTagsByObrigacao(obrigacaoId);
  const { mutate: vincular, isPending } = useVincularTags(obrigacaoId);

  const handleChange = (tagIds: string[]) => {
    vincular(tagIds);
  };

  return (
    <Select
      mode="multiple"
      loading={isPending}
      placeholder="Selecionar etiquetas"
      value={selectedTags.map((t) => t.id)}
      onChange={handleChange}
      style={{ minWidth: 200 }}
      options={allTags.map((t) => ({
        value: t.id,
        label: t.nome,
      }))}
      tagRender={(props) => {
        const tag = allTags.find((t) => t.id === props.value);
        return (
          <Tag closable={props.closable} onClose={props.onClose} color={tag?.cor}>
            {props.label}
          </Tag>
        );
      }}
    />
  );
}
