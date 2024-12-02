import Breadcrumb from "../../../components/Miscellaneous/Breadcrumb.jsx";
import DashboardLayout from "../../../components/Layouts/DashboardLayout.jsx";
import { useContext, useEffect, useState } from "react";
import useAxios from "../../../hooks/useAxios.jsx";
import { format, parseISO } from "date-fns";
import { IoTrashBin } from "react-icons/io5";
import Table from "../../../components/Layouts/Table.jsx";
import ConfirmationModal from "../../../components/Modals/ConfirmationModal.jsx";
import { ToastContext } from "../../../hooks/ToastProvider.jsx";
import FormModal from "../../../components/Modals/FormModal.jsx";
import { Avatar, Button } from "flowbite-react";
import { AiOutlineLoading } from "react-icons/ai";
import { FaFacebook, FaGoogleScholar } from "react-icons/fa6";
import { FaEdit, FaEye, FaResearchgate } from "react-icons/fa";
import { IoIosArrowDown, IoMdCloudUpload } from "react-icons/io";

const columns = [
  { name: "#", key: "index" },
  { name: "Image", key: "image" },
  { name: "Name", key: "name" },
  { name: "Category", key: "category" },
  { name: "Position", key: "position" },
  { name: "Email", key: "email" },
  { name: "Facebook", key: "facebook" },
  { name: "ResearchGate", key: "researchgate" },
  { name: "Google Scholar", key: "scholar" },
  { name: "Created At", key: "created_at" },
  { name: "Updated At", key: "updated_at" },
  { name: "Actions", key: "actions" },
];

const breadcrumbData = [
  { text: "Content", current: false },
  { text: "About", current: true },
];

