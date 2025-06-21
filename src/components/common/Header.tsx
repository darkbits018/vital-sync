import React from 'react';
import { Moon, Sun, ExternalLink } from 'lucide-react';

interface HeaderProps {
  title: string;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  showDarkModeToggle?: boolean;
}

export function Header({ title, darkMode, onToggleDarkMode, showDarkModeToggle = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      {/* Persistent Bolt.new Badge */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-1">
        <div className="flex items-center justify-center">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 text-white hover:text-purple-200 transition-colors text-xs font-medium"
          >
            <span>⚡</span>
            <span>Built with Bolt.new</span>
            <ExternalLink size={10} />
          </a>
        </div>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        
        {showDarkModeToggle && (
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 active:scale-95"
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} className="text-blue-600" />
            )}
          </button>
        )}
      </div>
    </header>
  );
}