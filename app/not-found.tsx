export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-32 text-center">
      <p className="text-6xl mb-6">🚀</p>
      <h1 className="text-[28px] font-bold mb-3 gradient-text">Seite nicht gefunden</h1>
      <p className="text-[15px] mb-8" style={{ color: 'var(--color-muted)' }}>
        Diese Landing Page existiert nicht oder wurde noch nicht generiert.
      </p>
      <a href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold no-underline"
        style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#a78bfa' }}>
        ← Zur Übersicht
      </a>
    </div>
  );
}
