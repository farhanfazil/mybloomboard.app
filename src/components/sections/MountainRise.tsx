"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { preload } from "react-dom";

/* Over the pictures: a light veil at the top for the words, clear around the horizon so
   its glow comes through as in the original, and black only at the very bottom, where the
   live demo rises out of it. */
const SHADE = [
  "linear-gradient(to bottom,",
  "rgba(0,0,0,0.18) 0%,",
  "rgba(0,0,0,0.04) 30%,",
  "rgba(0,0,0,0) 50%,",
  "rgba(0,0,0,0.12) 66%,",
  "rgba(0,0,0,0.55) 82%,",
  "rgba(0,0,0,0.9) 93%,",
  "#000000 100%)",
].join(" ");

/**
 * The hero as a little landscape. The sky (hero-sky.jpg) and the words are
 * pinned in place; the mountains (hero-mountains.png, same size and alignment)
 * and everything after them (the live demo) simply scroll up over them, so the
 * words slip behind the hills and the demo follows right below.
 *
 * The movement is pure CSS (a sticky backdrop with the rest of the page laid
 * over it), so it moves exactly with the scroll. As the hills rise, the sky goes
 * fully dark like a sunset and the words dim, then fade away as the demo reaches them: one black layer whose opacity follows the scroll.
 */
const SCENE_SCRIPT =
  "(function(){var r=document.currentScript&&document.currentScript.closest('.bb-scene');if(!r)return;" +
  "var m=r.querySelectorAll('img[data-scene]'),d=0;function s(){if(!d){d=1;r.setAttribute('data-scene','in')}}" +
  "function c(){for(var i=0;i<m.length;i++)if(!(m[i].complete&&m[i].naturalWidth))return;s()}" +
  "for(var i=0;i<m.length;i++)m[i].addEventListener('load',c);c();setTimeout(s,2500)})()";

/* The hero pictures, ready-made at three widths (no resizing per visit) and cached for a
   year (public/_headers). A 48 px blurred copy of each sits in the page itself, so the horizon
   shows at the very first paint and sharpens when the real pictures arrive. Re-make them
   with new names (hero-v4/…) whenever the pictures change. The blurred copies fade out
   completely once the real pictures are in (globals.css .bb-scene-tiny), so they never
   soften the finished scene. */
const HERO = "/backgrounds/hero-v3/";
/* Large screens get the original pictures themselves: the sky JPG untouched and the
   mountains as lossless WebP (every visible pixel identical to the PNG). Phones and small
   windows get high-quality smaller copies. */
const SKY_FULL = HERO + "sky-1920.jpg", MOUNTAINS_FULL = HERO + "mountains-1920.webp";
const SKY_SET = `${HERO}sky-828.webp 828w, ${HERO}sky-1280.webp 1280w, ${SKY_FULL} 1920w`;
const MOUNTAINS_SET = `${HERO}mountains-828.webp 828w, ${HERO}mountains-1280.webp 1280w, ${MOUNTAINS_FULL} 1920w`;
const SKY_TINY = "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAACwBQCdASowABsAPtFWn0uoJKKhsAqpABoJZQCuT4CDTq2P8w13Iv/jkEOF+4naJ4ZO5FSk6AAA/vaCeMsSi5KhG0nAbYUYvx37yegyj5gXjkqJ54qszvgA8BM1YpT3AkqYPmTLZ4sTst74ls5fwzQIDh59WfqXukub7iCHcgiT45K5HYuVxIoA";
const MOUNTAINS_TINY = "data:image/webp;base64,UklGRlQBAABXRUJQVlA4WAoAAAAQAAAALwAAGgAAQUxQSF4AAAARb6CgbSQUvwNmiIgAIX5SNwzhBZNa254wKhBgJiHCxiPB7gZT4vA/GThUIAG8af7pQEb0fwK03/MaTEXA6isJAGDwZeyIgF3qIuHxQrCqc50qRgLp3bK3E0rvB18SVlA4INAAAACwBQCdASowABsAPtFYokuoJSMhtVQIAQAaCWM7ggnw8ThGLCzxWgwNPAU0fTNPrT9mRmz9fgAA/vm88W0PVqX3Gh7dH4bXPNf2DyW0HS7uMDlqymATZAcBZAp18ZrNOo/SMYZ8O1CftIv8ERcGSqe6YsKQBqOaLbFZz5R5LedvP8Kz6BkFL3yBTBYCgnegYqT0RsCBXgMkg9sP4iWltwUdptRvPc3YDssddUj856H8yZh2dknAZ92JTWohJXQOGYS6jZsM8+U1fEid2NPzMAAA";
const tiny = (src: string): CSSProperties => ({
  backgroundImage: `url(${src})`, backgroundSize: "cover", backgroundPosition: "center",
  filter: "blur(14px)", transform: "scale(1.08)",
});

/** How far the faster part has climbed ahead after scrolling y: eases out, so
 *  the speed glides back to normal with no kink. Shared with SnapPoints. */
export function liftAt(y: number, max: number, span: number) {
  const u = Math.min(1, Math.max(0, y / span));
  return max * (1 - (1 - u) * (1 - u));
}

