"use client";
import ThemeToggle from "../components/ThemeToggle";
import { useThemeStore } from "../stores";
import { useEffect } from "react";

export default function Home() {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="h-full bg-white dark:bg-gray-900 text-black dark:text-white p-4">
      <h1 className="text-2xl font-bold">Hi, StackMind!</h1>
      <ThemeToggle />
    </div>
  );
}
