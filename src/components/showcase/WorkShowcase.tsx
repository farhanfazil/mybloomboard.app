"use client";

import "./work.css";
import Showcase from "./Showcase";
import { MARKUP } from "./work-markup";

const load = () => import("./work-run.js");

/** The /work page body: Tasks and Boards, side by side. */
export default function WorkShowcase() {
  return <Showcase markup={MARKUP} className="bbk" load={load} />;
}
