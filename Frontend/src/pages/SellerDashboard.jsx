import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faBoxesStacked,
  faUsers,
  faBagShopping,
  faFileInvoice,
  faUserCog,
  faCircleCheck,
  faCircleQuestion,
  faRightFromBracket,
  faBars,
  faPlus,
  faReceipt,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import useApp from "../hooks/useApp";
import useAuth from "../hooks/useAuth";
import { StatCardSkeleton } from "../components/Skeleton";
import Avatar, { getInitials } from "../components/profile/Avatar";
import SettingsPanel from "../components/profile/SettingsPanel";
import ProductsPanel from "../components/seller/ProductsPanel";
import {
  buildRevenueSeries,
  buildStatusBreakdown,
  buildRecentOrders,
  buildCustomerRows,
  computeStats,
  formatMoney,
} from "../utils/dashboardData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
);

const spring = { type: "spring", stiffness: 260, damping: 24 };

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: faChartPie },
  { id: "products", label: "Products", icon: faBoxesStacked },
  { id: "customers", label: "Customers", icon: faUsers },
  { id: "orders", label: "Orders", icon: faBagShopping },
  { id: "billing", label: "Billing", icon: faFileInvoice },
  { id: "settings", label: "Settings", icon: faUserCog },
];

const STATUS_BADGE = {
  Paid: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  Pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  Refunded: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

// ----------------------------- sub-components -----------------------------//

function StatusPill({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STATUS_BADGE[status] || STATUS_BADGE.Pending
      }`}
    >
      {status}
    </span>
  );
}

function SidebarContent({ user, active, onSelect, onLogout, onClose }) {
  return (
    <>
      <div className="p-4 flex flex-col items-start ">
        <div className="self-center">
          <span className="inline-block text-sm font-display font-bold tracking-wide text-gray-700 dark:text-gray-300 uppercase">
            Seller
          </span>
        </div>

        <nav aria-label="Dashboard" className="mt-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelect(item.id);
                  onClose?.();
                }}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center gap-3 w-full rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-4 text-center" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3 p-4">
          <Avatar user={user} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user?.name || user?.username || "Member"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email || "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            aria-label="Logout"
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        </div>
      </div>
    </>
  );
}

function SellerSidebar({ user, active, onSelect, onLogout, open, onClose }) {
  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-gray-900/50 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 start-0 z-40 flex w-64 -translate-x-full flex-col justify-between overflow-y-auto border-e border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-transform duration-300 lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:shrink-0 lg:translate-x-0 lg:justify-start lg:border-e lg:bg-transparent lg:p-0 ${
          open ? "translate-x-0" : ""
        }`}
      >
        <SidebarContent
          user={user}
          active={active}
          onSelect={onSelect}
          onLogout={onLogout}
          onClose={onClose}
        />
      </aside>
    </>
  );
}

function DashboardHeader({ title, onMenuClick, onNewReport }) {
  return (
    <header className="sticky top-16 z-20 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur px-4 sm:px-6 py-4 lg:top-20">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle menu"
          className="cursor-pointer rounded-md p-2 text-gray-600 dark:text-gray-400 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
        >
          <FontAwesomeIcon icon={faBars} className="size-5" />
        </button>
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
      </div>

      <button
        type="button"
        onClick={onNewReport}
        className="inline-flex items-center gap-2 rounded-md bg-gray-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-gray-900 transition hover:bg-gray-800 dark:hover:bg-gray-100"
      >
        <FontAwesomeIcon icon={faPlus} className="size-3.5" />
        New report
      </button>
    </header>
  );
}

