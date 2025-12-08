// src/components/SearchBar/SearchBar.jsx
import { useEffect, useState } from "react";

export default function SearchBar({ value, onChange }) {
  const [local, setLocal] = useState(value || "");

  useEffect(() => setLocal(value || ""), [value]);

  // debounce 300ms
  useEffect(() => {
    const id = setTimeout(() => {
      onChange(local);
    }, 300);
    return () => clearTimeout(id);
  }, [local, onChange]);

  return (
    <div className="flex items-center gap-2 w-full max-w-md">
      <input
        type="text"
        placeholder="Name, Phone no."
        className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-indigo-300"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
      {local && (
        <button
          className="text-xs text-gray-500"
          onClick={() => setLocal("")}
        >
          Clear
        </button>
      )}
    </div>
  );
}
