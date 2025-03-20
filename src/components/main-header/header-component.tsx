"use client";

import ThemeToggle from "../ThemeToggle";
import NavLink from "./nav-link";

export default function MainHeader() {
  return (
    <nav className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 p-2 text-white h-16">
      <NavLink href="/dashboard">Dashboard</NavLink>
      <div className="flex items-center space-x-4">
        <NavLink href="/posts">Posts (Server Component)</NavLink>
        <ThemeToggle />
      </div>
    </nav>
  );
}
