import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import ThemeButton from "../Buttons/ThemeButton.jsx";
import { Dialog, Popover } from "@headlessui/react";
import { Avatar, Dropdown } from "flowbite-react";
import { ToastContext } from "../../hooks/ToastProvider.jsx";
import useAxios from "../../hooks/useAxios.jsx";
import ConfirmationModal from "../Modals/ConfirmationModal.jsx";
import useCheckSession from "../../hooks/useCheckSession.jsx";
import FormModal from "../Modals/FormModal.jsx";
import ProfileUpdate from "./ProfileUpdate.jsx";

const NavItems = [
  {
    id: 1,
    text: "Home",
    link: "/",
  },
  {
    id: 2,
    text: "Blog",
    link: "/blog",
  },
  {
    id: 3,
    text: "News",
    link: "/news",
  },
  {
    id: 4,
    text: "Projects",
    link: "/project",
  },
  {
    id: 5,
    text: "Sessions",
    link: "/session",
  },
  {
    id: 6,
    text: "Gallery",
    link: "/gallery",
  },
  {
    id: 7,
    text: "Virtual Forest",
    link: "/forest",
  },
  {
    id: 8,
    text: "Products",
    link: "/product",
  },
  {
    id: 9,
    text: "About",
    link: "/about",
  },
  {
    id: 10,
    text: "Contact",
    link: "/contact",
  },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const lastPart = useLocation().pathname;
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const { showToast } = useContext(ToastContext);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [showProfileModal, setShowProfileModal] = useState(false);

  useCheckSession();

  useEffect(() => {
    const sessionActive = localStorage.getItem("sessionActive");
    setSessionActive(sessionActive === "true");
  }, []);

  const handleProfileView = () => {
    setShowProfileModal(true);
  };

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
    }
  }

  return (
    <>
      <header className="transition duration-500">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between p-6"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                className="h-12 w-auto transition duration-500"
                src="/logo/logo.png"
                alt="Brand"
              />
            </Link>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <IoMenu className="h-6 w-6 text-gray-500" aria-hidden="true" />
            </button>
          </div>
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            {NavItems.map((navItem) => (
              <Link
                key={navItem.id}
                to={navItem.link}
                onClick={(e) => {
                  if (navItem.text === "Virtual Forest") {
                    e.preventDefault();
                    setShowConfirmationModal(true);
                  }
                }}
                className={`text-sm font-semibold leading-6 transition duration-500 hover:text-primary-600 dark:hover:text-primary-600 ${
                  lastPart === navItem.link
                    ? "text-primary-600 dark:text-primary-600"
                    : "text-gray-900 dark:text-gray-300"
                }`}
              >
                {navItem.text}
              </Link>
            ))}
          </Popover.Group>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            {sessionActive ? (
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
                {userDetails?.role === "admin" ? (
                  <Link to="/admin/">
                    <Dropdown.Item className="dark:hover:bg-gray-800">
                      Dashboard
                    </Dropdown.Item>
                  </Link>
                ) : (
                  <Dropdown.Item
                    className="dark:hover:bg-gray-800"
                    onClick={handleProfileView}
                  >
                    Profile
                  </Dropdown.Item>
                )}
                <Dropdown.Item
                  onClick={handleSignOut}
                  className="dark:hover:bg-gray-800 text-red-500 dark:text-red-500 hover:text-red-500 dark:hover:text-red-500 font-medium"
                >
                  Sign out
                </Dropdown.Item>
              </Dropdown>
            ) : (
              <Link
                to="/login"
                className="text-gray-800 dark:text-white hover:bg-gray-200 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800 transition duration-500"
              >
                Log in
              </Link>
            )}
          </div>

          <div className="pl-6 pr-2 pt-2 hidden lg:block">
            <ThemeButton />
          </div>
        </nav>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-10" />
          <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white dark:bg-gray-950 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 transition duration-500">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img className="h-12 w-auto" src="/logo.png" alt="" />
              </Link>
              <button
                type="button"
                className="rounded-md text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <IoMdClose className="h-6 w-6 text-gray-500" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {NavItems.map((navItem) => (
                    <Link
                      key={navItem.id}
                      to={navItem.link}
                      onClick={(e) => {
                        if (navItem.text === "Virtual Forest") {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          setShowConfirmationModal(true);
                        }
                      }}
                      className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-500 ${
                        lastPart === navItem.link
                          ? "text-primary-600 dark:text-primary-600"
                          : "text-gray-900 dark:text-gray-300"
                      }`}
                    >
                      {navItem.text}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  {sessionActive ? (
                    <>
                      {userDetails?.role === "admin" ? (
                        <Link
                          to="/admin/"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-500 text-gray-900 dark:text-gray-300"
                        >
                          Dashboard
                        </Link>
                      ) : (
                        <span
                          onClick={handleProfileView}
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-500 text-gray-900 dark:text-gray-300"
                        >
                          Profile
                        </span>
                      )}
                      <Link
                        to="#"
                        onClick={handleSignOut}
                        className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-500 text-red-500 dark:text-red-500"
                      >
                        Sign out
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-500"
                    >
                      Log in
                    </Link>
                  )}
                  <div className="flex items-center justify-center py-5">
                    <ThemeButton />
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      <ConfirmationModal
        open={showConfirmationModal}
        setOpen={setShowConfirmationModal}
        onConfirm={() => navigate("/forest")}
      >
        <p>
          Please note that this experience requires a significant amount of GPU
          resources, which might affect performance on less powerful devices.
        </p>
        <br />
        <p>Are you sure you want to enter the Virtual Forest?</p>
      </ConfirmationModal>

      <FormModal
        open={showProfileModal}
        setOpen={setShowProfileModal}
        position={"top-center"}
        size={"3xl"}
        headerText={"Update Profile"}
      >
        <ProfileUpdate role="user" onClose={() => setShowProfileModal(false)} />
      </FormModal>
    </>
  );
};

export default Header;
