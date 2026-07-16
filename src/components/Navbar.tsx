"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  Avatar,
  Button,
  Dropdown,
  Label,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDarkMode, MdLightMode, MdLogout, MdPerson } from "react-icons/md";
import { useTheme } from "@/lib/theme-context";
import type { User } from "@/types";

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSignOut = () => {
    logout();
  };

  const isActive = (href: string) => pathname === href;

  const navLinkClass = (active: boolean) => `font-medium transition-colors ${
    active
      ? "text-[var(--brand-emerald)]"
      : isDarkMode
        ? "text-[var(--brand-slate)] hover:text-[var(--brand-emerald)]"
        : "text-slate-700 hover:text-[var(--brand-emerald)]"
  }`;

  const themeButtonClass = isDarkMode
    ? "bg-slate-800/80 hover:bg-slate-700"
    : "bg-slate-100 hover:bg-slate-200";

  return (
    <div className="surface-panel sticky top-0 z-50 border-b border-[var(--surface-border)] bg-white/85 py-3 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur md:py-4 dark:bg-slate-950/80">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 text-lg font-bold text-theme sm:text-xl">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--brand-emerald),var(--brand-gold))] text-white">
            CS
          </div>
          <span className="truncate">Community Spark</span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          <li>
            <Link href="/" className={navLinkClass(isActive("/"))}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/projects" className={navLinkClass(isActive("/projects"))}>
              Projects
            </Link>
          </li>
          <li>
            <Link href="/about" className={navLinkClass(isActive("/about"))}>
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className={navLinkClass(isActive("/contact"))}>
              Contact
            </Link>
          </li>
          <li>
            <Link href="/help" className={navLinkClass(isActive("/help"))}>
              Help
            </Link>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <Link href="/add-project" className={navLinkClass(isActive("/add-project"))}>
                  Add Project
                </Link>
              </li>
              <li>
                <Link href="/my-projects" className={navLinkClass(isActive("/my-projects"))}>
                  My Projects
                </Link>
              </li>
              <li>
                <Link href="/my-contributions" className={navLinkClass(isActive("/my-contributions"))}>
                  My Contributions
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={toggleTheme} className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${themeButtonClass}`}>
            {isDarkMode ? (
              <MdDarkMode className="text-xl text-white" />
            ) : (
              <MdLightMode className="text-xl text-(--brand-gold)" />
            )}
          </button>

          {isAuthenticated && user ? (
            <Dropdown>
              <DropdownTrigger>
                <div className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--surface-border)] bg-white/70 px-2 py-2 shadow-sm md:px-3 dark:bg-slate-900/60">
                  <Avatar className="transition-transform" size="sm">
                    <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                    <Avatar.Fallback>{user?.name?.charAt(0)?.toUpperCase()}</Avatar.Fallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium sm:inline">{user?.name}</span>
                </div>
              </DropdownTrigger>
              <Dropdown.Popover>
                <div className="px-3 pb-1 pt-3">
                  <div className="flex items-center gap-2">
                    <Avatar size="sm">
                      <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                      <Avatar.Fallback delayMs={600}>
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </Avatar.Fallback>
                    </Avatar>
                    <div className="flex flex-col gap-0">
                      <p className="text-sm font-medium leading-5">{user?.name}</p>
                      <p className="text-xs leading-none text-muted">{(user as User | null)?.email}</p>
                    </div>
                  </div>
                </div>
                <Dropdown.Menu aria-label="User Actions">
                  <DropdownItem id="profile" textValue="Profile" href="/profile">
                    <div className="flex w-full items-center justify-between gap-2">
                      <Label>Profile</Label>
                      <MdPerson className="size-3.5 text-muted" />
                    </div>
                  </DropdownItem>
                  <DropdownItem id="logout" textValue="Logout" variant="danger" onClick={handleSignOut}>
                    <div className="flex w-full items-center justify-between gap-2">
                      <Label>Logout</Label>
                      <MdLogout className="size-3.5 text-danger" />
                    </div>
                  </DropdownItem>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Link href="/login">
                <Button variant="ghost" size="sm" className={isDarkMode ? "text-white" : "text-slate-700"}>
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="theme-btn-primary px-3 py-2 text-sm">
                  Register
                </Button>
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors md:hidden ${themeButtonClass}`}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <span className="text-xl">✕</span> : <span className="text-xl">☰</span>}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          <div className="absolute inset-0 bg-[#081b15] opacity-100" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 flex h-screen w-[84%] max-w-[320px] flex-col border-l border-emerald-500/20 bg-[#081b15] p-4 shadow-[0_20px_80px_rgba(2,6,23,0.7)]">
            <div className="flex items-center justify-between border-b border-[var(--surface-border)] pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--brand-emerald),var(--brand-gold))] text-sm font-bold text-white">
                  CS
                </div>
                <span className="text-sm font-semibold text-theme">Community Spark</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${themeButtonClass}`}
                aria-label="Close navigation menu"
              >
                ✕
              </button>
            </div>

            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <li>
                <Link href="/" className={`flex rounded-xl px-3 py-3 ${navLinkClass(isActive("/"))}`} onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className={`flex rounded-xl px-3 py-3 ${navLinkClass(isActive("/projects"))}`} onClick={() => setMobileMenuOpen(false)}>
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/about" className={`flex rounded-xl px-3 py-3 ${navLinkClass(isActive("/about"))}`} onClick={() => setMobileMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`flex rounded-xl px-3 py-3 ${navLinkClass(isActive("/contact"))}`} onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/help" className={`flex rounded-xl px-3 py-3 ${navLinkClass(isActive("/help"))}`} onClick={() => setMobileMenuOpen(false)}>
                  Help
                </Link>
              </li>
            </ul>

            <div className="mt-4 border-t border-[var(--surface-border)] pt-4">
              {isAuthenticated ? (
                <div className="flex flex-col gap-2">
                  <Link href="/add-project" className={`flex rounded-xl px-3 py-3 ${navLinkClass(isActive("/add-project"))}`} onClick={() => setMobileMenuOpen(false)}>
                    Add Project
                  </Link>
                  <Link href="/my-projects" className={`flex rounded-xl px-3 py-3 ${navLinkClass(isActive("/my-projects"))}`} onClick={() => setMobileMenuOpen(false)}>
                    My Projects
                  </Link>
                  <Link href="/my-contributions" className={`flex rounded-xl px-3 py-3 ${navLinkClass(isActive("/my-contributions"))}`} onClick={() => setMobileMenuOpen(false)}>
                    My Contributions
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="rounded-xl border border-[var(--surface-border)] px-3 py-3 text-center text-sm font-semibold text-theme" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/register" className="rounded-xl bg-[linear-gradient(135deg,var(--brand-emerald),var(--brand-gold))] px-3 py-3 text-center text-sm font-semibold text-white" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
