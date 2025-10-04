"use client";

import { EditorTemplate } from "./editor-template";

export function RomanticEditor() {
  return (
    <EditorTemplate
      fieldName="romanticSentences"
      placeholder="💕 You are my favorite hello and hardest goodbye"
      emptyMessage="No romantic sentences yet. Add your first one above!"
    />
  );
}
