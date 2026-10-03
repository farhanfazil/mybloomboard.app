"use client";

import "./handover.css";
import Showcase from "./Showcase";
import { MARKUP } from "./handover-markup";

const load = () => import("./handover-run.js");

/** The /handover page body: typing headline, the hand-over film and the feature clips. */
export default function HandoverShowcase() {
  return <Showcase markup={MARKUP} className="bbh" load={load} />;
}
