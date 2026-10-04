/* Reactions under the live demo: a picture with a word, so a tap says
   something. Pictures are the same Microsoft Fluent art the app uses. */
export const DEMO_REACTIONS = [
  { id: "smart",     img: "/chat/emoji/light_bulb.png", label: "Smart" },
  { id: "fast",      img: "/chat/emoji/rocket.png",     label: "Fast" },
  { id: "beautiful", img: "/chat/emoji/sparkles.png",   label: "Beautiful" },
  { id: "teams",     img: "/chat/emoji/handshake.png",  label: "Great for teams" },
  { id: "useful",    img: "/chat/emoji/trophy.png",     label: "Useful" },
] as const;

export type DemoReactionId = (typeof DEMO_REACTIONS)[number]["id"];

export type DemoReactionCounts = Record<DemoReactionId, number>;

export const EMPTY_DEMO_REACTION_COUNTS: DemoReactionCounts = {
  smart: 0,
  fast: 0,
  beautiful: 0,
  teams: 0,
  useful: 0,
};

/* New key: an answer given to the old emoji bar doesn't count as one here. */
export const DEMO_REACTION_STORAGE_KEY = "bloomboard-demo-feel-v2";

export function isDemoReactionId(value: string): value is DemoReactionId {
  return value in EMPTY_DEMO_REACTION_COUNTS;
}
