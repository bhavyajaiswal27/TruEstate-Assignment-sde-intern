// src/components/Pagination/Pagination.jsx
export default function Pagination({
  page,
  pageSize,
  totalRows,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

  if (totalPages <= 1) return null;

  const maxButtons = 6;

  let start = 1;
  let end = totalPages;

  if (totalPages > maxButtons) {
    const half = Math.floor(maxButtons / 2);
    start = page - half;
    if (start < 1) start = 1;
    end = start + maxButtons - 1;
    if (end > totalPages) {
      end = totalPages;
      start = end - maxButtons + 1;
    }
  }

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="mt-4 flex justify-center">
      <div className="flex items-center gap-1">
        <button
          className="px-2 h-7 border rounded text-xs disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-50"
          disabled={!canPrev}
          onClick={() => canPrev && onPageChange(page - 1)}
        >
          Prev
        </button>

        {pages.map((p) => (
          <button
            key={p}
            className={`w-7 h-7 border rounded text-xs ${
              p === page
                ? "bg-gray-800 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => onPageChange(p)}
          >
            {p}
          </button>
        ))}

        <button
          className="px-2 h-7 border rounded text-xs disabled:opacity-40 disabled:cursor-not-allowed bg-white hover:bg-gray-50"
          disabled={!canNext}
          onClick={() => canNext && onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
