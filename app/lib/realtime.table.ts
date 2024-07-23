/* eslint-disable react-hooks/exhaustive-deps */
import {
  RealtimePostgresChangesPayload,
  RealtimePostgresUpdatePayload,
  SupabaseClient,
} from "@supabase/supabase-js";
import { Database, Tables } from "database.types";
import { useEffect, useState } from "react";
import { TableContextType } from "~/routes/$code";

export const createTableRealtimeClient = (
  supabase: SupabaseClient<Database>,
  code: string,
  table_id: TableContextType["table"]["data"]["id"],
  handleTablePayload: (
    payload: RealtimePostgresUpdatePayload<Tables<"mesa">>,
  ) => void,
  handleItemPayload: (
    payload: RealtimePostgresChangesPayload<Tables<"items">>,
  ) => void,
  handleTableUserPayload: (
    payload: RealtimePostgresChangesPayload<Tables<"table_users">>,
  ) => void,
  handleUserItemPayload: (
    payload: RealtimePostgresChangesPayload<Tables<"user_items">>,
  ) => void,
) => {
  const channel = supabase.channel(`table:${code}`);
  return channel
    .on<Tables<"mesa">>(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "mesa",
        filter: "code=eq." + code,
      },
      handleTablePayload,
    )
    .on<Tables<"items">>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "items",
        filter: "table_id=eq." + table_id,
      },
      handleItemPayload,
    )
    .on<Tables<"table_users">>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "table_users",
        filter: "table_id=eq." + table_id,
      },
      handleTableUserPayload,
    )
    .on<Tables<"user_items">>(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "user_items",
        filter: "table_id=eq." + table_id,
      },
      handleUserItemPayload,
    )
    .on("presence", { event: "sync" }, () => {
      const newState = channel.presenceState();
      console.log("sync", newState);
    })
    .on("presence", { event: "join" }, ({ key, newPresences }) => {
      console.log("join", key, newPresences);
    })
    .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
      console.log("leave", key, leftPresences);
    })
    .subscribe();
};

type RealTimeDataParams = {
  initialData: TableContextType["table"]["data"];
  supabase: SupabaseClient<Database>;
  code: string;
};

export function useRealtimeTable({
  initialData,
  supabase,
  code,
}: RealTimeDataParams) {
  const [tableData, setTableData] = useState(initialData);

  const handleTablePayload = (
    payload: RealtimePostgresUpdatePayload<Tables<"mesa">>,
  ) => {
    setTableData((prev) => {
      return {
        ...prev,
        ...payload.new,
      };
    });
  };
  const handleItemPayload = (
    payload: RealtimePostgresChangesPayload<Tables<"items">>,
  ) => {
    console.log("Change received!", payload);
    switch (payload.eventType) {
      case "INSERT":
        setTableData((prev) => ({
          ...prev,
          items: [
            ...prev.items,
            {
              id: payload.new.id,
              price: payload.new.price,
              name: payload.new.name,
              mods: payload.new.mods,
              users: [],
            },
          ],
        }));
        break;

      case "UPDATE": {
        const oldItem = tableData.items.find(
          (item) => item.id === payload.old.id!,
        )!;
        const newItem = { ...oldItem, ...payload.new };
        const newItems = updateObjectInArray(tableData.items, newItem, "id");
        setTableData((prev) => ({
          ...prev,
          items: newItems,
        }));

        break;
      }
      case "DELETE": {
        setTableData((prev) => ({
          ...prev,
          items: removeObjectInArray(prev.items, "id", payload.old?.id),
        }));
        break;
      }
    }
  };
  const handleTableUserPayload = (
    payload: RealtimePostgresChangesPayload<Tables<"table_users">>,
  ) => {
    console.log("Change received!", payload);
    switch (payload.eventType) {
      case "INSERT":
        setTableData((prev) => ({
          ...prev,
          table_users: [
            ...prev.table_users,
            {
              admin: payload.new.admin,
              cardholder_user_id: payload.new.cardholder_user_id,
              confirmed: payload.new.confirmed,
              paid: payload.new.paid,
              table_id: payload.new.table_id,
              user_id: payload.new.user_id,
            },
          ],
        }));
        break;
      case "UPDATE": {
        break;
        // const oldTableUsers = tableData.table_users.find(
        //   (user) => user.user_id === payload.old,
        // )!;
        // const newItem = { ...oldItem, ...payload.new };
        // const newItems = updateObjectInArray(tableData.items, newItem, "id");
        // setTableData((prev) => ({
        //   ...prev,
        //   items: newItems,
        // }));
        // break;
      }
      case "DELETE":
        console.log("DELETE", payload.old);
        break;
    }
  };
  const handleUserItemPayload = (
    payload: RealtimePostgresChangesPayload<Tables<"user_items">>,
  ) => {
    console.log("Change received!", payload);
    switch (payload.eventType) {
      case "INSERT":
        console.log("INSERT", payload.new);
        break;
      case "UPDATE":
        console.log("UPDATE", payload.new);
        break;
      case "DELETE":
        console.log("DELETE", payload.old);
        break;
    }
  };

  useEffect(() => {
    const channel = createTableRealtimeClient(
      supabase,
      code,
      initialData.id,
      handleTablePayload,
      handleItemPayload,
      handleTableUserPayload,
      handleUserItemPayload,
    );
    return () => {
      channel.untrack(); 
      channel.unsubscribe();
      supabase.removeChannel(channel);
    };
  }, [code, supabase, initialData.id]);
  return tableData;
}

//TODO: Update the item data
//TODO: DELETE the item data

//TODO: Update the user_item data
//TODO: DELETE the user_item data
//TODO: INSERT the user_item data

//TODO: Update the table_user data
//TODO: DELETE the table_user data
//TODO: INSERT the table_user data

function updateObjectInArray<T>(array: T[], object: T, key: keyof T) {
  return array.map((item) => {
    if (item[key] === object[key]) {
      return object;
    }
    return item;
  });
}
function removeObjectInArray<T>(array: T[], key: keyof T, value: unknown) {
  return array.filter((item) => item[key] !== value);
}
