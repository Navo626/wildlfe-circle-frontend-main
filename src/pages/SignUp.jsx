import {useContext, useState} from "react";
import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import {AiOutlineLoading} from "react-icons/ai";
import {Button} from "flowbite-react";
import axios from "axios";
import {ToastContext} from "../hooks/ToastProvider.jsx";
import {Link, useNavigate} from "react-router-dom";
import {FaEye, FaEyeSlash} from "react-icons/fa";

const SignUp = () => {
  const inputFieldData = [
    {
      name: "firstName",
      placeholder: "John",
      label: "First Name",
      type: "text",
    },
    { name: "lastName", placeholder: "Doe", label: "Last Name", type: "text" },
    {
      name: "email",
      placeholder: "example@gmail.com",
      label: "Email",
      type: "text",
    },
    {
      name: "phone",
      placeholder: "0712345678",
      label: "Phone Number",
      type: "text",
    },
    {
      name: "password",
      placeholder: "••••••••",
      label: "Password",
      type: "password",
    },
    {
      name: "confirmPassword",
      placeholder: "••••••••",
      label: "Confirm Password",
      type: "password",
    },
  ];
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useContext(ToastContext);
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    validateField(name, value, { ...user, [name]: value });
  };

  const validateField = (name, value, updatedUser) => {
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
      case "password":
      case "confirmPassword":
        // Validate password length and match
        if (name === "password" && !value) {
          errorMsg = "Password is required!";
        } else if (name === "password" && value.length < 8) {
          errorMsg = "Password must be at least 8 characters long!";
        } else if (
          updatedUser.confirmPassword &&
          value !== updatedUser.confirmPassword
        ) {
          // Both fields exist but do not match
          setErrors((prev) => ({
            ...prev,
            confirmPassword: "Passwords do not match!",
          }));
        } else {
          // Clear confirmPassword error if it matches now
          setErrors((prev) => ({ ...prev, confirmPassword: "" }));
        }
        if (name === "confirmPassword" && !value) {
          errorMsg = "Confirm password is required!";
        } else if (value !== updatedUser.password) {
          errorMsg = "Passwords do not match!";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const canSubmit = () => {
    return (
      Object.values(user).every((x) => x) &&
      Object.values(errors).every((x) => !x)
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(`${urlPrefix}/api/auth/register`, {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: user.phone,
        password: user.password,
        password_confirmation: user.confirmPassword,
      });
      if (response.data.status === true) {
        showToast("Registration successful! Please log in.", "success");
        setUser({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });

        navigate("/login");
      } else {
        showToast("Registration failed. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Registration failed. Please try again.", "danger");
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <section className="flex min-h-full flex-1 flex-col justify-center items-center p-4 py-10">
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg p-6 m-auto bg-white dark:bg-gray-950 rounded-xl shadow-md dark:shadow-gray-900 border dark:border-gray-700 transition duration-500">
            <div className="flex flex-col items-center justify-center mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 py-5 dark:text-white transition duration-500">
                Get Started!
              </h1>
              <img className="w-auto h-16 mb-5" src="/logo/logo.png" alt="Brand" />
            </div>
            <form onSubmit={submitForm} className="mx-auto max-w-xl">
              {/* Render form fields */}
              <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                {/* Field render helper */}
                {inputFieldData.map((field) => (
                  <div
                    key={field.name}
                    className={
                      field.name === "email" || field.name === "phone"
                        ? "sm:col-span-2"
                        : ""
                    }
                  >
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                    >
                      {field.label}
                    </label>
                    <div className="mt-2.5 relative">
                      <input
                        type={
                          field.type === "password"
                            ? field.name === "password"
                              ? showPassword
                                ? "text"
                                : "password"
                              : showConfirmPassword
                              ? "text"
                              : "password"
                            : field.type
                        }
                        id={field.name}
                        name={field.name}
                        value={user[field.name]}
                        onChange={handleChange}
                        disabled={isLoading}
                        placeholder={field.placeholder}
                        className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                      />
                      {field.type === "password" && (
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                          onClick={() =>
                            field.name === "password"
                              ? setShowPassword(!showPassword)
                              : setShowConfirmPassword(!showConfirmPassword)
                          }
                          aria-label={
                            field.name === "password"
                              ? showPassword
                                ? "Hide password"
                                : "Show password"
                              : showConfirmPassword
                              ? "Hide confirm password"
                              : "Show confirm password"
                          }
                        >
                          {field.name === "password" ? (
                            showPassword ? (
                              <FaEyeSlash />
                            ) : (
                              <FaEye />
                            )
                          ) : showConfirmPassword ? (
                            <FaEyeSlash />
                          ) : (
                            <FaEye />
                          )}
                        </button>
                      )}
                    </div>
                    {errors[field.name] && (
                      <span className="text-sm text-red-500">
                        {errors[field.name]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-10">
                <Button
                  type="submit"
                  disabled={!canSubmit() || isLoading}
                  className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-gray-300 focus:!ring-opacity-50"
                >
                  Register
                  {isLoading && (
                    <AiOutlineLoading className="h-6 w-6 animate-spin ml-2" />
                  )}
                </Button>
              </div>
            </form>
            <p className="mt-8 text-xs font-light text-center text-gray-400">
              {" "}
              Already have an account?
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-800"
              >
                &nbsp;Log In
              </Link>
            </p>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default SignUp;
