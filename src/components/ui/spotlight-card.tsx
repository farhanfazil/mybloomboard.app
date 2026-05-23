import React, { useEffect, useRef, ReactNode, CSSProperties } from 'react';

interface GlowCardProps {
  children?: ReactNode;
  className?: string;
  /** Extra inline styles — CSS custom-property overrides go here too */
  style?: CSSProperties;
  glowColor?: 'blue' | 'purple' | 'green' | 'red' | 'orange';
  size?: 'sm' | 'md' | 'lg';
  width?: string | number;
  height?: string | number;
  /** When true, ignores size prop and uses width/height/className for sizing */
  customSize?: boolean;
  /** Spotlight radius in px (default 200). Increase for larger cards. */
  spotSize?: number;
}

const glowColorMap = {
  blue:   { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green:  { base: 120, spread: 200 },
  red:    { base: 0,   spread: 200 },
  orange: { base: 30,  spread: 200 },
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96',
};

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = '',
  style: styleProp,
  glowColor = 'blue',
  size = 'md',
  width,
  height,
  customSize = false,
  spotSize = 200,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    /**
     * Use element-relative coordinates so the spotlight works correctly
     * even inside CSS 3-D transformed parents (rotateX / perspective).
     * background-attachment:fixed breaks inside any transform context —
     * getBoundingClientRect() gives the true on-screen position instead.
     */
    const syncPointer = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const rx = (e.clientX - rect.left).toFixed(2);
      const ry = (e.clientY - rect.top).toFixed(2);
      const xp = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      card.style.setProperty('--rx',  rx);
      card.style.setProperty('--ry',  ry);
      card.style.setProperty('--xp',  xp.toFixed(2));
    };

    document.addEventListener('pointermove', syncPointer);
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor];

  const inlineStyle: React.CSSProperties & Record<string, string | number> = {
    // ── CSS custom properties ────────────────────────────────────────────────
    '--base':    base,
    '--spread':  spread,
    '--radius':  '14',
    '--border':  '3',
    '--backdrop':      'hsl(0 0% 60% / 0.12)',
    '--backup-border': 'var(--backdrop)',
    '--size':    String(spotSize),
    '--outer':   '1',
    '--border-size':    'calc(var(--border, 2) * 1px)',
    '--spotlight-size': 'calc(var(--size, 150) * 1px)',
    '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',

    // ── Surface spotlight (card face) ─────────────────────────────────────
    // Coordinates are element-relative — no background-attachment:fixed needed
    backgroundImage: `radial-gradient(
      var(--spotlight-size) var(--spotlight-size) at
      calc(var(--rx, 50%) * 1px) calc(var(--ry, 50%) * 1px),
      hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.1)),
      transparent
    )`,
    backgroundColor:    'var(--backdrop, transparent)',
    backgroundSize:     '100% 100%',
    backgroundPosition: '0 0',
    border:    'var(--border-size) solid var(--backup-border)',
    position:  'relative',
    touchAction: 'none' as const,

    // ── Consumer overrides spread last (highest priority) ────────────────
    ...styleProp,
  };

  if (width  !== undefined) inlineStyle.width  = typeof width  === 'number' ? `${width}px`  : width;
  if (height !== undefined) inlineStyle.height = typeof height === 'number' ? `${height}px` : height;

  /**
   * Injected CSS — element-relative coords (--rx / --ry) on ::before / ::after.
   * background-attachment: fixed intentionally OMITTED — it breaks inside any
   * CSS transform / perspective stacking context.
   */
  const beforeAfterStyles = `
    [data-glow]::before,
    [data-glow]::after {
      pointer-events: none;
      content: "";
      position: absolute;
      inset: calc(var(--border-size) * -1);
      border: var(--border-size) solid transparent;
      border-radius: calc(var(--radius) * 1px);
      background-size: 100% 100%;
      background-repeat: no-repeat;
      background-position: 0 0;
      mask: linear-gradient(transparent, transparent), linear-gradient(white, white);
      mask-clip: padding-box, border-box;
      mask-composite: intersect;
    }

    /* Cursor spotlight — bright hue streak on border */
    [data-glow]::before {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at
        calc(var(--rx, 50%) * 1px) calc(var(--ry, 50%) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--border-spot-opacity, 1)),
        transparent 100%
      );
      filter: brightness(2);
    }

    /* White hot centre — tighter radius */
    [data-glow]::after {
      background-image: radial-gradient(
        calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at
        calc(var(--rx, 50%) * 1px) calc(var(--ry, 50%) * 1px),
        hsl(0 100% 100% / var(--border-light-opacity, 1)),
        transparent 100%
      );
    }

    /* Inner glow-bloom overlay — blurred version of the border spotlight */
    [data-glow] [data-glow] {
      position: absolute;
      inset: 0;
      will-change: filter;
      opacity: var(--outer, 1);
      border-radius: calc(var(--radius) * 1px);
      border-width: calc(var(--border-size) * 20);
      filter: blur(calc(var(--border-size) * 10));
      background: none;
      pointer-events: none;
      border: none;
    }

    [data-glow] > [data-glow]::before {
      inset: -10px;
      border-width: 10px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: beforeAfterStyles }} />
      <div
        ref={cardRef}
        data-glow
        style={inlineStyle}
        className={`
          ${!customSize ? sizeMap[size] : ''}
          ${!customSize ? 'aspect-[3/4]' : ''}
          rounded-2xl relative grid grid-rows-[1fr_auto]
          shadow-[0_1rem_2rem_-1rem_black]
          p-4 gap-4 backdrop-blur-[5px]
          ${className}
        `}
      >
        <div data-glow />
        {children}
      </div>
    </>
  );
};

export { GlowCard };
