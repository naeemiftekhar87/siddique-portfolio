"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

const parse = (text: string) => text.split(",").map((s) => s.trim()).filter(Boolean);

/**
 * Comma-separated list field. Keeps the raw text while typing (so commas and
 * spaces aren't swallowed) and reports the parsed, trimmed list to the form.
 */
export function ListInput({
  value,
  onChange,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> & {
  value: string[];
  onChange: (list: string[]) => void;
}) {
  const [text, setText] = useState(value.join(", "));
  // Re-sync when the list changes from outside (e.g. another entry is loaded).
  const [synced, setSynced] = useState(value);
  if (synced !== value) {
    setSynced(value);
    if (parse(text).join("\u0000") !== value.join("\u0000")) setText(value.join(", "));
  }

  return (
    <Input
      {...props}
      value={text}
      onChange={(e) => {
        setText(e.target.value);
        onChange(parse(e.target.value));
      }}
    />
  );
}
