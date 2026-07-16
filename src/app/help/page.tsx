"use client";

import Link from 'next/link';
import { FaLifeRing, FaQuestionCircle, FaRocket, FaShieldAlt } from 'react-icons/fa';

const supportTopics = [
  {
    title: 'How to submit a project',
    description: 'Create a clear project title, describe the community need, and add supporting details before publishing.',
    icon: FaRocket,
  },
  {
    title: 'How to manage your ideas',
    description: 'Review, update, or remove your submitted projects from your personal dashboard whenever needed.',
    icon: FaLifeRing,
  },
  {
    title: 'How to stay safe',
    description: 'Protect your account by keeping your password secure and avoiding sharing private contact details publicly.',
    icon: FaShieldAlt,
  },
];

export default function HelpPage() {
  return (
    <div className="px-4 py-8 text-theme md:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="overflow-hidden rounded-[2rem] border border-(--surface-border) bg-(--surface-bg) p-8 shadow-(--shadow-soft) md:p-10">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-(--brand-emerald)">Help & Support</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-theme md:text-5xl">
              Everything you need to get started and keep going.
            </h1>
            <p className="mt-4 text-base leading-8 text-theme-muted">
              Community Spark makes it simple to publish projects, gather support, and manage your ideas with confidence.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] border border-(--surface-border) bg-(--surface-bg) p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <FaQuestionCircle className="text-(--brand-emerald)" />
              <h2 className="text-2xl font-bold text-theme">Common questions</h2>
            </div>

            <div className="mt-6 space-y-4">
              {supportTopics.map((topic) => {
                const Icon = topic.icon;
                return (
                  <div key={topic.title} className="rounded-[1.25rem] border border-(--surface-border) bg-(--surface-muted) p-5">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 rounded-xl bg-(--surface-bg) p-2 text-(--brand-emerald)">
                        <Icon />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-theme">{topic.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-theme-muted">{topic.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[2rem] border border-(--surface-border) bg-(--surface-bg) p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-theme">Still need help?</h2>
            <p className="mt-3 text-sm leading-8 text-theme-muted">
              Reach out through the contact page if you want assistance with your account, submissions, or project visibility.
            </p>
            <div className="mt-6 space-y-3">
              <Link href="/contact" className="theme-btn-primary inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold">
                Contact support
              </Link>
              <Link href="/projects" className="theme-btn-secondary ml-3 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold">
                Browse projects
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
