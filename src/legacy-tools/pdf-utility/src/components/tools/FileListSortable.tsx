import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { UploadedFile } from '@/types/tools';
import { SortableItem } from './SortableItem';

interface FileListSortableProps {
    files: UploadedFile[];
    setFiles: (files: UploadedFile[]) => void;
    onRemove: (id: string) => void;
}

export function FileListSortable({ files, setFiles, onRemove }: FileListSortableProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = files.findIndex((f) => f.id === active.id);
            const newIndex = files.findIndex((f) => f.id === over.id);

            setFiles(arrayMove(files, oldIndex, newIndex));
        }
    }

    if (files.length === 0) return null;

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="space-y-2">
                <SortableContext
                    items={files.map(f => f.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {files.map((file) => (
                        <SortableItem
                            key={file.id}
                            id={file.id}
                            file={file}
                            onRemove={onRemove}
                        />
                    ))}
                </SortableContext>
            </div>
        </DndContext>
    );
}
