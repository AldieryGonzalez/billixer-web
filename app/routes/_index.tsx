import type { MetaFunction } from "@remix-run/node";
import { useOutletContext } from "@remix-run/react";
import { CreateTableFormT } from "~/components/create-dialog/atoms/form";
import CreateDialog from "~/components/create-dialog/index";
import JoinForm from "~/components/join-form/form";
import { SupabaseOutletContext } from "~/lib/supabase";

export const meta: MetaFunction = () => {
  return [
    { title: "Billixer" },
    { name: "description", content: "App for splitting checks and bills" },
  ];
};

export default function Index() {
  const { supabase } = useOutletContext<SupabaseOutletContext>();
  // TODO Change forms if user is logged in (Disable form inputs and show user name in placeholders)
  const handleCreateTable = async (form: CreateTableFormT) => {
    // TODO: Add Table to database
    // TODO: Handle User anon auth if not logged in
    const res = await supabase
      .from("mesa")
      .insert([
        {
          title: form.title,
          description: form.description,
          waiting_room: form.waitingRoom,
        },
      ])
      .select();

    return res;
  };

  return (
    <div className="flex h-full flex-col items-center justify-between gap-6 lg:flex-row">
      <div className="flex flex-col items-start justify-start gap-1 text-start lg:self-start">
        <h1 className="text-3xl lg:text-6xl">
          Welcome to{" "}
          <span className="font-lobster text-paynesGray lg:text-7xl">
            Billixer
          </span>
        </h1>
        <p>App for splitting checks and bills</p>
        {/* TODO: Add List of features and pie chart graphic to fill desktop mode */}
      </div>
      <div className="min-w-80 max-w-md grow">
        <JoinForm />
        <p className="mt-4 text-center">or</p>
        <CreateDialog action={handleCreateTable} />
      </div>
    </div>
  );
}
