"use client";

import type { DownloadChoice } from "@/lib/downloads";

export function PlatformIcon({ icon, size = 16 }: { icon: DownloadChoice["icon"]; size?: number }) {
  if (icon === "windows") {
    return (
      <svg width={size - 2} height={size - 2} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M0 3.45 9.83 2.1v9.48H0V3.45Zm11.03-1.51L24 0v11.58H11.03V1.94ZM0 12.42h9.83v9.48L0 20.55v-8.13Zm11.03 0H24V24l-12.97-1.83v-9.75Z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

/** The main download button: the visitor's own system. */
export function DownloadButton({ choice, className = "" }: { choice: DownloadChoice; className?: string }) {
  return (
    <a
      href={choice.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-lg bg-white font-semibold text-black transition-colors hover:bg-white/90 ${className}`}
    >
      <PlatformIcon icon={choice.icon} />
      {choice.label}
    </a>
  );
}

/** "Also available for Windows" under the buttons, plus an optional short note. */
export function AlsoAvailable({ choice, note, className = "" }: { choice: DownloadChoice | null; note?: string | null; className?: string }) {
  if (!choice && !note) return null;
  const name = choice ? choice.label.replace(/^Download (for|on) (the )?/, "") : "";
  return (
    <p className={`text-sm text-white/60 ${className}`}>
      {note ? <span>{note} </span> : null}
      {choice ? (
        <>
          Also available for{" "}
          <a
            href={choice.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-white/85 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white hover:decoration-white/70"
          >
            <PlatformIcon icon={choice.icon} size={13} />
            {name}
          </a>
        </>
      ) : null}
    </p>
  );
}
