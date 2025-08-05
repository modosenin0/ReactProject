import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2 position-relative overflow-hidden"
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      style={{ 
        transition: 'all 0.3s ease',
        transform: 'scale(1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <span 
        className="fs-5" 
        style={{ 
          transition: 'transform 0.5s ease, filter 0.3s ease',
          transform: isDarkMode ? 'rotate(180deg)' : 'rotate(0deg)',
          filter: isDarkMode ? 'brightness(1.2)' : 'brightness(1)',
        }}
      >
        {isDarkMode ? '☀️' : '🌙'}
      </span>
      <span className="d-none d-sm-inline fw-medium">
        {isDarkMode ? 'Light' : 'Dark'}
      </span>
    </button>
  );
}
