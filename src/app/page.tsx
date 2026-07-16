"use client";

import { Button } from '@heroui/react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Marquee from 'react-fast-marquee';
import Loader from '@/components/Loader';
import { ideasAPI } from '@/lib/api';
import { FaArrowRight, FaChartBar, FaChartLine, FaHandsHelping, FaSeedling } from 'react-icons/fa';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import type { Idea } from '@/types';

const slides = [
  {
    image:
      'https://distresscentre.com/wp-content/uploads/2024/03/community-service-1024x672.jpg',
    title: 'Turn local needs into shared action',
    description:
      'Share community projects, invite support, and bring practical ideas to life with neighbors and changemakers.',
    overlayOpacity: 0.5,
  },
  {
    image:
      'https://charitysmith.org/wp-content/uploads/2023/09/community.webp',
    title: 'Explore community projects that strengthen neighborhoods',
    description:
      'Discover trending initiatives, learn from local builders, and gather support before bringing a project to life.',
    overlayOpacity: 0.48,
  },
  {
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGDokh1GOFDD4UINIHrSgHoPDhAezJwQM44ybU5k-IoTChzJQ43Z2fVKs&s=10',
    title: 'Validate projects with real community insight',
    description:
      'Use comments, discussions, and project discovery to shape better community decisions faster.',
    overlayOpacity: 0.52,
  },
];