export default function MountainRise({ words, children }: { words: ReactNode; children: ReactNode }) {
  /* start both pictures in the page's first request (a <link rel=preload> in the head) */
  preload(SKY_FULL, { as: "image", imageSrcSet: SKY_SET, imageSizes: "100vw", fetchPriority: "high" });
  preload(MOUNTAINS_FULL, { as: "image", imageSrcSet: MOUNTAINS_SET, imageSizes: "100vw", fetchPriority: "high" });
  const duskRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const restRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  /* The sky and the hills appear together, in one soft fade, once both have
     loaded (never one after the other). The words show straight away. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const imgs = Array.from(root.querySelectorAll<HTMLImageElement>("img[data-scene]"));
    let shown = false;
    const show = () => { if (!shown) { shown = true; root.dataset.scene = "in"; } };
    const check = () => { if (imgs.every((i) => i.complete && i.naturalWidth > 0)) show(); };
    imgs.forEach((i) => i.addEventListener("load", check));
    check();
    const late = window.setTimeout(show, 2500);
    return () => { imgs.forEach((i) => i.removeEventListener("load", check)); window.clearTimeout(late); };
  }, []);

  useEffect(() => {
    const dusk = duskRef.current, wordsEl = wordsRef.current, rest = restRef.current;
    if (!dusk || !wordsEl || !rest) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* Phones: the hills and demo just scroll (pure CSS, so nothing can lag
       behind the finger), and the screen height is measured once, so the
       address bar sliding in and out never makes anything jump. */
    const phone = window.matchMedia("(max-width: 639px)").matches;
    let vh = window.innerHeight, lastW = window.innerWidth;
    let queued = false, maxLift = 0, span = 1;
    /* The live demo climbs faster than the hills: about twice the scroll speed
       at first, easing back to normal speed after three quarters of a screen,
       by which point it has gained almost half a screen. So one scroll brings it
       up ahead of the hills. The page after it is pulled up by the same amount,
       so there's no gap below it. Only a translate (no resizing), so it stays smooth. */
    const size = () => {
      maxLift = reduce || phone ? 0 : Math.round(vh * 0.45);
      span = Math.max(1, Math.round(vh * 0.75));
      rest.style.marginBottom = -maxLift + "px";
      /* SnapPoints needs to know how this part moves to land on it exactly */
      rest.dataset.liftMax = String(maxLift);
      rest.dataset.liftSpan = String(span);
    };
    const update = () => {
      queued = false;
      const lift = liftAt(window.scrollY, maxLift, span);
      rest.style.transform = lift ? `translate3d(0,${(-lift).toFixed(1)}px,0)` : "";
      /* like a sunset: the sky is completely black by the time the hills reach
         the buttons (about a quarter of a screen of scrolling); the words dim
         a little */
      const t = Math.min(1, Math.max(0, window.scrollY / (vh * 0.24)));
      const e = t * t * (3 - 2 * t);
      dusk.style.opacity = e.toFixed(3);
      /* then, as the demo climbs up to them, the words fade away completely */
      const g = Math.min(1, Math.max(0, (window.scrollY - vh * 0.2) / (vh * 0.18)));
      wordsEl.style.opacity = ((1 - e * 0.25) * (1 - g * g * (3 - 2 * g))).toFixed(3);
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    const onResize = () => {
      if (phone && window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      vh = window.innerHeight;
      size();
      onScroll();
    };
    size();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={rootRef} className="bb-scene relative" suppressHydrationWarning>
      {/* backdrop: the sky and the words, held in place */}
      <div className="sticky top-0 z-0 h-[100svh] overflow-hidden">
        <div aria-hidden className="bb-scene-tiny pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute inset-0" style={tiny(SKY_TINY)} />
        </div>
        <div aria-hidden className="bb-scene-part pointer-events-none absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-scene srcSet={SKY_SET} sizes="100vw" src={SKY_FULL} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: SHADE }} />
        {/* dusk: the sky goes dark as the hills come up (under the words) */}
        <div ref={duskRef} aria-hidden className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0, willChange: "opacity" }} />
        <div ref={wordsRef} className="relative" style={{ willChange: "opacity" }}>{words}</div>
      </div>

      {/* over it: the hills, laid exactly on the sky, then the page that follows */}
      {/* clicks pass through the see-through sky part to the buttons underneath */}
      {/* flow-root: the demo's negative bottom margin (it climbs ahead) must stay inside
          this box; otherwise the box, and with it the pinned sky, reached past the hero
          and its dusk layer covered the next section's heading */}
      <div className="pointer-events-none relative flow-root" style={{ marginTop: "-100svh" }}>
        <div aria-hidden className="pointer-events-none relative h-[100svh] overflow-hidden">
          <div className="bb-scene-tiny absolute inset-0">
            <div className="absolute inset-0" style={tiny(MOUNTAINS_TINY)} />
          </div>
        </div>
        <div aria-hidden className="bb-scene-part pointer-events-none absolute inset-x-0 top-0 h-[100svh]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img data-scene srcSet={MOUNTAINS_SET} sizes="100vw" src={MOUNTAINS_FULL} alt="" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
          <div
            className="absolute inset-0"
            style={{
              background: SHADE,
              WebkitMaskImage: "url(/backgrounds/hero-mountains-mask.webp)", maskImage: "url(/backgrounds/hero-mountains-mask.webp)",
              WebkitMaskSize: "cover", maskSize: "cover", WebkitMaskPosition: "center", maskPosition: "center",
            }}
          />
        </div>
        {/* Shows the scene as soon as both pictures are in, without waiting for the
            page's scripts to start (that took seconds on slow phones). The effect
            above does the same once React runs, in case this one can't. */}
        <script dangerouslySetInnerHTML={{ __html: SCENE_SCRIPT }} />
        <div
          ref={restRef}
          className="pointer-events-auto relative z-[45]"
          /* fades in from clear at the top, so climbing over the hills never shows a hard edge;
             above the spotlight's shade (z 44), which darkens everything else */
          style={{ willChange: "transform", background: "linear-gradient(to bottom, rgba(0,0,0,0) 0, #000 32vh)" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
