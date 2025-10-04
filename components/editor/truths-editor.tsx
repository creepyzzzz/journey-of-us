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
              value={truth.text}
              onChange={(e) => onUpdate(truth.id, e.target.value)}
              rows={2}
              className="flex-1 border-2 border-pink-200 bg-white/80 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-xl resize-none text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200"
              placeholder="💭 Enter your truth question..."
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(truth.id)}
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
    <div className="space-y-6">

      {/* Add New Truth */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 sm:p-6 border border-pink-100"
      >
        <div className="flex items-start gap-3">
          <Textarea
            value={newTruth}
            onChange={(e) => setNewTruth(e.target.value)}
            placeholder="💭 Add a truth question..."
            rows={2}
            className="flex-1 border-2 border-pink-200 bg-white/80 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-xl resize-none text-base font-semibold placeholder:text-pink-400 shadow-sm hover:shadow-md transition-all duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleAdd();
              }
            }}
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Heart className="h-20 w-20 text-pink-200 fill-pink-200 mx-auto" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
