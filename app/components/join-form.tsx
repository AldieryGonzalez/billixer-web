export default function JoinForm() {
  return (
    <form className="rounded-md border bg-white p-6 shadow-xl">
      <h3 className="text-xl font-semibold">Join table</h3>
      <input
        type="text"
        placeholder="Enter table code"
        className="mt-2 w-full rounded-md border p-2"
      />
      <input
        type="text"
        placeholder="Enter name"
        className="mt-2 w-full rounded-md border p-2"
      />
      <button className="mt-2 w-full rounded-md bg-sky-500 p-2 text-white">
        Join
      </button>
    </form>
  );
}
