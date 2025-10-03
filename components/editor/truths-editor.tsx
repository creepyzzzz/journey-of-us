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
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableTruthItemProps {
  truth: any;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
}

function SortableTruthItem({ truth, onUpdate, onDelete }: SortableTruthItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: truth.id });

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
              value={truth.text}
              onChange={(e) => onUpdate(truth.id, e.target.value)}
              rows={2}
              className="flex-1"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(truth.id)}
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

export function TruthsEditor() {
  const { currentGame, updateGame } = useSupabaseGameStore();
  const [newTruth, setNewTruth] = useState("");

  const truths = currentGame?.truths || [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAdd = () => {
    if (newTruth.trim() && currentGame) {
      updateGame({
        truths: [...truths, { id: nanoid(), text: newTruth.trim() }],
      });
      setNewTruth("");
    }
  };

  const handleDelete = (id: string) => {
    if (currentGame) {
      updateGame({
        truths: truths.filter((t) => t.id !== id),
      });
    }
  };

  const handleUpdate = (id: string, text: string) => {
    if (currentGame) {
      updateGame({
        truths: truths.map((t) => (t.id === id ? { ...t, text } : t)),
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = truths.findIndex((item) => item.id === active.id);
      const newIndex = truths.findIndex((item) => item.id === over?.id);

      updateGame({
        truths: arrayMove(truths, oldIndex, newIndex),
      });
    }
  };


  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Truth Questions</h3>
      </div>

      {/* Add New Truth */}
      <div className="flex items-start gap-2">
        <Textarea
          value={newTruth}
          onChange={(e) => setNewTruth(e.target.value)}
          placeholder="When did you first feel attracted to me?"
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.ctrlKey) {
              handleAdd();
            }
          }}
        />
        <Button onClick={handleAdd} size="icon" className="shrink-0">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Drag & Drop Truths List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={truths.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            <AnimatePresence>
              {truths.map((truth) => (
                <SortableTruthItem
                  key={truth.id}
                  truth={truth}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
      </DndContext>

      {truths.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No truths yet. Add your first truth question above!</p>
        </div>
      )}

      <div className="text-sm text-muted-foreground text-center">
        {truths.length} truth{truths.length !== 1 ? "s" : ""} • Ctrl+Enter to add • Drag to reorder
      </div>
    </div>
  );
}
