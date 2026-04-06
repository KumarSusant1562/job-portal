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
    return 'theme';
  };

  // Load theme preference from localStorage on mount and when user changes
  useEffect(() => {
    const themeKey = getThemeKey();
    const savedTheme = localStorage.getItem(themeKey);
    
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
      document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
    } else {
      // Default to light mode
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark-mode');
    }
  }, []);

  // Listen for storage changes to sync theme across tabs/windows
  useEffect(() => {
    const handleStorageChange = () => {
      const themeKey = getThemeKey();
      const savedTheme = localStorage.getItem(themeKey);
      
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
        document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
