"use client";

import Loader from '@/components/Loader';
import IdeaComments from '@/components/IdeaComments';
import { ideasAPI } from '@/lib/api';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { FaArrowLeft, FaArrowRight, FaCalendarAlt, FaCommentDots, FaFire, FaMapMarkerAlt } from 'react-icons/fa';
import type { Idea } from '@/types';

const formatDate = (value?: string) => {
  if (!value) return 'Recently';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently';

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

const getSupportNeeded = (idea?: Idea | null) => idea?.supportNeeded || idea?.estimatedBudget || 'Not specified';

const toTagList = (tags?: string[] | string) => {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.filter(Boolean);
  if (typeof tags === 'string') {
    return tags.split(',').map((tag) => tag.trim()).filter(Boolean);
  }

  return [];
};

const buildMediaGallery = (idea?: Idea | null) => {
  const images = [idea?.imageURL, ...(idea?.images || [])].filter(Boolean) as string[];
  return Array.from(new Set(images)).slice(0, 4);
};

export default function IdeaDetailsPage() {
  const params = useParams();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [relatedIdeas, setRelatedIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const ideaId = params?.id as string | undefined;

  useEffect(() => {
    let active = true;

    const loadIdea = async () => {
      try {
        setLoading(true);
        const data = await ideasAPI.getById(ideaId as string);
        if (!active) return;
        setIdea(data);
        setError('');
      } catch (fetchError) {
        if (!active) return;
        setIdea(null);
        setError(fetchError instanceof Error ? fetchError.message : 'Unable to load this idea right now.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (ideaId) {
      loadIdea();
    }

    return () => {
      active = false;
    };
  }, [ideaId]);

  useEffect(() => {
    let active = true;

    const loadRelatedIdeas = async () => {
      if (!idea?.category || !ideaId) return;

      try {
        const data = await ideasAPI.getAll({ category: idea.category });
        if (!active) return;
        const others = Array.isArray(data)
          ? data.filter((item) => item._id !== idea._id && item._id !== idea.id).slice(0, 3)
          : [];
        setRelatedIdeas(others);
      } catch {
        if (active) {
          setRelatedIdeas([]);
        }
      }
    };

    loadRelatedIdeas();

    return () => {
      active = false;
    };
  }, [idea?.category, idea?._id, idea?.id, ideaId]);

  const tags = useMemo(() => toTagList(idea?.tags), [idea]);
  const likesCount = Array.isArray(idea?.likes) ? idea.likes.length : (idea?.likes as number | undefined) || 0;
  const mediaGallery = useMemo(() => buildMediaGallery(idea), [idea]);

  const details = [
    { label: 'Category', value: idea?.category || 'Uncategorized' },
    { label: 'Location', value: idea?.location || idea?.targetAudience || 'Not specified' },
    { label: 'Support Needed', value: getSupportNeeded(idea) },
    { label: 'Priority', value: idea?.priority || 'Not specified' },
    { label: 'Created On', value: formatDate(idea?.createdAt) },
    { label: 'Author', value: idea?.userName || 'Anonymous builder' },
    { label: 'Contact', value: idea?.userEmail || 'Not shared' },
  ];

  const overviewCards = [
    {
      title: 'Community Need',
      body: idea?.problemStatement || idea?.supportNeeded || 'This project does not include a community need statement yet.',
    },
    {
      title: 'Proposed Action',
      body: idea?.proposedSolution || idea?.priority || 'The proposed action is not available yet.',
    },
    {
      title: 'Project Summary',
      body: idea?.fullDescription || idea?.detailedDescription || idea?.description || 'The author has not added a full description yet.',
    },
  ];

  if (loading) {
    return (
      <div className="px-4 py-10">
        <div className="theme-card mx-auto max-w-4xl p-8">
          <Loader message="Loading idea details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-10 text-(--page-text)">
        <div className="theme-card mx-auto max-w-4xl p-8 border-(--surface-border) bg-(--surface-bg) shadow-(--shadow-soft)">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--brand-emerald)">Idea details</p>
          <h1 className="mt-3 text-3xl font-black text-(--page-text)">Could not load idea details</h1>
          <p className="mt-3 text-sm leading-7 text-theme-muted">{error}</p>
          <div className="mt-6 flex gap-3">
            <Link href="/projects">
              <Button className="theme-btn-primary h-11 px-5" variant="primary">
                Back to ideas
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!idea) {
    return null;
  }

  const currentIdeaId = idea._id ?? idea.id;
  if (!currentIdeaId) {
    return (
      <div className="px-4 py-10 text-(--page-text)">
        <div className="theme-card mx-auto max-w-4xl p-8 border-(--surface-border) bg-(--surface-bg) shadow-(--shadow-soft)">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--brand-emerald)">Invalid idea</p>
          <h1 className="mt-3 text-3xl font-black text-(--page-text)">Idea identifier is missing</h1>
          <p className="mt-3 text-sm leading-7 text-theme-muted">Unable to show comments because this idea has no valid identifier.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="theme-shell min-h-screen px-4 py-6 text-theme md:py-10">
      <div className="mx-auto max-w-7xl">
        <Link href="/projects" className="theme-badge inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em]">
          <FaArrowLeft className="text-[0.7rem]" />
          Back to ideas
        </Link>

        <div className="mt-6">
          <article className="surface-panel overflow-hidden rounded-[2rem]">
            {mediaGallery.length > 0 && (
              <div className="border-b border-theme bg-(--surface-muted) p-6 md:p-8">
                <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
                  <div className="overflow-hidden rounded-[1.75rem] border border-theme bg-(--surface-muted)">
                    <div
                      className="h-80 bg-cover bg-center"
                      style={{
                        backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.08), rgba(15,23,42,0.18)), url(${mediaGallery[0]})`,
                      }}
                    />
                  </div>

                  {mediaGallery.length > 1 && (
                    <div className="grid gap-3">
                      {mediaGallery.slice(1).map((image, index) => (
                        <div key={`${image}-${index}`} className="overflow-hidden rounded-[1.25rem] border border-theme bg-(--surface-muted)">
                          <div
                            className="h-24 bg-cover bg-center"
                            style={{
                              backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.05), rgba(15,23,42,0.16)), url(${image})`,
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="theme-badge px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em]">
                  {idea.category || 'Uncategorized'}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-(--surface-border) bg-(--surface-muted) px-4 py-2 text-xs font-medium text-theme-muted">
                  <FaCalendarAlt className="text-(--brand-emerald)" />
                  {formatDate(idea.createdAt)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-(--surface-border) bg-(--surface-muted) px-4 py-2 text-xs font-medium text-theme-muted">
                  <FaFire className="text-(--brand-gold)" />
                  {likesCount} likes
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black tracking-tight text-theme md:text-5xl">
                {idea.title || 'Untitled project'}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-theme-muted md:text-lg">
                {idea.shortDescription || 'No short description was provided for this project.'}
              </p>

              <section className="theme-card mt-8 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-(--brand-emerald)">
                  <FaCommentDots />
                  Description / Overview
                </div>
                <p className="mt-4 text-base leading-8 text-theme-muted">
                  {idea.detailedDescription || idea.fullDescription || idea.description || 'No detailed overview is available yet.'}
                </p>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                  {overviewCards.map((card) => (
                    <div key={card.title} className="rounded-2xl border border-theme bg-(--surface-muted) p-4 shadow-sm">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-emerald">{card.title}</p>
                      <p className="mt-2 text-sm leading-7 text-theme-muted">{card.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="theme-card mt-6 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-(--brand-emerald)">
                  <FaMapMarkerAlt />
                  Key information / Specifications
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {details.map((detail) => (
                    <div key={detail.label} className="rounded-3xl border border-theme bg-(--surface-bg) p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-emerald">{detail.label}</p>
                      <p className="mt-3 text-sm leading-7 text-theme-muted">{detail.value}</p>
                    </div>
                  ))}

                  {tags.length > 0 && (
                    <div className="rounded-3xl border border-theme bg-(--surface-bg) p-5 sm:col-span-2 xl:col-span-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-emerald">Tags</p>
                      <div className="mt-3 flex flex-wrap gap-3">
                        {tags.map((tag) => (
                          <span key={tag} className="rounded-full border border-theme bg-(--surface-muted) px-4 py-2 text-sm text-theme-muted shadow-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="theme-card-soft mt-8 p-6">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.24em] text-(--brand-emerald)">
                  <FaCommentDots />
                  Comments & feedback
                </div>
                <p className="mt-3 text-sm leading-7 text-theme-muted">
                  Share your thoughts, ask questions, or support this idea with constructive feedback.
                </p>
                <div className="mt-6 rounded-[1.25rem] border border-theme bg-(--surface-bg) p-4 shadow-sm">
                  <IdeaComments ideaId={currentIdeaId} initialCount={idea.commentCount} />
                </div>
              </section>

              {relatedIdeas.length > 0 && (
                <section className="theme-card mt-8 p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-(--brand-emerald)">Related items</p>
                      <h3 className="mt-2 text-xl font-bold text-theme">Other projects in this category</h3>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    {relatedIdeas.map((item) => (
                      <Link key={item._id} href={`/projects/${item._id}`} className="rounded-[1.25rem] border border-theme bg-(--surface-muted) p-4 transition duration-300 hover:-translate-y-0.5 hover:border-(--brand-emerald)">
                        <p className="text-sm font-semibold text-theme">{item.title || 'Related project'}</p>
                        <p className="mt-2 text-sm leading-7 text-theme-muted line-clamp-2">{item.shortDescription || 'More community support is available for this idea.'}</p>
                        <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-(--brand-emerald)">
                          View project
                          <FaArrowRight className="text-xs" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
