import Image from "next/image";
import Link from "next/link";

/**
 * Home page: the live office as a see-through glass office (the same picture as the
 * share image, made with Higgsfield; source in scripts/brand). A full-width section
 * of its own in the picture's own navy, so the office floats in one continuous space
 * with nothing cropped (public/office/glass-office.jpg has navy room around it).
 */
const NAVY = "#0a223a"; /* the picture's own background colour */

export default function GlassOffice() {
  return (
    <section aria-labelledby="glass-office-title" className="relative overflow-hidden" style={{ background: NAVY }}>
      <div className="mx-auto grid max-w-[1400px] items-center gap-6 px-6 pb-4 pt-20 sm:px-10 md:min-h-[88vh] md:grid-cols-[minmax(0,6fr)_minmax(0,7fr)] md:gap-0 md:py-24 lg:px-16">
        <div className="relative z-10 md:pr-6">
          <h2
            id="glass-office-title"
            className="font-bold tracking-tight text-white"
            style={{ fontSize: "clamp(2.2rem, 4.2vw, 4rem)", lineHeight: 1.04 }}
          >
            <span className="md:whitespace-nowrap">Your whole team,</span>
            <br />
            <span className="md:whitespace-nowrap">one open office.</span>
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-white/75 sm:text-xl">
            Glass walls, so the whole team can see who is meeting, who is free and what is moving. Knock, walk in
            or pass a task across the room. Together in seconds, wherever everyone is.
          </p>
          <Link
            href="/office"
            className="mt-9 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#0a0f1c] transition-colors hover:bg-white/90"
          >
            Step inside the office
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>

        {/* the whole office, never cropped; its edges melt into the section's navy */}
        <div className="relative -mx-6 sm:mx-0 md:-mr-10 lg:-mr-16">
          <Image
            src="/office/glass-office.jpg"
            alt="A see-through glass office where teammates meet, chat and pass tasks to each other"
            width={2048}
            height={1640}
            sizes="(max-width: 768px) 100vw, 60vw"
            quality={84}
            className="h-auto w-full"
            style={{
              WebkitMaskImage: "linear-gradient(90deg, transparent 0, #000 14%)",
              maskImage: "linear-gradient(90deg, transparent 0, #000 14%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
