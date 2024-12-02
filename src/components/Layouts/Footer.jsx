import { FaFacebook, FaInstagram } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { FaYoutube } from "react-icons/fa";
import ScrollToTopButton from "../Buttons/ScrollToTopButton.jsx";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="transition duration-500 mt-auto">
        <div className="container flex flex-col items-center justify-between p-6 mx-auto max-w-7xl space-y-4 sm:space-y-0 sm:flex-row">
          <img
            className="h-12 w-auto transition duration-500"
            src="/logo/logo-uni.png"
            alt="Brand"
          />

          <p className="text-sm text-gray-600 dark:text-gray-300 transition duration-500">
            &copy; {currentYear} Wildlife Circle. All right reserved.
          </p>

          <div className="flex -mx-2">
            <Link
              to="https://facebook.com/wildlifecircleusj"
              className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
              aria-label="facebook"
            >
              <FaFacebook className="w-5 h-5" />
            </Link>

            <Link
              to="https://www.instagram.com/wildlifecircleusj"
              className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
              aria-label="Instagram"
            >
              <FaInstagram className="w-5 h-5" />
            </Link>

            <Link
              to="https://youtube.com/@wildlifecircleusj"
              className="mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-500"
              aria-label="Youtube"
            >
              <FaYoutube className="w-5 h-5" />
            </Link>

            <ScrollToTopButton />
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
