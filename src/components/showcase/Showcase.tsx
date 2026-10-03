"use client";

import { useEffect, useRef } from "react";

/**
 * Renders a generated showcase (static markup + a script that animates it) and
 * resets the markup on cleanup, so a remount starts from a clean copy.
 */
export default function Showcase({
  markup,
  className,
  load,
  id,
}: {
  markup: string;
  className: string;
  load: () => Promise<{ run: (root: HTMLElement) => () => void }>;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    load().then((m) => {
      if (!cancelled) stop = m.run(root);
    });
    return () => {
      cancelled = true;
      stop?.();
      root.innerHTML = markup;
    };
  }, [markup, load]);

  return <div id={id} ref={ref} className={className} dangerouslySetInnerHTML={{ __html: markup }} />;
}
