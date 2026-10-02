import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Moon,
  Sun,
  ChevronDown,
  Bell,
  LogIn,
  LogOut,
  User,
  LayoutDashboard,
  Command,
  Search,
  Menu,
  X,
  Keyboard,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import useThemeStore from "../store/useThemeStore";
import LogoutButton from "./LogoutButton";
import { Link, NavLink, useNavigate } from "react-router-dom";
import RecentSubmissionsPopup from "./RecentSubmissionsPopup";
import { useSubmissionStore } from "../store/useSubmissionStore";

const navLinkClass = ({ isActive }) =>
  `px-3 py-1.5 text-[13.5px] font-medium rounded-md transition-colors ${
    isActive
      ? "text-zinc-950 dark:text-white bg-zinc-100 dark:bg-white/10"
      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100/70 dark:hover:bg-white/5"
  }`;

const Navbar = () => {
  const { authUser } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { theme, toggleTheme } = useThemeStore();
  const { submissions, getAllSubmissions } = useSubmissionStore();
  const [showActivity, setShowActivity] = useState(false);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showActivity) getAllSubmissions();
  }, [showActivity]);

  useEffect(() => {
    const close = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
          {/* Brand */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-zinc-950 dark:bg-white">
              <Terminal className="h-3.5 w-3.5 text-white dark:text-zinc-950" strokeWidth={2.5} />
            </span>
            <span className="text-[15px] font-bold tracking-tight">
              CodeGod
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-2 hidden items-center gap-0.5 lg:flex">
            <NavLink to="/problems" className={navLinkClass}>Problems</NavLink>
            <NavLink to="/sheets" className={navLinkClass}>Sheets</NavLink>
            <NavLink to="/terms" className={navLinkClass}>Docs</NavLink>
            <NavLink to="/privacy" className={navLinkClass}>Privacy</NavLink>
          </nav>

          {/* Search (visual) */}
          <button
            onClick={() => navigate("/problems")}
            className="ml-auto hidden h-8 w-64 items-center gap-2 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/[0.04] px-2.5 text-[13px] text-zinc-400 transition-colors hover:border-zinc-300 dark:hover:border-white/20 md:flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="flex-1 text-left">Search problems…</span>
            <kbd className="flex items-center gap-0.5 rounded border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500">
              <Command className="h-2.5 w-2.5" />K
            </kbd>
          </button>

          {/* Actions */}
          <div className={`hidden items-center gap-1 lg:flex ${authUser ? "" : "md:flex"}`}>
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {authUser && (
              <button
                onClick={() => setShowActivity(true)}
                aria-label="Recent activity"
                className="relative flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white"
              >
                <Bell className="h-4 w-4" />
                {submissions?.length > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </button>
            )}

            {authUser ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="ml-1 flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-white/10 py-1 pl-1 pr-2 transition-colors hover:border-zinc-300 dark:hover:border-white/20"
                >
                  <img
                    src={authUser?.image || "https://avatar.iran.liara.run/public/boy"}
                    alt=""
                    className="h-6 w-6 rounded-md object-cover"
                  />
                  <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="animate-modalshow absolute right-0 top-10 w-64 overflow-hidden rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111113] shadow-xl shadow-zinc-950/5">
                    <div className="border-b border-zinc-100 dark:border-white/[0.06] px-4 py-3">
                      <p className="truncate text-[13px] font-semibold">
                        {authUser?.name ? authUser.name[0].toUpperCase() + authUser.name.slice(1) : "User"}
                      </p>
                      <p className="truncate text-xs text-zinc-500">{authUser?.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
                      >
                        <User className="h-4 w-4 text-zinc-400" /> Profile
                      </Link>
                      <button
                        onClick={() => { setShortcutsOpen(true); setProfileOpen(false); }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
                      >
                        <Keyboard className="h-4 w-4 text-zinc-400" /> Shortcuts
                      </button>
                      {authUser?.role === "ADMIN" && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/5"
                        >
                          <LayoutDashboard className="h-4 w-4 text-zinc-400" /> Admin
                          <span className="ml-auto rounded-full bg-violet-100 dark:bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold text-violet-700 dark:text-violet-300">ADMIN</span>
                        </Link>
                      )}
                    </div>
                    <div className="border-t border-zinc-100 dark:border-white/[0.06] p-1.5">
                      <LogoutButton
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
                        onClick={() => setProfileOpen(false)}
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </LogoutButton>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-3 py-1.5 text-[13.5px] font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="flex h-8 items-center gap-1.5 rounded-lg bg-zinc-950 dark:bg-white px-3.5 text-[13px] font-semibold text-white dark:text-zinc-950 transition-opacity hover:opacity-85"
                >
                  <LogIn className="h-3.5 w-3.5" /> Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-white/10 lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="border-t border-zinc-200/80 dark:border-white/[0.08] px-4 py-3 lg:hidden">
            <nav className="grid gap-1">
              {[
                ["/problems", "Problems"],
                ["/sheets", "Sheets"],
                ["/profile", "Profile"],
                ["/terms", "Terms"],
              ].map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-white/5"
                >
                  {label}
                </Link>
              ))}
              {!authUser && (
                <Link to="/login" onClick={() => setMobileOpen(false)} className="mt-1 flex h-10 items-center justify-center rounded-lg bg-zinc-950 dark:bg-white text-sm font-semibold text-white dark:text-zinc-950">
                  Get started
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      {showActivity && (
        <RecentSubmissionsPopup submissions={submissions} onClose={() => setShowActivity(false)} />
      )}

      {shortcutsOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-zinc-950/40 backdrop-blur-sm p-4" onClick={() => setShortcutsOpen(false)}>
          <div className="animate-modalshow w-full max-w-sm rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111113] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[15px] font-semibold tracking-tight">Keyboard shortcuts</h2>
              <button onClick={() => setShortcutsOpen(false)} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2">
              {[["Run code", "Ctrl + '"], ["Submit solution", "Ctrl + ↵"]].map(([label, keys]) => (
                <div key={label} className="flex items-center justify-between rounded-lg bg-zinc-50 dark:bg-white/[0.04] px-3.5 py-3 text-[13px]">
                  <span className="font-medium">{label}</span>
                  <kbd className="code-font rounded-md border border-zinc-200 dark:border-white/10 bg-white dark:bg-white/5 px-2 py-1 text-[11px] text-zinc-500">{keys}</kbd>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
