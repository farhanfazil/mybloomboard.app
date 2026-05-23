export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="relative px-6 py-12"
      style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-text-primary">Bloombooard</span>
            <span className="text-sm text-text-muted">Your day. Organised.</span>
          </div>

          {/* Privacy */}
          <div className="flex flex-col gap-1 sm:items-center">
            <p className="text-sm text-text-muted text-center">
              No tracking. No analytics.
            </p>
            <p className="text-sm text-text-muted text-center">
              No data collection.
            </p>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1 sm:items-end">
            <a
              href="mailto:farhan.fazil89@gmail.com"
              className="text-sm text-text-muted hover:text-accent-blue transition-colors"
            >
              farhan.fazil89@gmail.com
            </a>
            <span className="text-sm text-text-muted">Built by Farhan</span>
          </div>
        </div>

        <div
          className="pt-6 flex items-center justify-between"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span className="text-xs text-text-muted">
            © {year} Bloombooard · macOS only · Free forever
          </span>
          <span className="text-xs text-text-muted">
            Made with care, not cloud
          </span>
        </div>
      </div>
    </footer>
  );
}
