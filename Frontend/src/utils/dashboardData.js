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
  previous > 0 ? ((current - previous) / previous) * 100 : null;

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

export function buildNewCustomersSeries(orders = [], period = "6m") {
  const n = period === "12m" ? 12 : 6;
  const labels = lastNMonthLabels(n);
  if (!orders || orders.length === 0)
    return { labels, values: Array(n).fill(0) };
  const now = new Date();
  const values = labels.map((_, i) => {
    const month = new Date(now.getFullYear(), now.getMonth() - (n - 1 - i), 1);
    const ids = new Set(
      orders
        .filter((o) => o.createdAt && sameMonth(o.createdAt, month))
        .map((o) => o.user?._id || o.user?.username)
        .filter(Boolean),
    );
    return ids.size;
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
      revenueChange: null,
      activeCustomers: 0,
      customersFrom: 0,
      customersChange: null,
      churnRate: 0,
      churnFrom: null,
      churnChange: null,
    };
  }
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const revenue = sumMonth(orders, now);
  const revenueFrom = sumMonth(orders, prevMonth);

  const currentOrders = orders.filter(
    (o) => o.createdAt && sameMonth(o.createdAt, now),
  );
  const previousOrders = orders.filter(
    (o) => o.createdAt && sameMonth(o.createdAt, prevMonth),
  );

  const uniqueCustomers = (list) => {
    const ids = new Set(
      list.map((o) => o.user?._id || o.user?.username).filter(Boolean),
    );
    return ids.size;
  };

  const activeCustomers = uniqueCustomers(currentOrders);
  const customersFrom = previousOrders.length > 0 ? uniqueCustomers(previousOrders) : 0;

  const churnForPeriod = (periodOrders) => {
    if (periodOrders.length === 0) return null;
    const paid = periodOrders.filter((o) => o.paymentStatus === "Paid").length;
    return Number(((1 - paid / periodOrders.length) * 100).toFixed(1));
  };

  const churnRate = churnForPeriod(currentOrders);
  const churnFrom = churnForPeriod(previousOrders);
  const churnChange =
    churnRate !== null && churnFrom !== null
      ? Number((churnRate - churnFrom).toFixed(1))
      : null;

  return {
    revenue,
    revenueFrom,
    revenueChange: pctChange(revenue, revenueFrom),
    activeCustomers,
    customersFrom,
    customersChange: pctChange(activeCustomers, customersFrom),
    churnRate: churnRate ?? 0,
    churnFrom,
    churnChange,
  };
}

export const formatMoney = (value, digits = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value) || 0);
