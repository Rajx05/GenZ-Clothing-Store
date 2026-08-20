import { useState, useEffect, useCallback, useRef } from "react";
import axios from "../api/axios";

/**
 * Server-side paginated products hook.
 * Returns { products, initialLoading, loadingMore, hasMore, error, loadMore, sentinelRef }.
 */
export default function useInfiniteProducts({
  category,
  badge,
  search,
  sortBy,
  limit = 8,
}) {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(false);

  const inFlightRef = useRef(false);
  const resetIdRef = useRef(0); // bumped on every filter change so stale loadMore results are discarded
  const sentinelRef = useRef(null);
  const loadMoreRef = useRef(null);

  // ─── helpers ───────────────────────────────────────────────────────────────

  const buildParams = useCallback(
    (p) => {
      const params = new URLSearchParams({ page: p, limit });
      if (category && category !== "All") params.set("category", category);
      if (badge) params.set("badge", badge);
      if (search) params.set("search", search);
      if (sortBy) params.set("sortBy", sortBy);
      return params.toString();
    },
    [category, badge, search, sortBy, limit],
  );

  // ─── page 1 fetch (runs on filter / sort change) ───────────────────────────

  useEffect(() => {
    let cancelled = false;
    const rid = ++resetIdRef.current;

    inFlightRef.current = false;
    setLoadingMore(false);
    setInitialLoading(true);
    setError(false);

    (async () => {
      try {
        const res = await axios(`/products/get-all?${buildParams(1)}`);
        if (cancelled || rid !== resetIdRef.current) return;
        setProducts(res.data.products || []);
        setHasMore(!!res.data.hasMore);
        setPage(1);
      } catch {
        if (!cancelled && rid === resetIdRef.current) {
          setError(true);
          setProducts([]);
        }
      } finally {
        if (!cancelled && rid === resetIdRef.current) setInitialLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, badge, search, sortBy, limit]);

  // ─── loadMore ──────────────────────────────────────────────────────────────

  const loadMore = useCallback(async () => {
    if (inFlightRef.current || !hasMore || initialLoading) return;
    inFlightRef.current = true;
    const rid = resetIdRef.current;
    const nextPage = page + 1;

    setLoadingMore(true);
    try {
      const res = await axios(`/products/get-all?${buildParams(nextPage)}`);
      // Discard if filters changed while the request was in-flight
      if (rid !== resetIdRef.current) return;
      setProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newProducts = (res.data.products || []).filter(
          (p) => !existingIds.has(p._id),
        );
        return [...prev, ...newProducts];
      });
      setHasMore(!!res.data.hasMore);
      setPage(nextPage);
    } catch {
      if (rid === resetIdRef.current) setError(true);
    } finally {
      inFlightRef.current = false;
      if (rid === resetIdRef.current) setLoadingMore(false);
    }
  }, [page, hasMore, initialLoading, buildParams]);

  // keep latest loadMore in a ref so the observer effect doesn't re-create on every page change
  loadMoreRef.current = loadMore;

  // ─── IntersectionObserver (infinite scroll) ────────────────────────────────

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || initialLoading) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMoreRef.current();
      },
      { rootMargin: "200px 0px" }, // preload a little before the user reaches the bottom
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [initialLoading, hasMore]); // reconnect if hasMore toggles

  return {
    products,
    initialLoading,
    loadingMore,
    hasMore,
    error,
    loadMore,
    sentinelRef,
  };
}
