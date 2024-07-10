import {
  RealtimePostgresChangesPayload,
  RealtimePostgresUpdatePayload,
  SupabaseClient,
} from "@supabase/supabase-js";
import { Database } from "database.types";
import { TableContextType } from "~/routes/$code";

const handleTablePayload = (
  payload: RealtimePostgresUpdatePayload<Database>,
) => {
  console.log("Change received!", payload);
};
const handleItemPayload = (
  payload: RealtimePostgresChangesPayload<Database>,
) => {
  console.log("Change received!", payload);
};
const handleUserItemPayload = (
  payload: RealtimePostgresChangesPayload<Database>,
) => {
  console.log("Change received!", payload);
};
const handleTableUserPayload = (
  payload: RealtimePostgresChangesPayload<Database>,
) => {
  console.log("Change received!", payload);
};

export const createTableRealtimeClient = (
  supabase: SupabaseClient<Database>,
  code: string,
  table_id: TableContextType["table"]["data"]["id"],
) => {
  return supabase
    .channel(`table:${code}`)
    .on<Database>(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "mesa",
        filter: "code=eq." + code,
      },
      handleTablePayload,
    )
    .on<Database>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "items",
        filter: "table_id=eq." + table_id,
      },
      handleItemPayload,
    )
    .on<Database>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "table_users",
        filter: "table_id=eq." + table_id,
      },
      handleTableUserPayload,
    )
    .on<Database>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "user_items",
        filter: "table_id=eq." + table_id,
      },
      handleUserItemPayload,
    )
    .subscribe();
};
