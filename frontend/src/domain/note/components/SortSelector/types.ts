export type SortOrder = 'data_criacao_asc' | 'data_criacao_desc' | 'titulo_asc' | 'titulo_desc';

export interface SortSelectorProps {
  value: SortOrder;
  onChange: (order: SortOrder) => void;
}
