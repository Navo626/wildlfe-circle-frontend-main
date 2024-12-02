import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { FaLink, FaLinkedin } from "react-icons/fa";
import PropTypes from "prop-types";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa6";
import { ToastContext } from "../../hooks/ToastProvider.jsx";

const TooltipContent = ({ content, other }) => {
  const location = useLocation();
  const url = "https://www.localhost" + location.pathname;
  const { showToast } = useContext(ToastContext);

  const copyLinkToClipboard = () => {
    navigator.clipboard
      .writeText(url)
      .then(() => showToast("Link copied successfully", "success"))
      .catch(() => showToast("Failed to copy link", "danger"));
  };

  return (
    <>
      {content === "author" && (
        <>
          <div className="flex justify-between items-center px-4 py-3 sm:px-5">
            <ul className="text-xs space-x-3">
              <li className="inline-block">
                <span className="font-semibold text-gray-200 dark:text-neutral-200 transition duration-500">
                  Articles
                </span>
                <span className="text-gray-400 dark:text-neutral-400 transition duration-500">
                  &nbsp;{other.articles}
                </span>
              </li>
              <li className="inline-block">
                <span className="font-semibold text-gray-200 dark:text-neutral-200 transition duration-500">
                  Joined on
                </span>
                <span className="text-gray-400 dark:text-neutral-400 transition duration-500">
                  &nbsp;{other.joined}
                </span>
              </li>
            </ul>
          </div>
        </>
      )}

      {content === "like" && <>Like</>}

      {content === "comment" && <>Comment</>}

      {content === "share" && (
        <div className="w-56 transition-[opacity,margin] duration bg-neutral-950 shadow-md rounded-xl p-2 dark:bg-gray-700">
          <a
            onClick={copyLinkToClipboard}
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:focus:ring-neutral-400"
          >
            <FaLink className="opacity-90" />
            Copy link
          </a>
          <div className="border-t border-gray-600 my-2 dark:border-neutral-800"></div>
          <a
            target="_blank"
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:focus:ring-neutral-400"
            href={`https://twitter.com/intent/tweet?url=${url}&text=Checkout%20this%20awesome%20article`}
          >
            <BsTwitterX className="opacity-90" />
            Share on Twitter
          </a>
          <a
            target="_blank"
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:focus:ring-neutral-400"
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          >
            <FaFacebook className="opacity-90" />
            Share on Facebook
          </a>
          <a
            target="_blank"
            className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:focus:ring-neutral-400"
            href={`https://www.linkedin.com/shareArticle?mini=true&url=${url}`}
          >
            <FaLinkedin className="opacity-90" />
            Share on LinkedIn
          </a>
        </div>
      )}
    </>
  );
};

TooltipContent.propTypes = {
  content: PropTypes.string.isRequired,
  other: PropTypes.object,
};

export default TooltipContent;
