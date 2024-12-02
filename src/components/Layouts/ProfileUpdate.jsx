import anonymous_user from "../../assets/anonymous_user.png";
import {IoMdCloudUpload} from "react-icons/io";
import {Button} from "flowbite-react";
import {AiOutlineLoading} from "react-icons/ai";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import ConfirmationModal from "../Modals/ConfirmationModal.jsx";
import {useContext, useEffect, useState} from "react";
import {ToastContext} from "../../hooks/ToastProvider.jsx";
import useAxios from "../../hooks/useAxios.jsx";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

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
];

const passwordFieldData = [
  {
    name: "password",
    label: "Current Password",
    type: "password",
  },
  {
    name: "newPassword",
    label: "New Password",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
  },
];

const ProfileUpdate = ({ role, onClose }) => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    image: null,
  });
  const [password, setPassword] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useContext(ToastContext);
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [showProfileTab, setShowProfileTab] = useState(true);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [imageName, setImageName] = useState("");
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [visibleFields, setVisibleFields] = useState({
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/api/auth/check-token`);
      if (response.data.status === true) {
        setData({
          firstName: response.data.data.first_name,
          lastName: response.data.data.last_name,
          email: response.data.data.email,
          phone: response.data.data.phone,
          image: response.data.data.image_path,
        });

        const userDetails = {
          id: response.data.data.id,
          firstName: response.data.data.first_name,
          lastName: response.data.data.last_name,
          email: response.data.data.email,
          phone: response.data.data.phone,
          role: response.data.data.role,
          image: response.data.data.image_path,
        };

        localStorage.setItem("userDetails", JSON.stringify(userDetails));
      } else {
        showToast("Failed to fetch profile information", "danger");
      }
    } catch (error) {
      showToast("Failed to fetch profile information", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser().then((r) => r);
  }, []);

  const [previewImage, setPreviewImage] = useState(null);

  const handleProfileChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === "file" ? files[0] || null : value;
    setData((prev) => ({ ...prev, [name]: newValue }));
    validateProfileField(name, newValue, { ...data, [name]: newValue });

    if (type === "file") {
      const file = files[0];
      setImageName(file?.name || "");
      if (file) {
        const validImageTypes = [
          "image/jpg",
          "image/jpeg",
          "image/png",
          "image/webp",
        ];
        if (!validImageTypes.includes(file["type"])) {
          setErrors((prev) => ({
            ...prev,
            [name]:
              "Invalid file type. The selected file must be an image (JPG, JPEG, PNG, or WEBP).",
          }));
        } else if (file.size > 4096 * 1024) {
          setErrors((prev) => ({
            ...prev,
            [name]: "The selected image must not exceed 4MB.",
          }));
        } else {
          setErrors((prev) => ({ ...prev, [name]: "" }));
          setPreviewImage(URL.createObjectURL(file)); // Create a URL for the selected file
        }
      }
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => {
      const updated = { ...prev, [name]: value };
      validatePasswordField(name, value, updated);
      return updated;
    });
  };

  const validateProfileField = (name, value) => {
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
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const validatePasswordField = (name, value, updatedPasswords) => {
    let errorMsg = "";

    switch (name) {
      case "password":
        if (!value) errorMsg = "Current Password is required!";
        else if (value.length < 8)
          errorMsg = "Password must be at least 8 characters long!";
        break;
      case "newPassword":
        if (!value) errorMsg = "New Password is required!";
        else if (value.length < 8)
          errorMsg = "New Password must be at least 8 characters long!";
        break;
      case "confirmPassword":
        if (!value) {
          errorMsg = "Confirm Password is required!";
        } else if (value !== updatedPasswords.newPassword) {
          errorMsg = "Passwords do not match!";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));

    // Additional handling to clear 'confirmPassword' error if they now match
    if (name === "newPassword" || name === "confirmPassword") {
      if (updatedPasswords.newPassword === updatedPasswords.confirmPassword) {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      } else if (
        updatedPasswords.confirmPassword &&
        updatedPasswords.newPassword !== updatedPasswords.confirmPassword
      ) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match!",
        }));
      }
    }
  };

  const canSubmitProfile = () => {
    return (
      Object.values(data).every((x) => x) &&
      Object.values(errors).every((x) => !x)
    );
  };

  const canSubmitPassword = () => {
    return (
      password.password.length > 0 &&
      password.newPassword.length > 0 &&
      password.confirmPassword.length > 0 &&
      Object.values(errors).every((x) => !x)
    );
  };

  const submitProfileForm = async (e) => {
    e.preventDefault();
    if (!canSubmitProfile()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("first_name", data.firstName);
    formData.append("last_name", data.lastName);
    formData.append("phone", data.phone);
    if (data.image && typeof data.image !== "string") {
      formData.append("image", data.image);
    }

    try {
      const response = await axiosInstance.post(
        "/api/auth/update-profile/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.status === true) {
        showToast("Profile updated successfully!", "success");
        setData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          image: null,
        });
        setPreviewImage(null);
        setImageName("");
        await fetchUser();
        onClose();
      } else {
        showToast("Profile update failed. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Profile update failed. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const submitPasswordForm = (e) => {
    e.preventDefault();
    if (!canSubmitPassword()) return;

    setShowConfirmationModal(true);
  };

  return (
    <>
      <section>
        <div className="container">
          <div className="mt-6 md:flex md:items-center md:justify-center">
            <div className="inline-flex overflow-hidden bg-white border divide-x rounded-lg dark:bg-gray-900 rtl:flex-row-reverse dark:border-gray-700 dark:divide-gray-700 transition duration-500">
              <button
                onClick={() => setShowProfileTab(true)}
                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-300 ${
                  showProfileTab
                    ? "bg-primary-200 dark:bg-primary-800 dark:text-gray-300"
                    : ""
                }`}
              >
                Update Profile
              </button>
              <button
                onClick={() => setShowProfileTab(false)}
                className={`px-5 py-2 text-xs font-medium text-gray-600 transition-colors duration-300 ${
                  !showProfileTab
                    ? "bg-primary-200 dark:bg-primary-800 dark:text-gray-300"
                    : ""
                }`}
              >
                Update Password
              </button>
            </div>
          </div>
          <div className="max-w-4xl py-10 mx-auto">
            {showProfileTab ? (
              <>
                <div className="bg-white dark:bg-gray-950 rounded-xl border dark:border-gray-700 p-4 sm:p-7 transition duration-500">
                  {role === "admin" && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                        Update Profile
                      </h2>
                    </div>
                  )}

                  <form
                    onSubmit={(e) => submitProfileForm(e)}
                    encType="multipart/form-data"
                  >
                    <div className="container">
                      <div className="mb-2.5">
                        <label
                          htmlFor="image"
                          className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                        >
                          Profile Photo
                        </label>
                      </div>

                      <div className="mb-6 sm:col-span-9">
                        <div className="flex items-center gap-5">
                          {isLoading ? (
                            <div className="inline-block size-16 bg-gray-300 dark:bg-gray-700 border-gray-400 rounded-full ring-2 ring-white dark:ring-gray-950 transition duration-500 animate-pulse"></div>
                          ) : (
                            <img
                              className="inline-block size-16 rounded-full ring-2 ring-white dark:ring-gray-950 transition duration-500"
                              src={
                                previewImage
                                  ? previewImage
                                  : data.image
                                  ? urlPrefix + data.image
                                  : anonymous_user
                              }
                              alt={data.firstName + " " + data.lastName}
                            />
                          )}
                          <div className="flex gap-x-2">
                            <div>
                              <label
                                htmlFor="image"
                                className="flex w-full max-w-lg p-2.5 gap-2 mx-auto mt-2 text-center bg-white border-2 border-gray-300 cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl transition duration-500"
                              >
                                <IoMdCloudUpload className="w-6 h-6 text-gray-500 dark:text-gray-400" />

                                <h2 className="font-medium tracking-wide text-gray-700 dark:text-gray-200 transition duration-500">
                                  {imageName || "Upload Image"}
                                </h2>

                                <input
                                  type="file"
                                  id="image"
                                  name="image"
                                  accept="image/*"
                                  onChange={handleProfileChange}
                                  className="hidden"
                                />
                              </label>
                              {errors.image && (
                                <span className="text-sm text-red-500">
                                  {errors.image}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
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
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={data[field.name]}
                                onChange={handleProfileChange}
                                disabled={isLoading || field.name === "email"}
                                placeholder={field.placeholder}
                                className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                              />
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
                          disabled={!canSubmitProfile() || isLoading}
                          className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-gray-300 focus:!ring-opacity-50"
                        >
                          Update
                          {isLoading && (
                            <AiOutlineLoading className="h-6 w-6 animate-spin ml-2" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-xl border dark:border-gray-700 p-4 sm:p-7 dark:bg-gray-950 transition duration-500">
                  {role === "admin" && (
                    <div className="mb-8">
                      <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">
                        Update Password
                      </h2>
                    </div>
                  )}

                  <form onSubmit={(e) => submitPasswordForm(e)}>
                    <div className="container">
                      {/* Content */}
                      {passwordFieldData.map((field) => (
                        <div key={field.name} className="mt-4">
                          <label
                            htmlFor={field.name}
                            className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                          >
                            {field.label}
                          </label>
                          <div className="mt-2.5 relative">
                            <input
                              type={
                                visibleFields[field.name] ? "text" : "password"
                              }
                              id={field.name}
                              name={field.name}
                              onChange={handlePasswordChange}
                              disabled={isLoading}
                              placeholder="••••••••"
                              className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600"
                              onClick={() =>
                                setVisibleFields({
                                  ...visibleFields,
                                  [field.name]: !visibleFields[field.name],
                                })
                              }
                            >
                              {visibleFields[field.name] ? (
                                <FaEyeSlash />
                              ) : (
                                <FaEye />
                              )}
                            </button>
                          </div>
                          {errors[field.name] && (
                            <span className="text-sm text-red-500">
                              {errors[field.name]}
                            </span>
                          )}
                        </div>
                      ))}
                      <div className="mt-10">
                        <Button
                          type="submit"
                          disabled={!canSubmitPassword() || isLoading}
                          className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-gray-300 focus:!ring-opacity-50"
                        >
                          Update
                          {isLoading && (
                            <AiOutlineLoading className="h-6 w-6 animate-spin ml-2" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <ConfirmationModal
        open={showConfirmationModal}
        setOpen={setShowConfirmationModal}
        onConfirm={async () => {
          setIsLoading(true);
          try {
            const response = await axiosInstance.post(
              "/api/auth/change-password",
              {
                current_password: password.password,
                new_password: password.newPassword,
                new_password_confirmation: password.confirmPassword,
              }
            );

            if (response.data.status === true) {
              showToast(
                "Password updated successfully! Please log in again.",
                "success"
              );
              localStorage.removeItem("sessionActive");
              navigate("/login");
            } else {
              showToast("Password update failed. Please try again.", "danger");
            }
          } catch (error) {
            if (error.response) {
              if (error.response && error.response.status === 400) {
                showToast("Current Password is incorrect.", "danger");
              } else {
                showToast(
                  "Password update failed. Please try again.",
                  "danger"
                );
              }
            }
          }
          setIsLoading(false);
          setShowConfirmationModal(false);
        }}
      >
        <p>Are you sure you want to update the password?</p>
      </ConfirmationModal>
    </>
  );
};

ProfileUpdate.propTypes = {
  role: PropTypes.string,
  onClose: PropTypes.func,
};

export default ProfileUpdate;
