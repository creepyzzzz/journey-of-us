"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Plus, Trash2, Heart } from "lucide-react";
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
    <div className="space-y-6">
      {/* Add New Item Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-4 sm:p-6 border border-pink-100"
      >
        <div className="flex items-start gap-3">
          <Textarea
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder={placeholder}
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

      {/* Items List */}
      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item: any) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <Card className="border-2 border-pink-100 hover:border-pink-200 transition-all duration-200 shadow-sm hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Textarea
                      value={item.text}
                      onChange={(e) => handleUpdate(item.id, e.target.value)}
                      rows={2}
                      className="flex-1 border-2 border-pink-200 bg-white/80 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 rounded-xl resize-none text-base font-semibold shadow-sm hover:shadow-md transition-all duration-200"
                      placeholder="Enter your content..."
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                      className="shrink-0 h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {items.length === 0 && (
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
