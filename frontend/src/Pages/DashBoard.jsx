// src/pages/Dashboard.jsx
import { useState } from "react";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

import Sidebar from "../components/SideBar/SideBar";
import SearchBar from "../components/SearchBar/SearchBar";
import FilterBar from "../components/FilterPanel/FilterPanel";
import TransactionTable from "../components/TransactionTable/TransactionTable";
import SortDropdown from "../components/SortDropdown/SortDropDown";
import Pagination from "../components/Pagination/Pagination";
import useFilters from "../hooks/useFilters";
import useSalesData from "../hooks/useSalesData";
import useTagOptions from "../hooks/useTagOptions";

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const {
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
  resetFilters,
} = useFilters();



  const { data, isLoading, error } = useSalesData({
    search,
    filters,
    sort,
    page,
    pageSize,
  });

  const { data: tagOptions = [] } = useTagOptions();

  const rows = data?.data || [];
  const stats = data?.stats || {};
  const pagination = data?.pagination || { totalRows: 0 };

  return (
    <div className="min-h-screen bg-gray-100 flex relative">
      {/* Sidebar with curtain animation */}
      <Sidebar collapsed={sidebarCollapsed} />

      <main className="flex-1 flex flex-col bg-gray-100">
        {/* Top bar */}
        <div className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <h1 className="text-sm font-semibold">Sales Management System</h1>
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* filters + sort */}
          <div className="flex items-center justify-between gap-4">
            <FilterBar
  filters={filters}
  tagOptions={tagOptions}
  updateFilterArray={updateFilterArray}
  toggleTag={toggleTag}
  setAgeRange={setAgeRange}
  setDateRange={setDateRange}
  resetFilters={resetFilters}
/>

            <SortDropdown sort={sort} setSort={setSort} />
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-md p-3 border">
              <div className="text-xs text-gray-500">Total units sold</div>
              <div className="text-xl font-semibold mt-1">
                {stats.totalUnits ?? 0}
              </div>
            </div>
            <div className="bg-white rounded-md p-3 border">
              <div className="text-xs text-gray-500">Total Amount</div>
              <div className="text-xl font-semibold mt-1">
                ₹{stats.totalAmount ?? 0}
              </div>
            </div>
            <div className="bg-white rounded-md p-3 border">
              <div className="text-xs text-gray-500">Total Discount</div>
              <div className="text-xl font-semibold mt-1">
                ₹{stats.totalDiscount ?? 0}
              </div>
            </div>
          </div>

          {/* table + pagination */}
          {isLoading ? (
            <div className="border rounded-lg p-6 text-sm bg-white">
              Loading...
            </div>
          ) : error ? (
            <div className="border rounded-lg p-6 text-sm text-red-500 bg-white">
              Error loading data
            </div>
          ) : (
            <>
              <TransactionTable rows={rows} wide={sidebarCollapsed} />
              <Pagination
                page={page}
                pageSize={pageSize}
                totalRows={pagination.totalRows || 0}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </main>

      {/* Collapse / expand caret buttons */}
      {!sidebarCollapsed && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(true)}
          className="fixed bottom-4 right-4 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
          title="Hide sidebar"
        >
          <AiFillCaretLeft />
        </button>
      )}

      {sidebarCollapsed && (
        <button
          type="button"
          onClick={() => setSidebarCollapsed(false)}
          className="fixed bottom-4 left-4 w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
          title="Show sidebar"
        >
          <AiFillCaretRight />
        </button>
      )}
    </div>
  );
}
