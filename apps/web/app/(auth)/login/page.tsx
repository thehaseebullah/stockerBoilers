export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-[var(--bg)] text-[var(--ink)]">
      <div className="max-w-md w-full p-8 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-panel)] shadow-sm space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-display)]">
            Sign in to Stoker
          </h1>
          <p className="text-sm text-[var(--ink-2)] mt-1">
            Head office and operations login
          </p>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--ink)] mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full h-10 px-3 bg-[var(--surface)] border border-[var(--line-strong)] rounded-[var(--radius-control)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--ink)] mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full h-10 px-3 bg-[var(--surface)] border border-[var(--line-strong)] rounded-[var(--radius-control)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--focus)]"
            />
          </div>
          <button
            type="submit"
            className="w-full h-10 bg-[var(--primary)] text-[var(--ink-inverse)] font-medium rounded-[var(--radius-control)] text-sm hover:bg-[var(--primary-hover)] transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