const AdminAbout = () => {
  const axiosInstance = useAxios();
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const { showToast } = useContext(ToastContext);

  const [honoraryTitleDropdownOpen, setHonoraryTitleDropdownOpen] =
    useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [honoraryTitle, setHonoraryTitle] = useState("Mr");
  const [category, setCategory] = useState("Executive Team");
  const [imageName, setImageName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [errors, setErrors] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [itemIdToEdit, setItemIdToEdit] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditFormModal, setShowEditFormModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [member, setMember] = useState({
    honorary_title: "",
    name: "",
    position: "",
    category: "",
    email: "",
    social_facebook: "",
    social_researchgate: "",
    social_scholar: "",
    image: null,
  });

  const [data, setData] = useState([]);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/admin/content/member?keyword=${searchKeyword}&page=${pagination.currentPage}`
      );
      if (response.data.status === true) {
        setData(response.data.data.data);
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
      console.error("Failed to fetch member:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers().then((r) => r);
  }, [searchKeyword, pagination.currentPage]);

  const handleDelete = (userId) => {
    setItemIdToDelete(userId);
    setShowConfirmationModal(true);
  };

  const handleView = (userId) => {
    const user = data.find((user) => user.id === userId);
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (memberId) => {
    const selectedMember = data.find((i) => i.id === memberId);
    setItemIdToEdit(memberId);
    setMember({
      honorary_title: selectedMember.honoraryTitle,
      name: selectedMember.name,
      position: selectedMember.position,
      category: selectedMember.category,
      email: selectedMember.email,
      social_facebook: selectedMember.social_facebook,
      social_researchgate: selectedMember.social_researchgate,
      social_scholar: selectedMember.social_scholar,
      image: null,
    });
    setHonoraryTitle(selectedMember.honorary_title);
    setCategory(selectedMember.category);
    setImageName("");
    setErrors({});
    setShowEditFormModal(true);
  };

  const formatDate = (dateString) =>
    format(parseISO(dateString), "MMMM d, yyyy, p");

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    const newValue = type === "file" ? files[0] || null : value;
    setMember((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, value);

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
        }
      }
    }
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "name":
        if (!value) errorMsg = "Name is required!";
        break;
      case "position":
        if (!value) errorMsg = "Position is required!";
        break;
      case "email":
        if (!value) {
          errorMsg = "Email is required!";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = "Email address is invalid!";
        }
        break;
      case "image":
        if (!value) {
          errorMsg = "Image is required!";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const canSubmit = () => {
    if (showEditFormModal) {
      const requiredFields = ["name", "position", "email"];

      return (
        requiredFields.every((field) => member[field]) &&
        Object.values(errors).every((x) => !x)
      );
    } else {
      const requiredFields = ["name", "position", "email", "image"];

      return (
        requiredFields.every((field) => member[field]) &&
        Object.values(errors).every((x) => !x)
      );
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("honorary_title", honoraryTitle);
    formData.append("name", member.name);
    formData.append("position", member.position);
    formData.append("category", category);
    formData.append("email", member.email);
    if (member?.social_facebook) {
      formData.append("social_facebook", member.social_facebook);
    }
    if (member?.social_researchgate) {
      formData.append("social_researchgate", member.social_researchgate);
    }
    if (member?.social_scholar) {
      formData.append("social_scholar", member.social_scholar);
    }
    formData.append("image", member.image);

    try {
      const response = await axiosInstance.post(
        "/api/admin/content/member",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.status === true) {
        showToast("Member added successfully!", "success");
        setMember({
          name: "",
          position: "",
          email: "",
          image: null,
        });
        setHonoraryTitle("Mr.");
        setImageName("");
        setShowFormModal(false);
        await fetchMembers();
      } else {
        showToast("Member adding failed. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Member adding failed. Please try again.", "danger");
    }
    setIsLoading(false);
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("honorary_title", honoraryTitle);
    formData.append("name", member.name);
    formData.append("position", member.position);
    formData.append("category", category);
    formData.append("email", member.email);
    if (member?.social_facebook) {
      formData.append("social_facebook", member.social_facebook);
    }
    if (member?.social_researchgate) {
      formData.append("social_researchgate", member.social_researchgate);
    }
    if (member?.social_scholar) {
      formData.append("social_scholar", member.social_scholar);
    }
    formData.append("image", member.image ? member.image : "");

    try {
      const response = await axiosInstance.post(
        `/api/admin/content/member?id=${itemIdToEdit}&_method=PUT`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.status === true) {
        showToast("Member details updated successfully!", "success");
        setMember({
          honorary_title: "",
          name: "",
          position: "",
          category: "",
          email: "",
          social_facebook: "",
          social_researchgate: "",
          social_scholar: "",
          image: null,
        });
        setShowEditFormModal(false);
        setItemIdToEdit(false);
        setCategoryDropdownOpen(false);
        setHonoraryTitleDropdownOpen(false);
        setHonoraryTitle("Mr");
        setCategory("Executive Team");
        setImageName("");
        setErrors({});
        await fetchMembers();
      } else {
        showToast(
          "Failed to update member details. Please try again.",
          "danger"
        );
      }
    } catch (error) {
      showToast("Failed to update member details. Please try again.", "danger");
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
                    {Array.from({ length: 12 }, (_, index) => (
                      <td key={index} className="px-6 py-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <>
                  {data.length > 0 ? (
                    data.map((user, index) => (
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
                                  user?.name[0] + user?.name.split(" ")[1][0]
                                }
                                rounded={true}
                              />
                            </>
                          )}
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {user?.honorary_title + ". " + user?.name}
                          </p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{user?.category}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{user?.position}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            <a
                              href={`mailto:${user?.email}`}
                              className="hover:underline"
                            >
                              {user?.email}
                            </a>
                          </p>
                        </td>
                        <td className="px-6 max-w-96 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {user?.social_facebook ? (
                            <>
                              <p className="truncate w-full">
                                <a
                                  href={`https://facebook.com/${user?.social_facebook}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {user?.social_facebook}
                                </a>
                              </p>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-6 max-w-96 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {user?.social_researchgate ? (
                            <>
                              <p className="truncate w-full">
                                <a
                                  href={`https://www.researchgate.net/profile/${user?.social_researchgate}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {user?.social_researchgate}
                                </a>
                              </p>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-6 max-w-96 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {user?.social_scholar ? (
                            <>
                              <p className="truncate w-full">
                                <a
                                  href={`https://scholar.google.com/citations?user=${user?.social_scholar}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:underline"
                                >
                                  {user?.social_scholar}
                                </a>
                              </p>
                            </>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {formatDate(user?.created_at)}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {formatDate(user?.updated_at)}
                        </td>
                        <td className="flex gap-x-5 items-center justify-center px-6 py-3 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <button
                            onClick={() => handleView(user?.id)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-700"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(user?.id)}
                            className="text-amber-600 hover:text-amber-900 dark:text-amber-500 dark:hover:text-amber-700"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(user?.id)}
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
                        colSpan={13}
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
              `/api/admin/content/member?id=${itemIdToDelete}`
            );
            console.log(response.data);
            if (response.data.status === true) {
              showToast("User deleted successfully!", "success");
              await fetchMembers();
            } else {
              showToast("Failed to delete member!", "danger");
              console.log(response.data.message);
            }
          } catch (error) {
            showToast("Failed to delete member!", "danger");
            console.error("Failed to delete member:", error);
          }
          setShowConfirmationModal(false);
        }}
      >
        <p>Are you sure you want to delete this member?</p>
      </ConfirmationModal>

      <FormModal
        open={showFormModal}
        setOpen={setShowFormModal}
        onClose={() => {
          setCategoryDropdownOpen(false);
          setHonoraryTitleDropdownOpen(false);
        }}
        position={"center"}
        size={"2xl"}
        headerText={"Add New Member"}
      >
        <form onSubmit={submitForm} className="mx-auto max-w-xl">
          <div className="sm:col-span-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Name
              </label>
              <div className="flex mt-2.5">
                <button
                  className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-200 dark:bg-slate-900 border-r border-gray-300 rounded-s-lg hover:bg-gray-300 focus:outline-none dark:hover:bg-gray-800"
                  type="button"
                  onClick={() => {
                    setHonoraryTitleDropdownOpen(!honoraryTitleDropdownOpen);
                    setCategoryDropdownOpen(false);
                  }}
                >
                  {honoraryTitle}
                  <IoIosArrowDown className="ml-2" />
                </button>

                {honoraryTitleDropdownOpen && (
                  <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                      {["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."].map((title) => (
                        <li key={title}>
                          <button
                            type="button"
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setHonoraryTitle(title);
                              setHonoraryTitleDropdownOpen(false);
                            }}
                          >
                            {title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={member["name"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-l-none rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                  placeholder="Pasindu Rodrigo"
                />
              </div>
              {errors["name"] && (
                <span className="text-sm text-red-500">{errors["name"]}</span>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="position"
                className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Position
              </label>
              <div className="mt-2.5 relative">
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={member["position"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="President"
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                />
              </div>
              {errors["position"] && (
                <span className="text-sm text-red-500">
                  {errors["position"]}
                </span>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="category"
                className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Category
              </label>
              <div className="flex mt-2.5">
                <button
                  className="flex-shrink-0 inline-flex items-center justify-between w-full py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-200 dark:bg-slate-900 border-gray-300 rounded-lg hover:bg-gray-300 focus:outline-none dark:hover:bg-gray-800"
                  type="button"
                  onClick={() => {
                    setCategoryDropdownOpen(!categoryDropdownOpen);
                    setHonoraryTitleDropdownOpen(false);
                  }}
                >
                  {category}
                  <IoIosArrowDown />
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                      {["Executive Team", "Advisor", "Past President"].map(
                        (title) => (
                          <li key={title}>
                            <button
                              id="category"
                              name="category"
                              type="button"
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => {
                                setCategory(title);
                                setCategoryDropdownOpen(false);
                              }}
                            >
                              {title}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Email
              </label>
              <div className="mt-2.5 relative">
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={member["email"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="example@gmail.com"
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                />
              </div>
              {errors["email"] && (
                <span className="text-sm text-red-500">{errors["email"]}</span>
              )}
            </div>

            <div className="mt-4">
              <span className="block mb-2.5 text-sm font-medium text-gray-900 dark:text-white">
                Username
              </span>
              <div className="flex mb-4">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border-r border-gray-300 rounded-s-lg dark:bg-gray-800 dark:text-gray-400 ">
                  <FaFacebook className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </span>
                <input
                  type="text"
                  id="social_facebook"
                  name="social_facebook"
                  value={member["social_facebook"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-l-none rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                  placeholder="Facebook"
                />
              </div>

              <div className="flex mb-4">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border-r border-gray-300 rounded-s-lg dark:bg-gray-800 dark:text-gray-400 ">
                  <FaResearchgate className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </span>
                <input
                  type="text"
                  id="social_researchgate"
                  name="social_researchgate"
                  value={member["social_researchgate"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-l-none rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                  placeholder="ResearchGate"
                />
              </div>

              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border-r border-gray-300 rounded-s-lg dark:bg-gray-800 dark:text-gray-400 ">
                  <FaGoogleScholar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </span>
                <input
                  type="text"
                  id="social_scholar"
                  name="social_scholar"
                  value={member["social_scholar"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-l-none rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                  placeholder="Google Scholar"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="mt-4">
                <label
                  htmlFor="image"
                  className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                >
                  Image
                </label>

                <label
                  htmlFor="image"
                  className="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl"
                >
                  <IoMdCloudUpload className="w-8 h-8 text-gray-500 dark:text-gray-400" />

                  <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
                    {imageName || "Image"}
                  </h2>

                  <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
                    Upload or drag & drop JPG, JPEG, PNG, and WEBP images.{" "}
                  </p>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                  />
                </label>
                {errors["image"] && (
                  <span className="text-sm text-red-500">
                    {errors["image"]}
                  </span>
                )}
              </div>
            </div>
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
        position={"center"}
        size={"lg"}
        headerText={"View User Details"}
      >
        {selectedUser && (
          <div>
            <div className="flex items-center justify-center">
              {selectedUser.image_path ? (
                <>
                  <img
                    src={urlPrefix + selectedUser.image_path}
                    alt={selectedUser?.title}
                    className="h-20 w-20 object-cover rounded-full"
                  />
                </>
              ) : (
                <>
                  <Avatar />
                </>
              )}
            </div>
            <div className="my-7">
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Title</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedUser?.honorary_title}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Name</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedUser?.name}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Category</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedUser?.category}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Position</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedUser?.position}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Email</p>
                <p className="text-gray-800 dark:text-gray-200">
                  <a
                    href={`mailto:${selectedUser?.email}`}
                    className="hover:underline transition duration-300"
                  >
                    {selectedUser?.email}
                  </a>
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Facebook</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedUser?.social_facebook ? (
                    <>
                      <a
                        href={`https://facebook.com/${selectedUser?.social_facebook}`}
                        target="_blank"
                        className="hover:underline transition duration-300"
                      >
                        {selectedUser?.social_facebook}
                      </a>
                    </>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">ResearchGate</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedUser?.social_researchgate ? (
                    <>
                      <a
                        href={`https://www.researchgate.net/profile/${selectedUser?.social_researchgate}`}
                        target="_blank"
                        className="hover:underline transition duration-300"
                      >
                        {selectedUser?.social_researchgate}
                      </a>
                    </>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">
                  Google Scholar
                </p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedUser?.social_scholar ? (
                    <>
                      <p className="truncate w-full">
                        <a
                          href={`https://scholar.google.com/citations?user=${selectedUser?.social_scholar}`}
                          target="_blank"
                          className="hover:underline transition duration-300"
                        >
                          {selectedUser?.social_scholar}
                        </a>
                      </p>
                    </>
                  ) : (
                    "-"
                  )}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Updated At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedUser?.updated_at)}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Created At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedUser?.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </FormModal>

      <FormModal
        open={showEditFormModal}
        setOpen={setShowEditFormModal}
        onClose={() => {
          setMember({
            honorary_title: "",
            name: "",
            position: "",
            category: "",
            email: "",
            social_facebook: "",
            social_researchgate: "",
            social_scholar: "",
            image: null,
          });
          setCategoryDropdownOpen(false);
          setHonoraryTitleDropdownOpen(false);
          setHonoraryTitle("Mr");
          setCategory("Executive Team");
          setImageName("");
          setErrors({});
        }}
        position={"center"}
        size={"2xl"}
        headerText={"Update Member"}
      >
        <form onSubmit={submitEditForm} className="mx-auto max-w-xl">
          <div className="sm:col-span-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Name
              </label>
              <div className="flex mt-2.5">
                <button
                  className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-200 dark:bg-slate-900 border-r border-gray-300 rounded-s-lg hover:bg-gray-300 focus:outline-none dark:hover:bg-gray-800"
                  type="button"
                  onClick={() => {
                    setHonoraryTitleDropdownOpen(!honoraryTitleDropdownOpen);
                    setCategoryDropdownOpen(false);
                  }}
                >
                  {honoraryTitle}
                  <IoIosArrowDown className="ml-2" />
                </button>

                {honoraryTitleDropdownOpen && (
                  <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                      {["Mr", "Mrs", "Ms", "Dr", "Prof"].map((title) => (
                        <li key={title}>
                          <button
                            id="honorary_title"
                            name="honorary_title"
                            type="button"
                            className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={() => {
                              setHonoraryTitle(title);
                              setHonoraryTitleDropdownOpen(false);
                            }}
                          >
                            {title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={member["name"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-l-none rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                  placeholder="Pasindu Rodrigo"
                />
              </div>
              {errors["name"] && (
                <span className="text-sm text-red-500">{errors["name"]}</span>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="position"
                className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Position
              </label>
              <div className="mt-2.5 relative">
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={member["position"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="President"
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                />
              </div>
              {errors["position"] && (
                <span className="text-sm text-red-500">
                  {errors["position"]}
                </span>
              )}
            </div>

            <div className="mt-4">
              <label
                htmlFor="category"
                className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Category
              </label>
              <div className="flex mt-2.5">
                <button
                  className="flex-shrink-0 inline-flex items-center justify-between w-full py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-200 dark:bg-slate-900 border-gray-300 rounded-lg hover:bg-gray-300 focus:outline-none dark:hover:bg-gray-800"
                  type="button"
                  onClick={() => {
                    setCategoryDropdownOpen(!categoryDropdownOpen);
                    setHonoraryTitleDropdownOpen(false);
                  }}
                >
                  {category}
                  <IoIosArrowDown />
                </button>

                {categoryDropdownOpen && (
                  <div className="absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                      {["Executive Team", "Advisor", "Past President"].map(
                        (category) => (
                          <li key={category}>
                            <button
                              id="category"
                              name="category"
                              type="button"
                              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => {
                                setCategory(category);
                                setCategoryDropdownOpen(false);
                              }}
                            >
                              {category}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Email
              </label>
              <div className="mt-2.5 relative">
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={member["email"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  placeholder="example@gmail.com"
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                />
              </div>
              {errors["email"] && (
                <span className="text-sm text-red-500">{errors["email"]}</span>
              )}
            </div>

            <div className="mt-4">
              <span className="block mb-2.5 text-sm font-medium text-gray-900 dark:text-white">
                Username
              </span>
              <div className="flex mb-4">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border-r border-gray-300 rounded-s-lg dark:bg-gray-800 dark:text-gray-400 ">
                  <FaFacebook className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </span>
                <input
                  type="text"
                  id="social_facebook"
                  name="social_facebook"
                  value={member["social_facebook"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-l-none rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                  placeholder="Facebook"
                />
              </div>

              <div className="flex mb-4">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border-r border-gray-300 rounded-s-lg dark:bg-gray-800 dark:text-gray-400 ">
                  <FaResearchgate className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </span>
                <input
                  type="text"
                  id="social_researchgate"
                  name="social_researchgate"
                  value={member["social_researchgate"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-l-none rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                  placeholder="ResearchGate"
                />
              </div>

              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border-r border-gray-300 rounded-s-lg dark:bg-gray-800 dark:text-gray-400 ">
                  <FaGoogleScholar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </span>
                <input
                  type="text"
                  id="social_scholar"
                  name="social_scholar"
                  value={member["social_scholar"]}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="py-2.5 px-4 block w-full border-gray-200 rounded-l-none rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                  placeholder="Google Scholar"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="mt-4">
                <label
                  htmlFor="image"
                  className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                >
                  Image
                </label>

                <label
                  htmlFor="image"
                  className="flex flex-col items-center w-full max-w-lg p-5 mx-auto mt-2 text-center bg-white border-2 border-gray-300 border-dashed cursor-pointer dark:bg-gray-900 dark:border-gray-700 rounded-xl"
                >
                  <IoMdCloudUpload className="w-8 h-8 text-gray-500 dark:text-gray-400" />

                  <h2 className="mt-1 font-medium tracking-wide text-gray-700 dark:text-gray-200">
                    {imageName || "Image"}
                  </h2>

                  <p className="mt-2 text-xs tracking-wide text-gray-500 dark:text-gray-400">
                    Upload or drag & drop JPG, JPEG, PNG, and WEBP images.{" "}
                  </p>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                  />
                </label>
                {errors["image"] && (
                  <span className="text-sm text-red-500">
                    {errors["image"]}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="mt-10">
            <Button
              type="submit"
              disabled={!canSubmit() || isLoading}
              className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-gray-300 focus:!ring-opacity-50"
            >
              Update
              {isLoading && (
                <AiOutlineLoading className="h-6 w-6 animate-spin ml-2" />
              )}
            </Button>
          </div>
        </form>
      </FormModal>
    </>
  );
};

export default AdminAbout;
