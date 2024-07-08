import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { ArrowRightCircle } from "lucide-react";
import { useMemo } from "react";

const table = {
  title: "Izziban Sushi",
  description: "All you can eat sushi",
  date: "2021-09-01",
  allConfirmed: true,
  users: [
    {
      name: "John Doe",
      confirmed: true,
    },
    {
      name: "Jane Doe",
      confirmed: true,
    },
    {
      name: "Joe Doe",
      confirmed: false,
    },
    {
      name: "Jack Doe",
      confirmed: true,
    },
    {
      name: "Jill Doe",
      confirmed: false,
    },
    {
      name: "James Doe",
      confirmed: true,
    },
    {
      name: "Jessica Doe",
      confirmed: true,
    },
    {
      name: "Jason Doe",
      confirmed: false,
    },
    {
      name: "Jennifer Doe",
      confirmed: true,
    },
    {
      name: "Jacob Doe",
      confirmed: false,
    },
    {
      name: "Julia Doe",
      confirmed: true,
    },
    {
      name: "Justin Doe",
      confirmed: true,
    },
    {
      name: "Jasmine Doe",
      confirmed: false,
    },
    {
      name: "Jeremy Doe",
      confirmed: true,
    },
    {
      name: "Jocelyn Doe",
      confirmed: true,
    },
  ],
  items: [
    {
      name: "AYCE Sushi",
      price: 29.99,
      quantity: 3,
    },
    {
      name: "Sojurita",
      price: 12.99,
      quantity: 1,
    },
    {
      name: "Sake Bomb",
      price: 5.99,
      quantity: 2,
    },
  ],
};
const user = {
  name: "John Doe",
};

export default function Table() {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h1 className="text-3xl">{table.title}</h1>
        <button className="rounded-md border-2 border-black/5 bg-jonquil p-2 shadow hover:bg-jonquil/50">
          Table Settings
        </button>
      </div>
      <p className="mb-6">{table.description}</p>
      <div className="flex w-full flex-col justify-between gap-10 md:flex-row">
        <Users />
        <Bill />
      </div>
    </div>
  );
}

function Bill() {
  return (
    <div className="drop-shadow-2xl">
      <div className="reciept border bg-white p-6 py-12 shadow-2xl">
        <h2 className="mb-3 text-xl font-semibold">Bill</h2>
        <div className="flex-col gap-4">
          {table.items.map((item) => (
            <div
              key={item.name}
              className="flex justify-between gap-20 border-b-2 border-dotted"
            >
              <span>{item.name}</span>
              <span>${item.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Users() {
  const otherUsers = table.users.filter((u) => u.name !== user.name);
  const currentUser = table.users.find((u) => u.name === user.name);
  return (
    <div className="grow flex-col rounded-xl bg-jonquil p-4 md:max-w-screen-sm">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Users</h2>
        <button>
          <ArrowRightCircle />
        </button>
      </div>
      {/* Current User */}
      <div className="flex flex-col gap-3">
        {currentUser && (
          <div className="flex items-center justify-between gap-20 rounded border-2 border-black/15 bg-background/85 p-3 shadow-md">
            <div className="flex items-center gap-2">
              <Avatar name={currentUser.name} />
              <span className="font-bold">{`${currentUser.name} (Me)`}</span>
            </div>
            <span>{currentUser.confirmed ? "✅" : "❌"}</span>
          </div>
        )}
        {/* Rest of Users */}
        <div className="flex max-h-64 w-full flex-wrap gap-3 overflow-hidden">
          {otherUsers.map((user) => (
            <div
              key={user.name}
              className="flex min-w-24 grow flex-col items-center gap-2 rounded bg-background/85 p-3"
            >
              <Avatar name={user.name} />
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Avatar({ name }: { name: string }) {
  const avatar = useMemo(() => {
    return createAvatar(thumbs, {
      size: 32,
      seed: name,
    }).toDataUri();
  }, [name]);
  return (
    <img
      className="rounded-full border-2 border-black/15"
      src={avatar}
      alt={name}
    />
  );
}
