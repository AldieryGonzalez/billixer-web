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
      table: {
        Row: {
          active: boolean
          code: string
          confirmed: boolean
          created_at: string
          description: string
          id: number
          title: string
          waiting_room: boolean
        }
        Insert: {
          active?: boolean
          code: string
          confirmed?: boolean
          created_at?: string
          description: string
          id?: number
          title: string
          waiting_room?: boolean
        }
        Update: {
          active?: boolean
          code?: string
          confirmed?: boolean
          created_at?: string
          description?: string
          id?: number
          title?: string
          waiting_room?: boolean
        }
        Relationships: []
      }
      table_item: {
        Row: {
          id: number
          mods: string
          name: string
          price: number
          table_id: number
        }
        Insert: {
          id?: number
          mods?: string
          name?: string
          price: number
          table_id: number
        }
        Update: {
          id?: number
          mods?: string
          name?: string
          price?: number
          table_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "table_item_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "table"
            referencedColumns: ["id"]
          },
        ]
      }
      table_user: {
        Row: {
          admin: boolean
          cardholding_user_id: number
          confirmed: boolean
          paid: boolean
          table_id: number
          user_id: number
        }
        Insert: {
          admin: boolean
          cardholding_user_id: number
          confirmed: boolean
          paid: boolean
          table_id: number
          user_id: number
        }
        Update: {
          admin?: boolean
          cardholding_user_id?: number
          confirmed?: boolean
          paid?: boolean
          table_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "table_user_cardholding_user_id_fkey"
            columns: ["cardholding_user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_user_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "table"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      user_item: {
        Row: {
          item_id: number
          p_flat: number
          p_percent: number
          table_id: number
          user_id: number
        }
        Insert: {
          item_id: number
          p_flat: number
          p_percent?: number
          table_id: number
          user_id: number
        }
        Update: {
          item_id?: number
          p_flat?: number
          p_percent?: number
          table_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "table_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_item_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "table"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_item_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
