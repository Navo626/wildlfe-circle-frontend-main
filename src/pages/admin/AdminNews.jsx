import Breadcrumb from "../../components/Miscellaneous/Breadcrumb.jsx";
import Table from "../../components/Layouts/Table.jsx";
import {IoTrashBin} from "react-icons/io5";
import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import {useContext, useEffect, useState} from "react";
import {ToastContext} from "../../hooks/ToastProvider.jsx";
import useAxios from "../../hooks/useAxios.jsx";
import {format, parseISO} from "date-fns";
import ConfirmationModal from "../../components/Modals/ConfirmationModal.jsx";
import FormModal from "../../components/Modals/FormModal.jsx";
import {Button} from "flowbite-react";
import {AiOutlineLoading} from "react-icons/ai";
import {FaEdit, FaEye} from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import LightboxDisplay from "../../components/Modals/LightboxDisplay.jsx";

const columns = [
  { name: "#", key: "index" },
  { name: "Image", key: "image" },
  { name: "Title", key: "title" },
  { name: "Body", key: "body" },
  { name: "Created At", key: "created_at" },
  { name: "Updated At", key: "updated_at" },
  { name: "Actions", key: "actions" },
];

const breadcrumbData = [{ text: "News", current: true }];

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });
  const [selectedNewsToView, setSelectedNewsToView] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [itemIdToEdit, setItemIdToEdit] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditFormModal, setShowEditFormModal] = useState(false);
  const { showToast } = useContext(ToastContext);
  const [lightboxDisplay, setLightboxDisplay] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const axiosInstance = useAxios();
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [data, setData] = useState({
    title: "",
    body: "",
    image: null,
  });
  const [imageName, setImageName] = useState("");
  const [errors, setErrors] = useState({});

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/admin/news?keyword=${searchKeyword}&page=${pagination.currentPage}`
      );
      if (response.data.status === true) {
        setNews(response.data.data.data);
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
      console.error("Failed to fetch news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews().then((r) => r);
  }, [searchKeyword, pagination.currentPage]);

  const handleDelete = (newsId) => {
    setItemIdToDelete(newsId);
    setShowConfirmationModal(true);
  };

  const handleView = (newsId) => {
    const selectedNews = news.find((n) => n.id === newsId);
    setSelectedNewsToView(selectedNews);
    setShowViewModal(true);
  };

  const handleEdit = (newsId) => {
    const selectedNews = news.find((i) => i.id === newsId);
    setItemIdToEdit(newsId);
    setData({
      title: selectedNews.title,
      body: selectedNews.body,
      image: null,
    });
    setImageName("");
    setErrors({});
    setShowEditFormModal(true);
  };

  const formatDate = (dateString) =>
    format(parseISO(dateString), "MMMM d, yyyy, p");

  const openLightbox = (src) => {
    setSelectedImage(src);
    setLightboxDisplay(true);
  };

  const closeLightbox = () => {
    setLightboxDisplay(false);
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    const newValue = type === "file" ? files[0] || null : value;
    setData((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, value);

    if (type === "file") {
      const newFiles = Array.from(files);
      if (newFiles.length > 3) {
        setErrors((prev) => ({
          ...prev,
          [name]: "You can only select up to 3 images.",
        }));
      } else {
        setData((prev) => ({ ...prev, [name]: newFiles }));
        setImageName(newFiles.map((file) => file.name).join(", "));

        newFiles.forEach((file) => {
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
        });
      }
    }
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "title":
        if (!value) {
          errorMsg = "Title is required!";
        }
        break;
      case "body": {
        const strippedValue = stripHtmlTags(value).trim();
        if (!strippedValue) {
          errorMsg = "Body is required!";
        }
        break;
      }
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const canSubmit = () => {
    const { image, ...restData } = data;
    return (
      Object.values(restData).every((x) => x) &&
      Object.values(errors).every((x) => !x)
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("body", data.body);
    if (data.image) {
      data.image.forEach((imageFile, i) => {
        formData.append(`image[${i}]`, imageFile);
      });
    } else {
      // append empty image child to formData
      formData.append("image", "");
    }

    try {
      const response = await axiosInstance.post("/api/admin/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (response.data.status === true) {
        showToast("News added successfully!", "success");
        setData({
          title: "",
          body: "",
          image: null,
        });
        setShowFormModal(false);
        await fetchNews();
      } else {
        showToast("Failed to add news. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Failed to add news. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("body", data.body);
    if (data.image) {
      data.image.forEach((imageFile, i) => {
        formData.append(`image[${i}]`, imageFile);
      });
    } else {
      // append empty image child to formData
      formData.append("image", "");
    }

    try {
      const response = await axiosInstance.post(
        `/api/admin/news?id=${itemIdToEdit}&_method=PUT`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.status === true) {
        showToast("News updated successfully!", "success");
        setData({
          title: "",
          body: "",
          image: null,
        });
        setShowEditFormModal(false);
        setItemIdToEdit(null);
        await fetchNews();
      } else {
        showToast("Failed to update news. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Failed to update news. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
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
                    {Array.from({ length: 7 }, (_, index) => (
                      <td key={index} className="px-6 py-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <>
                  {news?.length > 0 ? (
                    news?.map((newsItem, index) => (
                      <tr
                        key={index}
                        className="bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 transition duration-500"
                      >
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {newsItem?.image_path === null ? (
                            <>
                              <div className="h-10 w-10 bg-gray-200 rounded-lg dark:bg-gray-800 transition duration-500" />
                            </>
                          ) : (
                            <>
                              <img
                                src={urlPrefix + newsItem?.image_path[0]}
                                alt={newsItem?.title}
                                onClick={() => openLightbox(newsItem)}
                                className="h-10 w-10 object-cover rounded-lg"
                              />
                            </>
                          )}
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{newsItem?.title}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <div
                            className="line-clamp-3 w-full"
                            dangerouslySetInnerHTML={{ __html: newsItem?.body }}
                          />
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {formatDate(newsItem?.created_at)}
                          </p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {formatDate(newsItem?.updated_at)}
                          </p>
                        </td>
                        <td className="flex gap-x-5 items-center justify-center px-6 py-3 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <button
                            onClick={() => handleView(newsItem?.id)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-700"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(newsItem?.id)}
                            className="text-amber-600 hover:text-amber-900 dark:text-amber-500 dark:hover:text-amber-700"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(newsItem?.id)}
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
                        colSpan={7}
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

      {lightboxDisplay && (
        <LightboxDisplay
          selectedImage={selectedImage}
          embedInfo={false}
          closeLightbox={closeLightbox}
        />
      )}

      <ConfirmationModal
        open={showConfirmationModal}
        setOpen={setShowConfirmationModal}
        onConfirm={async () => {
          try {
            const response = await axiosInstance.delete(
              `/api/admin/news?id=${itemIdToDelete}`
            );
            if (response.data.status === true) {
              showToast("News deleted successfully!", "success");
              await fetchNews();
            } else {
              showToast("Failed to delete news!", "danger");
            }
          } catch (error) {
            showToast("Failed to delete news!", "danger");
          }
          setShowConfirmationModal(false);
        }}
      >
        <p>Are you sure you want to delete this news?</p>
      </ConfirmationModal>

      <FormModal
        open={showFormModal}
        setOpen={setShowFormModal}
        position={"top-center"}
        size={"2xl"}
        headerText={"Add New News"}
      >
        <form onSubmit={(e) => submitForm(e)} encType="multipart/form-data">
          <div>
            <div className="relative">
              <label
                htmlFor="title"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Annual Meeting 2024"
                name="title"
                value={data["title"]}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
              />
            </div>
            {errors["title"] && (
              <span className="text-sm text-red-500">{errors["title"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="body"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Body
            </label>
            <ReactQuill
              id="body"
              name="body"
              theme="snow"
              value={data["body"]}
              onChange={(body) => {
                setData((prev) => ({ ...prev, body }));
                validateField("body", body);
              }}
              readOnly={isLoading}
              modules={AdminNews.modules}
              formats={AdminNews.formats}
              className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-900"
              placeholder="Body of the news"
            />
            {errors["body"] && (
              <span className="text-sm text-red-500">{errors["body"]}</span>
            )}
          </div>

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8 text-gray-500 dark:text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>

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
                accept="image/*"
                multiple
              />
            </label>
            {errors["image"] && (
              <span className="text-sm text-red-500">{errors["image"]}</span>
            )}
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={!canSubmit() || isLoading}
              className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-primary-300 focus:!ring-opacity-50"
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
        size={"2xl"}
        headerText={"View News Details"}
      >
        {selectedNewsToView && (
          <div>
            <div className="flex items-center justify-center">
              {selectedNewsToView?.image_path === null ? (
                <>
                  <div className="h-20 w-20 bg-gray-200 rounded-lg dark:bg-gray-800 transition duration-500" />
                </>
              ) : (
                <>
                  <img
                    src={urlPrefix + selectedNewsToView?.image_path[0]}
                    alt={selectedNewsToView?.title}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                </>
              )}
            </div>
            <div className="my-7">
              <div className="flex justify-between items-center gap-x-5 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Title</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedNewsToView?.title}
                </p>
              </div>
              <div className="flex justify-between items-center gap-x-8 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Body</p>
                <div
                  className="text-gray-800 dark:text-gray-200 content-body"
                  dangerouslySetInnerHTML={{ __html: selectedNewsToView?.body }}
                />
              </div>
              <div className="flex justify-between items-center gap-x-8 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Updated At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedNewsToView?.updated_at)}
                </p>
              </div>
              <div className="flex justify-between items-center gap-x-8 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Created At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedNewsToView?.created_at)}
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
          setData({
            title: "",
            body: "",
            image: null,
          });
          setImageName("");
          setErrors({});
        }}
        position={"top-center"}
        size={"2xl"}
        headerText={"Update News"}
      >
        <form onSubmit={(e) => submitEditForm(e)} encType="multipart/form-data">
          <div>
            <div className="relative">
              <label
                htmlFor="title"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Title
              </label>
              <input
                type="text"
                id="title"
                placeholder="Annual Meeting 2024"
                name="title"
                value={data["title"]}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
              />
            </div>
            {errors["title"] && (
              <span className="text-sm text-red-500">{errors["title"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="body"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Body
            </label>
            <ReactQuill
              id="body"
              name="body"
              theme="snow"
              value={data["body"]}
              onChange={(body) => {
                setData((prev) => ({ ...prev, body }));
                validateField("body", body);
              }}
              readOnly={isLoading}
              modules={AdminNews.modules}
              formats={AdminNews.formats}
              className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-900"
              placeholder="Body of the news"
            />
            {errors["body"] && (
              <span className="text-sm text-red-500">{errors["body"]}</span>
            )}
          </div>

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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8 text-gray-500 dark:text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                />
              </svg>

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
                accept="image/*"
                multiple
              />
            </label>
            {errors["image"] && (
              <span className="text-sm text-red-500">{errors["image"]}</span>
            )}
          </div>

          <div className="mt-6">
            <Button
              type="submit"
              disabled={!canSubmit() || isLoading}
              className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-primary-300 focus:!ring-opacity-50"
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

export default AdminNews;
