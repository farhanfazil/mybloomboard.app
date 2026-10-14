/**
 * What real teams say about BloomBoard, shown on the home page under the features
 * (src/components/sections/Proof.tsx). The section stays hidden while this is empty.
 *
 * Only real quotes from real people who agreed to be quoted, in their own words.
 * Never invent or "improve" one. A photo is optional (put it in public/proof/).
 */
export type ProofQuote = {
  quote: string;
  name: string;
  /** e.g. "Design lead" */
  role: string;
  /** the team or company, e.g. "Northwind Studio" */
  team: string;
  /** e.g. "/proof/jane.jpg" */
  photo?: string;
};

export const QUOTES: ProofQuote[] = [];

/** A short line above the quotes, e.g. "Teams that moved to BloomBoard". */
export const PROOF_TITLE = "From teams using BloomBoard";
