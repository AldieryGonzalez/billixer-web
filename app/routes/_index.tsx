import type { MetaFunction } from "@remix-run/node";
import CreateDialog from "~/components/create-dialog/index";
import JoinForm from "~/components/join-form/form";

export const meta: MetaFunction = () => {
  return [
    { title: "Billixer" },
    { name: "description", content: "App for splitting checks and bills" },
  ];
};

export default function Index() {
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
        <CreateDialog />
      </div>
    </div>
  );
}
