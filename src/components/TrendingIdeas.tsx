"use client";

import { Button } from '@heroui/react';
import Link from 'next/link';
import { FaChartBar, FaMoneyBillWave, FaUser } from 'react-icons/fa';
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { Idea } from '@/types';

interface TrendingIdeasProps {
  ideas?: Idea[];
  loading?: boolean;
  error?: string;
}

export default function TrendingIdeas({ ideas = [], loading = false, error = '' }: TrendingIdeasProps) {
  const chartData = ideas.reduce<Record<string, number>>((acc, idea) => {
    const key = idea.category || 'Community';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const chartSeries = Object.entries(chartData).map(([name, count]) => ({ name, count }));

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-600">Trending Initiatives</p>
          <h2 className="mt-2 text-2xl font-bold text-theme md:text-4xl">Live community projects people are supporting right now</h2>
        </div>
        <Link href="/projects" className="hidden sm:inline-flex">
          <Button variant="outline">View All Projects</Button>
        </Link>
      </div>

      {loading ? (
        <div className="min-h-55 rounded-2xl surface-panel" />
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-200">
          {error}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {ideas.map((idea) => (
              <article
                key={idea._id}
                role="button"
                tabIndex={0}
                onClick={() => window.location.assign(`/projects/${idea._id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    window.location.assign(`/projects/${idea._id}`);
                  }
                }}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-bg)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${idea.imageURL})`,
                  }}
                />

                <div className="flex h-full flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {idea.category}
                    </span>
                    <span className="text-xs text-theme-muted">
                      {idea.createdAt ? new Date(idea.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-bold text-theme line-clamp-2 min-h-14">{idea.title}</h3>

                  <p className="mt-3 text-sm text-theme-muted line-clamp-3 min-h-18">{idea.shortDescription}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-700 border border-amber-100 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                      <FaMoneyBillWave className="text-amber-600 text-xs" />
                      {idea.supportNeeded || idea.estimatedBudget || 'Support requested'}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700 border border-emerald-100 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                      <FaUser className="text-emerald-600 text-xs" />
                      {idea.userName || idea.userEmail || 'Anonymous'}
                    </span>
                  </div>

                  <div className="mt-auto pt-5">
                    <Link href={`/projects/${idea._id}`} className="inline-flex w-full">
                      <Button className="w-full" variant="primary">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-[1.75rem] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-5 shadow-[var(--shadow-soft)]">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <FaChartBar />
              Live category overview
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="url(#trendBarGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="trendBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-emerald)" />
                      <stop offset="100%" stopColor="var(--brand-gold)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
