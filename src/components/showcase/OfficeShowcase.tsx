"use client";

import "./office.css";
import Showcase from "./Showcase";
import { MARKUP } from "./office-markup";

const load = () => import("./office-run.js");

/** The /office page body: typing headline, the office film and the feature clips. */
export default function OfficeShowcase() {
  return <Showcase markup={MARKUP} className="bbo" load={load} />;
}
