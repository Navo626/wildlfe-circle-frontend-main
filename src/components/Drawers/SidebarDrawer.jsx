import { IoClose } from "react-icons/io5";
import PropTypes from "prop-types";
import { Button } from "flowbite-react";
import { useEffect, useRef } from "react";

const SidebarDrawer = ({ open, setOpen, title, children }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpen]);

  return (
    <>
      <div
        ref={sidebarRef}
        className={`w-96 fixed left-0 top-0 z-[60] px-6 overflow-y-auto ${
          open ? "translate-x-0" : "-translate-x-full"
        } bg-white dark:bg-gray-950 dark:text-white shadow-lg !transition !duration-500`}
      >
        <h2 className="text-gray-900 dark:text-white text-lg text-center font-semibold leading-7 pt-6 !transition !duration-500">
          {title}
        </h2>
        <Button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed right-0 top-5 z-40 !ring-0 !bg-transparent text-gray-900 dark:text-white !transition !duration-500"
        >
          <IoClose className="size-6" />
        </Button>
        <div className="pt-10 min-h-screen h-fit">{children}</div>
      </div>
    </>
  );
};

SidebarDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
  position: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
};

export default SidebarDrawer;
