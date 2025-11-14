import { clsx } from 'clsx';

export interface NoteCardVariantProps {
  color: string;
}

export function getNoteCardClassName(props: NoteCardVariantProps): string {
  const { color } = props;

  return clsx(
    'rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md',
    'flex flex-col gap-2'
  );
}
