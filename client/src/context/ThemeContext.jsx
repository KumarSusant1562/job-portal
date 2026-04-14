import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Get the theme preference key based on user login status
  const getThemeKey = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user && user._id) {
          return `theme_${user._id}`;
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
    return 'theme_guest';
  };

  const applyThemeFromStorage = () => {
    const themeKey = getThemeKey();
    const savedTheme = localStorage.getItem(themeKey);

    if (savedTheme) {
      const dark = savedTheme === 'dark';
      setIsDarkMode(dark);
      document.documentElement.classList.toggle('dark-mode', dark);
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark-mode');
    }
  };

  // Load theme preference from localStorage on mount and when user changes
  useEffect(() => {
    applyThemeFromStorage();
  }, []);

  // Listen for storage changes to sync theme across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => applyThemeFromStorage();
    const handleAuthUserChange = () => applyThemeFromStorage();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-user-changed', handleAuthUserChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-user-changed', handleAuthUserChange);
    };
  }, []);

  const toggleTheme = () => {
    const themeKey = getThemeKey();
    const newTheme = !isDarkMode ? 'dark' : 'light';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem(themeKey, newTheme);
    document.documentElement.classList.toggle('dark-mode', newTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
