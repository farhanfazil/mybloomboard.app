"use client";

import type { User } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export type WorkspaceTask = {
  id: string;
  title: string;
  project: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  done: boolean;
  accent: string;
};

export type WorkspaceBoard = {
  id: string;
  name: string;
  category: string;
  cards: number;
  progress: number;
  accent: string;
};

export type WorkspaceReminder = {
  id: string;
  title: string;
  schedule: string;
  kind: "Reminder" | "Meeting";
  completed: boolean;
};

export type WorkspaceSyncStatus =
  | "local"
  | "connecting"
  | "syncing"
  | "synced"
  | "error";

type CloudTaskRow = {
  id: string;
  title: string;
  project: string | null;
  due_label: string | null;
  priority: string | null;
  status: string;
  accent: string | null;
};

type CloudBoardRow = {
  id: string;
  title: string;
  category: string | null;
  card_count: number | null;
  progress: number | null;
  accent: string | null;
};

type CloudReminderRow = {
  id: string;
  title: string;
  schedule: string | null;
  kind: string | null;
  completed: boolean | null;
};

type CloudWorkspaceRow = {
  name: string;
};

type WorkspaceState = {
  tasks: WorkspaceTask[];
  boards: WorkspaceBoard[];
  reminders: WorkspaceReminder[];
  currentUser: User | null;
  workspaceId: string | null;
  cloudEnabled: boolean;
  syncStatus: WorkspaceSyncStatus;
  workspaceName: string;
  addTask: (title: string) => void;
  toggleTask: (id: string) => void;
  addBoard: () => void;
  addReminder: (title: string, kind?: WorkspaceReminder["kind"]) => void;
  toggleReminder: (id: string) => void;
  refreshCloudData: () => Promise<void>;
  signOut: () => Promise<void>;
};

const storageKey = "bloomboard-web-workspace-v2";

const starterTasks: WorkspaceTask[] = [
  {
    id: "launch-page",
    title: "Finalize Bloomboard launch page",
    project: "Bloomboard launch",
    due: "Today · 4:30 PM",
    priority: "High",
    done: false,
    accent: "border-l-red-400",
  },
  {
    id: "client-revisions",
    title: "Review client portal revisions",
    project: "Commercial website",
    due: "Today · 6:00 PM",
    priority: "Medium",
    done: false,
    accent: "border-l-blue-400",
  },
  {
    id: "weekly-recap",
    title: "Send weekly progress recap",
    project: "Team operations",
    due: "Tomorrow",
    priority: "Low",
    done: true,
    accent: "border-l-emerald-400",
  },
  {
    id: "onboarding-copy",
    title: "Prepare app onboarding copy",
    project: "Product",
    due: "Jun 15",
    priority: "Medium",
    done: false,
    accent: "border-l-violet-400",
  },
];

const starterBoards: WorkspaceBoard[] = [
  {
    id: "web-app",
    name: "Bloomboard Web App",
    category: "Product",
    cards: 18,
    progress: 64,
    accent: "from-blue-500/30 to-cyan-300/5",
  },
  {
    id: "commercial-campaign",
    name: "Commercial Campaign",
    category: "Marketing",
    cards: 12,
    progress: 42,
    accent: "from-orange-500/25 to-pink-300/5",
  },
  {
    id: "client-portal",
    name: "Client Portal",
    category: "Freelance",
    cards: 9,
    progress: 78,
    accent: "from-violet-500/30 to-fuchsia-300/5",
  },
];

const starterReminders: WorkspaceReminder[] = [
  {
    id: "launch-checkpoint",
    title: "Launch checkpoint",
    schedule: "Today · 4:30 PM",
    kind: "Meeting",
    completed: false,
  },
  {
    id: "hydrate",
    title: "Take a hydration break",
    schedule: "In 35 minutes",
    kind: "Reminder",
    completed: false,
  },
  {
    id: "client-follow-up",
    title: "Follow up with the commercial client",
    schedule: "Tomorrow · 10:00 AM",
    kind: "Reminder",
    completed: false,
  },
];

const WorkspaceContext = createContext<WorkspaceState | null>(null);

