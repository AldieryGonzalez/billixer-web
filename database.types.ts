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
      items: {
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
            referencedRelation: "mesa"
            referencedColumns: ["id"]
          },
        ]
      }
      mesa: {
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
          code?: string
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
      table_users: {
        Row: {
          admin: boolean
          cardholder_user_id: string
          confirmed: boolean
          paid: boolean
          table_id: number
          user_id: string
        }
        Insert: {
          admin?: boolean
          cardholder_user_id: string
          confirmed?: boolean
          paid?: boolean
          table_id: number
          user_id: string
        }
        Update: {
          admin?: boolean
          cardholder_user_id?: string
          confirmed?: boolean
          paid?: boolean
          table_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_user_cardholder_user_id_fkey"
            columns: ["cardholder_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_user_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "mesa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "table_user_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_items: {
        Row: {
          item_id: number
          p_flat: number
          p_percent: number
          table_id: number
          user_id: string
        }
        Insert: {
          item_id: number
          p_flat: number
          p_percent?: number
          table_id: number
          user_id: string
        }
        Update: {
          item_id?: number
          p_flat?: number
          p_percent?: number
          table_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_item_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_item_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "mesa"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_item_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gencode: {
        Args: {
          size: number
        }
        Returns: string
      }
      generate_table_code: {
        Args: {
          size: number
        }
        Returns: string
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
