import { useState, useMemo, useRef, useEffect } from "react";
import axiosPrivate from "../../api/axiosPrivate";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMagnifyingGlass,
  faPen,
  faTrash,
  faXmark,
  faBoxesStacked,
  faBagShopping,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { CATEGORIES } from "../../data/constants";
import useApp from "../../hooks/useApp";

const spring = { type: "spring", stiffness: 260, damping: 24 };

const STOCK_META = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "low", label: "Low stock" },
  { id: "out", label: "Out of stock" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL"];
const COLOR_OPTIONS = [
  "#1a1a1a",
  "#ffffff",
  "#8b7355",
  "#c4a882",
  "#2d2d2d",
  "#6b4226",
  "#1a1a2e",
  "#97c1a9",
  "#d4a574",
  "#bcd4e6",
];
const BADGE_OPTIONS = [
  { value: "", label: "None" },
  { value: "New", label: "New" },
  { value: "Sale", label: "Sale" },
  { value: "Best Seller", label: "Best Seller" },
];

const inputCls = (error) =>
  `w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border ${
    error ? "border-red-500" : "border-gray-200 dark:border-gray-700"
  } focus:ring-2 focus:ring-brand-500 outline-none text-sm text-gray-900 dark:text-white transition`;

const labelCls =
  "block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2";

function StockPill({ stock }) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-400">
        Out of stock
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400">
        Low · {stock} left
      </span>
    );
  }
  return (
    <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">
      In stock · {stock}
    </span>
  );
}

