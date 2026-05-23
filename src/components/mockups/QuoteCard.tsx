"use client";

export default function QuoteCard() {
  return (
    <div
      className="rounded-2xl p-4 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, rgba(10,30,50,0.95) 0%, rgba(20,50,80,0.9) 50%, rgba(10,40,60,0.95) 100%)",
        border: "1px solid rgba(77,159,255,0.15)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(77,159,255,0.12) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />
      <div className="flex items-start justify-between mb-2 relative">
        <span className="text-[9px] font-semibold uppercase tracking-widest text-accent-blue">
          ✦ DAILY REMINDER
        </span>
        <button
          className="w-5 h-5 rounded flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <span className="text-[8px]">⏸</span>
        </button>
      </div>
      <p className="text-[11px] italic text-text-primary leading-relaxed mb-3 relative">
        &ldquo;The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.&rdquo;
      </p>
      <div className="flex items-center justify-between relative">
        <p className="text-[9px]" style={{ color: "#4d9fff" }}>
          — Prophet Muhammad ﷺ — Bukhari
        </p>
        <button
          className="text-[9px] px-2.5 py-1 rounded-lg font-medium flex items-center gap-1 transition-all hover:scale-105"
          style={{
            background: "rgba(77,159,255,0.12)",
            color: "#4d9fff",
            border: "1px solid rgba(77,159,255,0.2)",
          }}
        >
          ↺ Refresh
        </button>
      </div>
    </div>
  );
}
