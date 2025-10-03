"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseGameStore } from "@/lib/supabase-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableDareItemProps {
  dare: any;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

function SortableDareItem({ dare, onUpdate, onDelete }: SortableDareItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: dare.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={isDragging ? "shadow-lg" : ""}>
        <CardContent className="p-4">
          <div className="flex items-start gap-2">
            <div
              className="cursor-move mt-2 touch-none"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
            </div>
            <Textarea
              value={dare.text}
              onChange={(e) => onUpdate(dare.id, e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(dare.id)}
              className="shrink-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function DaresEditor() {
  const { currentGame, updateGame } = useSupabaseGameStore();
  const [newDare, setNewDare] = useState("");

  const dares = currentGame?.dares || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    if (newDare.trim() && currentGame) {
      updateGame({
        dares: [...dares, { id: nanoid(), text: newDare.trim() }],
      });
      setNewDare("");
    }
  };

  const handleDelete = (id: string) => {
    if (currentGame) {
      updateGame({
        dares: dares.filter((d) => d.id !== id),
      });
    }
  };

  const handleUpdate = (id: string, text: string) => {
    if (currentGame) {
      updateGame({
        dares: dares.map((d) => (d.id === id ? { ...d, text } : d)),
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = dares.findIndex((item) => item.id === active.id);
      const newIndex = dares.findIndex((item) => item.id === over?.id);

      updateGame({
        dares: arrayMove(dares, oldIndex, newIndex),
      });
    }
  };


  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Dare Challenges</h3>
      </div>

      {/* Add New Dare */}
      <div className="flex items-start gap-2">
        <Textarea
          value={newDare}
          onChange={(e) => setNewDare(e.target.value)}
          placeholder="Give the biggest hug you can, right now"
          rows={2}
          onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && handleAdd()}
        />
        <Button onClick={handleAdd} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Drag & Drop Dares List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={dares.map(d => d.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            <AnimatePresence>
              {dares.map((dare) => (
                <SortableDareItem
                  key={dare.id}
                  dare={dare}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {dares.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No dares yet. Add your first dare above!</p>
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center">
        {dares.length} dare{dares.length !== 1 ? "s" : ""} • Ctrl+Enter to add • Drag to reorder
      </div>
    </div>
  );
}
