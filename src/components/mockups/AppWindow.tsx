"use client";

import StatsGrid from "./StatsGrid";
import StreakCard from "./StreakCard";
import EventsPanel from "./EventsPanel";
import HydrationCard from "./HydrationCard";
import QuoteCard from "./QuoteCard";
import MilestoneTimeline from "./MilestoneTimeline";
import SearchBar from "./SearchBar";
import TaskList from "./TaskList";

export default function AppWindow() {
  return (
    <div
      className="relative rounded-2xl overflow-hidden select-none"
      style={{
        width: 880,
        height: 580,
        background: "#0a1520",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
      }}
    >
      {/* Title bar */}
      <div
        className="flex items-center px-4 gap-3 flex-shrink-0"
        style={{
          height: 36,
          background: "rgba(10, 18, 30, 0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <span className="text-[11px] text-text-muted font-medium mx-auto">Bloombooard</span>
      </div>

      {/* Content */}
      <div className="flex" style={{ height: "calc(100% - 36px)" }}>
        {/* Sidebar */}
        <div
          className="flex flex-col gap-2.5 p-3 overflow-hidden flex-shrink-0"
          style={{
            width: 240,
            background: "rgba(8, 15, 25, 0.95)",
            borderRight: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* Time & Date */}
          <div className="px-1 pt-1">
            <p className="text-[18px] font-bold text-text-primary leading-none">04:12 PM</p>
            <p className="text-[9px] text-text-muted mt-0.5">Good afternoon, <span className="text-text-primary font-semibold">Farhan.</span></p>
            <p className="text-[8px] font-semibold uppercase tracking-widest text-text-muted mt-1">SATURDAY</p>
            <p className="text-[11px] font-bold text-text-primary">May 16, 2026</p>
          </div>

          <div className="text-[8px] font-semibold uppercase tracking-widest text-text-muted px-1">OVERVIEW</div>
          <StatsGrid compact />

          <EventsPanel compact />
          <HydrationCard compact />
          <StreakCard compact />
        </div>

        {/* Main area */}
        <div
          className="flex flex-col gap-2.5 p-3 flex-1 overflow-hidden"
          style={{ background: "rgba(10, 18, 30, 0.8)" }}
        >
          <QuoteCard />
          <MilestoneTimeline compact />
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[12px] font-bold text-text-primary">Tasks</span>
              <div className="flex gap-1.5">
                <button
                  className="text-[9px] px-2 py-0.5 rounded-lg"
                  style={{ background: "rgba(255,255,255,0.06)", color: "#607080" }}
                >
                  ○ Projects
                </button>
                <button
                  className="text-[9px] px-2 py-0.5 rounded-lg font-medium"
                  style={{ background: "#4d9fff", color: "white" }}
                >
                  + Add Task
                </button>
              </div>
            </div>
            <SearchBar compact />
            <div className="mt-2">
              <TaskList size="sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
