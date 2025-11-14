import type { SortSelectorProps, SortOrder } from './types';

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
  { label: 'Mais recentes', value: 'data_criacao_desc' },
  { label: 'Mais antigas', value: 'data_criacao_asc' },
  { label: 'Título (A-Z)', value: 'titulo_asc' },
  { label: 'Título (Z-A)', value: 'titulo_desc' },
];

export const SortSelector = ({ value, onChange }: SortSelectorProps) => {
  return (
    <div className="flex gap-2 items-center">
      <label htmlFor="sort" className="text-sm font-medium text-gray-700">
        Ordenar:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOrder)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
