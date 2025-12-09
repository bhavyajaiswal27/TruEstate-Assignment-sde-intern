# Sales Dashboard

## 1. Overview (3–5 lines)
A full-stack sales analytics dashboard built to handle large-scale transactional data efficiently. It supports advanced search, multi-level filtering, dynamic sorting, and server-side pagination. The system is optimized for performance using SQL-level query processing. It provides real-time insights with a responsive and animated UI.

## 2. Tech Stack
- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: SQLite (better-sqlite3)
- Data Handling: CSV Parser, Axios
- State & Caching: React Query

## 3. Search Implementation Summary
Search is implemented at the database level using SQL `LIKE` queries. It supports real-time, debounced searching across customer names and phone numbers. Queries are dynamically built to ensure efficient filtering without loading unnecessary data.

## 4. Filter Implementation Summary
Multiple filters such as region, gender, product category, payment method, tags, age range, and date range are supported. Filters are applied using SQL `WHERE` clauses with `IN`, `BETWEEN`, and logical conditions. All filters work together simultaneously.

## 5. Sorting Implementation Summary
Sorting is handled on the backend using dynamic `ORDER BY` clauses. Users can sort by customer name, date, and quantity in both ascending and descending order. Sorting is applied before pagination for accurate results.

## 6. Pagination Implementation Summary
Pagination is implemented using SQL `LIMIT` and `OFFSET`. The backend returns total row count along with the current page data. The frontend uses this information to render dynamic page numbers with next and previous navigation.

## 7. Setup Instructions
1. Clone the repository.
2. Install dependencies for both frontend and backend using `npm install`.
3. Configure environment variables in `.env.txt`.
4. Start the backend using `npm start`.
5. Start the frontend using `npm run dev`.
