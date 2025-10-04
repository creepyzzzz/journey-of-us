"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Plus, Trash2, GripVertical, Sparkles } from "lucide-react";
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
      <Card className={`${isDragging ? "shadow-lg scale-105" : ""} border-2 border-pink-100 hover:border-pink-200 transition-all duration-200 shadow-sm hover:shadow-md`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className="cursor-move mt-2 touch-none p-1 rounded-lg hover:bg-pink-50 transition-colors"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4 text-pink-400 hover:text-pink-600 transition-colors" />
            </div>
            <Textarea
              value={dare.text}
              onChange={(e) => onUpdate(dare.id, e.target.value)}
              rows={2}
              className="flex-1 border-2 border-pink-200 bg-white/80 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-xl resize-none text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="⭐ Enter your dare challenge..."
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(dare.id)}
              className="shrink-0 h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
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
    <div className="space-y-6">
      {/* Add New Dare */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 sm:p-6 border border-pink-100"
      >
        <div className="flex items-start gap-3">
          <Textarea
            value={newDare}
            onChange={(e) => setNewDare(e.target.value)}
            placeholder="⭐ Give the biggest hug you can, right now"
            rows={2}
            className="flex-1 border-2 border-pink-200 bg-white/80 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-xl resize-none text-base font-semibold placeholder:text-pink-400 shadow-sm hover:shadow-md transition-all duration-200"
            onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && handleAdd()}
          />
          <Button 
            onClick={handleAdd} 
            size="icon" 
            className="shrink-0 h-12 w-12 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded-xl cute-shadow"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Sparkles className="h-20 w-20 text-pink-200 mx-auto" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
