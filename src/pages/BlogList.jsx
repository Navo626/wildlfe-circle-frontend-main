import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import {Link} from "react-router-dom";
import {IoIosArrowBack, IoIosArrowForward} from "react-icons/io";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import useCheckSession from "../hooks/useCheckSession.jsx";
import {Button} from "flowbite-react";
import {ToastContext} from "../hooks/ToastProvider.jsx";
import FormModal from "../components/Modals/FormModal.jsx";
import {AiOutlineLoading} from "react-icons/ai";
import useAxios from "../hooks/useAxios.jsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {WiStars} from "react-icons/wi";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });
  const isLoggedIn = useCheckSession();
  const { showToast } = useContext(ToastContext);
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [data, setData] = useState({
    title: "",
    body: "",
    image: null,
  });
  const [imageName, setImageName] = useState("");
  const [errors, setErrors] = useState({});
  const axiosInstance = useAxios();

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${urlPrefix}/api/blog?page=${pagination.currentPage}`
      );

      if (response.data.status === true) {
        setBlogs(response.data.data.data);
        setPagination({
          currentPage: response.data.data.current_page,
          totalPages: response.data.data.last_page,
          totalResults: response.data.data.total,
          perPage: response.data.data.per_page,
        });
        setIsLoading(false);
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs().then((r) => r);
  }, [pagination.currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  const renderPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    let pages = [];
    let startPage, endPage;

    if (totalPages <= 5) {
      // less than 5 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 5 total pages so calculate start and end pages
      if (currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
            currentPage === i
              ? "text-white z-10 bg-primary-600 focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
              : "text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:hover:text-gray-700 focus:z-20 focus:outline-offset-0 transition duration-500"
          }`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  const handleAddBlog = async () => {
    if (!isLoggedIn) {
      showToast("Please log in to add blogs", "warning");
      return;
    }
    setShowBlogModal(true);
  };

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    const newValue = type === "file" ? files[0] || null : value;
    setData((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);

    if (type === "file") {
      const file = files[0];
      if (file) {
        setImageName(file.name);
        const validImageTypes = [
          "image/jpg",
          "image/jpeg",
          "image/png",
          "image/webp",
        ];
        if (!validImageTypes.includes(file.type)) {
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
      formData.append("image", data.image);
    } else {
      formData.append("image", "");
    }

    try {
      const response = await axiosInstance.post("/api/blog", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === true) {
        showToast("Blog added successfully!", "success");
        setData({
          title: "",
          body: "",
          image: null,
        });
        setImageName("");
        setShowBlogModal(false);
        await fetchBlogs();
      } else {
        showToast("Failed to add blog. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Failed to add blog. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptimize = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("body", data.body);

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/blog/optimize", formData);

      if (response.data.status === true) {
        showToast("Optimized successfully!", "success");
        setData((prev) => ({ ...prev, body: response.data.data }));
      } else {
        showToast("Failed to optimize. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Failed to optimize. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <section>
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-12 mx-auto">
            <h1 className="text-3xl mb-8 text-center font-bold text-gray-800 sm:text-4xl dark:text-white transition duration-500">
              Blogs
            </h1>
            {isLoading ? (
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse flex flex-col bg-white dark:bg-gray-900 p-3 rounded-lg"
                    >
                      <div className="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg" />
                      <div className="mt-4 h-4 max-w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="mt-2 h-4 max-w-64 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="mt-6 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="mt-2 h-4 max-w-64 bg-gray-200 dark:bg-gray-700 rounded" />
                    </div>
                  ))}
              </div>
            ) : (
              <>
                <div className="max-w-32 mb-8">
                  <Button
                    onClick={handleAddBlog}
                    disabled={isLoading}
                    className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-primary-300 focus:!ring-opacity-50"
                  >
                    Add Blog
                  </Button>
                </div>
                <div className="mx-auto grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {blogs.map((blog) => (
                    <Link key={blog.id} to={`/blog/${blog.id}`}>
                      <article
                        key={blog.id}
                        className="flex max-w-xl flex-col items-start justify-between hover:shadow-xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md"
                      >
                        {blog.image_path ? (
                          <img
                            className="object-cover object-center w-full h-64 rounded-lg lg:h-80 mb-5"
                            src={urlPrefix + blog.image_path}
                            alt={blog.title}
                          />
                        ) : (
                          <div className="bg-gray-100 dark:bg-gray-700 w-full h-64 rounded-lg lg:h-80 mb-5 transition duration-500" />
                        )}

                        <span className="text-sm mb-1 text-gray-600 dark:text-gray-400 transition duration-500">
                          By{" "}
                          <span className="font-semibold text-primary-600">
                            {blog.author}
                          </span>
                        </span>

                        <time
                          dateTime={blog.created_at}
                          className="text-xs text-gray-600 dark:text-gray-400 transition duration-500"
                        >
                          {new Date(blog.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </time>

                        <div className="group relative">
                          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200 transition duration-500">
                            <span className="absolute inset-0" />
                            {blog.title}
                          </h3>
                          <div
                            className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400 transition duration-500"
                            dangerouslySetInnerHTML={{ __html: blog.body }}
                          />
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {blogs.length > 0 ? (
                  <>
                    <div className="pt-10 grid gap-3 justify-end transition duration-500">
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                          <button
                            disabled={pagination.currentPage === 1}
                            onClick={() =>
                              handlePageChange(pagination.currentPage - 1)
                            }
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-primary-100 focus:z-20 focus:outline-offset-0"
                          >
                            <IoIosArrowBack />
                          </button>

                          {renderPageNumbers()}
                          <button
                            disabled={
                              pagination.currentPage === pagination.totalPages
                            }
                            onClick={() =>
                              handlePageChange(pagination.currentPage + 1)
                            }
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-primary-100 focus:z-20 focus:outline-offset-0"
                          >
                            <IoIosArrowForward />
                          </button>
                        </nav>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center text-gray-700 dark:text-gray-400 transition duration-500">
                      No articles found
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
        <Footer />
      </div>

      <FormModal
        open={showBlogModal}
        setOpen={setShowBlogModal}
        position={"top-center"}
        size={"2xl"}
        headerText={"Add Blog"}
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
                placeholder="How to identify a venomous snake?"
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
            <div className="flex items-stretch justify-between">
              <label
                htmlFor="body"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Body
              </label>

              <Button
                type="submit"
                onClick={(e) => handleOptimize(e)}
                disabled={isLoading || errors["body"] || !data["body"]}
                className="h-10 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-primary-300 focus:!ring-opacity-50"
              >
                Optimize <WiStars className="size-6" />
                {isLoading && (
                  <AiOutlineLoading className="h-6 w-6 animate-spin ml-2" />
                )}
              </Button>
            </div>
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
              modules={BlogList.modules}
              formats={BlogList.formats}
              className="mt-3 text-sm text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-900"
              placeholder="Body of the blog"
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
    </>
  );
};

export default BlogList;
