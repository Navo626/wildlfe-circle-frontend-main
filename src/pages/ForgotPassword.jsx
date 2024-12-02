import Footer from "../components/Layouts/Footer.jsx";
import Header from "../components/Layouts/Header.jsx";
import { AiOutlineLoading } from "react-icons/ai";
import { Button } from "flowbite-react";
import { useContext, useState } from "react";
import { ToastContext } from "../hooks/ToastProvider.jsx";
import axios from "axios";

const ForgotPassword = () => {
  const [forgot, setForgot] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useContext(ToastContext);
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForgot((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);

    if (errors["other"]) {
      setErrors((prev) => ({ ...prev, other: null }));
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
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const canSubmit = () => {
    return (
      Object.values(forgot).every((x) => x) &&
      Object.values(errors).every((x) => !x)
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${urlPrefix}/api/auth/forgot-password`,
        {
          email: forgot.email,
        }
      );

      if (response.data.status === true) {
        showToast(
          "Reset link sent successfully. Please check your emails",
          "success"
        );
        setForgot({
          email: "",
        });
        setErrors({});
      } else {
        showToast("Reset link sending failed. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Reset link sending failed. Please try again.", "danger");
      if (error.response.status === 429) {
        showToast(error.response.data.message, "danger");
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
                Forgot Password
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center transition duration-500">
                Enter your email address to receive a password reset link
              </p>
            </div>

            <form className="mt-6" onSubmit={(e) => submitForm(e)}>
              <div>
                <input
                  type="text"
                  id="email"
                  placeholder="example@gmail.com"
                  name="email"
                  value={forgot["email"]}
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

              <div className="mt-6">
                <Button
                  type="submit"
                  disabled={!canSubmit() || isLoading}
                  className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-primary-300 focus:!ring-opacity-50"
                >
                  Submit
                  {isLoading && (
                    <AiOutlineLoading className="h-6 w-6 animate-spin ml-2" />
                  )}
                </Button>

                <div className="mt-3 text-center">
                  <p className="text-sm text-gray-500">
                    {errors["other"] && (
                      <span className="text-sm text-red-500">
                        {errors["other"]}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </form>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default ForgotPassword;
