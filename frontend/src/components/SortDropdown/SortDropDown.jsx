// src/components/SortDropdown/SortDropdown.jsx
const OPTIONS = [
  { value: "customerName_asc", label: "Customer Name (A-Z)" },
  { value: "customerName_desc", label: "Customer Name (Z-A)" },
  { value: "date_desc", label: "Date (Newest First)" },
  { value: "date_asc", label: "Date (Oldest First)" },
  { value: "quantity_desc", label: "Quantity (High to Low)" },
  { value: "quantity_asc", label: "Quantity (Low to High)" },
];

export default function SortDropdown({ sort, setSort }) {
  const current = `${sort.field}_${sort.order}`;

  const handleChange = (e) => {
    const [field, order] = e.target.value.split("_");
    setSort({ field, order });
  };

  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500">Sort by:</span>
      <div className="inline-flex items-center px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-md text-xs text-gray-700">
        <select
          className="bg-transparent outline-none border-none text-xs pr-4 cursor-pointer"
          value={current}
          onChange={handleChange}
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <span className="-ml-3 text-[10px] pointer-events-none">▾</span>
      </div>
    </div>
  );
}
