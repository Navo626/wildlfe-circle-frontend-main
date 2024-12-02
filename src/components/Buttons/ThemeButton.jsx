import { useTheme } from "../../hooks/ThemeProvider.jsx";
import { MdDarkMode, MdSunny } from "react-icons/md";

const ThemeIcons = {
  dark: <MdDarkMode className="h-5 w-5 text-white" />,
  light: <MdSunny className="h-5 w-5 text-gray-900" />,
};

const ThemeButton = () => {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <>
      <button className="h-fit w-fit rounded-md" onClick={toggleTheme}>
        {currentTheme === "light" ? ThemeIcons.light : ThemeIcons.dark}
      </button>
    </>
  );
};

export default ThemeButton;
