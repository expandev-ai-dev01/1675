import { format } from 'date-fns';
import { getNoteCardClassName } from './variants';
import type { NoteCardProps } from './types';

export const NoteCard = ({ note, onEdit, onDelete, onClick }: NoteCardProps) => {
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(note.idNote);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.idNote);
  };

  return (
    <div
      className={getNoteCardClassName({ color: note.cor })}
      style={{ backgroundColor: note.cor }}
      onClick={() => onClick(note.idNote)}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">{note.titulo}</h3>
        <div className="flex gap-2">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Delete
          </button>
        </div>
      </div>
      <p className="text-gray-700 text-sm line-clamp-3">{note.conteudo}</p>
      <p className="text-xs text-gray-500 mt-2">
        {format(new Date(note.dataCriacao), 'MMM dd, yyyy HH:mm')}
      </p>
    </div>
  );
};
