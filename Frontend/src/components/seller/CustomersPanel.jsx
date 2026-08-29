import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { getInitials } from "../profile/Avatar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const spring = { type: "spring", stiffness: 260, damping: 24 };

function NewCustomersChart({ series, dark }) {
  const axisColor = dark ? "#9ca3af" : "#4b5563";
  const gridColor = dark ? "#374151" : "#e5e7eb";

  const data = {
    labels: series.labels,
    datasets: [
      {
        label: "New customers",
        data: series.values,
        backgroundColor: "#4f46e5",
        hoverBackgroundColor: "#4338ca",
        borderRadius: 4,
        maxBarThickness: 32,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.formattedValue} customers`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: axisColor },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: axisColor },
      },
    },
  };

  return (
    <div className="relative h-64">
      <Bar data={data} options={options} />
      <span className="sr-only">
        Bar chart showing new customers per month ({series.labels.join(", ")} at{" "}
        {series.values.join(", ")}).
      </span>
    </div>
  );
}

function CustomersPanel({ customers, newCustomers, dark, setToast }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        (c.email || "").toLowerCase().includes(term),
    );
  }, [customers, query]);
  const handleAddCustomer = () => {
    setToast?.({
      message: "Adding customers manually is coming soon.",
      type: "info",
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="flex items-start  justify-between flex-wrap gap-4"
      >
        <div>
          <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
            YOUR AUDIENCE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Customers
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            See who has shopped your catalog at a glance.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={handleAddCustomer}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white px-5 py-3 text-xs font-semibold tracking-wider text-white dark:text-gray-900 shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faUserPlus} className="size-3.5" />
          Add customer
        </motion.button>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm"
      >
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          New customers
        </h2>
        <div className="mt-4">
          <NewCustomersChart series={newCustomers} dark={dark} />
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.1 }}
        className="rounded-2xl border text-center  border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm"
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            All customers
          </h2>

          <label htmlFor="customer-search-input" className="sr-only">
            Search customers
          </label>
          <div className="relative">
            <input
              type="text"
              id="customer-search-input"
              placeholder="Search customers"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border-gray-200 dark:border-gray-700 dark:bg-gray-900 py-1.5 pl-3 pr-9 text-sm text-gray-900 dark:text-gray-100 shadow-xs sm:w-56"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 grid w-8 place-content-center text-gray-400">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="size-4" />
            </span>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-800">
            <thead className="ltr:text-left rtl:text-right">
              <tr className="*:font-medium *:text-gray-900">
                <th className="px-3 py-2 whitespace-nowrap dark:text-gray-100">
                  Customer
                </th>
                <th className="px-3 py-2 whitespace-nowrap dark:text-gray-100">
                  Email
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filtered.map((row) => (
                <tr
                  key={row.id}
                  className="*:text-gray-900 dark:*:text-gray-100"
                >
                  <td className="px-3 py-2 whitespace-nowrap font-medium">
                    {row.name}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}

export default CustomersPanel;
