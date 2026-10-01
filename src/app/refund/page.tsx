import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/refund" },
  title: "Refund policy · BloomBoard",
  description: "How trials, cancellations and refunds work for BloomBoard plans.",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Free trial",
    body: [
      "Bloom starts with a 7-day free trial and Team with a 14-day free trial. If you start the trial on mybloomboard.app, no card is needed. If you do nothing, you move to the free plan when the trial ends and keep your tasks.",
    ],
  },
  {
    title: "Cancel any time",
    body: [
      "You can cancel from the app (Settings, then Account, then Manage subscription) or from the link in your receipt email. Your plan stays active until the end of the period you paid for, and you are not charged again.",
    ],
  },
  {
    title: "Refunds",
    body: [
      "If BloomBoard is not right for you, write to support@mybloomboard.app within 14 days of your first payment and we will refund it in full.",
      "The same applies within 14 days of a yearly renewal. Monthly renewals are not refunded, but you can cancel at any time so you are not charged for the next month.",
      "For Team plans, removing seats applies from your next billing date. If you were charged for seats you did not use, write to us and we will sort it out.",
    ],
  },
  {
    title: "Who handles payments",
    body: [
      "Payments are processed by Polar (polar.sh), our merchant of record. Your receipt comes from Polar, and refunds go back to the card or method you paid with, usually within 5 to 10 business days.",
      "If you live in the EU or UK, you also have the statutory right to withdraw within 14 days of buying. This policy never limits your legal rights.",
    ],
  },
  {
    title: "Contact",
    body: ["MyBloomBoard, Dubai, United Arab Emirates.", "support@mybloomboard.app. We answer within two business days."],
  },
];

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <header className="mx-auto flex max-w-[1120px] items-center px-5 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <Image src="/email-icon.png" alt="" width={30} height={30} className="rounded-lg" />
          BloomBoard
        </Link>
      </header>
      <main className="mx-auto max-w-[720px] px-5 pb-24 pt-10 md:pt-16">
        <h1 className="text-[34px] font-bold tracking-[-0.03em] md:text-[40px]">Refund policy</h1>
        <p className="mt-2 text-sm text-[#a1a1aa]">Last updated: 29 September 2026</p>
        <div className="mt-10 flex flex-col gap-9">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold">{s.title}</h2>
              {s.body.map((p, i) => <p key={i} className="mt-2.5 text-[15.5px] leading-relaxed text-[#c4c4cc]">{p}</p>)}
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-[#a1a1aa]">
          See also our <a href="/terms.html" className="underline">Terms of Service</a> and <a href="/privacy.html" className="underline">Privacy Policy</a>.
        </p>
      </main>
    </div>
  );
}
