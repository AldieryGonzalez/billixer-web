import { thumbs } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
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
      <h1 className="text-center text-3xl">{table.title}</h1>
      <p className="mb-6 text-center">{table.description}</p>
      <div className="flex w-full justify-between gap-10">
        <Users />
        <Bill />
      </div>
    </div>
  );
}

function Bill() {
  return (
    <div className="drop-shadow-2xl">
      <div className="reciept border bg-white p-6 shadow-2xl">
        <h2>Bill</h2>
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
  return (
    <div className="grow flex-col rounded-xl bg-jonquil p-4">
      <h2>Users</h2>
      <div className="flex flex-col gap-1">
        {table.users.map((user) => (
          <div
            key={user.name}
            className="flex items-center justify-between gap-20 border-b-2 border-dotted p-1"
          >
            <div className="flex items-center gap-2">
              <Avatar name={user.name} />
              <span>{user.name}</span>
            </div>
            <span>{user.confirmed ? "✅" : "❌"}</span>
          </div>
        ))}
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
  return <img className="rounded-full" src={avatar} alt={name} />;
}
