import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[var(--bg)] text-[var(--ink)]">
      <div className="max-w-2xl w-full p-8 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-panel)] shadow-sm space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight font-[family-name:var(--font-display)]">
            Stoker
          </h1>
          <p className="text-[var(--ink-2)] text-base">
            Operations platform for boiler-rental and biofuel-supply logistics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <Link
            href="/dashboard"
            className="p-5 border border-[var(--line)] rounded-[var(--radius-card)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors block"
          >
            <h2 className="font-semibold text-lg text-[var(--primary)] font-[family-name:var(--font-display)]">
              Console
            </h2>
            <p className="text-sm text-[var(--ink-2)] mt-1">
              Head-office web application for operations, finance, and logistics.
            </p>
          </Link>

          <Link
            href="/f/home"
            className="p-5 border border-[var(--line)] rounded-[var(--radius-card)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors block"
          >
            <h2 className="font-semibold text-lg text-[var(--primary)] font-[family-name:var(--font-display)]">
              Field
            </h2>
            <p className="text-sm text-[var(--ink-2)] mt-1">
              Mobile-first PWA for site supervisors and operators.
            </p>
          </Link>

          <Link
            href="/simulator"
            className="p-5 border border-[var(--line)] rounded-[var(--radius-card)] hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] transition-colors block"
          >
            <h2 className="font-semibold text-lg text-[var(--primary)] font-[family-name:var(--font-display)]">
              Simulator
            </h2>
            <p className="text-sm text-[var(--ink-2)] mt-1">
              Virtual phone frames and live event tracing pipe.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
