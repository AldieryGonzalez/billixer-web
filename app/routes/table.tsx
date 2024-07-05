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
};
const user = {
  name: "John Doe",
};

export default function Table() {
  return (
    <div className="w-full">
      <h1 className="text-3xl">{table.title}</h1>
      <p>{table.description}</p>
      <div className="flex w-full justify-between">
        <div className="grow flex-col">yadad</div>
        <Bill />
      </div>
    </div>
  );
}

function Bill() {
  return (
    <div className="drop-shadow-2xl">
      <div className="reciept grow border bg-white p-6 shadow-2xl">
        <h2>Bill</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Confirmed</th>
            </tr>
          </thead>
          <tbody>
            {table.users.map((user) => (
              <tr key={user.name}>
                <td>{user.name}</td>
                <td>{user.confirmed ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
