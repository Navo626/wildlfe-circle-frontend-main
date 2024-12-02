import Footer from "../components/Layouts/Footer.jsx";
import Header from "../components/Layouts/Header.jsx";
import { FaMapMarkedAlt } from "react-icons/fa";
import { IoMailOpen } from "react-icons/io5";
import { Link } from "react-router-dom";
import { AiOutlineLoading } from "react-icons/ai";
import { Button } from "flowbite-react";
import { useContext, useState } from "react";
import { ToastContext } from "../hooks/ToastProvider.jsx";
import axios from "axios";

const Contact = () => {
  const inputFieldData = [
    {
      name: "firstName",
      placeholder: "First Name",
      label: "First Name",
      type: "text",
    },
    {
      name: "lastName",
      placeholder: "Last Name",
      label: "Last Name",
      type: "text",
    },
    { name: "email", placeholder: "Email", label: "Email", type: "text" },
    {
      name: "phone",
      placeholder: "Phone Number",
      label: "Phone Number",
      type: "text",
    },
  ];
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    details: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useContext(ToastContext);
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "firstName":
        if (!value) errorMsg = `First Name is required!`;
        break;
      case "lastName":
        if (!value) errorMsg = `Last Name is required!`;
        break;
      case "email":
        if (!value) {
          errorMsg = "Email is required!";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = "Email address is invalid!";
        }
        break;
      case "phone":
        if (!value) {
          errorMsg = "Phone number is required!";
        } else if (!/^\d{10}$/.test(value)) {
          errorMsg = "Phone number is invalid!";
        }
        break;
      case "details":
        if (name === "details" && !value) {
          errorMsg = "Details is required!";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const canSubmit = () => {
    return (
      Object.values(contact).every((x) => x) &&
      Object.values(errors).every((x) => !x)
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${urlPrefix}/api/contact`, {
        firstname: contact.firstName,
        lastname: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        details: contact.details,
      });

      if (response.data.status === true) {
        showToast("Message sent successfully.", "success");
        setContact({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          details: "",
        });
      } else {
        showToast("Message sending failed. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Message sending failed. Please try again.", "danger");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <section className="flex-grow">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-12 mx-auto">
            <div className="mx-auto">
              <div className="text-center">
                <h2 className="text-3xl mb-8 text-center font-bold text-gray-800 sm:text-4xl dark:text-white transition duration-500">
                  Contact Us
                </h2>
                <div className="w-full text-center text-gray-600 dark:text-gray-400 text-lg leading-8 transition duration-500">
                  We&apos;d love to talk about how we can help you.
                </div>
              </div>

              <div className="mt-12 grid items-center lg:grid-cols-2 gap-6 lg:gap-16">
                <div className="flex flex-col border rounded-xl p-4 sm:p-6 lg:p-8 dark:border-gray-700 bg-white dark:bg-gray-950 transition duration-500">
                  <h2 className="mb-8 text-xl font-semibold text-gray-800 dark:text-gray-200 transition duration-500">
                    Fill in the form
                  </h2>

                  <form onSubmit={(e) => submitForm(e)}>
                    <div className="grid gap-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {inputFieldData.map((field) => (
                          <div
                            key={field.name}
                            className={
                              field.name === "email" || field.name === "phone"
                                ? "sm:col-span-2"
                                : ""
                            }
                          >
                            <div className="mt-2.5">
                              <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={contact[field.name]}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder={field.placeholder}
                                className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                              />
                              {errors[field.name] && (
                                <span className="text-sm text-red-500">
                                  {errors[field.name]}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2.5">
                        <label form="details" className="sr-only">
                          Details
                        </label>
                        <textarea
                          id="details"
                          name="details"
                          rows="4"
                          value={contact.details}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                          placeholder="Details"
                        ></textarea>
                        {errors["details"] && (
                          <span className="text-sm text-red-500">
                            {errors["details"]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 grid">
                      <Button
                        type="submit"
                        disabled={!canSubmit() || isLoading}
                        className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-gray-300 focus:!ring-opacity-50"
                      >
                        Send
                        {isLoading && (
                          <AiOutlineLoading className="h-6 w-6 animate-spin ml-2" />
                        )}
                      </Button>
                    </div>

                    <div className="mt-3 text-center">
                      <p className="text-sm text-gray-500">
                        We&apos;ll get back to you in 1-2 business days.
                      </p>
                    </div>
                  </form>
                </div>

                <div className="divide-y divide-gray-200 dark:divide-gray-800 transition duration-500">
                  <div className=" flex gap-x-7 py-6">
                    <IoMailOpen className="flex-shrink-0 size-5 mt-1.5 text-gray-800 dark:text-gray-200 transition duration-500" />
                    <div className="grow">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 transition duration-500">
                        Contact us by email
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        If you wish to write us an email instead, please use
                      </p>
                      <Link
                        className="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition duration-500"
                        to="mailto:thewildlifecircle@gmail.com"
                      >
                        thewildlifecircle@gmail.com
                      </Link>
                    </div>
                  </div>

                  <div className=" flex gap-x-7 py-6">
                    <FaMapMarkedAlt className="flex-shrink-0 size-5 mt-1.5 text-gray-800 dark:text-gray-200 transition duration-500" />
                    <div className="grow">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200 transition duration-500">
                        Locate us
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        If you wish to meet us instead, please visit us at
                      </p>
                      <Link
                        className="mt-2 inline-flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition duration-500"
                        to="https://maps.app.goo.gl/GnnPDMjD7BRUx7Cv6"
                        target="_blank"
                      >
                        Wildlife Circle, VW34+V2G, Rubber Watte Rd, Nugegoda
                        Gangodawila, Sri Lanka
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default Contact;
