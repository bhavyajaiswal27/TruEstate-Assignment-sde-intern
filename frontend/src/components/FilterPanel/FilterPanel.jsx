// src/components/FilterBar/FilterBar.jsx
import { useState, useEffect } from "react";

const REGION_OPTIONS = ["North", "South", "East", "West"];
const GENDER_OPTIONS = ["Male", "Female", "Other"];
const CATEGORY_OPTIONS = ["Clothing", "Electronics", "Grocery", "Beauty", "Other"];
const PAYMENT_OPTIONS = ["Cash", "Card", "UPI", "Wallet"];

const AGE_OPTIONS = [
  { label: "18 - 25", value: "18-25" },
  { label: "26 - 35", value: "26-35" },
  { label: "36 - 45", value: "36-45" },
  { label: "46+", value: "46-200" },
];

function PillShell({ children, className = "", onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "relative inline-flex items-center px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-md text-xs text-gray-700 shadow-sm transition-all duration-200 ease-out hover:-translate-y-[1px] hover:shadow-md " +
        className
      }
    >
      {children}
    </button>
  );
}

// Generic MULTI-SELECT dropdown with animated list
function MultiDropdown({ label, selected, options, onToggle }) {
  const [open, setOpen] = useState(false);
  const count = selected.length;

  return (
    <div className="relative">
      <PillShell onClick={() => setOpen((o) => !o)}>
        <span className="pr-4">
          {label}
          {count > 0 && ` (${count})`}
        </span>
        <span className="-ml-3 text-[10px] pointer-events-none">▾</span>
      </PillShell>

      <div
        className={
          "absolute left-0 mt-1 w-44 bg-white border rounded-md shadow-lg z-20 text-xs p-2 max-h-60 overflow-y-auto origin-top transform transition-all duration-200 " +
          (open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none")
        }
      >
        {options.map((opt, index) => {
          const checked = selected.includes(opt);
          return (
            <label
              key={opt}
              style={{ transitionDelay: open ? `${index * 20}ms` : "0ms" }}
              className={
                "flex items-center gap-2 px-1 py-0.5 cursor-pointer transition-opacity duration-200 " +
                (open ? "opacity-100" : "opacity-0") +
                (checked ? " bg-gray-50" : " hover:bg-gray-50")
              }
            >
              <input
                type="checkbox"
                className="w-3 h-3"
                checked={checked}
                onChange={() => onToggle(opt)}
              />
              <span>{opt}</span>
            </label>
          );
        })}

        {count > 0 && (
          <button
            type="button"
            className="mt-1 w-full text-left px-1 py-0.5 rounded text-gray-500 hover:bg-gray-50"
            style={{ transitionDelay: open ? `${options.length * 20}ms` : "0ms" }}
            onClick={() => selected.forEach((s) => onToggle(s))}
          >
            Clear selected
          </button>
        )}
      </div>
    </div>
  );
}

function isoToDdmm(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

function ddmmToIso(text) {
  const parts = text.split("-");
  if (parts.length !== 3) return "";
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy) return "";
  return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
}

export default function FilterBar({
  filters,
  tagOptions,
  updateFilterArray,
  toggleTag,
  setAgeRange,
  setDateRange,
  resetFilters,
}) {
  const { region, gender, category, payment, tags, ageRange, dateRange } =
    filters;

  // ---- Age multi-select local state ----
  const [ageSelectedLabels, setAgeSelectedLabels] = useState([]);

  useEffect(() => {
    if (!ageRange.min && !ageRange.max) {
      setAgeSelectedLabels([]);
    }
  }, [ageRange.min, ageRange.max]);

  const handleAgeToggle = (label) => {
    setAgeSelectedLabels((prev) => {
      const exists = prev.includes(label);
      const next = exists ? prev.filter((l) => l !== label) : [...prev, label];

      if (next.length === 0) {
        setAgeRange("", "");
        return [];
      }

      let globalMin = Infinity;
      let globalMax = -Infinity;

      AGE_OPTIONS.forEach((opt) => {
        if (!next.includes(opt.label)) return;
        const [min, max] = opt.value.split("-").map(Number);
        if (min < globalMin) globalMin = min;
        if (max > globalMax) globalMax = max;
      });

      if (!isFinite(globalMin) || !isFinite(globalMax)) {
        setAgeRange("", "");
      } else {
        setAgeRange(String(globalMin), String(globalMax));
      }

      return next;
    });
  };

  // ---- Date state ----
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [dateOpen, setDateOpen] = useState(false);

  useEffect(() => {
    setFromText(isoToDdmm(dateRange.start));
    setToText(isoToDdmm(dateRange.end));
  }, [dateRange.start, dateRange.end]);

  const applyDates = (from, to) => {
    const isoFrom = ddmmToIso(from);
    const isoTo = ddmmToIso(to);
    setDateRange(isoFrom || "", isoTo || "");
  };

  const fromLabel = isoToDdmm(dateRange.start);
  const toLabel = isoToDdmm(dateRange.end);

  // helpers for chips
  const clearDate = () => {
    setDateRange("", "");
    setFromText("");
    setToText("");
  };
  const clearAge = () => {
    setAgeRange("", "");
    setAgeSelectedLabels([]);
  };

  return (
    <div className="flex flex-col gap-1 text-xs">
      {/* Top row: dropdown pills */}
      <div className="flex items-center gap-2">
        {/* Reset */}
        <button
          type="button"
          onClick={resetFilters}
          title="Reset filters"
          className="w-8 h-8 flex items-center justify-center bg-gray-100 border border-gray-200 rounded-md text-gray-600 shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md"
        >
          ⟳
        </button>

        {/* Region, Gender, Age, Category, Tags, Payment, Date */}
        <MultiDropdown
          label="Customer Region"
          selected={region}
          options={REGION_OPTIONS}
          onToggle={(v) => updateFilterArray("region", v)}
        />

        <MultiDropdown
          label="Gender"
          selected={gender}
          options={GENDER_OPTIONS}
          onToggle={(v) => updateFilterArray("gender", v)}
        />

        <MultiDropdown
          label="Age Range"
          selected={ageSelectedLabels}
          options={AGE_OPTIONS.map((a) => a.label)}
          onToggle={handleAgeToggle}
        />

        <MultiDropdown
          label="Product Category"
          selected={category}
          options={CATEGORY_OPTIONS}
          onToggle={(v) => updateFilterArray("category", v)}
        />

        <MultiDropdown
          label="Tags"
          selected={tags}
          options={tagOptions}
          onToggle={toggleTag}
        />

        <MultiDropdown
          label="UPI"
          selected={payment}
          options={PAYMENT_OPTIONS}
          onToggle={(v) => updateFilterArray("payment", v)}
        />

        {/* Date dropdown with animated panel */}
        <div className="relative">
          <PillShell onClick={() => setDateOpen((o) => !o)}>
            <span className="pr-4">Date</span>
            <span className="-ml-3 text-[10px] pointer-events-none">▾</span>
          </PillShell>

          <div
            className={
              "absolute left-0 mt-1 w-64 bg-white border rounded-md shadow-lg z-20 text-xs p-3 space-y-2 origin-top transform transition-all duration-200 " +
              (dateOpen
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : "opacity-0 scale-95 -translate-y-1 pointer-events-none")
            }
          >
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">From (dd-mm-yyyy)</span>
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                className="border rounded px-2 py-1 text-xs"
                value={fromText}
                onChange={(e) => setFromText(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-500">To (dd-mm-yyyy)</span>
              <input
                type="text"
                placeholder="dd-mm-yyyy"
                className="border rounded px-2 py-1 text-xs"
                value={toText}
                onChange={(e) => setToText(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                className="px-2 py-1 border rounded text-xs bg-gray-50 hover:bg-gray-100"
                onClick={() => {
                  clearDate();
                  setDateOpen(false);
                }}
              >
                Clear
              </button>
              <button
                type="button"
                className="px-2 py-1 border rounded text-xs bg-gray-50 hover:bg-gray-100"
                onClick={() => {
                  applyDates(fromText, toText);
                  setDateOpen(false);
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chips row */}
      <div className="flex flex-wrap gap-1 pl-10 pt-1">
        {region.map((r) => (
          <button
            key={`region-${r}`}
            type="button"
            onClick={() => updateFilterArray("region", r)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px]"
          >
            <span>Region: {r}</span>
            <span>✕</span>
          </button>
        ))}

        {gender.map((g) => (
          <button
            key={`gender-${g}`}
            type="button"
            onClick={() => updateFilterArray("gender", g)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px]"
          >
            <span>Gender: {g}</span>
            <span>✕</span>
          </button>
        ))}

        {ageSelectedLabels.length > 0 && (
          <button
            type="button"
            onClick={clearAge}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px]"
          >
            <span>Age: {ageSelectedLabels.join(", ")}</span>
            <span>✕</span>
          </button>
        )}

        {category.map((c) => (
          <button
            key={`cat-${c}`}
            type="button"
            onClick={() => updateFilterArray("category", c)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px]"
          >
            <span>Category: {c}</span>
            <span>✕</span>
          </button>
        ))}

        {payment.map((p) => (
          <button
            key={`pay-${p}`}
            type="button"
            onClick={() => updateFilterArray("payment", p)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px]"
          >
            <span>Payment: {p}</span>
            <span>✕</span>
          </button>
        ))}

        {tags.map((t) => (
          <button
            key={`tag-${t}`}
            type="button"
            onClick={() => toggleTag(t)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px]"
          >
            <span>{t}</span>
            <span>✕</span>
          </button>
        ))}

        {(fromLabel || toLabel) && (
          <button
            type="button"
            onClick={clearDate}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px]"
          >
            <span>
              Date: {fromLabel || "…"} – {toLabel || "…"}
            </span>
            <span>✕</span>
          </button>
        )}
      </div>
    </div>
  );
}
