import { Terminal } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-white/[0.08] bg-white dark:bg-[#09090b]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-zinc-950 dark:bg-white">
                <Terminal className="h-3.5 w-3.5 text-white dark:text-zinc-950" strokeWidth={2.5} />
              </span>
              <span className="text-[15px] font-bold tracking-tight">CodeGod</span>
            </Link>
            <p className="mt-4 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              The focused way to master data structures and algorithms. Practice, track streaks, and get interview-ready.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Practice</p>
              <ul className="space-y-2.5 text-[13px] font-medium">
                <li><Link to="/problems" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white">Problems</Link></li>
                <li><Link to="/sheets" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white">Sheets</Link></li>
                <li><Link to="/profile" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white">Profile</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Company</p>
              <ul className="space-y-2.5 text-[13px] font-medium">
                <li><Link to="/" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white">Home</Link></li>
                <li><a href="https://github.com/pritamawatade" target="_blank" rel="noreferrer" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white">GitHub</a></li>
                <li><a href="mailto:pritamawatade.work@gmail.com" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Legal</p>
              <ul className="space-y-2.5 text-[13px] font-medium">
                <li><Link to="/privacy" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white">Privacy</Link></li>
                <li><Link to="/terms" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-zinc-200 dark:border-white/[0.08] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-zinc-400">© 2026 CodeGod. All rights reserved.</p>
          <p className="code-font text-xs text-zinc-400">Built for consistent practice.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