function TrendBadge({ value, decrease = false }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 self-end rounded-sm p-1 text-xs font-medium ${
        decrease
          ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
          : "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400"
      }`}
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        className="size-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d={
            decrease
              ? "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              : "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          }
        />
      </svg>
      <span className="sr-only">{decrease ? "Decrease: " : "Increase: "}</span>
      {value}%
    </span>
  );
}

function StatCard({ label, value, from, badge, decrease = false, children }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring }}
      className="flex flex-col gap-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm"
    >
      <TrendBadge value={badge} decrease={decrease} />
      <div>
        <strong className="block text-sm font-medium text-gray-600 dark:text-gray-50">
          {label}
        </strong>
        <p className="mt-1">
          <span className="text-2xl font-medium text-gray-900 dark:text-gray-100">
            {value}
          </span>
          {from !== undefined && (
            <span className="ms-2 text-xs text-gray-600 dark:text-gray-400">
              from {from}
            </span>
          )}
        </p>
      </div>
      {children}
    </motion.article>
  );
}

function RevenueSparkline({ series }) {
  const data = {
    labels: series.labels,
    datasets: [
      {
        data: series.values,
        borderColor: "#10b981",
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.35,
        fill: false,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: { x: { display: false }, y: { display: false } },
  };
  return (
    <div className="h-10">
      <Line data={data} options={options} />
    </div>
  );
}

function RevenueTrendChart({ series, dark }) {
  const axisColor = dark ? "#9ca3af" : "#4b5563";
  const gridColor = dark ? "#374151" : "#e5e7eb";
  const fillGradient = (context) => {
    const { chart } = context;
    const { ctx, chartArea } = chart;
    if (!chartArea) return "rgba(79, 70, 229, 0.1)";
    const gradient = ctx.createLinearGradient(
      0,
      chartArea.top,
      0,
      chartArea.bottom,
    );
    gradient.addColorStop(0, "rgba(79, 70, 229, 0.25)");
    gradient.addColorStop(1, "rgba(79, 70, 229, 0)");
    return gradient;
  };

  const data = {
    labels: series.labels,
    datasets: [
      {
        label: "Revenue",
        data: series.values,
        borderColor: "#4f46e5",
        backgroundColor: fillGradient,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#4f46e5",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2,
        tension: 0.35,
        fill: true,
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
        callbacks: { label: (item) => formatMoney(item.parsed.y) },
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
        ticks: {
          color: axisColor,
          callback: (tickValue) => `₹${Number(tickValue) / 1000}k`,
        },
      },
    },
  };
  return (
    <div className="h-64">
      <Line data={data} options={options} />
    </div>
  );
}

function OrderStatusDonut({ breakdown, dark }) {
  const data = {
    labels: breakdown.labels,
    datasets: [
      {
        data: breakdown.values,
        backgroundColor: ["#10b981", "#f59e0b", "#f43f5e"],
        hoverBackgroundColor: ["#059669", "#d97706", "#e11d48"],
        borderColor: dark ? "#111827" : "#ffffff",
        borderWidth: 2,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: dark ? "#9ca3af" : "#4b5563" },
      },
      tooltip: {
        callbacks: {
          label: (item) => `${item.label}: ${item.formattedValue}%`,
        },
      },
    },
  };
  return (
    <div className="h-64">
      <Doughnut data={data} options={options} />
    </div>
  );
}

function OverviewPanel({
  stats,
  revenue,
  statusBreakdown,
  recentOrders,
  dark,
}) {
  const [range, setRange] = useState("6m");

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Monthly revenue"
          value={formatMoney(stats.revenue)}
          from={formatMoney(stats.revenueFrom)}
          badge={Math.abs(stats.revenueChange).toFixed(1)}
          decrease={stats.revenueChange < 0}
        >
          <RevenueSparkline series={revenue["6m"]} />
        </StatCard>

        <StatCard
          label="Active customers"
          value={stats.activeCustomers.toLocaleString()}
          from={stats.customersFrom.toLocaleString()}
          badge={Math.abs(stats.customersChange).toFixed(1)}
          decrease={stats.customersChange < 0}
        />

        <StatCard
          label="Churn rate"
          value={`${stats.churnRate}%`}
          from={`${stats.churnFrom}%`}
          badge={Math.abs(stats.churnChange).toFixed(1)}
          decrease={stats.churnChange < 0}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.05 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm lg:col-span-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Revenue trend
            </h2>
            <div className="inline-flex rounded-md border border-gray-200 dark:border-gray-700 p-0.5 text-xs font-medium">
              {["6m", "12m"].map((r) => {
                const selected = range === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    aria-pressed={selected}
                    className={`rounded-sm px-2 py-1 transition-colors ${
                      selected
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {r === "6m" ? "6M" : "12M"}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="mt-4">
            <RevenueTrendChart series={revenue[range]} dark={dark} />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.1 }}
          className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm"
        >
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Orders by status
          </h2>
          <div className="mt-4">
            <OrderStatusDonut breakdown={statusBreakdown} dark={dark} />
          </div>
        </motion.section>
      </div>

      {/* Recent orders */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.15 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Recent orders
          </h2>
          <Link
            to="/my-orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
          >
            View all{" "}
            <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-800">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                {["Customer", "Order", "Status", "Amount"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {recentOrders.map((row) => (
                <tr
                  key={row.id}
                  className="*:text-gray-900 dark:*:text-gray-100"
                >
                  <td className="px-3 py-2 whitespace-nowrap font-medium">
                    {row.customer}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{row.id}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {formatMoney(row.amount, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    </div>
  );
}

function CustomersPanel({ customers }) {
  return (
    <div className="space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="flex items-center justify-between flex-wrap gap-3"
      >
        <div>
          <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
            YOUR AUDIENCE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Customers
          </h1>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm overflow-x-auto"
      >
        <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-800">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              {["Customer", "Orders", "Items", "Total spent", "Status"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {customers.map((c) => (
              <tr
                key={c.id || c.name}
                className="*:text-gray-900 dark:*:text-gray-100"
              >
                <td className="px-3 py-2 whitespace-nowrap font-medium">
                  <span className="flex items-center gap-2.5">
                    <span className="grid size-8 place-content-center rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 text-xs font-bold">
                      {getInitials(c.name)}
                    </span>
                    {c.name}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {c.orders ?? (c.id ? 1 : "—")}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {c.items ?? "—"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatMoney(c.total ?? c.spent, 2)}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {c.status ? <StatusPill status={c.status} /> : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

function OrdersPanel({ orders, customer }) {
  const rows = useMemo(
    () => buildRecentOrders(orders, customer, 10),
    [orders, customer],
  );

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
          ALL TRANSACTIONS
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          Orders
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm overflow-x-auto"
      >
        <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-800">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              {["Order", "Customer", "Status", "Amount"].map((h) => (
                <th
                  key={h}
                  className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {rows.map((row) => (
              <tr key={row.id} className="*:text-gray-900 dark:*:text-gray-100">
                <td className="px-3 py-2 whitespace-nowrap font-medium">
                  {row.id}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{row.customer}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <StatusPill status={row.status} />
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {formatMoney(row.amount, 2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}

function BillingPanel({ orders }) {
  const totals = useMemo(() => {
    const sum = (pred) =>
      orders.filter(pred).reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const status = (s) =>
      s === "Paid" ? "Paid" : s === "Failed" ? "Refunded" : "Pending";
    return {
      total: sum(() => true),
      Paid: sum((o) => status(o.paymentStatus) === "Paid"),
      Pending: sum((o) => status(o.paymentStatus) === "Pending"),
      Refunded: sum((o) => status(o.paymentStatus) === "Refunded"),
    };
  }, [orders]);

  const cards = [
    { label: "Total revenue", value: totals.total, icon: faReceipt },
    { label: "Collected (Paid)", value: totals.Paid, icon: faCircleCheck },
    {
      label: "Outstanding (Pending)",
      value: totals.Pending,
      icon: faBagShopping,
    },
    { label: "Refunded", value: totals.Refunded, icon: faCircleQuestion },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
          MONEY AT A GLANCE
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
          Billing
        </h1>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...spring, delay: i * 0.05 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5 sm:p-6 shadow-sm"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/30 flex items-center justify-center text-brand-600 dark:text-brand-400">
              <FontAwesomeIcon icon={card.icon} />
            </div>
            <p className="mt-4 text-2xl font-display font-bold text-gray-900 dark:text-gray-100">
              {formatMoney(card.value)}
            </p>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mt-1">
              {card.label}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.15 }}
        className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 sm:p-6 shadow-sm overflow-x-auto"
      >
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Invoices
        </h2>
        <div className="mt-4">
          <table className="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-800">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                {["Invoice", "Status", "Amount"].map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 whitespace-nowrap font-medium text-gray-900 dark:text-gray-100"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No invoices yet — demo data shown on the Overview tab.
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr
                    key={o.razorpayOrderId || o._id}
                    className="*:text-gray-900 dark:*:text-gray-100"
                  >
                    <td className="px-3 py-2 whitespace-nowrap font-medium">
                      {o.razorpayOrderId || o._id}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <StatusPill
                        status={
                          o.paymentStatus === "Paid"
                            ? "Paid"
                            : o.paymentStatus === "Failed"
                              ? "Refunded"
                              : "Pending"
                        }
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {formatMoney(o.totalAmount, 2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

// ------------------------------- main page -------------------------------//

export default function SellerDashboard() {
  const {
    setToast,
    cartLoading,
    fetchCartItems,
    sellerOrders,
    getSellerOrders,
    darkMode,
  } = useApp();
  const { loggedIn, setLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  console.log("seller orders:", sellerOrders);
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("tab") || "overview";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const loggedOutRef = useRef(false);

  // Redirect to login if not authenticated (skip once user logs out on purpose)
  useEffect(() => {
    if (!loggedIn.status && !loggedOutRef.current) {
      navigate("/login");
    }
  }, [loggedIn.status, navigate]);

  // Refresh cart + seller orders for this session
  useEffect(() => {
    if (loggedIn.status) {
      fetchCartItems();
      getSellerOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn.status]);

  // Close the mobile drawer when resizing up to desktop
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const user = loggedIn.user || {};
  const customer = user?.username || "You";

  const stats = useMemo(() => computeStats(sellerOrders), [sellerOrders]);
  const revenue = useMemo(
    () => ({
      "6m": buildRevenueSeries(sellerOrders, "6m"),
      "12m": buildRevenueSeries(sellerOrders, "12m"),
    }),
    [sellerOrders],
  );
  const statusBreakdown = useMemo(
    () => buildStatusBreakdown(sellerOrders),
    [sellerOrders],
  );
  const recentOrders = useMemo(
    () => buildRecentOrders(sellerOrders, customer),
    [sellerOrders, customer],
  );
  const customers = useMemo(
    () => buildCustomerRows(sellerOrders, customer),
    [sellerOrders, customer],
  );

  if (!loggedIn.status) return null;

  const title =
    NAV_ITEMS.find((item) => item.id === active)?.label || "Overview";

  const handleLogout = () => {
    loggedOutRef.current = true;
    logout();
    navigate("/");
  };

  const handleSaved = (updatedUser) => {
    if (!updatedUser) {
      setToast?.({
        message: "Could not save settings. Please try again.",
        type: "error",
      });
      return;
    }
    setLoggedIn({ status: true, user: { ...user, ...updatedUser } });
    setToast?.({ message: "Profile updated successfully!", type: "success" });
  };

  const handleNewReport = () =>
    setToast?.({ message: "Report generated (demo)", type: "success" });

  const showSkeletons = cartLoading || false;

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col">
      <div className="lg:flex lg:items-start">
        <SellerSidebar
          user={user}
          active={active}
          onSelect={(id) => setSearchParams({ tab: id })}
          onLogout={handleLogout}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="min-w-0 flex-1">
          <DashboardHeader
            title={title}
            onMenuClick={() => setSidebarOpen(true)}
            onNewReport={handleNewReport}
          />

          <AnimatePresence mode="wait">
            {active === "overview" && (
              <motion.main
                key="overview"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
              >
                {showSkeletons ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 p-4 sm:p-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <StatCardSkeleton key={i} index={i} />
                    ))}
                  </div>
                ) : (
                  <OverviewPanel
                    stats={stats}
                    revenue={revenue}
                    statusBreakdown={statusBreakdown}
                    recentOrders={recentOrders}
                    dark={darkMode}
                  />
                )}
              </motion.main>
            )}

            {active === "customers" && (
              <motion.main
                key="customers"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
              >
                <CustomersPanel customers={customers} />
              </motion.main>
            )}

            {active === "products" && (
              <motion.main
                key="products"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
              >
                <ProductsPanel setToast={setToast} />
              </motion.main>
            )}

            {active === "orders" && (
              <motion.main
                key="orders"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
              >
                <OrdersPanel orders={sellerOrders} customer={customer} />
              </motion.main>
            )}

            {active === "billing" && (
              <motion.main
                key="billing"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
              >
                <BillingPanel orders={sellerOrders} />
              </motion.main>
            )}

            {active === "settings" && (
              <motion.main
                key="settings"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={spring}
              >
                <div className="p-4 sm:p-6">
                  <SettingsPanel user={user} onSaved={handleSaved} />
                </div>
              </motion.main>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
