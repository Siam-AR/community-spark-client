"use client";

import React from "react";
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
    <div className="surface-panel sticky top-0 z-50 py-4">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-theme">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--brand-emerald),var(--brand-gold))] text-white">
            CS
          </div>
          <span>Community Spark</span>
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

        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className={`rounded-lg p-2 transition-colors ${themeButtonClass}`}>
            {isDarkMode ? (
              <MdDarkMode className="text-xl text-white" />
            ) : (
              <MdLightMode className="text-xl text-(--brand-gold)" />
            )}
          </button>

          {isAuthenticated && user ? (
            <Dropdown>
              <DropdownTrigger>
                <div className="flex cursor-pointer items-center gap-2">
                  <Avatar className="transition-transform" size="sm">
                    <Avatar.Image referrerPolicy="no-referrer" alt={user?.name || "User"} src={user?.image} />
                    <Avatar.Fallback>{user?.name?.charAt(0)?.toUpperCase()}</Avatar.Fallback>
                  </Avatar>
                  <span className="hidden font-medium sm:inline">{user?.name}</span>
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
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className={isDarkMode ? "text-white" : "text-slate-700"}>
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="theme-btn-primary px-4 py-2">
                  Register
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="mt-4 flex items-center justify-between px-4 md:hidden">
        <ul className="flex gap-4 text-sm">
          <li>
            <Link href="/" className="font-medium text-theme">
              Home
            </Link>
          </li>
          <li>
            <Link href="/projects" className="font-medium text-theme">
              Projects
            </Link>
          </li>
          <li>
            <Link href="/about" className="font-medium text-theme">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="font-medium text-theme">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/help" className="font-medium text-theme">
              Help
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link href="/add-project" className="font-medium text-theme">
                  Add
                </Link>
              </li>
              <li>
                <Link href="/my-projects" className="font-medium text-theme">
                  My Projects
                </Link>
              </li>
              <li>
                <Link href="/my-contributions" className="font-medium text-theme">
                  Contributions
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
