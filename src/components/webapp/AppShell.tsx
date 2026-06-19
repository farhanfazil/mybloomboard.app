"use client";

import Image from "next/image";
import Link from "next/link";
import { ReactNode, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bot,
  Activity,
  BarChart3,
  Bell,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  Check,
  Cloud,
  CloudOff,
  CreditCard,
  FolderKanban,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MessageSquare,
  NotebookText,
  RefreshCw,
  Settings,
  Sparkles,
  ListTodo,
  Users,
} from "lucide-react";
import {
  useWorkspace,
  WorkspaceProvider,
} from "@/components/webapp/WorkspaceStore";

const navItems = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard },
  { label: "Tasks", href: "/app/tasks", icon: ListTodo },
  { label: "Reminders", href: "/app/reminders", icon: CalendarClock },
  { label: "Boards", href: "/app/boards", icon: FolderKanban },
  { label: "AI Hub", href: "/app/ai", icon: Bot },
  { label: "Chief of Staff", href: "/app/chief-of-staff", icon: Sparkles },
  { label: "Daily Recap", href: "/app/daily-recap", icon: NotebookText },
  { label: "Freelance", href: "/app/freelance", icon: BriefcaseBusiness },
  { label: "Team", href: "/app/team", icon: Users },
  { label: "Chat", href: "/app/chat", icon: MessageSquare },
  { label: "Reports", href: "/app/reports", icon: BarChart3 },
  { label: "Workload Health", href: "/app/workload-health", icon: Activity },
  { label: "Billing", href: "/app/billing", icon: CreditCard },
  { label: "Settings", href: "/app/settings", icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <WorkspaceProvider>
      <AppShellContent>{children}</AppShellContent>
    </WorkspaceProvider>
  );
}

function AppShellContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const {
    cloudEnabled,
    currentUser,
    refreshCloudData,
    reminders,
    signOut,
    syncStatus,
    tasks,
    workspaceName,
  } = useWorkspace();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const notifications = useMemo(
    () => [
      ...tasks
        .filter((task) => !task.done && task.due.startsWith("Today"))
        .slice(0, 3)
        .map((task) => ({
          id: `task-${task.id}`,
          title: task.title,
          detail: task.due,
          href: "/app/tasks",
          icon: Check,
        })),
      ...reminders
        .filter((reminder) => !reminder.completed)
        .slice(0, 3)
        .map((reminder) => ({
          id: `reminder-${reminder.id}`,
          title: reminder.title,
          detail: reminder.schedule,
          href: "/app/reminders",
          icon: BellRing,
        })),
    ],
    [reminders, tasks],
  );
  const activeItem =
    navItems.find((item) => item.href === pathname) ??
    navItems.find((item) => item.href !== "/app" && pathname.startsWith(`${item.href}/`));

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_20%_0%,rgba(77,159,255,0.14),transparent_28%),radial-gradient(circle_at_80%_15%,rgba(124,58,237,0.12),transparent_30%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-white/10 bg-white/[0.025] p-5 backdrop-blur-xl lg:block">
          <Link href="/" className="mb-8 flex items-center gap-3">
            <Image src="/logo.png" alt="" width={44} height={44} className="rounded-2xl" />
            <div>
              <p className="text-lg font-semibold">Bloomboard</p>
              <p className="max-w-40 truncate text-xs text-white/45">
                {workspaceName}
              </p>
            </div>
          </Link>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                    pathname === item.href
                      ? "border border-blue-300/15 bg-blue-400/10 text-white"
                      : "text-white/55 hover:bg-white/[0.08] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-black/70 px-4 backdrop-blur-xl sm:px-8 lg:px-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-300/70">
                Bloomboard Web App
              </p>
              <h1 className="text-xl font-semibold sm:text-2xl">
                {activeItem?.label ?? "Your day, everywhere."}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => void refreshCloudData()}
                disabled={!currentUser || syncStatus === "syncing"}
                title={
                  syncStatus === "synced"
                    ? "Cloud synced"
                    : syncStatus === "error"
                      ? "Sync needs attention"
                      : currentUser
                        ? "Syncing workspace"
                        : cloudEnabled
                          ? "Local preview — sign in to sync"
                          : "Local preview"
                }
                className={`hidden h-10 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition sm:inline-flex ${
                  syncStatus === "error"
                    ? "border-red-300/25 bg-red-300/10 text-red-100"
                    : syncStatus === "synced"
                      ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-100"
                      : "border-white/12 bg-white/[0.04] text-white/55"
                }`}
              >
                {syncStatus === "syncing" || syncStatus === "connecting" ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : syncStatus === "synced" ? (
                  <Cloud className="h-3.5 w-3.5" />
                ) : syncStatus === "error" ? (
                  <RefreshCw className="h-3.5 w-3.5" />
                ) : (
                  <CloudOff className="h-3.5 w-3.5" />
                )}
                {syncStatus === "synced"
                  ? "Synced"
                  : syncStatus === "error"
                    ? "Retry sync"
                    : syncStatus === "syncing" || syncStatus === "connecting"
                      ? "Syncing"
                      : "Local"}
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen((current) => !current)}
                  aria-label="Open notifications"
                  aria-expanded={notificationsOpen}
                  className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/65 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.length > 0 && (
                    <span className="absolute right-0 top-0 flex h-4 min-w-4 -translate-y-1/4 translate-x-1/4 items-center justify-center rounded-full bg-blue-500 px-1 text-[9px] font-black text-white">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/12 bg-[#0b0d12]/95 shadow-2xl backdrop-blur-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                      <div>
                        <p className="font-bold">Notifications</p>
                        <p className="text-xs text-white/35">
                          Tasks and reminders that need you
                        </p>
                      </div>
                      <span className="rounded-full bg-blue-400/15 px-2.5 py-1 text-xs font-bold text-blue-200">
                        {notifications.length}
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-2">
                      {notifications.length ? (
                        notifications.map((notification) => {
                          const Icon = notification.icon;
                          return (
                            <Link
                              key={notification.id}
                              href={notification.href}
                              onClick={() => setNotificationsOpen(false)}
                              className="flex gap-3 rounded-2xl p-3 transition hover:bg-white/[0.07]"
                            >
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-400/10 text-blue-200">
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold">
                                  {notification.title}
                                </span>
                                <span className="mt-1 block text-xs text-white/35">
                                  {notification.detail}
                                </span>
                              </span>
                            </Link>
                          );
                        })
                      ) : (
                        <div className="px-5 py-10 text-center">
                          <p className="text-sm font-semibold">You&apos;re all clear.</p>
                          <p className="mt-1 text-xs text-white/35">
                            New activity will appear here.
                          </p>
                        </div>
                      )}
                    </div>
                    <Link
                      href="/app/reminders"
                      onClick={() => setNotificationsOpen(false)}
                      className="block border-t border-white/10 px-5 py-3 text-center text-xs font-bold text-blue-200 transition hover:bg-white/[0.05] hover:text-white"
                    >
                      Manage reminders
                    </Link>
                  </div>
                )}
              </div>
              {currentUser ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAccountOpen((current) => !current)}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-300/20 bg-blue-400/10 text-sm font-black text-blue-100 transition hover:border-blue-200/45 hover:bg-blue-400/20"
                    aria-label="Open account menu"
                    aria-expanded={accountOpen}
                  >
                    {(currentUser.user_metadata?.full_name?.[0] ??
                      currentUser.email?.[0] ??
                      "B"
                    ).toUpperCase()}
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-12 z-50 w-72 rounded-3xl border border-white/12 bg-[#0b0d12]/95 p-3 shadow-2xl backdrop-blur-2xl">
                      <div className="rounded-2xl bg-white/[0.045] p-4">
                        <p className="truncate font-bold">
                          {currentUser.user_metadata?.full_name ?? "Bloomboard user"}
                        </p>
                        <p className="mt-1 truncate text-xs text-white/40">
                          {currentUser.email}
                        </p>
                        <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-200">
                          <Cloud className="h-3.5 w-3.5" />
                          {workspaceName}
                        </p>
                      </div>
                      <Link
                        href="/app/settings"
                        onClick={() => setAccountOpen(false)}
                        className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/[0.07] hover:text-white"
                      >
                        <Settings className="h-4 w-4" />
                        Account settings
                      </Link>
                      <button
                        type="button"
                        onClick={() => {
                          setAccountOpen(false);
                          void signOut();
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-200/75 transition hover:bg-red-300/10 hover:text-red-100"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/app/sign-in"
                  className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white/75 transition hover:border-white/30 hover:bg-white/[0.08] hover:text-white"
                >
                  Sign in
                </Link>
              )}
              <Link
                href="/"
                className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:scale-[1.03] hover:bg-white/90 sm:inline-flex"
              >
                Marketing site
              </Link>
            </div>
          </header>

          <nav className="sticky top-20 z-20 flex gap-2 overflow-x-auto border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur-xl lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                    pathname === item.href
                      ? "border-blue-300/30 bg-blue-400/15 text-white"
                      : "border-white/10 text-white/50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <main className="flex-1 px-4 py-8 sm:px-8 lg:px-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
