"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Check, MailPlus, MoreHorizontal, ShieldCheck, UserRoundPlus, X } from "lucide-react";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type Role = "Owner" | "Manager" | "Member" | "Client";
type MemberStatus = "Active" | "Invited";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: MemberStatus;
};

const storageKey = "bloomboard-phase-two-members";

type CloudTeamMember = {
  id: string;
  display_name: string;
  email: string | null;
  role: string;
  status: string;
};

const defaultMembers: TeamMember[] = [
  {
    id: "owner",
    name: "James",
    email: "owner@mybloomboard.app",
    role: "Owner",
    status: "Active",
  },
  {
    id: "alex",
    name: "Alex Lee",
    email: "alex@mybloomboard.app",
    role: "Manager",
    status: "Active",
  },
  {
    id: "jamie",
    name: "Jamie Morgan",
    email: "jamie@mybloomboard.app",
    role: "Member",
    status: "Active",
  },
  {
    id: "maya",
    name: "Maya Thompson",
    email: "maya@mybloomboard.app",
    role: "Member",
    status: "Invited",
  },
];

const roles: Role[] = ["Owner", "Manager", "Member", "Client"];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function normalizeRole(role: string): Role {
  const value = `${role.slice(0, 1).toUpperCase()}${role.slice(1).toLowerCase()}`;
  return roles.includes(value as Role) ? (value as Role) : "Member";
}

function normalizeStatus(status: string): MemberStatus {
  return status.toLowerCase() === "active" ? "Active" : "Invited";
}

