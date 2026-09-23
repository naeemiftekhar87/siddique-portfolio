type AdminPlaceholderProps = {
  title: string;
  /** The docs/phases.md phase that builds this module. */
  phase: number;
};

/** Temporary content for admin routes until their phase is built. */
export function AdminPlaceholder({ title, phase }: AdminPlaceholderProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl">{title}</h1>
      <p className="mt-2 text-muted-foreground">
        Admin module placeholder, built in Phase {phase}. Authentication and
        route protection arrive in Phase 5.
      </p>
    </div>
  );
}
