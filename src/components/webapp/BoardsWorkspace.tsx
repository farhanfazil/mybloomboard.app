"use client";

import { FolderKanban, Image as ImageIcon, MessageSquare, Plus, Users } from "lucide-react";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";

export function BoardsWorkspace() {
  const { addBoard, boards } = useWorkspace();

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200/65">
            Visual project system
          </p>
          <h2 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Boards that move work.</h2>
          <p className="mt-3 max-w-2xl text-white/45">
            Organize every project, discussion, asset, and next action in a shared visual workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={addBoard}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:scale-[1.02]"
        >
          <Plus className="h-4 w-4" />
          New board
        </button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {boards.map((board) => (
          <article
            key={board.id}
            className={`group min-h-[280px] rounded-[30px] border border-white/10 bg-gradient-to-br ${board.accent} p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20`}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30">
                <FolderKanban className="h-5 w-5 text-white/70" />
              </div>
              <span className="rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/45">
                {board.category}
              </span>
            </div>
            <h3 className="mt-8 text-2xl font-bold">{board.name}</h3>
            <p className="mt-2 text-sm text-white/38">{board.cards} cards · Updated today</p>
            <div className="mt-7">
              <div className="mb-2 flex justify-between text-xs text-white/40">
                <span>Project progress</span>
                <span>{board.progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-black/35">
                <div
                  className="h-full rounded-full bg-white/70 transition-all"
                  style={{ width: `${board.progress}%` }}
                />
              </div>
            </div>
            <div className="mt-7 flex items-center gap-4 text-xs text-white/38">
              <span className="inline-flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" /> 6 comments</span>
              <span className="inline-flex items-center gap-1.5"><ImageIcon className="h-3.5 w-3.5" /> 4 assets</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> 3 members</span>
            </div>
          </article>
        ))}
      </section>

      <section className="rounded-[30px] border border-dashed border-white/15 bg-white/[0.02] p-8 text-center">
        <p className="text-sm font-semibold">Create categories for campaigns, clients, products, or personal goals.</p>
        <button type="button" className="mt-3 text-sm font-bold text-blue-200 hover:text-white">+ New category</button>
      </section>
    </div>
  );
}
