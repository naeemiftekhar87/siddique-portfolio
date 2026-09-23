import Link from "next/link";

// Minimal 404. The full design (path in a code tag, Go Back, quick links)
// is a Phase 1 task.
export default function NotFound() {
  return (
    <main id="main" className="flex-1">
      <section className="hero-bg">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="hero-label text-xs">404</p>
          <h1 className="mt-3 text-4xl sm:text-5xl">Page not found</h1>
          <p className="text-soft mt-4 max-w-xl">
            The page you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block text-cyan-light underline-offset-4 hover:underline"
          >
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
