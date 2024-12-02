import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";

const Toast = ({ type, message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const toastClasses = {
    success:
      "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200",
    danger: "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200",
    warning:
      "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200",
  };

  return (
    <div
      className={`fixed top-5 right-5 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 rounded-lg shadow ${
        toastClasses[type]
      } transition-opacity ${isVisible ? "opacity-100" : "opacity-0"}`}
      role="alert"
    >
      <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg">
        {type === "success" && (
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
          </svg>
        )}
        {type === "danger" && (
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM13.707 12.293l-3-3a1 1 0 0 0-1.414 1.414l3 3a1 1 0 0 0 1.414-1.414ZM6.707 12.293a1 1 0 0 0 0 1.414 1 1 0 0 0 1.414 0 1 1 0 0 0 0-1.414 1 1 0 0 0-1.414 0Z" />
          </svg>
        )}
        {type === "warning" && (
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
          </svg>
        )}
      </div>
      <div className="ms-3 text-sm font-normal">{message}</div>
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        data-dismiss-target="#toast-warning"
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <IoClose className="w-3 h-3" />
      </button>
    </div>
  );
};

Toast.propTypes = {
  type: PropTypes.oneOf(["success", "danger", "warning"]).isRequired,
  message: PropTypes.string.isRequired,
};

export default Toast;
