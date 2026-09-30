"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

// Mirrors urlSchema / linkSchema in lib/data/schemas.ts.
const isUrl = (v: string) => /^https?:\/\//i.test(v);
const isPath = (v: string) => /^\/(?![\/\\])/.test(v);
// "www.example.com/x" or "example.com": a web address typed without its scheme.
const looksLikeHost = (v: string) => /^(?:[a-z0-9-]+\.)+[a-z]{2,}(?:[/:?#]|$)/i.test(v);

/**
 * Link field. Keeps exactly what the owner types (spaces and slashes are never
 * rewritten mid-typing, so the caret can't jump) and reports the trimmed value.
 * On blur it trims, adds a missing "https://" to a bare web address, and shows
 * a hint when the value isn't a link the server will accept.
 *
 * `allowPath` also accepts a site path such as /about.
 */
export function UrlInput({
  value,
  onChange,
  allowPath = false,
  wrapperClassName = "w-full min-w-0",
  onBlur,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "value" | "onChange" | "type"> & {
  value: string;
  onChange: (value: string) => void;
  allowPath?: boolean;
  wrapperClassName?: string;
}) {
  const [text, setText] = useState(value);
  const [synced, setSynced] = useState(value);
  const [touched, setTouched] = useState(false);
  // Re-sync when the value changes from outside (another entry loaded, media picked, reset).
  if (synced !== value) {
    setSynced(value);
    if (text.trim() !== value) setText(value);
  }

  const report = (next: string) => {
    setSynced(next);
    onChange(next);
  };

  const trimmed = text.trim();
  const valid = trimmed === "" || isUrl(trimmed) || (allowPath && isPath(trimmed));
  const showError = touched && !valid;
  const errorId = props.id ? `${props.id}-url-error` : undefined;

  return (
    <div className={wrapperClassName}>
      <Input
        variant="admin-field"
        {...props}
        // A text field (not type="url"): the browser's URL sanitising fights
        // React's controlled value and moves the caret while typing.
        type="text"
        inputMode="url"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        value={text}
        aria-invalid={showError || undefined}
        aria-describedby={showError ? errorId : props["aria-describedby"]}
        onChange={(e) => {
          setText(e.target.value);
          report(e.target.value.trim());
        }}
        onBlur={(e) => {
          let next = text.trim();
          if (next && !isUrl(next) && !(allowPath && isPath(next)) && looksLikeHost(next)) next = `https://${next}`;
          setText(next);
          if (next !== value) report(next);
          setTouched(true);
          onBlur?.(e);
        }}
      />
      {showError && (
        <p id={errorId} className="text-red-400 text-xs mt-1" role="alert">
          {allowPath ? "Start with https:// for another website, or / for a page on this site (e.g. /about)." : "Start the link with https://"}
        </p>
      )}
    </div>
  );
}
