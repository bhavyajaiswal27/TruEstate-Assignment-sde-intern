// src/hooks/useFilters.js
import { useState } from "react";

export default function useFilters() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    region: [],
    gender: [],
    category: [],
    payment: [],
    tags: [],
    ageRange: { min: "", max: "" },
    dateRange: { start: "", end: "" },
  });

  const [sort, setSort] = useState({ field: "date", order: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const updateFilterArray = (key, value) => {
    setFilters((prev) => {
      const arr = prev[key] || [];
      const exists = arr.includes(value);
      return {
        ...prev,
        [key]: exists ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
    setPage(1);
  };

  const toggleTag = (tag) => updateFilterArray("tags", tag);

  const setAgeRange = (min, max) => {
    setFilters((prev) => ({ ...prev, ageRange: { min, max } }));
    setPage(1);
  };

  const setDateRange = (start, end) => {
    setFilters((prev) => ({ ...prev, dateRange: { start, end } }));
    setPage(1);
  };

  const resetFilters = () => {
    setFilters({
      region: [],
      gender: [],
      category: [],
      payment: [],
      tags: [],
      ageRange: { min: "", max: "" },
      dateRange: { start: "", end: "" },
    });
    setSearch("");
    setSort({ field: "date", order: "desc" });
    setPage(1);
    setPageSize(10);
  };

  return {
    search,
    setSearch,
    filters,
    updateFilterArray,
    toggleTag,
    setAgeRange,
    setDateRange,
    sort,
    setSort,
    page,
    setPage,
    pageSize,
    setPageSize,
    resetFilters,
  };
}
