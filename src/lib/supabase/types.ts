type SharedRecord = {
  id: string;
  workspace_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  last_updated_by: string | null;
  sync_version: number;
};

export type BloomboardDatabase = {
  public: {
    Tables: {
      tasks: {
        Row: SharedRecord & {
          title: string;
          description: string | null;
          status: string;
          priority: string | null;
          due_at: string | null;
          mood: string | null;
          created_by: string | null;
          assigned_to: string | null;
          project: string;
          due_label: string;
          accent: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          title: string;
          description?: string | null;
          status?: string;
          priority?: string | null;
          due_at?: string | null;
          mood?: string | null;
          created_by?: string | null;
          assigned_to?: string | null;
          project?: string;
          due_label?: string;
          accent?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          last_updated_by?: string | null;
          sync_version?: number;
        };
        Update: Partial<BloomboardDatabase["public"]["Tables"]["tasks"]["Insert"]>;
        Relationships: [];
      };
      boards: {
        Row: SharedRecord & {
          title: string;
          cover_file_id: string | null;
          created_by: string | null;
          category: string;
          card_count: number;
          progress: number;
          accent: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          title: string;
          cover_file_id?: string | null;
          created_by?: string | null;
          category?: string;
          card_count?: number;
          progress?: number;
          accent?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          last_updated_by?: string | null;
          sync_version?: number;
        };
        Update: Partial<BloomboardDatabase["public"]["Tables"]["boards"]["Insert"]>;
        Relationships: [];
      };
      reminders: {
        Row: SharedRecord & {
          title: string;
          schedule: string;
          kind: string;
          completed: boolean;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          title: string;
          schedule?: string;
          kind?: string;
          completed?: boolean;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          last_updated_by?: string | null;
          sync_version?: number;
        };
        Update: Partial<
          BloomboardDatabase["public"]["Tables"]["reminders"]["Insert"]
        >;
        Relationships: [];
      };
      workspaces: {
        Row: SharedRecord & {
          name: string;
          owner_id: string;
          plan: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          plan?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          last_updated_by?: string | null;
          sync_version?: number;
        };
        Update: Partial<
          BloomboardDatabase["public"]["Tables"]["workspaces"]["Insert"]
        >;
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          BloomboardDatabase["public"]["Tables"]["profiles"]["Insert"]
        >;
        Relationships: [];
      };
      team_members: {
        Row: SharedRecord & {
          user_id: string | null;
          display_name: string;
          email: string | null;
          role: string;
          status: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id?: string | null;
          display_name: string;
          email?: string | null;
          role?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          last_updated_by?: string | null;
          sync_version?: number;
        };
        Update: Partial<
          BloomboardDatabase["public"]["Tables"]["team_members"]["Insert"]
        >;
        Relationships: [];
      };
      workspace_invitations: {
        Row: {
          id: string;
          workspace_id: string;
          email: string;
          role: string;
          status: string;
          invited_by: string;
          expires_at: string;
          accepted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          email: string;
          role?: string;
          status?: string;
          invited_by: string;
          expires_at?: string;
          accepted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          BloomboardDatabase["public"]["Tables"]["workspace_invitations"]["Insert"]
        >;
        Relationships: [];
      };
      conversations: {
        Row: SharedRecord & {
          type: string;
          title: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          type?: string;
          title?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          last_updated_by?: string | null;
          sync_version?: number;
        };
        Update: Partial<
          BloomboardDatabase["public"]["Tables"]["conversations"]["Insert"]
        >;
        Relationships: [];
      };
      conversation_members: {
        Row: {
          id: string;
          workspace_id: string;
          conversation_id: string;
          user_id: string | null;
          member_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          conversation_id: string;
          user_id?: string | null;
          member_id?: string | null;
          created_at?: string;
        };
        Update: Partial<
          BloomboardDatabase["public"]["Tables"]["conversation_members"]["Insert"]
        >;
        Relationships: [];
      };
      messages: {
        Row: SharedRecord & {
          conversation_id: string;
          body: string | null;
          message_type: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          conversation_id: string;
          body?: string | null;
          message_type?: string;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          last_updated_by?: string | null;
          sync_version?: number;
        };
        Update: Partial<
          BloomboardDatabase["public"]["Tables"]["messages"]["Insert"]
        >;
        Relationships: [];
      };
      daily_recaps: {
        Row: {
          id: string;
          workspace_id: string;
          recap_date: string;
          summary: string;
          details: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          recap_date: string;
          summary: string;
          details?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          BloomboardDatabase["public"]["Tables"]["daily_recaps"]["Insert"]
        >;
        Relationships: [];
      };
      chief_of_staff_signals: {
        Row: {
          id: string;
          workspace_id: string;
          title: string;
          detail: string | null;
          severity: string;
          source_table: string | null;
          source_id: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          title: string;
          detail?: string | null;
          severity?: string;
          source_table?: string | null;
          source_id?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          BloomboardDatabase["public"]["Tables"]["chief_of_staff_signals"]["Insert"]
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      ensure_user_workspace: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
