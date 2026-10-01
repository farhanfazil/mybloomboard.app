import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  alternates: { canonical: "/security" },
  title: "Security and data · BloomBoard",
  description: "Where BloomBoard keeps your data, how it is protected, which providers we use, and how to export or delete it.",
};

const SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "Where your data lives",
    body: [
      "Used on its own without an account, BloomBoard keeps your tasks, boards, notes and settings on your computer only.",
      "When you sign in, your data syncs to our database hosted by Supabase on Amazon Web Services in Tokyo, Japan. Team boards, chat and meetings are stored there so everyone on the team sees the same thing.",
      "Files and photos shared in chat are stored with Cloudflare R2 or Supabase Storage.",
    ],
  },
  {
    title: "How it is protected",
    body: [
      "All traffic between the app and our servers is encrypted with TLS. Data in the database and in file storage is encrypted at rest by our hosting providers.",
      "Access is enforced in the database itself with row-level security: a person can only read their own data and the data of teams they belong to. Billing and plan records can only be changed by our payment system, never from the app.",
      "Passwords are handled by Supabase Auth and stored as salted hashes. We never see them. Sign-in codes and email confirmation protect new accounts.",
      "Gmail and Outlook connections use the official Google and Microsoft sign-in. Their access tokens stay on your computer, encrypted with your system keychain, and are never sent to our servers.",
      "The Mac app is signed and notarised by Apple. The Windows app is distributed through the Microsoft Store.",
    ],
  },
  {
    title: "Calls",
    body: [
      "Audio and video calls are carried by LiveKit over encrypted connections. We do not record calls. Live captions use Apple's built-in speech recognition.",
    ],
  },
  {
    title: "AI",
    body: [
      "Bloom AI sends only the text needed for a request to Anthropic's Claude API. Anthropic does not use API data to train its models. AI requests go through our server, which checks your plan; your data is not sold or shared for advertising.",
    ],
  },
  {
    title: "Providers we use",
    body: [
      "Supabase (database, sign-in, storage), Cloudflare (file storage), LiveKit (calls), Anthropic (AI), Polar (payments, merchant of record), Resend (account and invite emails), and Google or Microsoft only if you connect your email or calendar.",
    ],
  },
  {
    title: "Your control",
    body: [
      "Export: Settings, then About, then Export my data saves a copy of everything the app keeps for you.",
      "Delete: Settings, then Account, then Delete account permanently removes your account and synced data. Team owners can remove members at any time.",
      "There is no advertising and no tracking in the app. See our Privacy Policy for details.",
    ],
  },
  {
    title: "For companies",
    body: [
      "Need a security questionnaire answered, a data processing agreement, or a question about hosting? Write to hello@mybloomboard.app and we will reply within two business days.",
      "Report a security issue to support@mybloomboard.app. We take every report seriously and reply quickly.",
    ],
  },
];

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      <header className="mx-auto flex max-w-[1120px] items-center px-5 py-5 md:px-12">
        <Link href="/" className="flex items-center gap-2.5 font-bold">
          <Image src="/email-icon.png" alt="" width={30} height={30} className="rounded-lg" />
          BloomBoard
        </Link>
      </header>
      <main className="mx-auto max-w-[720px] px-5 pb-24 pt-10 md:pt-16">
        <h1 className="text-[34px] font-bold tracking-[-0.03em] md:text-[40px]">Security and your data</h1>
        <p className="mt-2 text-sm text-[#a1a1aa]">Last updated: 30 September 2026</p>
        <div className="mt-10 flex flex-col gap-9">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="text-lg font-bold">{s.title}</h2>
              {s.body.map((p, i) => <p key={i} className="mt-2.5 text-[15.5px] leading-relaxed text-[#c4c4cc]">{p}</p>)}
            </section>
          ))}
        </div>
        <p className="mt-12 text-sm text-[#a1a1aa]">
          See also our <a href="/privacy.html" className="underline">Privacy Policy</a>, <a href="/terms.html" className="underline">Terms of Service</a> and <a href="/refund" className="underline">Refund policy</a>.
        </p>
      </main>
    </div>
  );
}
