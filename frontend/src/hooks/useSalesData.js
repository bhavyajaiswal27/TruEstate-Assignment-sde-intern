// src/hooks/useSalesData.js
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export default function useSalesData({
  search,
  filters,
  sort,
  page,
  pageSize,
}) {
  const queryKey = ["sales", { search, filters, sort, page, pageSize }];

  const queryFn = async () => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);

    filters.region.forEach((r) => params.append("region", r));
    filters.gender.forEach((g) => params.append("gender", g));
    filters.category.forEach((c) => params.append("category", c));
    filters.payment.forEach((p) => params.append("payment", p));
    filters.tags.forEach((t) => params.append("tags", t)); // NEW

    if (filters.ageRange.min) params.set("ageMin", filters.ageRange.min);
    if (filters.ageRange.max) params.set("ageMax", filters.ageRange.max);
    if (filters.dateRange.start) params.set("dateFrom", filters.dateRange.start);
    if (filters.dateRange.end) params.set("dateTo", filters.dateRange.end);

    params.set("sortField", sort.field);
    params.set("sortOrder", sort.order);
    params.set("page", page);
    params.set("pageSize", pageSize);

    const res = await api.get(`/sales?${params.toString()}`);
    return res.data;
  };

  return useQuery({
    queryKey,
    queryFn,
    keepPreviousData: true,
  });
}
