"use client";

import Loader from '@/components/Loader';
import ProjectCard from '@/components/ProjectCard';
import { ideasAPI } from '@/lib/api';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import type { Idea } from '@/types';

const CATEGORY_OPTIONS = ['All Categories', 'Education', 'Environment', 'Health', 'Community Welfare', 'Technology', 'Culture'];

export default function IdeaPage() {
  const router = useRouter();
  const [totalIdeasCount, setTotalIdeasCount] = useState(0);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchValue.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, dateFrom, dateTo, sortBy]);

  useEffect(() => {
    let active = true;

    const loadTotalIdeas = async () => {
      try {
        const allIdeas = await ideasAPI.getAll();
        if (!active) return;
        setTotalIdeasCount(Array.isArray(allIdeas) ? allIdeas.length : 0);
      } catch {
        if (active) {
          setTotalIdeasCount(0);
        }
      }
    };

    const loadIdeas = async () => {
      try {
        setLoading(true);

        const filters: Record<string, string> = {};
        if (debouncedSearch) filters.search = debouncedSearch;
        if (category !== 'All Categories') filters.category = category;
        if (dateFrom) filters.dateFrom = dateFrom;
        if (dateTo) filters.dateTo = dateTo;

        const data = await ideasAPI.getAll(filters);
        if (!active) return;
        setIdeas(Array.isArray(data) ? data : []);
        setError('');
      } catch (fetchError) {
        if (!active) return;
        setIdeas([]);
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load ideas right now.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadTotalIdeas();
    loadIdeas();

    return () => {
      active = false;
    };
  }, [debouncedSearch, category, dateFrom, dateTo]);

  const resetFilters = () => {
    setSearchValue('');
    setDebouncedSearch('');
    setCategory('All Categories');
    setDateFrom('');
    setDateTo('');
    setSortBy('newest');
  };

  const sortedIdeas = useMemo(() => {
    const nextIdeas = [...ideas];

    switch (sortBy) {
      case 'oldest':
        nextIdeas.sort((a, b) => (a.createdAt || '').localeCompare(b.createdAt || ''));
        break;
      case 'title-asc':
        nextIdeas.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'title-desc':
        nextIdeas.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      case 'newest':
      default:
        nextIdeas.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        break;
    }

    return nextIdeas;
  }, [ideas, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedIdeas.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIdeas = sortedIdeas.slice(startIndex, startIndex + itemsPerPage);

  const visiblePageNumbers = useMemo(() => {
    const pages = [] as number[];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let page = start; page <= end; page += 1) {
      pages.push(page);
    }

    return pages;
  }, [currentPage, totalPages]);

  const openIdeaDetails = (ideaId?: string) => {
    if (ideaId) router.push(`/projects/${ideaId}`);
  };

  return (
    <div className="px-4 py-6 text-slate-900 md:py-10">
      <section className="ideas-hero relative overflow-hidden rounded-[2rem] border border-(--surface-border) bg-white px-5 py-7 shadow-(--shadow-soft) md:px-8 md:py-10">
        <div className="ideas-hero-bg absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.10),transparent_34%),radial-gradient(circle_at_top_right,rgba(6,182,212,0.08),transparent_30%),linear-gradient(135deg,rgba(255,255,255,1),rgba(248,250,252,1))]" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-5">
            <span className="theme-badge px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em]">
              <FaFilter className="text-[0.7rem]" />
              Browse Community Projects
            </span>

            <div className="space-y-3">
              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-slate-900 md:text-5xl">
                Discover community projects built for local impact, support, and momentum.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-slate-600 md:text-base">
                Search by title, filter by category, and explore initiatives by published date.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { value: totalIdeasCount, label: 'Total projects available', icon: FaFilter },
                { value: ideas.length, label: 'Filtered projects available', icon: FaSearch },
              ].map((stat) => (
                <div key={stat.label} className="ideas-hero-stat rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <stat.icon className="text-(--brand-emerald)" />
                  <p className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="ideas-hero-filters rounded-3xl border border-(--surface-border) bg-(--surface-muted) p-5 shadow-sm md:p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--brand-emerald)">Filters</p>
            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Search by title</span>
                <div className="ideas-hero-input flex items-center gap-3 rounded-2xl border border-(--surface-border) bg-white px-4 py-3 text-slate-700 shadow-sm">
                  <FaSearch className="shrink-0 text-slate-400" />
                  <input
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    type="search"
                    placeholder="Search community projects..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Category</span>
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400/60"
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Date from</span>
                  <input
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                    type="date"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400/60"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Date to</span>
                  <input
                    value={dateTo}
                    onChange={(event) => setDateTo(event.target.value)}
                    type="date"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-cyan-400/60"
                  />
                </label>

                <div className="flex items-end">
                  <Button onPress={resetFilters} className="theme-btn-secondary h-12.5 w-full" variant="outline">
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-6 flex flex-col gap-4 rounded-[1.75rem] border border-(--surface-border) bg-(--surface-bg) p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--brand-emerald)">Results</p>
            <p className="mt-1 text-sm text-theme-muted">
              Showing {sortedIdeas.length > 0 ? `${startIndex + 1}-${Math.min(startIndex + itemsPerPage, sortedIdeas.length)} of ${sortedIdeas.length}` : '0'} projects
            </p>
          </div>

          <label className="flex items-center gap-3 text-sm text-theme-muted">
            <span className="font-medium text-slate-700">Sort by</span>
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="rounded-2xl border border-(--surface-border) bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-cyan-400/60"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title-asc">Title A-Z</option>
              <option value="title-desc">Title Z-A</option>
            </select>
          </label>
        </div>

        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-(--surface-border) bg-(--surface-bg) shadow-sm">
                <div className="h-56 animate-pulse bg-slate-200" />
                <div className="flex flex-1 flex-col p-5">
                  <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
                  <div className="mt-4 h-6 w-3/4 animate-pulse rounded-full bg-slate-200" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-slate-200" />
                  <div className="mt-2 h-4 w-5/6 animate-pulse rounded-full bg-slate-200" />
                  <div className="mt-4 h-24 rounded-2xl bg-slate-100" />
                  <div className="mt-5 h-12 rounded-2xl bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="theme-card-soft rounded-[2rem] p-6 text-rose-900">
            <p className="text-lg font-semibold">Unable to load projects</p>
            <p className="mt-2 text-sm text-rose-700">{error}</p>
          </div>
        ) : sortedIdeas.length === 0 ? (
          <div className="theme-section p-8 text-center text-slate-700">
            <p className="text-2xl font-bold text-slate-900">No projects found</p>
            <p className="mt-3 text-sm text-slate-600">Try a different search term, category, or date range.</p>
            <div className="mt-6 flex justify-center">
              <Button onPress={resetFilters} variant="primary">
                Clear Filters
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {paginatedIdeas.map((idea) => (
                <ProjectCard key={idea._id} idea={idea} onViewDetails={openIdeaDetails} />
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-(--surface-border) bg-(--surface-bg) p-4 shadow-sm">
              <p className="text-sm text-theme-muted">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onPress={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                  className="h-10 px-4"
                  variant="outline"
                  isDisabled={currentPage === 1}
                >
                  Previous
                </Button>

                {visiblePageNumbers.map((page) => (
                  <Button
                    key={page}
                    onPress={() => setCurrentPage(page)}
                    className="h-10 min-w-10 px-3"
                    variant={page === currentPage ? 'primary' : 'outline'}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  onPress={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                  className="h-10 px-4"
                  variant="outline"
                  isDisabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
