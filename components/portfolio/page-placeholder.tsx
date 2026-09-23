type PagePlaceholderProps = {
  title: string;
  /** The docs/phases.md phase that builds this page. */
  phase: number;
  detail?: string;
};

/** Temporary hero shown on public routes until their phase is built. */
export function PagePlaceholder({ title, phase, detail }: PagePlaceholderProps) {
  return (
    <section className="hero-bg">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="hero-label text-xs">Under construction</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{title}</h1>
        <p className="text-soft mt-4 max-w-xl">
          This page is a placeholder. Its content is built in Phase {phase}.
        </p>
        {detail ? (
          <p className="font-data text-muted mt-2 text-sm">{detail}</p>
        ) : null}
      </div>
    </section>
  );
}
