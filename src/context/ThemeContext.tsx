import React, { createContext, useContext, useState, useEffect } from "react";
import { ThemeMode } from "../types";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  accentColorClass: string;
  badgeBgClass: string;
  isPolishActive: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to the requested "professional" polish theme
  const [theme, setTheme] = useState<ThemeMode>("professional");

  useEffect(() => {
    // Update body class for CSS variable root overrides
    document.documentElement.classList.remove("theme-professional", "theme-classic", "theme-minimal");
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  const accentColorClass =
    theme === "professional"
      ? "text-amber-400"
      : theme === "classic"
      ? "text-yellow-400"
      : "text-slate-200";

  const badgeBgClass =
    theme === "professional"
      ? "bg-amber-500 hover:bg-amber-600 text-white"
      : theme === "classic"
      ? "bg-yellow-500 hover:bg-yellow-600 text-slate-950"
      : "bg-slate-800 hover:bg-slate-700 text-white";

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        accentColorClass,
        badgeBgClass,
        isPolishActive: theme === "professional",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
