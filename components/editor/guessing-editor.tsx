"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Plus, Trash2, Edit2, Check, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSupabaseGameStore } from "@/lib/supabase-store";
import { motion, AnimatePresence } from "framer-motion";

export function GuessingEditor() {
  const { currentGame, updateGame } = useSupabaseGameStore();
  const [newQuestion, setNewQuestion] = useState({ label: "", type: "text" as "text" | "choice", answer: "", choices: [] as string[], correctChoiceIndex: -1 });
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ label: "", type: "text" as "text" | "choice", answer: "", choices: [] as string[], correctChoiceIndex: -1 });

  const questions = currentGame?.guessingQuestions || [];

  const handleAdd = () => {
    if (newQuestion.label.trim() && currentGame) {
      updateGame({
        guessingQuestions: [
          ...questions,
          {
            id: nanoid(),
            label: newQuestion.label.trim(),
            type: newQuestion.type,
            creatorAnswer: newQuestion.answer.trim(),
            choices: newQuestion.type === "choice" ? newQuestion.choices : undefined,
            correctChoiceIndex: newQuestion.type === "choice" ? newQuestion.correctChoiceIndex : undefined,
          },
        ],
      });
      setNewQuestion({ label: "", type: "text", answer: "", choices: [], correctChoiceIndex: -1 });
    }
  };

  const handleDelete = (id: string) => {
    if (currentGame) {
      updateGame({
        guessingQuestions: questions.filter((q) => q.id !== id),
      });
    }
  };

  const handleEdit = (question: any) => {
    setEditingQuestion(question.id);
    setEditForm({
      label: question.label,
      type: question.type,
      answer: question.creatorAnswer || "",
      choices: question.choices || [],
      correctChoiceIndex: question.correctChoiceIndex ?? -1,
    });
  };

  const handleSaveEdit = () => {
    if (editingQuestion && currentGame) {
      updateGame({
        guessingQuestions: questions.map((q) =>
          q.id === editingQuestion
            ? {
                ...q,
                label: editForm.label.trim(),
                type: editForm.type,
                creatorAnswer: editForm.answer.trim(),
                choices: editForm.type === "choice" ? editForm.choices : undefined,
                correctChoiceIndex: editForm.type === "choice" ? editForm.correctChoiceIndex : undefined,
              }
            : q
        ),
      });
      setEditingQuestion(null);
      setEditForm({ label: "", type: "text", answer: "", choices: [], correctChoiceIndex: -1 });
    }
  };

  const handleCancelEdit = () => {
    setEditingQuestion(null);
    setEditForm({ label: "", type: "text", answer: "", choices: [], correctChoiceIndex: -1 });
  };

  const addChoice = () => {
    setEditForm({ ...editForm, choices: [...editForm.choices, ""] });
  };

  const updateChoice = (index: number, value: string) => {
    const newChoices = [...editForm.choices];
    newChoices[index] = value;
    setEditForm({ ...editForm, choices: newChoices });
  };

  const removeChoice = (index: number) => {
    const newChoices = editForm.choices.filter((_, i) => i !== index);
    let newCorrectIndex = editForm.correctChoiceIndex;
    
    // Adjust correct choice index if we're removing a choice before the correct one
    if (index < editForm.correctChoiceIndex) {
      newCorrectIndex = editForm.correctChoiceIndex - 1;
    } else if (index === editForm.correctChoiceIndex) {
      newCorrectIndex = -1; // Reset if we're removing the correct choice
    }
    
    setEditForm({ ...editForm, choices: newChoices, correctChoiceIndex: newCorrectIndex });
  };

  const addNewChoice = () => {
    setNewQuestion({ ...newQuestion, choices: [...newQuestion.choices, ""] });
  };

  const updateNewChoice = (index: number, value: string) => {
    const newChoices = [...newQuestion.choices];
    newChoices[index] = value;
    setNewQuestion({ ...newQuestion, choices: newChoices });
  };

  const removeNewChoice = (index: number) => {
    const newChoices = newQuestion.choices.filter((_, i) => i !== index);
    let newCorrectIndex = newQuestion.correctChoiceIndex;
    
    // Adjust correct choice index if we're removing a choice before the correct one
    if (index < newQuestion.correctChoiceIndex) {
      newCorrectIndex = newQuestion.correctChoiceIndex - 1;
    } else if (index === newQuestion.correctChoiceIndex) {
      newCorrectIndex = -1; // Reset if we're removing the correct choice
    }
    
    setNewQuestion({ ...newQuestion, choices: newChoices, correctChoiceIndex: newCorrectIndex });
  };

  return (
    <div className="space-y-4">
      <Card className="bg-blue-50">
        <CardContent className="p-4">
          <div className="space-y-3">
            <Input
              value={newQuestion.label}
              onChange={(e) => setNewQuestion({ ...newQuestion, label: e.target.value })}
              placeholder="What's my favorite color?"
            />
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={newQuestion.type}
                onValueChange={(value: "text" | "choice") =>
                  setNewQuestion({ ...newQuestion, type: value, choices: value === "text" ? [] : newQuestion.choices, correctChoiceIndex: value === "text" ? -1 : newQuestion.correctChoiceIndex })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Answer</SelectItem>
                  <SelectItem value="choice">Multiple Choice</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={newQuestion.answer}
                onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                placeholder="Your answer (optional)"
              />
            </div>
            
            {newQuestion.type === "choice" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Choice Options</label>
                  <Button onClick={addNewChoice} size="sm" variant="outline">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Choice
                  </Button>
                </div>
                {newQuestion.choices.map((choice, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <RadioGroup
                      value={newQuestion.correctChoiceIndex.toString()}
                      onValueChange={(value) => setNewQuestion({ ...newQuestion, correctChoiceIndex: parseInt(value) })}
                      className="flex items-center"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value={index.toString()} id={`new-correct-${index}`} />
                        <Label htmlFor={`new-correct-${index}`} className="text-sm font-medium text-green-600">
                          Correct
                        </Label>
                      </div>
                    </RadioGroup>
                    <Input
                      value={choice}
                      onChange={(e) => updateNewChoice(index, e.target.value)}
                      placeholder={`Choice ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => removeNewChoice(index)}
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {newQuestion.choices.length === 0 && (
                  <p className="text-sm text-muted-foreground">No choices added yet. Click "Add Choice" to add options.</p>
                )}
                {newQuestion.choices.length > 0 && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-medium">
                        {newQuestion.correctChoiceIndex >= 0 
                          ? `Correct answer: "${newQuestion.choices[newQuestion.correctChoiceIndex]}"`
                          : "Select the correct answer above"
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}
            <Button onClick={handleAdd} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-2">
        <AnimatePresence>
          {questions.map((question) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <Card>
                <CardContent className="p-4">
                  {editingQuestion === question.id ? (
                    // Edit Mode
                    <div className="space-y-3">
                      <Textarea
                        value={editForm.label}
                        onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                        placeholder="What's my favorite color?"
                        className="min-h-[60px]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          value={editForm.type}
                          onValueChange={(value: "text" | "choice") =>
                            setEditForm({ ...editForm, type: value, choices: value === "text" ? [] : editForm.choices })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Answer</SelectItem>
                            <SelectItem value="choice">Multiple Choice</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          value={editForm.answer}
                          onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                          placeholder="Your answer (optional)"
                        />
                      </div>
                      
                      {editForm.type === "choice" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Choice Options</label>
                            <Button onClick={addChoice} size="sm" variant="outline">
                              <Plus className="h-3 w-3 mr-1" />
                              Add Choice
                            </Button>
                          </div>
                          {editForm.choices.map((choice, index) => (
                            <div key={index} className="flex gap-2 items-center">
                              <RadioGroup
                                value={editForm.correctChoiceIndex.toString()}
                                onValueChange={(value) => setEditForm({ ...editForm, correctChoiceIndex: parseInt(value) })}
                                className="flex items-center"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value={index.toString()} id={`correct-${index}`} />
                                  <Label htmlFor={`correct-${index}`} className="text-sm font-medium text-green-600">
                                    Correct
                                  </Label>
                                </div>
                              </RadioGroup>
                              <Input
                                value={choice}
                                onChange={(e) => updateChoice(index, e.target.value)}
                                placeholder={`Choice ${index + 1}`}
                                className="flex-1"
                              />
                              <Button
                                onClick={() => removeChoice(index)}
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          {editForm.choices.length === 0 && (
                            <p className="text-sm text-muted-foreground">No choices added yet. Click "Add Choice" to add options.</p>
                          )}
                          {editForm.choices.length > 0 && (
                            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                              <div className="flex items-center gap-2 text-sm text-green-700">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">
                                  {editForm.correctChoiceIndex >= 0 
                                    ? `Correct answer: "${editForm.choices[editForm.correctChoiceIndex]}"`
                                    : "Select the correct answer above"
                                  }
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button onClick={handleSaveEdit} size="sm" className="flex-1">
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button onClick={handleCancelEdit} variant="outline" size="sm" className="flex-1">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Read Mode
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">{question.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Type: {question.type}
                          {question.creatorAnswer && (
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              Answer: {question.creatorAnswer}
                            </span>
                          )}
                        </p>
                        {question.choices && question.choices.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground mb-1">Options:</p>
                            <div className="flex flex-wrap gap-1">
                              {question.choices.map((choice: string, index: number) => (
                                <span 
                                  key={index} 
                                  className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${
                                    question.correctChoiceIndex === index 
                                      ? "bg-green-100 text-green-800 border border-green-300" 
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {question.correctChoiceIndex === index && (
                                    <CheckCircle className="h-3 w-3" />
                                  )}
                                  {choice}
                                </span>
                              ))}
                            </div>
                            {question.correctChoiceIndex !== undefined && question.correctChoiceIndex >= 0 && (
                              <div className="mt-2 text-xs text-green-600 font-medium">
                                ✓ Correct answer: {question.choices?.[question.correctChoiceIndex]}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(question)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(question.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {questions.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No guessing questions yet. Add your first one above!</p>
        </div>
      )}
    </div>
  );
}