function ProductFormModal({ initial, onSave, onClose, submitting }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(() => ({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    originalPrice: initial?.originalPrice ?? "",
    category: initial?.category ?? CATEGORIES[0]?.name ?? "Dresses",
    image: initial?.image ?? "",
    sizes: initial?.sizes ?? ["S", "M", "L"],
    colors: initial?.colors ?? ["#1a1a1a", "#ffffff"],
    stock: initial?.stock ?? "",
    badge: initial?.badge ?? "",
  }));
  const fileRef = useRef(null);
  const [errors, setErrors] = useState({});

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const toggleSize = (size) => {
    set(
      "sizes",
      form.sizes.includes(size)
        ? form.sizes.filter((s) => s !== size)
        : [...form.sizes, size],
    );
  };
  const toggleColor = (color) => {
    set(
      "colors",
      form.colors.includes(color)
        ? form.colors.filter((c) => c !== color)
        : [...form.colors, color],
    );
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Product name is required";
    if (form.price === "" || Number(form.price) <= 0)
      nextErrors.price = "Enter a valid price";
    if (form.sizes.length === 0) nextErrors.sizes = "Pick at least one size";
    if (form.colors.length === 0) nextErrors.colors = "Pick at least one color";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSave({
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      stock: Number(form.stock) || 0,
      imageFile: fileRef.current?.files?.[0] ?? null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={spring}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-gray-100">
              {isEdit ? "Edit product" : "Add new product"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {isEdit
                ? "Update the details of this listing."
                : "List a new piece in your catalog."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          id="product-form"
          className="space-y-5 px-6 py-5 max-h-[65vh] overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className={labelCls}>Product name</label>
              <input
                type="text"
                value={form.name}
                name="name"
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Wool Blend Trench Coat"
                className={inputCls(errors.name)}
              />
              {errors.name && (
                <p
                  className="text-xs text-red-500 mt-1 font-medium"
                  role="alert"
                >
                  {errors.name}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Description</label>
              <textarea
                value={form.description}
                name="description"
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe your product..."
                rows={3}
                className={inputCls(errors.description)}
              />
            </div>

            <div>
              <label className={labelCls}>Price (₹)</label>
              <input
                type="number"
                min="0"
                name="price"
                step="0.01"
                value={form.price}
                onChange={(e) => set("price", e.target.value)}
                placeholder="129"
                className={inputCls(errors.price)}
              />
              {errors.price && (
                <p
                  className="text-xs text-red-500 mt-1 font-medium"
                  role="alert"
                >
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className={labelCls}>Original price (₹)</label>
              <input
                type="number"
                min="0"
                name="original_price"
                step="0.01"
                value={form.originalPrice}
                onChange={(e) => set("originalPrice", e.target.value)}
                placeholder="Optional"
                className={inputCls()}
              />
            </div>

            <div>
              <label className={labelCls}>Category</label>
              <select
                name="category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={inputCls()}
              >
                {CATEGORIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Stock quantity</label>
              <input
                type="number"
                min="0"
                name="stock"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="0"
                className={inputCls()}
              />
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Badge</label>
              <div className="flex flex-wrap gap-2">
                {BADGE_OPTIONS.map((b) => {
                  const selected = form.badge === b.value;
                  return (
                    <button
                      key={b.value}
                      type="button"
                      value={form.badge}
                      name="badge"
                      onClick={() => set("badge", b.value)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
                        selected
                          ? "bg-brand-100 dark:bg-brand-900/30 border-brand-600 text-brand-700 dark:text-brand-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Upload Image </label>
              <input
                type="file"
                ref={fileRef}
                name="image"
                accept="image/png, image/jpeg, image/webp, image/jpg"
                required
                className={inputCls(errors.image)}
              />
              {errors.image && (
                <p
                  className="text-xs text-red-500 mt-1 font-medium"
                  role="alert"
                >
                  {errors.image}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Sizes</label>
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((size) => {
                  const selected = form.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      type="button"
                      value={form.sizes}
                      name="sizes"
                      onClick={() => toggleSize(size)}
                      className={`h-10 w-10 rounded-xl text-xs font-bold border transition-colors ${
                        selected
                          ? "bg-brand-100 dark:bg-brand-900/30 border-brand-600 text-brand-700 dark:text-brand-400"
                          : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {errors.sizes && (
                <p
                  className="text-xs text-red-500 mt-1 font-medium"
                  role="alert"
                >
                  {errors.sizes}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Colors</label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => {
                  const selected = form.colors.includes(color);
                  return (
                    <button
                      key={color}
                      value={form.colors}
                      type="button"
                      name="colors"
                      onClick={() => toggleColor(color)}
                      aria-label={`Color ${color}`}
                      required
                      className={`h-9 w-9 rounded-full border-2 transition ${
                        selected
                          ? "border-brand-600 scale-110"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  );
                })}
              </div>
              {errors.colors && (
                <p
                  className="text-xs text-red-500 mt-1 font-medium"
                  role="alert"
                >
                  {errors.colors}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-800 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-xs font-semibold tracking-wider border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              CANCEL
            </button>
            <motion.button
              whileHover={{ scale: submitting ? 1 : 1.02 }}
              whileTap={{ scale: submitting ? 1 : 0.98 }}
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-semibold tracking-wider shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting && (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="text-[10px]"
                />
              )}
              {submitting
                ? isEdit
                  ? "SAVING..."
                  : "ADDING..."
                : isEdit
                  ? "SAVE CHANGES"
                  : "ADD PRODUCT"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default function ProductsPanel({ setToast }) {
  const {
    sellerProducts,
    setSellerProducts,
    getSellerProducts,
    updateSellerProduct,
  } = useApp();

  useEffect(() => {
    getSellerProducts();
  }, [getSellerProducts]);

  const products = sellerProducts;
  const total = products.length !== undefined ? products.length : 0;
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const stats = useMemo(() => {
    if (total !== 0) {
      const out = products.filter((p) => p.stock <= 0).length;
      const low = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
      return { total, low, out, active: total - low - out };
    } else {
      return { total, low: 0, out: 0, active: 0 };
    }
  }, [products, total]);

  const filtered = useMemo(() => {
    if (total === 0) {
      return {};
    } else {
      return products.filter((p) => {
        const matchesQuery =
          !query.trim() ||
          p.name.toLowerCase().includes(query.trim().toLowerCase());
        const matchesFilter =
          filter === "all" ||
          (filter === "active" && p.stock > 5) ||
          (filter === "low" && p.stock > 0 && p.stock <= 5) ||
          (filter === "out" && p.stock <= 0);
        return matchesQuery && matchesFilter;
      });
    }
  }, [products, query, filter, total]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    // IF EDITING EXISTING PRODUCT
    if (editing) {
      try {
        setSubmitting(true);
        await updateSellerProduct(editing._id, data);
        await getSellerProducts();
        setToast?.({
          message: `"${data.name}" updated successfully!`,
          type: "success",
        });
      } catch (error) {
        console.error("Error updating product:", error);
        setToast?.({
          message: "Failed to update product. Please try again.",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    }

    // IF ADDING NEW PRODUCT
    else {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("originalPrice", data.originalPrice ?? "");
      formData.append("category", data.category);
      formData.append("stock", data.stock);
      formData.append("badge", data.badge);
      formData.append("sizes", JSON.stringify(data.sizes));
      formData.append("colors", JSON.stringify(data.colors));
      if (data.imageFile) {
        formData.append("image", data.imageFile);
      }

      try {
        setSubmitting(true);
        await axiosPrivate.post("/seller-products/add", formData);
        await getSellerProducts();
        setToast?.({
          message: `"${data.name}" added to your catalog!`,
          type: "success",
        });
      } catch (error) {
        console.error("Error adding product:", error);
        setToast?.({
          message: "Failed to add product. Please try again.",
          type: "error",
        });
      } finally {
        setSubmitting(false);
      }
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleDelete = async (product) => {
    try {
      await axiosPrivate.delete(`/seller-products/${product._id}`);
      await getSellerProducts();
      setToast?.({
        message: `"${product.name}" removed from your catalog.`,
        type: "info",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      setToast?.({
        message: "Failed to delete product. Please try again.",
        type: "error",
      });
    }
  };

  const statCards = [
    { label: "Total products", value: stats.total },
    { label: "In stock", value: stats.active },
    { label: "Low stock", value: stats.low },
    { label: "Out of stock", value: stats.out },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6">
      {/* Header */}
      {/* <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
        className="flex items-start justify-between flex-wrap gap-4"
      >
        <div>
          <span className="text-xs tracking-[0.3em] text-brand-600 dark:text-brand-400 font-semibold uppercase">
            YOUR CATALOG
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
            Products
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">
            Manage the pieces you sell. Add new listings or edit existing ones.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white px-5 py-3 text-xs font-semibold tracking-wider text-white dark:text-gray-900 shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faPlus} />
          ADD PRODUCT
        </motion.button>
      </motion.div> */}

      {/* Mini stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.05 }}
        className="grid grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {statCards.map((s) => (
          <div
            key={s.label}
            className=" flex gap-2 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-2 shadow-sm"
          >
            <p className="text-xs  font-semibold text-gray-400 uppercase tracking-wider mt-1">
              {s.label}:
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {s.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.1 }}
        className="sticky top-20 dark:bg-slate-950 bg-white p-2 z-20 flex flex-col sm:flex-row sm:items-center gap-4"
      >
        {/* Search bar */}
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className={`${inputCls()} pl-10`}
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white px-5 py-3 text-xs font-semibold tracking-wider text-white dark:text-gray-900 shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon icon={faPlus} />
          ADD PRODUCT
        </motion.button>
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1">
          {STOCK_META.map((f) => {
            const selected = filter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                  selected
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Product grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...spring, delay: 0.15 }}
      >
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="group relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-sm"
              >
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                  <img
                    src={product.image[0].url}
                    alt={product.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  {product.badge && (
                    <span
                      className={`absolute top-2 left-2 z-10 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide text-white ${
                        product.badge === "Sale"
                          ? "bg-red-500"
                          : product.badge === "New"
                            ? "bg-emerald-500"
                            : "bg-gray-900"
                      }`}
                    >
                      {product.badge}
                    </span>
                  )}
                  <span className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 rounded-full bg-gray-900/70 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-white backdrop-blur">
                    <FontAwesomeIcon
                      icon={faBagShopping}
                      className="text-[9px]"
                    />
                    {product.sold ?? 0} sold
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-gray-900/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => openEdit(product)}
                      aria-label={`Edit ${product.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-900 shadow-lg hover:scale-110 transition"
                    >
                      <FontAwesomeIcon icon={faPen} className="text-xs" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product)}
                      aria-label={`Delete ${product.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-lg hover:scale-110 transition"
                    >
                      <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    </button>
                  </div>
                </div>

                <div className="pt-3">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {product.category}
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-bold text-sm">₹{product.price}</span>
                    <StockPill stock={product.stock} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-20 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600">
              <FontAwesomeIcon icon={faBoxesStacked} className="text-2xl" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              No products found
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {query || filter !== "all"
                ? "Try adjusting your search or filters."
                : "Add your first product to start selling."}
            </p>
            {!query && filter === "all" && (
              <button
                type="button"
                onClick={openAdd}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-900 dark:bg-white px-6 py-3 text-xs font-semibold tracking-wider text-white dark:text-gray-900 shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition"
              >
                <FontAwesomeIcon icon={faPlus} />
                ADD PRODUCT
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Add / Edit modal */}
      <AnimatePresence>
        {modalOpen && (
          <ProductFormModal
            initial={editing}
            onSave={handleSave}
            submitting={submitting}
            onClose={() => {
              setModalOpen(false);
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