function normalizePriority(priority: unknown): WorkspaceTask["priority"] {
  return priority === "High" || priority === "Low" ? priority : "Medium";
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [tasks, setTasks] = useState(starterTasks);
  const [boards, setBoards] = useState(starterBoards);
  const [reminders, setReminders] = useState(starterReminders);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);
  const [workspaceName, setWorkspaceName] = useState("Local Workspace");
  const [syncStatus, setSyncStatus] =
    useState<WorkspaceSyncStatus>(supabase ? "connecting" : "local");
  const [hydrated, setHydrated] = useState(false);
  const workspaceIdRef = useRef<string | null>(null);
  const currentUserRef = useRef<User | null>(null);

  useEffect(() => {
    workspaceIdRef.current = workspaceId;
  }, [workspaceId]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved) as {
          tasks?: WorkspaceTask[];
          boards?: WorkspaceBoard[];
          reminders?: WorkspaceReminder[];
        };
        if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
        if (Array.isArray(parsed.boards)) setBoards(parsed.boards);
        if (Array.isArray(parsed.reminders)) setReminders(parsed.reminders);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }

    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ tasks, boards, reminders }),
    );
  }, [boards, hydrated, reminders, tasks]);

  const loadCloudData = useCallback(
    async (targetWorkspaceId: string) => {
      if (!supabase) return;

      setSyncStatus("syncing");
      const [taskResult, boardResult, reminderResult, workspaceResult] =
        await Promise.all([
          supabase
            .from("tasks")
            .select("*")
            .eq("workspace_id", targetWorkspaceId)
            .is("deleted_at", null)
            .order("created_at", { ascending: false }),
          supabase
            .from("boards")
            .select("*")
            .eq("workspace_id", targetWorkspaceId)
            .is("deleted_at", null)
            .order("created_at", { ascending: true }),
          supabase
            .from("reminders")
            .select("*")
            .eq("workspace_id", targetWorkspaceId)
            .is("deleted_at", null)
            .order("created_at", { ascending: false }),
          supabase
            .from("workspaces")
            .select("name")
            .eq("id", targetWorkspaceId)
            .single(),
        ]);

      const firstError =
        taskResult.error ||
        boardResult.error ||
        reminderResult.error ||
        workspaceResult.error;

      if (firstError) {
        console.error("Bloomboard cloud sync failed", firstError);
        setSyncStatus("error");
        return;
      }

      const cloudTasks = (taskResult.data ?? []) as CloudTaskRow[];
      const cloudBoards = (boardResult.data ?? []) as CloudBoardRow[];
      const cloudReminders = (reminderResult.data ?? []) as CloudReminderRow[];
      const cloudWorkspace = workspaceResult.data as CloudWorkspaceRow | null;

      setTasks(
        cloudTasks.map((task) => ({
          id: task.id,
          title: task.title,
          project: task.project ?? "Personal",
          due: task.due_label ?? "Today",
          priority: normalizePriority(task.priority),
          done: task.status === "done",
          accent: task.accent ?? "border-l-blue-400",
        })),
      );
      setBoards(
        cloudBoards.map((board) => ({
          id: board.id,
          name: board.title,
          category: board.category ?? "Uncategorized",
          cards: board.card_count ?? 0,
          progress: board.progress ?? 0,
          accent: board.accent ?? "from-blue-500/25 to-cyan-300/5",
        })),
      );
      setReminders(
        cloudReminders.map((reminder) => ({
          id: reminder.id,
          title: reminder.title,
          schedule: reminder.schedule ?? "Today",
          kind: reminder.kind === "Meeting" ? "Meeting" : "Reminder",
          completed: Boolean(reminder.completed),
        })),
      );
      setWorkspaceName(cloudWorkspace?.name ?? "Bloomboard Workspace");
      setSyncStatus("synced");
    },
    [supabase],
  );

  const connectUser = useCallback(
    async (user: User | null) => {
      setCurrentUser(user);
      currentUserRef.current = user;

      if (!supabase || !user) {
        setWorkspaceId(null);
        workspaceIdRef.current = null;
        setWorkspaceName("Local Workspace");
        setSyncStatus("local");
        return;
      }

      setSyncStatus("connecting");
      const { data, error } = await supabase.rpc("ensure_user_workspace");

      if (error || !data) {
        console.error("Could not prepare the Bloomboard workspace", error);
        setSyncStatus("error");
        return;
      }

      const nextWorkspaceId = String(data);
      setWorkspaceId(nextWorkspaceId);
      workspaceIdRef.current = nextWorkspaceId;
      await loadCloudData(nextWorkspaceId);
    },
    [loadCloudData, supabase],
  );

  useEffect(() => {
    if (!supabase || !hydrated) return;

    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (active) void connectUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) void connectUser(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [connectUser, hydrated, supabase]);

  const runCloudMutation = useCallback(
    async (operation: () => PromiseLike<{ error: { message: string } | null }>) => {
      if (!workspaceIdRef.current || !currentUserRef.current) return;
      setSyncStatus("syncing");
      const { error } = await operation();
      if (error) {
        console.error("Bloomboard cloud update failed", error);
        setSyncStatus("error");
        return;
      }
      setSyncStatus("synced");
    },
    [],
  );

  const value = useMemo<WorkspaceState>(
    () => ({
      tasks,
      boards,
      reminders,
      currentUser,
      workspaceId,
      cloudEnabled: Boolean(supabase),
      syncStatus,
      workspaceName,
      addTask(title) {
        const cleanTitle = title.trim();
        if (!cleanTitle) return;

        const task: WorkspaceTask = {
          id: crypto.randomUUID(),
          title: cleanTitle,
          project: "Personal",
          due: "Today",
          priority: "Medium",
          done: false,
          accent: "border-l-blue-400",
        };
        setTasks((current) => [task, ...current]);

        const targetWorkspaceId = workspaceIdRef.current;
        const user = currentUserRef.current;
        if (supabase && targetWorkspaceId && user) {
          void runCloudMutation(() =>
            supabase.from("tasks").insert({
              id: task.id,
              workspace_id: targetWorkspaceId,
              title: task.title,
              project: task.project,
              due_label: task.due,
              priority: task.priority,
              status: "pending",
              accent: task.accent,
              created_by: user.id,
              last_updated_by: user.id,
            }),
          );
        }
      },
      toggleTask(id) {
        const completed = !tasks.find((task) => task.id === id)?.done;
        setTasks((current) =>
          current.map((task) =>
            task.id === id ? { ...task, done: completed } : task,
          ),
        );

        const user = currentUserRef.current;
        const targetWorkspaceId = workspaceIdRef.current;
        if (supabase && targetWorkspaceId && user) {
          void runCloudMutation(() =>
            supabase
              .from("tasks")
              .update({
                status: completed ? "done" : "pending",
                last_updated_by: user.id,
              })
              .eq("id", id)
              .eq("workspace_id", targetWorkspaceId),
          );
        }
      },
      addBoard() {
        const board: WorkspaceBoard = {
          id: crypto.randomUUID(),
          name: `New Board ${boards.length + 1}`,
          category: "Uncategorized",
          cards: 0,
          progress: 0,
          accent: "from-emerald-500/25 to-blue-300/5",
        };
        setBoards((current) => [...current, board]);

        const targetWorkspaceId = workspaceIdRef.current;
        const user = currentUserRef.current;
        if (supabase && targetWorkspaceId && user) {
          void runCloudMutation(() =>
            supabase.from("boards").insert({
              id: board.id,
              workspace_id: targetWorkspaceId,
              title: board.name,
              category: board.category,
              card_count: board.cards,
              progress: board.progress,
              accent: board.accent,
              created_by: user.id,
              last_updated_by: user.id,
            }),
          );
        }
      },
      addReminder(title, kind = "Reminder") {
        const cleanTitle = title.trim();
        if (!cleanTitle) return;

        const reminder: WorkspaceReminder = {
          id: crypto.randomUUID(),
          title: cleanTitle,
          schedule: "Today",
          kind,
          completed: false,
        };
        setReminders((current) => [reminder, ...current]);

        const targetWorkspaceId = workspaceIdRef.current;
        const user = currentUserRef.current;
        if (supabase && targetWorkspaceId && user) {
          void runCloudMutation(() =>
            supabase.from("reminders").insert({
              id: reminder.id,
              workspace_id: targetWorkspaceId,
              title: reminder.title,
              schedule: reminder.schedule,
              kind: reminder.kind,
              completed: false,
              created_by: user.id,
              last_updated_by: user.id,
            }),
          );
        }
      },
      toggleReminder(id) {
        const completed =
          !reminders.find((reminder) => reminder.id === id)?.completed;
        setReminders((current) =>
          current.map((reminder) =>
            reminder.id === id ? { ...reminder, completed } : reminder,
          ),
        );

        const user = currentUserRef.current;
        const targetWorkspaceId = workspaceIdRef.current;
        if (supabase && targetWorkspaceId && user) {
          void runCloudMutation(() =>
            supabase
              .from("reminders")
              .update({ completed, last_updated_by: user.id })
              .eq("id", id)
              .eq("workspace_id", targetWorkspaceId),
          );
        }
      },
      async refreshCloudData() {
        if (workspaceIdRef.current) {
          await loadCloudData(workspaceIdRef.current);
        }
      },
      async signOut() {
        if (supabase) await supabase.auth.signOut();
      },
    }),
    [
      boards,
      currentUser,
      loadCloudData,
      reminders,
      runCloudMutation,
      supabase,
      syncStatus,
      tasks,
      workspaceName,
      workspaceId,
    ],
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  }
  return context;
}
