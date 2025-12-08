// src/components/TransactionTable/TransactionTable.jsx
export default function TransactionTable({ rows, wide }) {
  const handleCopy = (phone) => {
    if (!phone) return;
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(phone).catch(() => {});
    } else {
      const el = document.createElement("textarea");
      el.value = phone;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
  };

  if (!rows.length) {
    return (
      <div className="border rounded-lg p-6 text-sm text-gray-500 bg-white">
        No transactions match your filters.
      </div>
    );
  }

  if (!wide) {
    // normal compact view (till Quantity)
    return (
      <div className="border rounded-lg bg-white shadow-sm">
        <div className="max-h-[520px] overflow-y-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="px-3 py-2 text-left font-semibold">
                  Transaction ID
                </th>
                <th className="px-3 py-2 text-left font-semibold">Date</th>
                <th className="px-3 py-2 text-left font-semibold">
                  Customer ID
                </th>
                <th className="px-3 py-2 text-left font-semibold">
                  Customer name
                </th>
                <th className="px-3 py-2 text-left font-semibold">
                  Phone Number
                </th>
                <th className="px-3 py-2 text-left font-semibold">Gender</th>
                <th className="px-3 py-2 text-left font-semibold">Age</th>
                <th className="px-3 py-2 text-left font-semibold">
                  Product Category
                </th>
                <th className="px-3 py-2 text-left font-semibold">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={row.id || `${row.transaction_id}-${idx}`}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.transaction_id}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.date}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.customer_id}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.customer_name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-gray-700">
                      <span>{row.phone_number}</span>
                      <button
                        type="button"
                        className="p-0.5 rounded text-gray-400 hover:text-gray-600"
                        onClick={() => handleCopy(row.phone_number)}
                        title="Copy phone number"
                      >
                        <span className="text-[13px] leading-none">⧉</span>
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.gender}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.age}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {row.product_category}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-right">
                    {row.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // WIDE MODE – show all important columns with horizontal scroll
  return (
    <div className="border rounded-lg bg-white shadow-sm">
      <div className="max-h-[520px] overflow-y-auto overflow-x-auto">
        <table className="min-w-max text-xs">
          <thead className="bg-gray-50 border-b sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-left font-semibold">
                Transaction ID
              </th>
              <th className="px-3 py-2 text-left font-semibold">Date</th>
              <th className="px-3 py-2 text-left font-semibold">
                Customer ID
              </th>
              <th className="px-3 py-2 text-left font-semibold">
                Customer name
              </th>
              <th className="px-3 py-2 text-left font-semibold">
                Phone Number
              </th>
              <th className="px-3 py-2 text-left font-semibold">Gender</th>
              <th className="px-3 py-2 text-left font-semibold">Age</th>
              <th className="px-3 py-2 text-left font-semibold">
                Customer Region
              </th>
              <th className="px-3 py-2 text-left font-semibold">
                Customer Type
              </th>
              <th className="px-3 py-2 text-left font-semibold">Product ID</th>
              <th className="px-3 py-2 text-left font-semibold">
                Product Name
              </th>
              <th className="px-3 py-2 text-left font-semibold">Brand</th>
              <th className="px-3 py-2 text-left font-semibold">
                Product Category
              </th>
              <th className="px-3 py-2 text-left font-semibold">Tags</th>
              <th className="px-3 py-2 text-left font-semibold">Quantity</th>
              <th className="px-3 py-2 text-left font-semibold">
                Price / Unit
              </th>
              <th className="px-3 py-2 text-left font-semibold">
                Discount %
              </th>
              <th className="px-3 py-2 text-left font-semibold">
                Total Amount
              </th>
              <th className="px-3 py-2 text-left font-semibold">
                Final Amount
              </th>
              <th className="px-3 py-2 text-left font-semibold">
                Payment Method
              </th>
              <th className="px-3 py-2 text-left font-semibold">Order Status</th>
              <th className="px-3 py-2 text-left font-semibold">
                Delivery Type
              </th>
              <th className="px-3 py-2 text-left font-semibold">Store ID</th>
              <th className="px-3 py-2 text-left font-semibold">
                Store Location
              </th>
              <th className="px-3 py-2 text-left font-semibold">
                Salesperson ID
              </th>
              <th className="px-3 py-2 text-left font-semibold">
                Employee Name
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id || `${row.transaction_id}-${idx}`}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.transaction_id}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{row.date}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.customer_id}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.customer_name}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center gap-1 text-gray-700">
                    <span>{row.phone_number}</span>
                    <button
                      type="button"
                      className="p-0.5 rounded text-gray-400 hover:text-gray-600"
                      onClick={() => handleCopy(row.phone_number)}
                      title="Copy phone number"
                    >
                      <span className="text-[13px] leading-none">⧉</span>
                    </button>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{row.gender}</td>
                <td className="px-3 py-2 whitespace-nowrap">{row.age}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.customer_region}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.customer_type}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.product_id}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.product_name}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{row.brand}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.product_category}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{row.tags}</td>
                <td className="px-3 py-2 whitespace-nowrap text-right">
                  {row.quantity}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.price_per_unit}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.discount_percentage}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.total_amount}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.final_amount}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.payment_method}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.order_status}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.delivery_type}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.store_id}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.store_location}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.salesperson_id}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {row.employee_name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
