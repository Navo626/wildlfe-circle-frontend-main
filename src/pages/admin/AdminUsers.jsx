import Breadcrumb from "../../components/Miscellaneous/Breadcrumb.jsx";
import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import {useContext, useEffect, useState} from "react";
import useAxios from "../../hooks/useAxios.jsx";
import {format, parseISO} from "date-fns";
import {IoTrashBin} from "react-icons/io5";
import Table from "../../components/Layouts/Table.jsx";
import ConfirmationModal from "../../components/Modals/ConfirmationModal.jsx";
import {ToastContext} from "../../hooks/ToastProvider.jsx";
import FormModal from "../../components/Modals/FormModal.jsx";
import {FaEye, FaEyeSlash} from "react-icons/fa";
import {Avatar, Button} from "flowbite-react";
import {AiOutlineLoading} from "react-icons/ai";

const columns = [
  { name: "#", key: "index" },
  { name: "Image", key: "image" },
  { name: "First Name", key: "first_name" },
  { name: "Last Name", key: "last_name" },
  { name: "Phone", key: "phone" },
  { name: "Email", key: "email" },
  { name: "Created At", key: "created_at" },
  { name: "Updated At", key: "updated_at" },
  { name: "Actions", key: "actions" },
];

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

const breadcrumbData = [{ text: "Users", current: true }];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const { showToast } = useContext(ToastContext);
  const loggedInUserId = JSON.parse(localStorage.getItem("userDetails")).id;
  const axiosInstance = useAxios();
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/admin/user?keyword=${searchKeyword}&page=${pagination.currentPage}`
      );
      if (response.data.status === true) {
        setUsers(response.data.data.data);
        setPagination({
          currentPage: response.data.data.current_page,
          totalPages: response.data.data.last_page,
          totalResults: response.data.data.total,
          perPage: response.data.data.per_page,
        });
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers().then((r) => r);
  }, [searchKeyword, pagination.currentPage]);

  const handleDelete = (userId) => {
    setUserIdToDelete(userId);
    setShowConfirmationModal(true);
  };

  const handleView = (userId) => {
    const user = users.find((user) => user.id === userId);
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const formatDate = (dateString) =>
    format(parseISO(dateString), "MMMM d, yyyy, p");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      // Create a regular expression that matches only numeric characters
      const regex = /^[0-9]*$/;

      // If the value doesn't match the regular expression, return without updating the state
      if (!regex.test(value)) {
        return;
      }
    }

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
        } else if (!/^07\d{8}$/.test(value)) {
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
      const response = await axiosInstance.post("/api/admin/user", {
        first_name: user.firstName,
        last_name: user.lastName,
        email: user.email,
        phone: user.phone,
        password: user.password,
        password_confirmation: user.confirmPassword,
      });

      if (response.data.status === true) {
        showToast("User created successfully!", "success");
        setUser({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        setShowFormModal(false);
        await fetchUsers();
      } else {
        showToast("User creation failed. Please try again.", "danger");
      }
    } catch (error) {
      showToast("User creation failed. Please try again.", "danger");
    }
    setIsLoading(false);
  };

  return (
    <>
      <DashboardLayout>
        <div className="p-4 min-h-screen">
          <Breadcrumb breadcrumbs={breadcrumbData} />

          <Table
            columns={columns}
            pagination={pagination}
            setPagination={setPagination}
            isLoading={isLoading}
            setSearchKeyword={setSearchKeyword}
            addButton={true}
            setShowFormModal={setShowFormModal}
          >
            <tbody className="divide-y divide-gray-200 dark:divide-neutral-700 transition duration-500">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    {Array.from({ length: 9 }, (_, index) => (
                      <td key={index} className="px-6 py-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <>
                  {users.length > 0 ? (
                    users.map((user, index) => (
                      <tr
                        key={index}
                        className="bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 transition duration-500"
                      >
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {index + 1}
                        </td>
                        <td className="flex items-center px-6 py-3  transition duration-500">
                          {user?.image_path ? (
                            <>
                              <img
                                src={urlPrefix + user.image_path}
                                alt={user?.title}
                                className="h-10 w-10 object-cover rounded-full"
                              />
                            </>
                          ) : (
                            <>
                              <Avatar
                                img={user?.image_path}
                                placeholderInitials={
                                  user?.first_name[0] + user?.last_name[0]
                                }
                                rounded={true}
                              />
                            </>
                          )}
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{user?.first_name}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{user?.last_name}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{user?.phone}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <a
                            href={`mailto:${user?.email}`}
                            className="hover:underline"
                          >
                            {user?.email}
                          </a>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {formatDate(user?.created_at)}
                          </p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {formatDate(user?.updated_at)}
                          </p>
                        </td>
                        <td className="flex gap-x-5 items-center justify-center px-6 py-3 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <button
                            onClick={() => handleView(user.id)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-700"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            disabled={user.id === loggedInUserId}
                            className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-700"
                          >
                            <IoTrashBin className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-3 text-center text-sm text-gray-500"
                      >
                        No results found
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </Table>
        </div>
      </DashboardLayout>

      <ConfirmationModal
        open={showConfirmationModal}
        setOpen={setShowConfirmationModal}
        onConfirm={async () => {
          try {
            const response = await axiosInstance.delete(
              `/api/admin/user?id=${userIdToDelete}`
            );
            if (response.data.status === true) {
              showToast("User deleted successfully!", "success");
              await fetchUsers();
            } else {
              showToast("Failed to delete user!", "danger");
            }
          } catch (error) {
            showToast("Failed to delete user!", "danger");
          }
          setShowConfirmationModal(false);
        }}
      >
        <p>Are you sure you want to delete this user?</p>
      </ConfirmationModal>

      <FormModal
        open={showFormModal}
        setOpen={setShowFormModal}
        position={"top-center"}
        size={"2xl"}
        headerText={"Add New User"}
      >
        <form onSubmit={submitForm} className="mx-auto max-w-xl">
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
              Add
              {isLoading && (
                <AiOutlineLoading className="h-6 w-6 animate-spin ml-2" />
              )}
            </Button>
          </div>
        </form>
      </FormModal>

      <FormModal
        open={showViewModal}
        setOpen={setShowViewModal}
        position={"top-center"}
        size={"lg"}
        headerText={"View User Details"}
      >
        {selectedUser && (
          <div>
            <div className="flex items-center justify-center">
              {selectedUser?.image_path ? (
                <>
                  <img
                    src={urlPrefix + selectedUser.image_path}
                    alt={selectedUser?.title}
                    className="h-20 w-20 object-cover rounded-full"
                  />
                </>
              ) : (
                <>
                  <Avatar
                    img={selectedUser?.image_path}
                    placeholderInitials={
                      selectedUser?.first_name[0] + selectedUser?.last_name[0]
                    }
                    rounded={true}
                  />
                </>
              )}
            </div>
            <div className="my-7">
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">First Name</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedUser?.first_name}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Last Name</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedUser?.last_name}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Phone</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedUser?.phone}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Email</p>
                <a
                  href={`mailto:${selectedUser?.email}`}
                  className="text-gray-800 dark:text-gray-200 hover:underline"
                >
                  {selectedUser?.email}
                </a>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Updated At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedUser?.updated_at)}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Created At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedUser?.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </FormModal>
    </>
  );
};

export default AdminUsers;
