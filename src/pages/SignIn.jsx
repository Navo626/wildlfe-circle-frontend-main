import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {Button} from "flowbite-react";
import {AiOutlineLoading} from "react-icons/ai";
import {ToastContext} from "../hooks/ToastProvider.jsx";
import axios from "axios";
import {FaEye, FaEyeSlash} from "react-icons/fa";

const SignIn = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useContext(ToastContext);
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const sessionActive = localStorage.getItem("sessionActive");
    if (sessionActive === "true") {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setIsChecked(checked);
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
      validateField(name, value);
    }
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "email":
        if (!value) {
          errorMsg = "Email is required!";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = "Email address is invalid!";
        }
        break;
      case "password":
        if (!value) {
          errorMsg = "Password is required!";
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
      const response = await axios.post(
        `${urlPrefix}/api/auth/login`,
        {
          email: user.email,
          password: user.password,
          remember: isChecked,
        },
        { withCredentials: true }
      );

      if (response.data.status === true) {
        const userDetails = {
          id: response.data.data.id,
          firstName: response.data.data.first_name,
          lastName: response.data.data.last_name,
          email: response.data.data.email,
          phone: response.data.data.phone,
          role: response.data.data.role,
          image: response.data.data.image_path,
        };

        localStorage.setItem("sessionActive", "true");
        localStorage.setItem("userDetails", JSON.stringify(userDetails));

        showToast("Login successful!", "success");
        setUser({
          email: "",
          password: "",
        });
        setIsChecked(false);

        if (response.data.data.role === "admin") {
          navigate("/admin/");
        } else {
          navigate("/");
        }
      } else {
        showToast("An error occurred.", "danger");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showToast("Email or Password is incorrect.", "danger");
      } else {
        showToast("An error occurred.", "danger");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <section className="flex min-h-full flex-1 flex-col justify-center items-center mx-4">
          <div className="w-full max-w-sm md:max-w-md lg:max-w-lg p-6 m-auto mx-auto bg-white dark:bg-gray-950 rounded-xl shadow-md dark:shadow-gray-900 border dark:border-gray-700 transition duration-500">
            <div className="flex flex-col items-center justify-center mx-auto">
              <h1 className="text-3xl font-bold text-gray-800 py-5 dark:text-white transition duration-500">
                Welcome Back!
              </h1>
              <img className="w-auto h-16 -mb-5" src="/logo/logo.png" alt="" />
            </div>

            <form className="mt-6" onSubmit={(e) => submitForm(e)}>
              <div>
                <label
                  htmlFor="Email"
                  className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                >
                  Email
                </label>
                <input
                  type="text"
                  id="email"
                  placeholder="example@gmail.com"
                  name="email"
                  value={user["email"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="my-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                />
                {errors["email"] && (
                  <span className="text-sm text-red-500">
                    {errors["email"]}
                  </span>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                  >
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="my-3 text-xs text-primary-600 hover:text-primary-800 transition duration-500"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="••••••••"
                    name="password"
                    value={user["password"]}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors["password"] && (
                  <span className="text-sm text-red-500">
                    {errors["password"]}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start pt-3">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      id="remember"
                      name="remember"
                      value={user["remember"]}
                      checked={isChecked}
                      disabled={isLoading}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded transition duration-500"
                      onChange={() => setIsChecked(!isChecked)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="remember"
                      className="text-gray-800 dark:text-gray-200 transition duration-500"
                    >
                      Remember me
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={!canSubmit() || isLoading}
                  className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-primary-300 focus:!ring-opacity-50"
                >
                  Sign In
                  {isLoading && (
                    <AiOutlineLoading className="h-6 w-6 animate-spin ml-2" />
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-8 text-xs font-light text-center text-gray-400">
              {" "}
              Don&apos;t have an account?
              <Link
                to="/register"
                className="font-medium text-primary-600 hover:text-primary-800"
              >
                &nbsp;Create One
              </Link>
            </p>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default SignIn;
