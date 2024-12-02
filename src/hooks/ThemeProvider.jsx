import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const ThemeContext = createContext(undefined);

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(
    localStorage.theme ? localStorage.theme : "light"
  );

  useEffect(() => {
    const ThemeSwitcher = () => {
      if (localStorage.theme === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.style.setProperty("--bg-color", "#fff");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.style.setProperty("--bg-color", "#000");
      }
    };

    ThemeSwitcher();
  }, [currentTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "light" ? "dark" : "light";
    setCurrentTheme(newTheme);
    localStorage.theme = newTheme;
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
