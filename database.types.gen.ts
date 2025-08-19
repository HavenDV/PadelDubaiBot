export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          cancelled: boolean | null
          courts: number
          created_at: string | null
          end_time: string
          id: number
          location_id: number
          note: string | null
          price: number
          start_time: string
          updated_at: string | null
        }
        Insert: {
          cancelled?: boolean | null
          courts: number
          created_at?: string | null
          end_time: string
          id?: number
          location_id: number
          note?: string | null
          price: number
          start_time: string
          updated_at?: string | null
        }
        Update: {
          cancelled?: boolean | null
          courts?: number
          created_at?: string | null
          end_time?: string
          id?: number
          location_id?: number
          note?: string | null
          price?: number
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          description: string | null
          id: number
          member_count: number | null
          name: string | null
          permissions: Json | null
          title: string | null
          type: string
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id: number
          member_count?: number | null
          name?: string | null
          permissions?: Json | null
          title?: string | null
          type?: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          member_count?: number | null
          name?: string | null
          permissions?: Json | null
          title?: string | null
          type?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          attributes: Json | null
          created_at: string | null
          id: number
          lat: number | null
          lng: number | null
          name: string
          opening_hours: Json | null
          phone: string | null
          place_id: string | null
          plus_code: string | null
          rating: number | null
          updated_at: string | null
          url: string
          user_ratings_total: number | null
          website: string | null
        }
        Insert: {
          address?: string | null
          attributes?: Json | null
          created_at?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          name: string
          opening_hours?: Json | null
          phone?: string | null
          place_id?: string | null
          plus_code?: string | null
          rating?: number | null
          updated_at?: string | null
          url: string
          user_ratings_total?: number | null
          website?: string | null
        }
        Update: {
          address?: string | null
          attributes?: Json | null
          created_at?: string | null
          id?: number
          lat?: number | null
          lng?: number | null
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          place_id?: string | null
          plus_code?: string | null
          rating?: number | null
          updated_at?: string | null
          url?: string
          user_ratings_total?: number | null
          website?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          booking_id: number
          chat_id: number
          created_at: string | null
          id: number
          message_id: number
          updated_at: string | null
        }
        Insert: {
          booking_id: number
          chat_id: number
          created_at?: string | null
          id?: number
          message_id: number
          updated_at?: string | null
        }
        Update: {
          booking_id?: number
          chat_id?: number
          created_at?: string | null
          id?: number
          message_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          booking_id: number
          created_at: string | null
          id: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          booking_id: number
          created_at?: string | null
          id?: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          booking_id?: number
          created_at?: string | null
          id?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "registrations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          admin: boolean | null
          allows_write_to_pm: boolean | null
          created_at: string | null
          explicit_name: string | null
          first_name: string
          id: number
          is_bot: boolean | null
          is_premium: boolean | null
          language_code: string | null
          last_name: string | null
          photo_url: string | null
          show_logs: boolean | null
          skill_level: string | null
          theme_preference: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          admin?: boolean | null
          allows_write_to_pm?: boolean | null
          created_at?: string | null
          explicit_name?: string | null
          first_name: string
          id: number
          is_bot?: boolean | null
          is_premium?: boolean | null
          language_code?: string | null
          last_name?: string | null
          photo_url?: string | null
          show_logs?: boolean | null
          skill_level?: string | null
          theme_preference?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          admin?: boolean | null
          allows_write_to_pm?: boolean | null
          created_at?: string | null
          explicit_name?: string | null
          first_name?: string
          id?: number
          is_bot?: boolean | null
          is_premium?: boolean | null
          language_code?: string | null
          last_name?: string | null
          photo_url?: string | null
          show_logs?: boolean | null
          skill_level?: string | null
          theme_preference?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_current_user: {
        Args: { target_tg_id: number }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
