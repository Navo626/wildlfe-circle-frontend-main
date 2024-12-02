import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, Dropdown } from "flowbite-react";
import { ToastContext } from "../../hooks/ToastProvider.jsx";
import useAxios from "../../hooks/useAxios.jsx";
import useIsAdmin from "../../hooks/useIsAdmin.jsx";
import {
  MdContentCopy,
  MdDescription,
  MdEvent,
  MdNewReleases,
  MdPeople,
  MdPerson,
  MdPhotoLibrary,
  MdShoppingCart,
  MdSpaceDashboard,
  MdWork,
} from "react-icons/md";
import PropTypes from "prop-types";
import ThemeButton from "../Buttons/ThemeButton.jsx";
import { IoMenu } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";
import { FaTruck } from "react-icons/fa";
import ScrollToTopButton from "../Buttons/ScrollToTopButton.jsx";

const sidebarItems = [
  {
    text: "Dashboard",
    link: "/admin/",
    icon: <MdSpaceDashboard className="h-4 w-4" />,
  },
  {
    text: "Users",
    link: "/admin/users",
    icon: <MdPeople className="h-4 w-4" />,
  },
  {
    text: "Blog",
    link: "/admin/blogs",
    icon: <MdDescription className="h-4 w-4" />,
  },
  {
    text: "News",
    link: "/admin/news",
    icon: <MdNewReleases className="h-4 w-4" />,
  },
  {
    text: "Projects",
    link: "/admin/projects",
    icon: <MdWork className="h-4 w-4" />,
  },
  {
    text: "Sessions",
    link: "/admin/sessions",
    icon: <MdEvent className="h-4 w-4" />,
  },
  {
    text: "Gallery",
    link: "/admin/gallery",
    icon: <MdPhotoLibrary className="h-4 w-4" />,
  },
  {
    text: "Products",
    link: "/admin/products",
    icon: <MdShoppingCart className="h-4 w-4" />,
  },
  {
    text: "Orders",
    link: "/admin/orders",
    icon: <FaTruck className="h-4 w-4" />,
  },
  {
    text: "Content",
    icon: <MdContentCopy className="h-4 w-4" />,
    children: [
      {
        id: 1,
        text: "About",
        link: "/admin/content/about",
      },
    ],
  },
  {
    text: "Profile",
    link: "/admin/profile",
    icon: <MdPerson className="h-4 w-4" />,
  },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const sidebarRef = useRef();
  const lastPart = useLocation().pathname;
  const { showToast } = useContext(ToastContext);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [openSubmenus, setOpenSubmenus] = useState({});
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;

  useIsAdmin();

  const toggleSubmenu = (id) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Function to close the sidebar if clicking outside it
  const closeSidebar = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Add event listener to document to close sidebar when clicking outside
    document.addEventListener("mousedown", closeSidebar);

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("mousedown", closeSidebar);
    };
  }, []);

  async function handleSignOut() {
    try {
      await axiosInstance.post(`/api/auth/logout`, {
        logout_all: false,
      });
      showToast("Logged out successful!", "success");
      localStorage.clear();
      localStorage.setItem("sessionActive", "false");
      setSessionActive(false);
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/login");
    }
  }

  return (
    <>
      {/*HEADER*/}
      <header className="sticky top-0 inset-x-0 flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white dark:bg-gray-950 border-b text-sm py-2.5 sm:py-4 lg:ps-64 dark:border-gray-700 transition duration-500">
        <nav className="flex basis-full items-center w-full mx-auto px-4 sm:px-10">
          <div className="me-5 lg:me-0 lg:hidden">
            {/*Logo*/}
            <Link
              className="flex-none rounded-xl text-xl inline-block font-semibold focus:outline-none focus:opacity-80"
              to="#"
            >
              <img
                className="h-12 w-auto transition duration-500"
                src="/logo/logo.png"
                alt="Brand"
              />
            </Link>
            {/*End Logo*/}
          </div>

          <div className="w-full flex items-center justify-end ms-auto lg:justify-between sm:gap-x-3 sm:order-3">
            <div className="pt-1.5 hidden lg:block">
              <ThemeButton />
            </div>
            <Dropdown
              className="dark:bg-gray-900"
              label={
                userDetails?.image ? (
                  <>
                    <img
                      src={urlPrefix + userDetails.image}
                      alt={userDetails?.title}
                      className="h-10 w-10 object-cover rounded-full"
                    />
                  </>
                ) : (
                  <>
                    <Avatar
                      placeholderInitials={
                        userDetails?.firstName[0] + userDetails?.lastName[0]
                      }
                      rounded
                    />
                  </>
                )
              }
              arrowIcon={false}
              inline
            >
              <Dropdown.Header>
                <span className="block text-sm dark:bg-gray-900">
                  {userDetails?.firstName + " " + userDetails?.lastName}
                </span>
                <span className="block truncate text-sm font-medium">
                  {userDetails?.email}
                </span>
              </Dropdown.Header>
              <Link to="/">
                <Dropdown.Item className="dark:hover:bg-gray-800">
                  Home
                </Dropdown.Item>
              </Link>
              <Dropdown.Item
                onClick={handleSignOut}
                className="dark:hover:bg-gray-800 text-red-500 dark:text-red-500 hover:text-red-500 dark:hover:text-red-500 font-medium"
              >
                Sign out
              </Dropdown.Item>
            </Dropdown>
          </div>
        </nav>
      </header>
      {/*END HEADER*/}

      {/*MAIN CONTENT*/}

      {/*Sidebar*/}
      <div className="top-0 inset-x-0 z-20 bg-white border-y px-4 sm:px-6 md:px-8 lg:hidden dark:bg-gray-950 dark:border-neutral-700 transition duration-500">
        <div className="flex justify-between py-4 mx-2">
          <button
            type="button"
            className="text-gray-500 hover:text-gray-600"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Toggle Navigation</span>
            <IoMenu className="h-5 w-5 text-gray-500" />
          </button>
          <div className="pt-1.5 block lg:hidden">
            <ThemeButton />
          </div>
        </div>
      </div>

      <div
        ref={sidebarRef}
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all transform fixed top-0 start-0 bottom-0 z-[60] w-64 bg-white dark:bg-gray-950 border-e border-gray-200 dark:border-gray-700 pt-7 pb-10 overflow-y-auto lg:block lg:translate-x-0 lg:end-auto lg:bottom-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 duration-500`}
      >
        <div className="flex items-center justify-center px-6">
          <img
            className="h-12 w-auto transition duration-500"
            src="/logo/logo.png"
            alt="Brand"
          />
        </div>

        <nav className="p-6 w-full flex flex-col flex-wrap">
          <ul className="space-y-1.5">
            {sidebarItems?.map((item, index) => (
              <li key={index}>
                {item?.children ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(item.id)}
                      className="w-full text-start flex items-center justify-between gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:text-gray-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-300 focus:outline-none focus:ring-1 focus:ring-gray-600 transition duration-500"
                    >
                      <div className="flex gap-x-3">
                        {item?.icon}
                        {item?.text}
                      </div>
                      <IoIosArrowDown
                        className={`h-4 w-4 transform transition-transform duration-500 ${
                          openSubmenus[item.id] ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`w-full transition-[height] duration-500 ${
                        openSubmenus[item.id] ? "block" : "hidden"
                      }`}
                    >
                      <ul className="pt-2 ps-2">
                        {item?.children?.map((subItem) => (
                          <li key={subItem?.id}>
                            <Link
                              to={subItem?.link}
                              className="flex items-center gap-x-3.5 py-2 px-2.5 text-sm text-gray-700 dark:text-gray-300 dark:hover:text-gray-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-300 focus:outline-none focus:ring-1 focus:ring-gray-600 transition duration-500"
                            >
                              {subItem?.text}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item?.link}
                    className={`flex items-center gap-x-3 py-2 px-2.5 ${
                      lastPart === item?.link
                        ? "bg-primary-400 dark:bg-primary-800"
                        : "text-gray-700 hover:bg-primary-100 dark:hover:bg-primary-300 dark:hover:text-gray-700"
                    } text-sm rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-600 transition duration-500`}
                  >
                    {item?.icon}
                    {item?.text}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/*Content*/}
      <div className="w-full lg:ps-64">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">{children}</div>
      </div>
      {/*End Content*/}

      <ScrollToTopButton />
    </>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node,
};

export default DashboardLayout;
