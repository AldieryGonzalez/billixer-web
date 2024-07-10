import type { Session } from "@supabase/supabase-js";
import { Database } from "database.types";

export type Table = Database["public"]["Tables"]["mesa"]["Row"];
export type User = Database["public"]["Tables"]["users"]["Row"];
export type Item = Database["public"]["Tables"]["items"]["Row"];
export type UserItem = Database["public"]["Tables"]["user_items"]["Row"];
export type TableUser = Database["public"]["Tables"]["table_users"]["Row"];

export type TableWithRelations = Table & {
  users: Array<TableUser & { user_info: User; cardholder_info: User }>;
  items: Item[];
};
export type TableContextType = {
  table: TableWithRelations;
  session: Session | null;
};