export function TeamWorkspaceClient() {
  const { currentUser, workspaceId } = useWorkspace();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [members, setMembers] = useState<TeamMember[]>(defaultMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [cloudLoading, setCloudLoading] = useState(false);

  useEffect(() => {
    if (workspaceId) return;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      setMembers(JSON.parse(saved) as TeamMember[]);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (workspaceId) return;
    window.localStorage.setItem(storageKey, JSON.stringify(members));
  }, [members, workspaceId]);

  useEffect(() => {
    if (!supabase || !workspaceId || !currentUser) return;

    const db = supabase;
    const targetWorkspaceId = workspaceId;
    const user = currentUser;
    let active = true;

    async function loadMembers() {
      setCloudLoading(true);
      const { data, error } = await db
        .from("team_members")
        .select("id, display_name, email, role, status")
        .eq("workspace_id", targetWorkspaceId)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (!active) return;

      if (error) {
        console.error("Could not load team members", error);
        setNotice("Cloud members could not be loaded. Local preview remains available.");
        setCloudLoading(false);
        return;
      }

      let cloudMembers = (data ?? []) as CloudTeamMember[];
      if (cloudMembers.length === 0) {
        const displayName =
          user.user_metadata?.full_name ??
          user.email?.split("@")[0] ??
          "Workspace owner";
        const owner = {
          workspace_id: targetWorkspaceId,
          user_id: user.id,
          display_name: displayName,
          email: user.email ?? null,
          role: "owner",
          status: "active",
          last_updated_by: user.id,
        };
        const { data: createdOwner, error: ownerError } = await db
          .from("team_members")
          .insert(owner)
          .select("id, display_name, email, role, status")
          .single();

        if (!ownerError && createdOwner) {
          cloudMembers = [createdOwner as CloudTeamMember];
        }
      }

      setMembers(
        cloudMembers.map((member) => ({
          id: member.id,
          name: member.display_name,
          email: member.email ?? "",
          role: normalizeRole(member.role),
          status: normalizeStatus(member.status),
        })),
      );
      setCloudLoading(false);
    }

    void loadMembers();
    return () => {
      active = false;
    };
  }, [currentUser, supabase, workspaceId]);

  const activeCount = useMemo(
    () => members.filter((member) => member.status === "Active").length,
    [members],
  );

  async function inviteMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const role = String(form.get("role") ?? "Member") as Role;

    if (!email) return;

    const name = email
      .split("@")[0]
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => `${part[0]?.toUpperCase() ?? ""}${part.slice(1)}`)
      .join(" ");

    const member: TeamMember = {
      id: crypto.randomUUID(),
      name: name || "Invited member",
      email,
      role,
      status: "Invited",
    };

    if (supabase && workspaceId && currentUser) {
      const { data, error } = await supabase
        .from("team_members")
        .insert({
          id: member.id,
          workspace_id: workspaceId,
          display_name: member.name,
          email,
          role: role.toLowerCase(),
          status: "invited",
          last_updated_by: currentUser.id,
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error("Could not invite team member", error);
        setNotice("The invitation could not be saved. Check your workspace role.");
        return;
      }

      const { error: invitationError } = await supabase
        .from("workspace_invitations")
        .upsert(
          {
            workspace_id: workspaceId,
            email,
            role: role.toLowerCase(),
            status: "pending",
            invited_by: currentUser.id,
          },
          { onConflict: "workspace_id,email" },
        );

      if (invitationError) {
        console.error("Could not create invitation record", invitationError);
      }
    }

    setMembers((current) => [...current, member]);
    setInviteOpen(false);
    setNotice(
      workspaceId
        ? `Invitation saved for ${email}.`
        : `Invitation prepared for ${email} in this browser preview.`,
    );
    event.currentTarget.reset();
  }

  async function updateRole(id: string, role: Role) {
    if (supabase && workspaceId && currentUser) {
      const { error } = await supabase
        .from("team_members")
        .update({
          role: role.toLowerCase(),
          last_updated_by: currentUser.id,
        })
        .eq("id", id)
        .eq("workspace_id", workspaceId);
      if (error) {
        console.error("Could not update team role", error);
        setNotice("The role could not be updated.");
        return;
      }
    }

    setMembers((current) =>
      current.map((member) => (member.id === id ? { ...member, role } : member)),
    );
    setNotice("Member access updated.");
  }

  async function removeMember(id: string) {
    if (supabase && workspaceId && currentUser) {
      const { error } = await supabase
        .from("team_members")
        .update({
          deleted_at: new Date().toISOString(),
          last_updated_by: currentUser.id,
        })
        .eq("id", id)
        .eq("workspace_id", workspaceId);
      if (error) {
        console.error("Could not remove team member", error);
        setNotice("The member could not be removed.");
        return;
      }
    }

    setMembers((current) => current.filter((member) => member.id !== id));
    setNotice(workspaceId ? "Member removed." : "Member removed from the preview workspace.");
  }

  return (
    <div className="rounded-[30px] border border-white/10 bg-black/35 p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
            {cloudLoading ? "Loading cloud members" : "Workspace members"}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <h3 className="text-2xl font-bold">Bloomboard Team</h3>
            <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
              {activeCount} active
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setInviteOpen((current) => !current)}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-blue-50"
        >
          <UserRoundPlus className="h-4 w-4" />
          Invite member
        </button>
      </div>

      {inviteOpen && (
        <form
          onSubmit={inviteMember}
          className="mt-5 grid gap-3 rounded-3xl border border-blue-300/20 bg-blue-400/[0.07] p-4 sm:grid-cols-[1fr_170px_auto]"
        >
          <label className="sr-only" htmlFor="invite-email">
            Email address
          </label>
          <input
            id="invite-email"
            name="email"
            type="email"
            required
            placeholder="teammate@company.com"
            className="h-12 rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-blue-300/45"
          />
          <label className="sr-only" htmlFor="invite-role">
            Role
          </label>
          <select
            id="invite-role"
            name="role"
            defaultValue="Member"
            className="h-12 rounded-2xl border border-white/10 bg-[#10131a] px-4 text-sm text-white outline-none focus:border-blue-300/45"
          >
            {roles
              .filter((role) => role !== "Owner")
              .map((role) => (
                <option key={role}>{role}</option>
              ))}
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-500 px-4 text-sm font-bold transition hover:bg-blue-400"
            >
              <MailPlus className="h-4 w-4" />
              Send
            </button>
            <button
              type="button"
              onClick={() => setInviteOpen(false)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 text-white/60 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Close invitation form"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}

      {notice && (
        <div className="mt-4 flex items-center gap-2 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-100">
          <Check className="h-4 w-4" />
          {notice}
        </div>
      )}

      <div className="mt-5 space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 sm:grid-cols-[minmax(0,1fr)_150px_110px_auto] sm:items-center"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(77,159,255,.35),rgba(124,58,237,.35))] text-sm font-black">
                {initials(member.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold">{member.name}</p>
                <p className="truncate text-sm text-white/42">{member.email}</p>
              </div>
            </div>

            <select
              value={member.role}
              disabled={member.role === "Owner"}
              onChange={(event) => void updateRole(member.id, event.target.value as Role)}
              className="h-10 rounded-xl border border-white/10 bg-[#10131a] px-3 text-sm font-semibold text-white outline-none disabled:cursor-not-allowed disabled:text-white/45"
              aria-label={`Role for ${member.name}`}
            >
              {roles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>

            <span
              className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                member.status === "Active"
                  ? "bg-emerald-400/10 text-emerald-200"
                  : "bg-amber-400/10 text-amber-200"
              }`}
            >
              {member.status}
            </span>

            {member.role === "Owner" ? (
              <ShieldCheck className="h-5 w-5 text-blue-200" aria-label="Workspace owner" />
            ) : (
              <button
                type="button"
                onClick={() => void removeMember(member.id)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/45 transition hover:border-red-300/25 hover:bg-red-400/[0.08] hover:text-red-200"
                aria-label={`Remove ${member.name}`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs leading-5 text-white/30">
        {workspaceId
          ? "Member access and invitations are stored in your synced workspace."
          : "Preview data is saved in this browser. Sign in to sync team access through Supabase."}
      </p>
    </div>
  );
}
