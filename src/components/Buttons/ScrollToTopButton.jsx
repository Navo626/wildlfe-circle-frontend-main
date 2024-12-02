import { FaArrowUp } from "react-icons/fa";
import { useEffect, useState } from "react";

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Function to handle scrolling
    const handleScroll = () => {
      // Check if the page has been scrolled down by at least 100px
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add event listener to handle scrolling
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  const scrollToTop = () => {
    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          className="fixed right-0 bottom-0 m-6 bg-primary-600 hover:bg-primary-800 text-white font-bold py-2 px-2 rounded-full"
          onClick={scrollToTop}
        >
          <FaArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
};

export default ScrollToTopButton;