const marqueeItems = [
  { label: 'Community-led ideas', tone: 'emerald' },
  { label: 'Local impact', tone: 'gold' },
  { label: 'Shared support', tone: 'emerald' },
  { label: 'Fast feedback', tone: 'gold' },
  { label: 'Clear goals', tone: 'emerald' },
  { label: 'Meaningful action', tone: 'gold' },
];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [featuredIdeas, setFeaturedIdeas] = useState<Idea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [ideasError, setIdeasError] = useState('');


  const impactStats = useMemo(() => {
    const totalProjects = featuredIdeas.length;
    const categories = new Set(
      featuredIdeas
        .map((idea) => idea.category)
        .filter((category): category is string => Boolean(category)),
    ).size;
    const conversations = featuredIdeas.reduce((sum, idea) => sum + (idea.commentCount || 0), 0);

    return [
      {
        label: 'Featured Projects',
        value: String(totalProjects),
        hint: 'Live projects highlighted from the community feed',
        icon: FaHandsHelping,
      },
      {
        label: 'Categories Covered',
        value: String(categories),
        hint: 'Education, health, environment, and more',
        icon: FaSeedling,
      },
      {
        label: 'Community Conversations',
        value: String(conversations),
        hint: 'Comments and feedback helping projects grow',
        icon: FaChartLine,
      },
    ];
  }, [featuredIdeas]);

  const chartData = useMemo(() => {
    const grouped = featuredIdeas.reduce<Record<string, number>>((acc, idea) => {
      const key = idea.category || 'Community';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([name, count]) => ({ name, count }));
  }, [featuredIdeas]);

  const featuredProjectCards = featuredIdeas.slice(0, 3);

  useEffect(() => {
    const preload = async () => {
      await Promise.all(
        slides.map(
          (slide) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.src = slide.image;
              img.onload = img.onerror = () => resolve();
            }),
        ),
      );
      setLoading(false);
    };

    preload();
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadFeaturedIdeas = async () => {
      try {
        setIdeasLoading(true);
        const data = await ideasAPI.getFeatured();

        if (mounted) {
          setFeaturedIdeas(Array.isArray(data) ? data : []);
          setIdeasError('');
        }
      } catch (error) {
        if (mounted) {
          setIdeasError(error instanceof Error ? error.message : 'Failed to load trending initiatives.');
          setFeaturedIdeas([]);
        }
      } finally {
        if (mounted) {
          setIdeasLoading(false);
        }
      }
    };

    loadFeaturedIdeas();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="h-[75vh]">
        <Loader message="Loading banner…" />
      </div>
    );
  }

  return (
    <div className="space-y-8 px-4 py-6 md:py-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-white shadow-[var(--shadow-soft)]">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          className="h-[50vh] sm:h-[60vh] md:h-[75vh]"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="h-[50vh] sm:h-[60vh] md:h-[75vh] bg-cover bg-center bg-no-repeat relative"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                <div
                  className="absolute inset-0 flex items-center"
                  style={{
                    backgroundColor: `rgba(0,0,0,${slide.overlayOpacity})`,
                  }}
                >
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 text-white">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold whitespace-pre-line mb-2 sm:mb-4">
                      {slide.title}
                    </h1>

                    <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mb-4 sm:mb-6 text-gray-200">
                      {slide.description}
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <Link href="/projects">
                        <Button className="theme-btn-primary px-5 py-3">Explore Community Projects</Button>
                      </Link>
                      <Link href="/about">
                        <Button className="theme-btn-secondary px-5 py-3">Learn More</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <section className="max-w-7xl mx-auto rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-6 shadow-[var(--shadow-soft)] md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[var(--brand-emerald)]">Featured Projects</p>
              <h2 className="mt-2 text-2xl md:text-4xl font-bold text-theme">Highlighted community initiatives with real momentum</h2>
            </div>
            <Link href="/projects" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-emerald)] hover:text-[var(--brand-gold)]">
              Browse all projects
              <FaArrowRight className="text-xs" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {(featuredProjectCards.length > 0 ? featuredProjectCards : Array.from({ length: 3 }, () => null)).map((idea, index) => {
              if (!idea) {
                return (
                  <div key={index} className="theme-card-soft overflow-hidden p-5">
                    <div className="h-44 rounded-xl bg-slate-100" />
                    <div className="mt-4 space-y-3">
                      <div className="h-4 w-28 rounded-full bg-slate-200" />
                      <div className="h-5 w-3/4 rounded-full bg-slate-200" />
                      <div className="h-4 w-full rounded-full bg-slate-200" />
                    </div>
                  </div>
                );
              }

              return (
                <article key={idea._id} className="group overflow-hidden rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-bg)] shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{
                      backgroundImage: `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.35)), url(${idea.imageURL || 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop'})`,
                    }}
                  />
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="theme-badge px-3 py-1 text-xs font-semibold">
                        {idea.category || 'Community'}
                      </span>
                      <span className="text-xs text-theme-muted">
                        {idea.location || 'Local project'}
                      </span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-theme line-clamp-2">{idea.title || 'Community project'}</h3>
                    <p className="mt-3 text-sm text-theme-muted line-clamp-1">{idea.shortDescription || 'A local initiative looking for support and collaboration.'}</p>
                    <Link href={`/projects/${idea._id}`} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand-emerald)] hover:text-[var(--brand-gold)]">
                      Read project details
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-[var(--surface-border)] bg-[var(--surface-muted)] p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <FaChartBar />
              Project distribution by category
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.25)" />
                  <XAxis dataKey="name" tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: 'rgba(16, 185, 129, 0.12)' }}
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgba(148, 163, 184, 0.25)',
                      backgroundColor: 'rgba(255, 255, 255, 0.97)',
                      boxShadow: '0 14px 32px rgba(15, 23, 42, 0.14)',
                    }}
                    labelStyle={{ color: '#0f172a', fontWeight: 700 }}
                    itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                    formatter={(value) => {
                      const safeValue = typeof value === 'number' ? value : Number(value ?? 0);
                      return [`${safeValue} project${safeValue === 1 ? '' : 's'}`, 'Projects'];
                    }}
                  />
                  <Bar dataKey="count" fill="url(#featuredBarGradient)" radius={[8, 8, 0, 0]} />
                  <defs>
                    <linearGradient id="featuredBarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand-emerald)" />
                      <stop offset="100%" stopColor="var(--brand-gold)" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto overflow-hidden rounded-[2rem] border border-[var(--surface-border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(236,253,245,0.95),rgba(254,249,195,0.95))] p-4 shadow-[var(--shadow-soft)] sm:p-6 md:p-8 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(3,19,25,0.96),rgba(30,41,59,0.95))] dark:border-emerald-400/20">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-emerald-200/70 bg-white/80 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-emerald-400/20 dark:bg-slate-900/80 dark:shadow-[0_20px_60px_rgba(2,6,23,0.5)]">
            <div className="absolute inset-y-0 left-0 w-24 bg-[linear-gradient(90deg,rgba(16,185,129,0.16),transparent)] dark:bg-[linear-gradient(90deg,rgba(16,185,129,0.28),transparent)]" />
            <div className="absolute inset-y-0 right-0 w-24 bg-[linear-gradient(270deg,rgba(234,179,8,0.16),transparent)] dark:bg-[linear-gradient(270deg,rgba(250,204,21,0.22),transparent)]" />
            <Marquee
              direction="left"
              speed={36}
              pauseOnHover
              pauseOnClick
              gradient={false}
              className="py-2"
            >
              {[...marqueeItems, ...marqueeItems].map((item, index) => (
                <span
                  key={`${item.label}-${index}`}
                  className={`mx-2 inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold uppercase tracking-[0.25em] shadow-sm transition hover:scale-[1.02] ${
                    item.tone === 'gold'
                      ? 'border-[var(--brand-gold)]/30 bg-[var(--brand-gold)]/10 text-[var(--brand-gold)] dark:border-[var(--brand-gold)]/40 dark:bg-[var(--brand-gold)]/15 dark:text-amber-300'
                      : 'border-[var(--brand-emerald)]/30 bg-[var(--brand-emerald)]/10 text-[var(--brand-emerald)] dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300'
                  }`}
                >
                  {item.label}
                </span>
              ))}
            </Marquee>
          </div>
        </section>

        <section className="max-w-7xl mx-auto rounded-[2rem] border border-[var(--surface-border)] bg-[var(--surface-bg)] p-6 shadow-[var(--shadow-soft)] md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[var(--brand-emerald)]">Community momentum</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-theme">Live signals from the projects people are already supporting.</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-theme-muted">
              These highlights update from the latest featured projects and community conversations so the homepage feels active and current.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {impactStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div key={stat.label} className="rounded-[1.25rem] border border-[var(--surface-border)] bg-[var(--surface-muted)] p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-emerald)]/10 text-[var(--brand-emerald)]">
                      <Icon className="text-lg" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-theme-muted">{stat.label}</p>
                      <p className="text-2xl font-bold text-theme">{stat.value}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-theme-muted">{stat.hint}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="max-w-7xl mx-auto overflow-hidden rounded-[2rem] border border-white/20 bg-[linear-gradient(135deg,var(--brand-emerald),var(--brand-gold))] p-8 text-white shadow-[0_25px_70px_rgba(15,23,42,0.18)] md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.16),transparent_30%)]" />
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold tracking-[0.25em] uppercase text-white/80">Ready to begin</p>
              <h2 className="mt-2 text-2xl md:text-4xl font-bold leading-tight">Bring a community idea forward and find people who care.</h2>
              <p className="mt-4 text-sm leading-7 text-white/85 md:text-base">
                Turn a simple spark into a visible project with support, feedback, and momentum from the community.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/add-project">
                <Button className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-100">Start a Project</Button>
              </Link>
              <Link href="/projects">
                <Button className="rounded-2xl border border-white/40 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Browse Projects</Button>
              </Link>
            </div>
          </div>
        </section>
    </div>
  );
}
