"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useSupabaseGameStore } from "@/lib/supabase-store";
import { motion, AnimatePresence } from "framer-motion";

interface EditorTemplateProps {
  fieldName: "secrets" | "memories" | "romanticSentences";
  placeholder: string;
  emptyMessage: string;
}

export function EditorTemplate({ fieldName, placeholder, emptyMessage }: EditorTemplateProps) {
  const { currentGame, updateGame } = useSupabaseGameStore();
  const [newItem, setNewItem] = useState("");

  const items = currentGame?.[fieldName] || [];

  const handleAdd = () => {
    if (newItem.trim() && currentGame) {
      updateGame({
        [fieldName]: [...items, { id: nanoid(), text: newItem.trim() }],
      });
      setNewItem("");
    }
  };

  const handleDelete = (id: string) => {
    if (currentGame) {
      updateGame({
        [fieldName]: items.filter((i: any) => i.id !== id),
      });
    }
  };

  const handleUpdate = (id: string, text: string) => {
    if (currentGame) {
      updateGame({
        [fieldName]: items.map((i: any) => (i.id === id ? { ...i, text } : i)),
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2">
        <Textarea
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder={placeholder}
          rows={2}
          onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && handleAdd()}
        />
        <Button onClick={handleAdd} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {items.map((item: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <Card>
                <CardContent className="p-4 flex items-start gap-2">
                  <Textarea
                    value={item.text}
                    onChange={(e) => handleUpdate(item.id, e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}
