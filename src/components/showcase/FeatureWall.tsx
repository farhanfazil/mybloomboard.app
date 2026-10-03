"use client";

import "./wall.css";
import Showcase from "./Showcase";
import { MARKUP } from "./wall-markup";

const load = () => import("./wall-run.js");

/** Homepage "One app. Everything you need." wall: tiles that show what each feature works with. */
export default function FeatureWall() {
  return <Showcase id="features" markup={MARKUP} className="bbw" load={load} />;
}
