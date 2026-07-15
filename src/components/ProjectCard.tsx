import { Button } from '@heroui/react';
import { FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import type { Idea } from '@/types';

const formatDate = (value?: string) => {
  if (!value) return 'Recently added';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently added';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

interface ProjectCardProps {
  idea: Idea;
  onViewDetails: (ideaId?: string) => void;
}

export default function ProjectCard({ idea, onViewDetails }: ProjectCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[var(--surface-border)] bg-[var(--surface-bg)] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[var(--brand-emerald)] hover:shadow-lg">
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <div
          className="h-full w-full bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(15,23,42,0.14)), url(${idea.imageURL || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop'})`,
          }}
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[var(--brand-emerald)] shadow-sm backdrop-blur-sm">
          {idea.category || 'Uncategorized'}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 text-slate-900">
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <span>{formatDate(idea.createdAt)}</span>
          <span>{idea.commentCount ?? 0} comments</span>
        </div>

        <h2 className="mt-2 min-h-12 text-lg font-bold leading-6 tracking-tight text-slate-900 line-clamp-2">
          {idea.title || 'Untitled project'}
        </h2>

        <p className="mt-2 min-h-14 text-sm leading-6 text-slate-600 line-clamp-3">
          {idea.shortDescription || 'No short description was provided for this project.'}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-700">
          <div className="inline-flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
            <FaUser className="shrink-0 text-[var(--brand-emerald)]" />
            <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
              {idea.userName || idea.userEmail || 'Anonymous builder'}
            </span>
          </div>

          <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-[11px] text-slate-600">
            <FaMapMarkerAlt className="text-[var(--brand-emerald)]" />
            {idea.location || 'Local project'}
          </span>
        </div>

        <div className="mt-auto pt-4">
          <Button
            onPress={() => onViewDetails(idea._id)}
            className="w-full rounded-2xl bg-[var(--brand-emerald)] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--brand-gold)]"
          >
            View Details
          </Button>
        </div>
      </div>
    </article>
  );
}
