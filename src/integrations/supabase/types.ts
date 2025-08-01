export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_audit_log: {
        Row: {
          action: string
          admin_user_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_audit_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_sessions: {
        Row: {
          admin_id: string
          created_at: string | null
          expires_at: string
          id: string
          ip_address: unknown | null
          session_token: string
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          expires_at: string
          id?: string
          ip_address?: unknown | null
          session_token: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          session_token?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          invitation_expires_at: string | null
          invitation_token: string | null
          invited_by: string | null
          is_active: boolean | null
          password_hash: string | null
          role: string
          totp_secret: string | null
          totp_verified: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          password_hash?: string | null
          role?: string
          totp_secret?: string | null
          totp_verified?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invited_by?: string | null
          is_active?: boolean | null
          password_hash?: string | null
          role?: string
          totp_secret?: string | null
          totp_verified?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      enquiry_submissions: {
        Row: {
          created_at: string | null
          form_data: Json | null
          form_type: string
          id: string
          page_path: string
          referrer: string | null
          session_id: string
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          form_data?: Json | null
          form_type: string
          id?: string
          page_path: string
          referrer?: string | null
          session_id: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          form_data?: Json | null
          form_type?: string
          id?: string
          page_path?: string
          referrer?: string | null
          session_id?: string
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          admin_notes: string | null
          contacted_at: string | null
          converted_at: string | null
          created_at: string
          current_heating_system: string | null
          email: string | null
          epc_score: string | null
          form_data: Json | null
          id: string
          ip_address: unknown | null
          name: string
          page_path: string
          phone: string | null
          postcode: string | null
          property_ownership: string | null
          property_type: string | null
          referrer: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          admin_notes?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          current_heating_system?: string | null
          email?: string | null
          epc_score?: string | null
          form_data?: Json | null
          id?: string
          ip_address?: unknown | null
          name: string
          page_path: string
          phone?: string | null
          postcode?: string | null
          property_ownership?: string | null
          property_type?: string | null
          referrer?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          admin_notes?: string | null
          contacted_at?: string | null
          converted_at?: string | null
          created_at?: string
          current_heating_system?: string | null
          email?: string | null
          epc_score?: string | null
          form_data?: Json | null
          id?: string
          ip_address?: unknown | null
          name?: string
          page_path?: string
          phone?: string | null
          postcode?: string | null
          property_ownership?: string | null
          property_type?: string | null
          referrer?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      page_visits: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          page_path: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          page_path: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          page_path?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      visitor_sessions: {
        Row: {
          converted: boolean | null
          created_at: string | null
          id: string
          pages_visited: number | null
          referrer: string | null
          session_end: string | null
          session_start: string | null
          total_time_seconds: number | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
          visitor_id: string
        }
        Insert: {
          converted?: boolean | null
          created_at?: string | null
          id?: string
          pages_visited?: number | null
          referrer?: string | null
          session_end?: string | null
          session_start?: string | null
          total_time_seconds?: number | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id: string
        }
        Update: {
          converted?: boolean | null
          created_at?: string | null
          id?: string
          pages_visited?: number | null
          referrer?: string | null
          session_end?: string | null
          session_start?: string | null
          total_time_seconds?: number | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      form_submission_stats: {
        Row: {
          count: number | null
          service_type: Database["public"]["Enums"]["service_type"] | null
          status: Database["public"]["Enums"]["lead_status"] | null
          submission_date: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      authenticate_admin: {
        Args: { user_email: string; user_password: string }
        Returns: Json
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      is_authenticated_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_admin_action: {
        Args: {
          p_admin_id: string
          p_action: string
          p_details?: Json
          p_ip_address?: unknown
          p_user_agent?: string
        }
        Returns: undefined
      }
      update_admin_password: {
        Args: { admin_user_id: string; new_password: string }
        Returns: undefined
      }
      verify_admin_password_by_id: {
        Args: { admin_user_id: string; provided_password: string }
        Returns: boolean
      }
    }
    Enums: {
      lead_status:
        | "new"
        | "contacted"
        | "qualified"
        | "converted"
        | "closed"
        | "lost"
        | "survey_booked"
        | "doesnt_qualify"
        | "no_contact"
      service_type: "eco4" | "solar" | "gas_boilers" | "home_improvements"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      lead_status: [
        "new",
        "contacted",
        "qualified",
        "converted",
        "closed",
        "lost",
        "survey_booked",
        "doesnt_qualify",
        "no_contact",
      ],
      service_type: ["eco4", "solar", "gas_boilers", "home_improvements"],
    },
  },
} as const
