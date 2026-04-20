import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UploadedFile } from '@/types/tools';
import { GripVertical, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // Keep utility function usage

interface SortableItemProps {
    id: string;
    file: UploadedFile;
    onRemove: (id: string) => void;
}

export function SortableItem({ id, file, onRemove }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 bg-white p-3 rounded-lg border shadow-sm group"
        >
            <button
                {...attributes}
                {...listeners}
                className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing"
            >
                <GripVertical size={20} />
            </button>

            {/* Thumbnail or Icon */}
            <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                {file.file.type.startsWith('image/') ? (
                    <img
                        src={URL.createObjectURL(file.file)}
                        alt="thumb"
                        className="w-full h-full object-cover"
                        onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                ) : (
                    <span className="text-xs font-bold text-slate-500 uppercase">
                        {file.file.name.split('.').pop()}
                    </span>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                    {file.file.name}
                </p>
                <p className="text-xs text-slate-500">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
            </div>

            <button
                onClick={() => onRemove(id)}
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
            >
                <X size={20} />
            </button>
        </div>
    );
}
