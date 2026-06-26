export const DEMO_REACTIONS = [
  { id: "love",   emoji: "💙", label: "Love" },
  { id: "fire",   emoji: "🔥", label: "Fire" },
  { id: "cheer",  emoji: "👏", label: "Cheer" },
  { id: "rocket", emoji: "🚀", label: "Rocket" },
  { id: "crown",  emoji: "👑", label: "Crown" },
] as const;

export type DemoReactionId = (typeof DEMO_REACTIONS)[number]["id"];

export type DemoReactionCounts = Record<DemoReactionId, number>;

export const EMPTY_DEMO_REACTION_COUNTS: DemoReactionCounts = {
  love: 0,
  fire: 0,
  cheer: 0,
  rocket: 0,
  crown: 0,
};

export const DEMO_REACTION_STORAGE_KEY = "bloomboard-demo-reaction";

export function isDemoReactionId(value: string): value is DemoReactionId {
  return value in EMPTY_DEMO_REACTION_COUNTS;
}
