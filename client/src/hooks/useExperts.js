import { useState, useEffect, useCallback } from 'react';

const LIMIT = 6;

/**
 * Fetches paginated experts from GET /api/experts.
 * - category → API-level filter (triggers a fresh fetch + resets to page 1)
 * - searchQuery → client-side name filter on the fetched page
 */
export function useExperts() {
  const [allExperts, setAllExperts]     = useState([]); // raw page from API
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [page, setPage]                 = useState(1);
  const [pagination, setPagination]     = useState(null);
  const [category, setCategory]         = useState('');
  const [searchQuery, setSearchQuery]   = useState('');
  const [categories, setCategories]     = useState([]); // accumulated unique categories

  const fetchExperts = useCallback(async (pageNum, cat) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: pageNum, limit: LIMIT });
      if (cat) params.append('category', cat);

      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/experts?${params.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Server error ${res.status}`);
      }
      const data = await res.json();
      setAllExperts(data.data || []);
      setPagination(data.pagination || null);

      // Accumulate unique categories seen across all fetched pages
      setCategories((prev) => {
        const set = new Set([...prev, ...(data.data || []).map((e) => e.category)]);
        return Array.from(set).sort();
      });
    } catch (err) {
      setError(err.message || 'Failed to load experts. Please try again.');
      setAllExperts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Re-fetch when page or category changes
  useEffect(() => {
    fetchExperts(page, category);
  }, [page, category, fetchExperts]);

  // Category change resets to page 1
  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setPage(1);
    setSearchQuery('');
  };

  // Name search is client-side (filter the current page's results)
  const displayedExperts = searchQuery.trim()
    ? allExperts.filter((e) =>
        e.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : allExperts;

  const retry = () => fetchExperts(page, category);

  return {
    experts: displayedExperts,
    loading,
    error,
    page,
    setPage,
    pagination,
    category,
    handleCategoryChange,
    searchQuery,
    setSearchQuery,
    categories,
    retry,
  };
}
