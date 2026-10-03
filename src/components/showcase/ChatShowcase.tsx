"use client";

import "./chat.css";
import Showcase from "./Showcase";
import { MARKUP } from "./chat-markup";

const load = () => import("./chat-run.js");

/** The /chat page body: an interactive chat playground and the little scenes. */
export default function ChatShowcase() {
  return <Showcase markup={MARKUP} className="bbc" load={load} />;
}
