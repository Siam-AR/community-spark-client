import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-emerald-500/20 bg-slate-950 text-slate-100 shadow-[0_-20px_50px_rgba(2,6,23,0.35)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,125,75,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(209,135,26,0.16),transparent_34%)]" />
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-[var(--brand-emerald)]/12 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[var(--brand-gold)]/12 blur-3xl" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-8 md:px-10 md:py-12 lg:px-16 lg:py-14">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-10 lg:gap-12">
          <div className="flex flex-col items-start text-left">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/95 text-xl font-black text-slate-950">
                CS
              </div>
              <h2 className="text-2xl font-black tracking-tight">Community Spark</h2>
            </div>

            <p className="max-w-sm text-sm leading-7 text-slate-300">
              Share community projects, invite support, and grow practical ideas that make neighborhoods and local groups stronger.
            </p>

            <div className="mt-6 flex gap-4">
              <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-100 transition hover:bg-emerald-500/90 hover:text-white">
                <FaFacebookF size={16} />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-100 transition hover:bg-amber-500/90 hover:text-white">
                <FaInstagram size={16} />
              </a>
              <a href="https://x.com" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-100 transition hover:bg-slate-700 hover:text-white">
                <FaXTwitter size={16} />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-100 transition hover:bg-blue-600 hover:text-white">
                <FaLinkedinIn size={16} />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-center md:items-center">
            <h3 className="mb-5 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-4 text-sm text-slate-300">
              <li><Link href="/" className="transition hover:text-amber-300">Home</Link></li>
              <li><Link href="/about" className="transition hover:text-amber-300">About</Link></li>
              <li><Link href="/projects" className="transition hover:text-amber-300">Projects</Link></li>
              <li><Link href="/contact" className="transition hover:text-amber-300">Contact</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-start sm:items-end md:items-end">
            <div className="w-full max-w-[18rem] text-left sm:text-right md:text-right">
              <h3 className="mb-5 text-lg font-semibold">Contact</h3>
              <div className="space-y-4 text-sm text-slate-300">
                <p>Email: hello@communityspark.org</p>
                <p>Phone: +880 1234-567890</p>
                <p>Location: Dhaka, Bangladesh</p>
              </div>
              <Link href="/about" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--brand-emerald),var(--brand-gold))] px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-300 hover:scale-105">
                Learn More
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-white/10" />

        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-end sm:justify-between">
          <p>© {new Date().getFullYear()} Community Spark - All rights reserved.</p>
          <div className="flex items-center gap-6 sm:justify-end">
            <Link href="/about" className="transition hover:text-amber-300">About</Link>
            <Link href="/contact" className="transition hover:text-amber-300">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
