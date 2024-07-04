import type { MetaFunction } from "@remix-run/node";
import CreateDialog from "~/components/create-dialog";
import JoinForm from "~/components/join-form";

export const meta: MetaFunction = () => {
  return [
    { title: "Billixer" },
    { name: "description", content: "App for splitting checks and bills" },
  ];
};

export default function Index() {
  return (
    <div className="mx-4 mt-10 flex h-full flex-col items-center justify-between gap-6 md:mx-16 lg:flex-row">
      <div className="flex flex-col items-start justify-start gap-1 text-start lg:self-start">
        <h1 className="text-3xl lg:text-6xl">
          Welcome to{" "}
          <span className="font-lobster text-paynesGray lg:text-7xl">
            Billixer
          </span>
        </h1>
        <p>App for splitting checks and bills</p>
      </div>
      <div>
        <JoinForm />
        <p className="mt-4 text-center">or</p>
        <CreateDialog />
      </div>
    </div>
  );
}
