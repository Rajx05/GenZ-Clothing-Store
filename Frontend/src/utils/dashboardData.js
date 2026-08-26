const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function lastNMonthLabels(n) {
  const labels = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(MONTHS_SHORT[d.getMonth()]);
  }
  return labels;
}

function sameMonth(dateStr, target) {
  const d = new Date(dateStr);
  return (
    d.getFullYear() === target.getFullYear() &&
    d.getMonth() === target.getMonth()
  );
}

function sumMonth(orders, target) {
  return orders
    .filter((o) => o.createdAt && sameMonth(o.createdAt, target))
    .reduce((total, o) => total + (o.totalAmount || 0), 0);
}

const pctChange = (current, previous) =>
  previous > 0 ? ((current - previous) / previous) * 100 : 0;

export function buildRevenueSeries(orders = [], period = "6m") {
  const n = period === "12m" ? 12 : 6;
  const labels = lastNMonthLabels(n);
  if (!orders || orders.length === 0)
    return { labels, values: Array(n).fill(0) };
  const now = new Date();
  const values = labels.map((_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    return sumMonth(orders, month);
  });
  return { labels, values };
}

export function buildStatusBreakdown(orders = []) {
  if (!orders || orders.length === 0) {
    return { labels: ["Paid", "Pending", "Refunded"], values: [0, 0, 0] };
  }
  const counts = { Paid: 0, Pending: 0, Refunded: 0 };
  orders.forEach((o) => {
    if (o.paymentStatus === "Paid") counts.Paid += 1;
    else if (o.paymentStatus === "Failed") counts.Refunded += 1;
    else counts.Pending += 1;
  });
  const labels = ["Paid", "Pending", "Refunded"];
  return { labels, values: labels.map((l) => counts[l]) };
}

export function buildRecentOrders(orders = [], customer = "You", limit = 4) {
  if (!orders || orders.length === 0) return [];
  return [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
    .map((o) => ({
      id: o.razorpayOrderId || `#${String(o._id).slice(-4)}`,
      customer: o.user?.username || customer,
      status:
        o.paymentStatus === "Paid"
          ? "Paid"
          : o.paymentStatus === "Failed"
            ? "Refunded"
            : "Pending",
      amount: o.totalAmount || 0,
    }));
}

export function buildCustomerRows(orders = [], customer = "You") {
  if (!orders || orders.length === 0) return [];
  const rows = orders
    .filter((o) => o.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((o) => ({
      id: o.razorpayOrderId || o._id,
      name: o.user?.username || customer,
      email: o.user?.email || "",
      total: o.totalAmount || 0,
      items: (o.items || []).reduce((n, it) => n + (it.quantity || 1), 0),
      date: o.createdAt,
      status:
        o.paymentStatus === "Paid"
          ? "Paid"
          : o.paymentStatus === "Failed"
            ? "Refunded"
            : "Pending",
    }));
  return rows;
}

export function computeStats(orders = []) {
  if (!orders || orders.length === 0) {
    return {
      revenue: 0,
      revenueFrom: 0,
      revenueChange: 0,
      activeCustomers: 0,
      customersFrom: 0,
      customersChange: 0,
      churnRate: 0,
      churnFrom: 0,
      churnChange: 0,
    };
  }
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const revenue = sumMonth(orders, now);
  const revenueFrom = sumMonth(orders, prevMonth);

  const paidCount = orders.filter((o) => o.paymentStatus === "Paid").length;
  const churn = orders.length > 0 ? (1 - paidCount / orders.length) * 100 : 0;

  return {
    revenue,
    revenueFrom,
    revenueChange: pctChange(revenue, revenueFrom),
    activeCustomers: orders.length || 0,
    customersFrom: Math.max(orders.length - 1, 0),
    customersChange: orders.length > 1 ? 100 / (orders.length - 1) : 0,
    churnRate: Number(churn.toFixed(1)),
    churnFrom: Number((churn + 0.5).toFixed(1)),
    churnChange: -1,
  };
}

export const formatMoney = (value, digits = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);
