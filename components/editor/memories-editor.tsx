"use client";

import { EditorTemplate } from "./editor-template";

export function MemoriesEditor() {
  return (
    <EditorTemplate
      fieldName="memories"
      placeholder="💭 Describe our most unforgettable date"
      emptyMessage="No memories yet. Add your first memory prompt above!"
    />
  );
}
