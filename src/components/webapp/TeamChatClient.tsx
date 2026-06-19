"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  FileImage,
  Hash,
  Mic,
  Paperclip,
  Plus,
  Search,
  Send,
  Smile,
  UsersRound,
} from "lucide-react";
import { useWorkspace } from "@/components/webapp/WorkspaceStore";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  author: string;
  initials: string;
  body: string;
  time: string;
  type?: "text" | "voice" | "file";
  mine?: boolean;
};

type Conversation = {
  id: string;
  title: string;
  kind: "direct" | "group";
  members: number;
  unread: number;
  messages: Message[];
};

const storageKey = "bloomboard-phase-two-chat";

type CloudConversation = {
  id: string;
  title: string | null;
  type: string;
};

type CloudMessage = {
  id: string;
  conversation_id: string;
  body: string | null;
  message_type: string;
  created_by: string | null;
  created_at: string;
};

const initialConversations: Conversation[] = [
  {
    id: "launch",
    title: "Launch Team",
    kind: "group",
    members: 4,
    unread: 2,
    messages: [
      {
        id: "m1",
        author: "Alex Lee",
        initials: "AL",
        body: "Can you review the proposal card before 2 PM?",
        time: "9:18 AM",
      },
      {
        id: "m2",
        author: "Jamie Morgan",
        initials: "JM",
        body: "Added notes and a voice update to the board.",
        time: "9:22 AM",
        type: "voice",
      },
      {
        id: "m3",
        author: "You",
        initials: "FA",
        body: "Perfect. I tagged Sam on the asset delivery thread too.",
        time: "9:26 AM",
        mine: true,
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    kind: "group",
    members: 6,
    unread: 0,
    messages: [
      {
        id: "m4",
        author: "Sam Kim",
        initials: "SK",
        body: "The campaign board is ready for final comments.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "alex",
    title: "Alex Lee",
    kind: "direct",
    members: 2,
    unread: 0,
    messages: [
      {
        id: "m5",
        author: "Alex Lee",
        initials: "AL",
        body: "I moved the overdue tasks into tomorrow's focus block.",
        time: "Yesterday",
      },
    ],
  },
];

function currentTime() {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function formatMessageTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function TeamChatClient() {
  const { currentUser, workspaceId } = useWorkspace();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);
  const [activeId, setActiveId] = useState(initialConversations[0].id);
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState("");
  const [activity, setActivity] = useState("");
  const [cloudLoading, setCloudLoading] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (workspaceId) return;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;

    try {
      setConversations(JSON.parse(saved) as Conversation[]);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [workspaceId]);

  useEffect(() => {
    if (workspaceId) return;
    window.localStorage.setItem(storageKey, JSON.stringify(conversations));
  }, [conversations, workspaceId]);

  useEffect(() => {
    if (!supabase || !workspaceId || !currentUser) return;

    const db = supabase;
    const targetWorkspaceId = workspaceId;
    const user = currentUser;
    let active = true;

    async function createStarterChannel() {
      const id = crypto.randomUUID();
      const { data, error } = await db
        .from("conversations")
        .insert({
          id,
          workspace_id: targetWorkspaceId,
          type: "channel",
          title: "General",
          created_by: user.id,
          last_updated_by: user.id,
        })
        .select("id, title, type")
        .single();

      if (error || !data) throw error;

      await db.from("conversation_members").insert({
        workspace_id: targetWorkspaceId,
        conversation_id: data.id,
        user_id: user.id,
      });
      return data as CloudConversation;
    }

    async function loadCloudChat() {
      setCloudLoading(true);
      const conversationResult = await db
        .from("conversations")
        .select("id, title, type")
        .eq("workspace_id", targetWorkspaceId)
        .is("deleted_at", null)
        .order("created_at", { ascending: true });

      if (conversationResult.error) {
        console.error("Could not load cloud conversations", conversationResult.error);
        if (active) {
          setActivity("Cloud chat could not be loaded. Local preview remains available.");
          setCloudLoading(false);
        }
        return;
      }

      let cloudConversations = (conversationResult.data ?? []) as CloudConversation[];
      if (cloudConversations.length === 0) {
        try {
          cloudConversations = [await createStarterChannel()];
        } catch (error) {
          console.error("Could not create starter conversation", error);
        }
      }

      const [messageResult, memberResult] = await Promise.all([
        db
          .from("messages")
          .select("id, conversation_id, body, message_type, created_by, created_at")
          .eq("workspace_id", targetWorkspaceId)
          .is("deleted_at", null)
          .order("created_at", { ascending: true }),
        db
          .from("conversation_members")
          .select("conversation_id")
          .eq("workspace_id", targetWorkspaceId),
      ]);

      if (!active) return;
      if (messageResult.error) {
        console.error("Could not load cloud messages", messageResult.error);
      }

      const cloudMessages = (messageResult.data ?? []) as CloudMessage[];
      const memberCounts = new Map<string, number>();
      for (const membership of memberResult.data ?? []) {
        memberCounts.set(
          membership.conversation_id,
          (memberCounts.get(membership.conversation_id) ?? 0) + 1,
        );
      }

      const nextConversations: Conversation[] = cloudConversations.map(
        (conversation) => ({
          id: conversation.id,
          title: conversation.title ?? "Untitled conversation",
          kind: conversation.type === "direct" ? "direct" : "group",
          members: Math.max(memberCounts.get(conversation.id) ?? 0, 1),
          unread: 0,
          messages: cloudMessages
            .filter((message) => message.conversation_id === conversation.id)
            .map((message) => ({
              id: message.id,
              author: message.created_by === user.id ? "You" : "Team member",
              initials: message.created_by === user.id ? "ME" : "TM",
              body: message.body ?? "",
              time: formatMessageTime(message.created_at),
              type:
                message.message_type === "voice" || message.message_type === "file"
                  ? message.message_type
                  : "text",
              mine: message.created_by === user.id,
            })),
        }),
      );

      if (nextConversations.length > 0) {
        setConversations(nextConversations);
        setActiveId((current) =>
          nextConversations.some((conversation) => conversation.id === current)
            ? current
            : nextConversations[0].id,
        );
      }
      setCloudLoading(false);
    }

    void loadCloudChat();

    const channel = db
      .channel(`workspace-chat-${targetWorkspaceId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `workspace_id=eq.${targetWorkspaceId}`,
        },
        (payload) => {
          const message = payload.new as CloudMessage;
          setConversations((current) =>
            current.map((conversation) => {
              if (
                conversation.id !== message.conversation_id ||
                conversation.messages.some((item) => item.id === message.id)
              ) {
                return conversation;
              }
              return {
                ...conversation,
                messages: [
                  ...conversation.messages,
                  {
                    id: message.id,
                    author: message.created_by === user.id ? "You" : "Team member",
                    initials: message.created_by === user.id ? "ME" : "TM",
                    body: message.body ?? "",
                    time: formatMessageTime(message.created_at),
                    type:
                      message.message_type === "voice" ||
                      message.message_type === "file"
                        ? message.message_type
                        : "text",
                    mine: message.created_by === user.id,
                  },
                ],
              };
            }),
          );
        },
      )
      .subscribe();

    return () => {
      active = false;
      void db.removeChannel(channel);
    };
  }, [currentUser, supabase, workspaceId]);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ??
    conversations[0];

  const visibleConversations = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return conversations;
    return conversations.filter((conversation) =>
      conversation.title.toLowerCase().includes(normalized),
    );
  }, [conversations, query]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [activeConversation.messages.length]);

  function appendMessage(message: Message) {
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              unread: 0,
              messages: [...conversation.messages, message],
            }
          : conversation,
      ),
    );
  }

  async function saveCloudMessage(message: Message) {
    if (!supabase || !workspaceId || !currentUser) return true;

    const { error } = await supabase.from("messages").insert({
      id: message.id,
      workspace_id: workspaceId,
      conversation_id: activeConversation.id,
      body: message.body,
      message_type: message.type ?? "text",
      created_by: currentUser.id,
      last_updated_by: currentUser.id,
    });

    if (error) {
      console.error("Could not save cloud message", error);
      setActivity("Message could not be synced. Please retry.");
      return false;
    }
    setActivity("Message synced to your workspace.");
    return true;
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = composer.trim();
    if (!body) return;

    const message: Message = {
      id: crypto.randomUUID(),
      author: "You",
      initials: "ME",
      body,
      time: currentTime(),
      mine: true,
    };
    appendMessage(message);
    setComposer("");
    await saveCloudMessage(message);
    if (!workspaceId) setActivity("Message added to this browser preview.");
  }

  async function addVoiceMessage() {
    const message: Message = {
      id: crypto.randomUUID(),
      author: "You",
      initials: "ME",
      body: "Voice message · 0:18",
      time: currentTime(),
      type: "voice",
      mine: true,
    };
    appendMessage(message);
    await saveCloudMessage(message);
    if (!workspaceId) setActivity("Voice message preview added.");
  }

  async function addFile() {
    const message: Message = {
      id: crypto.randomUUID(),
      author: "You",
      initials: "ME",
      body: "Campaign-review.png · 2.4 MB",
      time: currentTime(),
      type: "file",
      mine: true,
    };
    appendMessage(message);
    await saveCloudMessage(message);
    if (!workspaceId) setActivity("File attachment preview added.");
  }

  async function createConversation() {
    const id = crypto.randomUUID();
    const next: Conversation = {
      id,
      title: `Project channel ${conversations.length + 1}`,
      kind: "group",
      members: 1,
      unread: 0,
      messages: [],
    };

    if (supabase && workspaceId && currentUser) {
      const { error } = await supabase.from("conversations").insert({
        id,
        workspace_id: workspaceId,
        type: "channel",
        title: next.title,
        created_by: currentUser.id,
        last_updated_by: currentUser.id,
      });
      if (error) {
        console.error("Could not create conversation", error);
        setActivity("The conversation could not be created.");
        return;
      }
      await supabase.from("conversation_members").insert({
        workspace_id: workspaceId,
        conversation_id: id,
        user_id: currentUser.id,
      });
    }

    setConversations((current) => [...current, next]);
    setActiveId(id);
    setActivity(
      workspaceId
        ? "New group conversation synced."
        : "New group conversation created in this browser preview.",
    );
  }

  return (
    <section className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.025] lg:grid lg:min-h-[650px] lg:grid-cols-[320px_1fr]">
      <aside className="border-b border-white/10 bg-black/30 p-4 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/35">
              {cloudLoading ? "Loading conversations" : "Conversations"}
            </p>
            <h3 className="mt-1 text-xl font-bold">Team chat</h3>
          </div>
          <button
            type="button"
            onClick={() => void createConversation()}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/60 transition hover:bg-white/[0.08] hover:text-white"
            aria-label="Create group conversation"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <label className="mt-5 flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.035] px-3 text-white/45 focus-within:border-blue-300/35">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search conversations</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search conversations"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
        </label>

        <div className="mt-4 space-y-2">
          {visibleConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              onClick={() => {
                setActiveId(conversation.id);
                setConversations((current) =>
                  current.map((item) =>
                    item.id === conversation.id ? { ...item, unread: 0 } : item,
                  ),
                );
              }}
              className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                activeConversation.id === conversation.id
                  ? "border-blue-400/35 bg-blue-400/[0.10]"
                  : "border-transparent hover:border-white/10 hover:bg-white/[0.04]"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.08] text-blue-100">
                {conversation.kind === "group" ? (
                  <Hash className="h-4 w-4" />
                ) : (
                  conversation.title
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{conversation.title}</p>
                <p className="text-xs text-white/38">
                  {conversation.members} {conversation.members === 1 ? "member" : "members"}
                </p>
              </div>
              {conversation.unread > 0 && (
                <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-blue-500 px-1.5 text-xs font-black">
                  {conversation.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </aside>

      <div className="flex min-h-[590px] min-w-0 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/20 text-sm font-black text-violet-100">
              {activeConversation.kind === "group" ? (
                <UsersRound className="h-5 w-5" />
              ) : (
                activeConversation.title.slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <h3 className="font-bold">{activeConversation.title}</h3>
              <p className="text-xs text-emerald-200/70">
                {activeConversation.members} members · synced workspace
              </p>
            </div>
          </div>
          <Smile className="h-5 w-5 text-white/35" />
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 sm:px-6">
          {activeConversation.messages.length === 0 && (
            <div className="mx-auto mt-20 max-w-sm text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                <UsersRound className="h-5 w-5 text-violet-200" />
              </div>
              <h4 className="mt-4 text-lg font-bold">Start the conversation</h4>
              <p className="mt-2 text-sm leading-6 text-white/42">
                Share an update, attach a file, or add a voice message to this channel.
              </p>
            </div>
          )}

          {activeConversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.mine ? "justify-end" : "justify-start"}`}
            >
              {!message.mine && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-black text-blue-100">
                  {message.initials}
                </div>
              )}
              <div
                className={`max-w-[82%] rounded-[22px] border px-4 py-3 sm:max-w-[68%] ${
                  message.mine
                    ? "border-blue-300/20 bg-blue-500/25"
                    : "border-white/10 bg-white/[0.05]"
                }`}
              >
                {!message.mine && (
                  <p className="mb-1 text-xs font-semibold text-white/42">{message.author}</p>
                )}
                <div className="flex items-center gap-2">
                  {message.type === "voice" && <Mic className="h-4 w-4 text-violet-200" />}
                  {message.type === "file" && <FileImage className="h-4 w-4 text-blue-200" />}
                  <p className="text-sm leading-6 text-white/82">{message.body}</p>
                </div>
                <p className="mt-1 text-right text-[11px] text-white/32">{message.time}</p>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>

        <div className="border-t border-white/10 p-4 sm:p-5">
          {activity && <p className="mb-3 text-xs text-emerald-200/70">{activity}</p>}
          <form
            onSubmit={sendMessage}
            className="flex items-end gap-2 rounded-[24px] border border-white/10 bg-white/[0.04] p-2 focus-within:border-blue-300/35"
          >
            <button
              type="button"
              onClick={() => void addFile()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white/45 transition hover:bg-white/[0.08] hover:text-white"
              aria-label="Attach a preview file"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <textarea
              value={composer}
              onChange={(event) => setComposer(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={1}
              placeholder="Message your team..."
              className="max-h-28 min-h-10 min-w-0 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm text-white outline-none placeholder:text-white/30"
            />
            <button
              type="button"
              onClick={() => void addVoiceMessage()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white/45 transition hover:bg-violet-400/10 hover:text-violet-200"
              aria-label="Add a preview voice message"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-500 text-white transition hover:scale-[1.03] hover:bg-blue-400"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="mt-3 text-xs text-white/28">
            {workspaceId
              ? "Messages are synced to this workspace in real time."
              : "Preview messages stay in this browser. Sign in to enable cloud chat."}
          </p>
        </div>
      </div>
    </section>
  );
}
