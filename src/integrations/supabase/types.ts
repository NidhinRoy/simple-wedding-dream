export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      photos: {
        Row: {
          alt: string
          created_at: string | null
          id: string
          order: number | null
          src: string
        }
        Insert: {
          alt: string
          created_at?: string | null
          id?: string
          order?: number | null
          src: string
        }
        Update: {
          alt?: string
          created_at?: string | null
          id?: string
          order?: number | null
          src?: string
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          attending: boolean
          created_at: string | null
          dietary_restrictions: string | null
          email: string
          id: string
          message: string | null
          name: string
          plus_one: boolean
          timestamp: number
        }
        Insert: {
          attending?: boolean
          created_at?: string | null
          dietary_restrictions?: string | null
          email: string
          id?: string
          message?: string | null
          name: string
          plus_one?: boolean
          timestamp: number
        }
        Update: {
          attending?: boolean
          created_at?: string | null
          dietary_restrictions?: string | null
          email?: string
          id?: string
          message?: string | null
          name?: string
          plus_one?: boolean
          timestamp?: number
        }
        Relationships: []
      }
      themes: {
        Row: {
          accent_color: string
          background_color: string
          created_at: string | null
          id: string
          primary_color: string
          secondary_color: string
          text_color: string
        }
        Insert: {
          accent_color?: string
          background_color?: string
          created_at?: string | null
          id?: string
          primary_color?: string
          secondary_color?: string
          text_color?: string
        }
        Update: {
          accent_color?: string
          background_color?: string
          created_at?: string | null
          id?: string
          primary_color?: string
          secondary_color?: string
          text_color?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order: number
          time: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order?: number
          time: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order?: number
          time?: string
          title?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          address: string
          created_at: string | null
          id: string
          maps_url: string
          name: string
        }
        Insert: {
          address?: string
          created_at?: string | null
          id?: string
          maps_url?: string
          name?: string
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          maps_url?: string
          name?: string
        }
        Relationships: []
      }
      wedding_details: {
        Row: {
          bride_name: string
          created_at: string | null
          groom_name: string
          id: string
          story: string | null
          wedding_date: string
        }
        Insert: {
          bride_name?: string
          created_at?: string | null
          groom_name?: string
          id?: string
          story?: string | null
          wedding_date?: string
        }
        Update: {
          bride_name?: string
          created_at?: string | null
          groom_name?: string
          id?: string
          story?: string | null
          wedding_date?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
