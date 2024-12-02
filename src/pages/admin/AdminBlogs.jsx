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
import {FaEye} from "react-icons/fa";
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

const breadcrumbData = [{ text: "Blogs", current: true }];

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });
  const [selectedBlogToView, setSelectedBlogToView] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const { showToast } = useContext(ToastContext);
  const [lightboxDisplay, setLightboxDisplay] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const axiosInstance = useAxios();
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/admin/blog?keyword=${searchKeyword}&page=${pagination.currentPage}`
      );
      if (response.data.status === true) {
        setBlogs(response.data.data.data);
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
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs().then((r) => r);
  }, [searchKeyword, pagination.currentPage]);

  const handleDelete = (newsId) => {
    setItemIdToDelete(newsId);
    setShowConfirmationModal(true);
  };

  const handleView = (blogId) => {
    const selectedBlog = blogs.find((n) => n.id === blogId);
    setSelectedBlogToView(selectedBlog);
    setShowViewModal(true);
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
            addButton={false}
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
                  {blogs?.length > 0 ? (
                    blogs?.map((blog, index) => (
                      <tr
                        key={index}
                        className="bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 transition duration-500"
                      >
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {blog?.image_path === null ? (
                            <>
                              <div className="h-10 w-10 bg-gray-200 rounded-lg dark:bg-gray-800 transition duration-500" />
                            </>
                          ) : (
                            <>
                              <img
                                src={urlPrefix + blog?.image_path}
                                alt={blog?.title}
                                onClick={() => openLightbox(blog)}
                                className="h-10 w-10 object-cover rounded-lg"
                              />
                            </>
                          )}
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{blog?.title}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <div
                            className="line-clamp-3 w-full"
                            dangerouslySetInnerHTML={{ __html: blog?.body }}
                          />
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {formatDate(blog?.created_at)}
                          </p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {formatDate(blog?.updated_at)}
                          </p>
                        </td>
                        <td className="flex gap-x-5 items-center justify-center px-6 py-3 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <button
                            onClick={() => handleView(blog?.id)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-700"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(blog?.id)}
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
              `/api/admin/blog?id=${itemIdToDelete}`
            );
            if (response.data.status === true) {
              showToast("Blog deleted successfully!", "success");
              await fetchBlogs();
            } else {
              showToast("Failed to delete blog!", "danger");
            }
          } catch (error) {
            showToast("Failed to delete blog!", "danger");
          }
          setShowConfirmationModal(false);
        }}
      >
        <p>Are you sure you want to delete this blog?</p>
      </ConfirmationModal>

      <FormModal
        open={showViewModal}
        setOpen={setShowViewModal}
        position={"top-center"}
        size={"2xl"}
        headerText={"View Blog Details"}
      >
        {selectedBlogToView && (
          <div>
            <div className="flex items-center justify-center">
              {selectedBlogToView?.image_path === null ? (
                <>
                  <div className="h-20 w-20 bg-gray-200 rounded-lg dark:bg-gray-800 transition duration-500" />
                </>
              ) : (
                <>
                  <img
                    src={urlPrefix + selectedBlogToView?.image_path}
                    alt={selectedBlogToView?.title}
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                </>
              )}
            </div>
            <div className="my-7">
              <div className="flex justify-between items-center gap-x-5 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Title</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedBlogToView?.title}
                </p>
              </div>
              <div className="flex justify-between items-center gap-x-8 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Body</p>
                <div
                  className="text-gray-800 dark:text-gray-200 content-body"
                  dangerouslySetInnerHTML={{ __html: selectedBlogToView?.body }}
                />
              </div>
              <div className="flex justify-between items-center gap-x-8 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Updated At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedBlogToView?.updated_at)}
                </p>
              </div>
              <div className="flex justify-between items-center gap-x-8 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Created At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedBlogToView?.created_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </FormModal>
    </>
  );
};

export default AdminBlogs;
