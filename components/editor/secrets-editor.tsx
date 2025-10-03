"use client";

import { EditorTemplate } from "./editor-template";

export function SecretsEditor() {
  return (
    <EditorTemplate
      fieldName="secrets"
      placeholder="Tell a silly secret your partner doesn't know"
      emptyMessage="No secrets yet. Add your first secret above!"
    />
  );
}
