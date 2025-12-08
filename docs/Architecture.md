# Sales Dashboard

A full-stack sales analytics dashboard built with React, Node.js, Express, and SQLite. Handles 1M+ rows of transaction data with advanced search, filtering, sorting, and pagination capabilities.

## 🚀 Features

- **Real-time Search** - Debounced search across customer names and phone numbers
- **Advanced Filtering** - Multi-select filters for region, gender, category, payment method, tags, age range, and date range
- **Dynamic Sorting** - Sort by customer name, date, quantity, and more
- **Animated UI** - Smooth transitions and staggered animations inspired by modern design patterns
- **Responsive Layout** - Collapsible sidebar with compact and wide table views
- **Performance Optimized** - SQL-level query optimization with proper indexing
- **One-Time CSV Import** - Automatic import from Google Drive on first run

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Data Flow](#data-flow)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Reference](#api-reference)

## 🏗️ Architecture Overview

### Tech Stack

**Backend:**
- Node.js + Express
- SQLite (better-sqlite3)
- CSV Parser
- Axios

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- React Query
- Axios

### Key Design Decisions

1. **Database-First Approach** - All heavy lifting (search, filter, sort, pagination) happens at the SQL level
2. **One-Time Import** - CSV is downloaded from Google Drive once, then all operations use the SQLite database
3. **Batch Processing** - CSV rows are inserted in batches of 1000 for optimal performance
4. **Indexed Queries** - Strategic indexes on frequently queried fields ensure fast response times
5. **React Query Caching** - Smart caching and refetching based on query parameters

## 🔧 Backend Architecture

### 1.1 Overview

The backend is a Node.js + Express API layer over a SQLite database with the following responsibilities:

- One-time ingestion of large CSV (1M+ rows) from Google Drive
- Data persistence in SQLite with appropriate indexes
- RESTful API endpoints for data retrieval and filtering
- SQL-level implementation of search, filtering, sorting, and pagination

### 1.2 Key Components

#### Express Server (`src/server.js`)
- Configures CORS and JSON parsing
- Mounts API routes at `/api/sales`
- Ensures database is ready before accepting requests
- Handles CSV import on startup if needed

#### Database Configuration (`src/config/database.js`)
- Creates SQLite database instance
- Defines `sales` table schema
- Creates indexes on:
  - `date`
  - `customer_region`
  - `product_category`
  - `customer_name`
  - `phone_number`
  - `payment_method`
  - `tags`

#### CSV Importer (`src/utils/csvImporter.js`)
- Checks if data already exists
- Downloads CSV from Google Drive using streaming
- Parses CSV rows and maps to database columns
- Batch inserts (1000 rows per transaction)
- Maps CSV headers to database columns:
  - Transaction ID → `transaction_id`
  - Customer Name → `customer_name`
  - Date → `date`
  - etc.

#### Service Layer (`src/services/salesServices.js`)
**`getSales(query)`**
- Normalizes query parameters
- Builds dynamic SQL queries
- Returns structured response:
  ```javascript
  {
    data: [...rows],
    pagination: { page, pageSize, totalRows },
    stats: { totalUnits, totalAmount, totalDiscount }
  }
  ```

**`getAllTags()`**
- Extracts unique tags from database
- Caches results in memory
- Returns sorted tag list

#### Query Builder (`src/utils/queryBuilder.js`)

**`normalizeQuery(reqQuery)`**
Converts query string parameters into normalized structure:
```javascript
{
  search: "",
  region: [], gender: [], category: [], payment: [], tags: [],
  ageMin: null, ageMax: null,
  dateFrom: null, dateTo: null,
  sortField: "date", sortOrder: "desc",
  page: 1, pageSize: 10
}
```

**`buildSalesQueries(normalized)`**
Dynamically builds SQL with:
- **WHERE conditions:**
  - Search: `LOWER(customer_name) LIKE ? OR phone_number LIKE ?`
  - Multi-select filters: `customer_region IN (?, ?, ...)`
  - Tags: Must contain ALL selected tags (AND logic)
  - Age range: `age BETWEEN ? AND ?`
  - Date range: `date BETWEEN ? AND ?`
- **ORDER BY:** Based on `sortField` and `sortOrder`
- **LIMIT & OFFSET:** For pagination

Returns both data query and stats query with same filters.

## ⚛️ Frontend Architecture

### 2.1 Overview

Built with React 18 + Vite, styled with Tailwind CSS. Uses React Query for data fetching and caching.

### 2.2 Core Features

- Sidebar with collapse/expand animation
- Debounced search bar
- Animated multi-select filter bar with chips
- Sort dropdown
- Responsive transaction table (compact/wide modes)
- Pagination with dynamic page numbers

### 2.3 Key Components

#### Sidebar (`components/Sidebar/Sidebar.jsx`)
- Vertical navigation menu
- Smooth width transition on collapse (`w-64` ↔ `w-0`)
- Controlled by caret buttons in Dashboard

#### SearchBar (`components/SearchBar/SearchBar.jsx`)
- Text input with debouncing
- Searches customer names and phone numbers
- Updates `search` state in `useFilters`

#### FilterBar (`components/FilterBar/FilterBar.jsx`)
**Animated dropdown pills for:**
- Customer Region (multi-select)
- Gender (multi-select)
- Age Range (multi-select buckets: 18–25, 26–35, 36–45, 46+)
- Product Category (multi-select)
- Tags (multi-select, dynamic from DB)
- Payment Method (multi-select)
- Date Range (From/To with dd-mm-yyyy format)

**Features:**
- Staggered animations on open (20ms delay per option)
- Filter chips below main row
- One-click clear per filter
- Converts UI state to backend-friendly parameters

#### TransactionTable (`components/TransactionTable/TransactionTable.jsx`)

**Compact Mode (`wide=false`):**
- Limited columns: ID, Date, Customer, Phone, Gender, Age, Category, Quantity
- Vertical scroll (`max-h-[520px]`)
- Sticky header

**Wide Mode (`wide=true`):**
- All columns including: Region, Type, Product details, Tags, Price, Discount, Payment, Status
- Horizontal + vertical scroll
- Used when sidebar is collapsed

**Features:**
- Copy phone number button
- Zebra striping
- Sticky table headers

#### SortDropdown (`components/SortDropdown/SortDropdown.jsx`)
Sort options:
- Customer Name (A–Z / Z–A)
- Date (Newest / Oldest)
- Quantity (High / Low)

#### Pagination (`components/Pagination/Pagination.jsx`)
- Prev/Next buttons
- Dynamic page numbers (sliding window, up to 6 visible)
- Preserves all filters/sort/search state

### 2.4 State Management Hooks

#### `useFilters.js`
Central UI state management:
```javascript
{
  search: "",
  filters: {
    region: [], gender: [], category: [], payment: [], tags: [],
    ageRange: { min: "", max: "" },
    dateRange: { start: "", end: "" }
  },
  sort: { field: "date", order: "desc" },
  page: 1,
  pageSize: 10
}
```

**Helpers:**
- `updateFilterArray(key, value)` - Add/remove from multi-select
- `toggleTag(tag)` - Toggle tag selection
- `setAgeRange(min, max)` - Set age range
- `setDateRange(start, end)` - Set date range
- `resetFilters()` - Clear all filters and return to page 1

#### `useSalesData.js`
- React Query hook for fetching sales data
- Builds URLSearchParams from filter state
- Calls `GET /api/sales`
- Returns data, stats, and pagination info
- Automatic caching and refetching

#### `useTagOptions.js`
- Fetches unique tags from `GET /api/sales/tags`
- Caches with 5-minute stale time
- Provides dynamic tag list to FilterBar

#### `services/api.js`
Configured axios instance:
```javascript
baseURL: "http://localhost:4000/api"
```

### 2.5 Dashboard Page (`pages/Dashboard.jsx`)

Main composition root that:
- Manages `sidebarCollapsed` state
- Uses all hooks (`useFilters`, `useSalesData`, `useTagOptions`)
- Renders layout with all components
- Displays KPI cards (Total Units, Total Amount, Total Discount)
- Controls caret buttons for sidebar toggle

## 🔄 Data Flow

### 3.1 Initial Data Ingestion (One-Time)

```
Server Start
    ↓
server.js calls importCsvIfNeeded()
    ↓
csvImporter.js checks if sales table has data
    ↓
If empty:
  • Download CSV from Google Drive
  • Stream through csv-parser
  • Convert rows to DB format
  • Batch insert (1000 rows per transaction)
    ↓
If not empty:
  • Skip import
    ↓
Server ready - CSV never needed again
```

### 3.2 Dashboard Request-Response Flow

```
User loads http://localhost:5173
    ↓
Dashboard mounts
    ↓
useFilters initializes default state
useSalesData fetches with default filters
useTagOptions fetches tag list
    ↓
useSalesData builds query string:
  • search
  • filters (region, gender, category, etc.)
  • ageRange, dateRange
  • sort.field, sort.order
  • page, pageSize
    ↓
GET /api/sales?...
    ↓
Backend:
  salesRoutes → salesController → salesServices
  queryBuilder builds SQL
  Database returns rows + stats
    ↓
Response rendered:
  • KPI cards updated
  • Table populated
  • Pagination configured
    ↓
User interactions (filter/sort/search/page change)
    ↓
useFilters updates state
    ↓
useSalesData refetches automatically
    ↓
UI updates
```

## 📁 Project Structure

### Backend
```
backend/
├── package.json
├── .env.txt
└── src/
    ├── server.js
    ├── config/
    │   └── database.js
    ├── routes/
    │   └── salesRoutes.js
    ├── controllers/
    │   └── salesController.js
    ├── services/
    │   ├── salesServices.js
    │   └── index.js
    ├── utils/
    │   ├── csvImporter.js
    │   └── queryBuilder.js
    └── data/
        └── sales.db (created at runtime)
```

### Frontend
```
frontend/
├── package.json
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── pages/
    │   └── Dashboard.jsx
    ├── components/
    │   ├── Sidebar/
    │   │   └── Sidebar.jsx
    │   ├── SearchBar/
    │   │   └── SearchBar.jsx
    │   ├── FilterBar/
    │   │   └── FilterBar.jsx
    │   ├── TransactionTable/
    │   │   └── TransactionTable.jsx
    │   ├── SortDropdown/
    │   │   └── SortDropdown.jsx
    │   └── Pagination/
    │       └── Pagination.jsx
    ├── hooks/
    │   ├── useFilters.js
    │   ├── useSalesData.js
    │   └── useTagOptions.js
    └── services/
        └── api.js
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
```

Create `.env.txt` file:
```env
PORT=4000
DATABASE_FILE=./src/data/sales.db
CSV_URL=https://drive.google.com/uc?export=download&id=YOUR_FILE_ID
```

Start backend:
```bash
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

Open browser at `http://localhost:5173`

## ⚙️ Configuration

### Backend Environment Variables (`.env.txt`)
- `PORT` - Server port (default: 4000)
- `DATABASE_FILE` - Path to SQLite database file
- `CSV_URL` - Google Drive download URL for CSV

### Frontend Configuration (`vite.config.js`)
- Proxy configuration for API requests (if needed)
- Build optimization settings

## 📡 API Reference

### GET `/api/sales`

Retrieve sales transactions with filtering, sorting, and pagination.

**Query Parameters:**
- `search` (string) - Search customer name or phone number
- `region` (array) - Filter by customer regions
- `gender` (array) - Filter by gender
- `category` (array) - Filter by product category
- `payment` (array) - Filter by payment method
- `tags` (array) - Filter by tags (AND logic)
- `ageMin` (number) - Minimum age
- `ageMax` (number) - Maximum age
- `dateFrom` (string) - Start date (ISO format)
- `dateTo` (string) - End date (ISO format)
- `sortField` (string) - Field to sort by (default: "date")
- `sortOrder` (string) - "asc" or "desc" (default: "desc")
- `page` (number) - Page number (default: 1)
- `pageSize` (number) - Items per page (default: 10)

**Response:**
```json
{
  "data": [...transactions],
  "pagination": {
    "page": 1,
    "pageSize": 10,
    "totalRows": 1000000
  },
  "stats": {
    "totalUnits": 50000,
    "totalAmount": 5000000,
    "totalDiscount": 250000
  }
}
```

### GET `/api/sales/tags`

Retrieve all unique tags from the database.

**Response:**
```json
{
  "tags": ["Electronics", "Clothing", "Home", ...]
}
```

## 📊 Module Responsibilities

### Backend Modules

| Module | Responsibility |
|--------|---------------|
| `server.js` | Initialize app, import CSV if needed, start server |
| `config/database.js` | Configure SQLite connection, define schema and indexes |
| `utils/csvImporter.js` | One-time CSV import from Google Drive with batching |
| `utils/queryBuilder.js` | Build dynamic SQL for search, filters, sorting, pagination |
| `services/salesServices.js` | Core business logic for data retrieval and aggregation |
| `controllers/salesController.js` | HTTP request/response handling |
| `routes/salesRoutes.js` | Route definitions for API endpoints |

### Frontend Modules

| Module | Responsibility |
|--------|---------------|
| `pages/Dashboard.jsx` | Main layout and orchestration of components |
| `components/Sidebar/` | Navigation with collapse/expand animation |
| `components/SearchBar/` | Search input with debouncing |
| `components/FilterBar/` | Animated multi-select filters and chips |
| `components/TransactionTable/` | Table view with compact/wide modes |
| `components/SortDropdown/` | Sorting selection interface |
| `components/Pagination/` | Page navigation controls |
| `hooks/useFilters.js` | Central UI state management |
| `hooks/useSalesData.js` | API communication via React Query |
| `hooks/useTagOptions.js` | Dynamic tag fetching and caching |
| `services/api.js` | Axios instance configuration |

## 🎨 UI Features

- **Staggered Animations** - Filter dropdowns open with cascading effect
- **Smooth Transitions** - Sidebar collapse, filter chips, and page changes
- **Responsive Design** - Adapts to sidebar state with compact/wide table modes
- **Filter Chips** - Visual representation of active filters with easy removal
- **Copy to Clipboard** - One-click phone number copying
- **Sticky Headers** - Table headers remain visible during scroll
- **Zebra Striping** - Alternating row colors for better readability

## 🔍 Performance Optimizations

1. **Database Indexing** - Strategic indexes on frequently queried fields
2. **Batch Imports** - 1000 rows per transaction during CSV import
3. **SQL-Level Operations** - All filtering, sorting, and pagination in database
4. **React Query Caching** - Intelligent caching prevents unnecessary API calls
5. **Debounced Search** - Reduces API calls during typing
6. **Prepared Statements** - SQL injection prevention and performance boost

## License

This project is proprietary and confidential.

## Contributing

Please contact the development team before making contributions.

---

Built with ❤️ using React, Node.js, and SQLite