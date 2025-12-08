// src/components/Sidebar/Sidebar.jsx
export default function Sidebar({ collapsed }) {
  return (
    <aside
  className={
    "bg-gray-50 border-r min-h-screen flex flex-col overflow-hidden transition-all duration-300 ease-out " +
    (collapsed ? "w-0" : "w-64")
  }
>

      <div
        className={
          "transition-transform duration-300 ease-out " +
          (collapsed ? "-translate-x-full" : "translate-x-0")
        }
      >
        {/* Brand */}
        <div className="px-4 py-3 border-b flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            B
          </div>
          <div>
            <div className="text-sm font-semibold">Vault</div>
            <div className="text-xs text-gray-500">Bhavya Jaiswal</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-4 text-sm">
          <div>
            <div className="text-xs uppercase text-gray-400 mb-1">Main</div>
            <button className="w-full text-left px-2 py-1 rounded bg-gray-100">
              Dashboard
            </button>
            <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-50">
              Nexus
            </button>
            <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-50">
              Intake
            </button>
          </div>

          <div>
            <div className="text-xs uppercase text-gray-400 mb-1">Services</div>
            {["Pre-active", "Active", "Blocked", "Closed"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-50"
              >
                <span className="w-2 h-2 rounded-full bg-gray-300" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div>
            <div className="text-xs uppercase text-gray-400 mb-1">
              Invoices
            </div>
            <button className="w-full text-left px-2 py-1 rounded bg-gray-100">
              Proforma Invoices
            </button>
            <button className="w-full text-left px-2 py-1 rounded hover:bg-gray-50">
              Final Invoices
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
