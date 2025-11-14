import type { ColorFilterProps } from './types';

const PRESET_COLORS = [
  { name: 'Todas', value: undefined },
  { name: 'Branco', value: '#FFFFFF' },
  { name: 'Amarelo', value: '#FEF08A' },
  { name: 'Verde', value: '#BBF7D0' },
  { name: 'Azul', value: '#BFDBFE' },
  { name: 'Rosa', value: '#FBCFE8' },
  { name: 'Roxo', value: '#DDD6FE' },
];

export const ColorFilter = ({ selectedColor, onColorChange }: ColorFilterProps) => {
  return (
    <div className="flex gap-2 items-center">
      <span className="text-sm font-medium text-gray-700">Filtrar por cor:</span>
      <div className="flex gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorChange(color.value)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${
              selectedColor === color.value ? 'border-gray-900 scale-110' : 'border-gray-300'
            }`}
            style={{ backgroundColor: color.value || '#F3F4F6' }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};
