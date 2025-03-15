import { useThemeStore } from '../store/main';

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded"
    >
      {isDarkMode ? 'Light Mode’a Geç' : 'Dark Mode’a Geç'}
    </button>
  );
}