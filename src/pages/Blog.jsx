import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import {Avatar, Button, Tooltip} from "flowbite-react";
import TooltipContent from "../components/Miscellaneous/TooltipContent.jsx";
import Comments from "../components/Layouts/Comments.jsx";
import {useContext, useEffect, useState} from "react";
import useCheckSession from "../hooks/useCheckSession.jsx";
import {ToastContext} from "../hooks/ToastProvider.jsx";
import FormModal from "../components/Modals/FormModal.jsx";
import {AiOutlineLoading} from "react-icons/ai";
import {useParams} from "react-router-dom";
import useAxios from "../hooks/useAxios.jsx";
import {IoTrashBin} from "react-icons/io5";
import ConfirmationModal from "../components/Modals/ConfirmationModal.jsx";
import {FaEdit, FaRegCommentDots, FaRegHeart} from "react-icons/fa";
import {FiShare} from "react-icons/fi";
import {WiStars} from "react-icons/wi";
import ReactQuill from "react-quill";

const Blog = () => {
  const {id} = useParams();
  const [blog, setBlog] = useState(null);
  const {showToast} = useContext(ToastContext);
  const [showFormModal, setShowFormModal] = useState(false);
  const isLoggedIn = useCheckSession();
  const [data, setData] = useState({
    comment: "",
  });
  const [blogData, setBlogData] = useState({
    title: "",
    body: "",
    image: null,
  });
  const [imageName, setImageName] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [likeStatus, setLikeStatus] = useState(false);
  const [comments, setComments] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const axiosInstance = useAxios();
  const [showEditFormModal, setShowEditFormModal] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);

  const fetchBlog = async () => {
    try {
      const response = await axiosInstance.get(
        `${urlPrefix}/api/blog?id=${id}`
      );

      if (response.data.status === true) {
        setBlogData({
          title: response.data.data.blog.title,
          body: response.data.data.blog.body,
          image: null,
        })
        setBlog(response.data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const response = await axiosInstance.get(`/api/blog/like?id=${id}`);

      if (response.data.status === true) {
        setLikeStatus(response.data.data.is_liked);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axiosInstance.get(`/api/blog/comment?id=${id}`);

      if (response.data.status === true) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBlog().then((r) => r);
    fetchComments().then((r) => r);

    if (isLoggedIn) {
      fetchLikeStatus().then((r) => r);
    }
  }, [isLoggedIn, urlPrefix]);

  const calculateReadingTime = (text) => {
    if (!text) {
      return 0;
    }
    const wordsPerMinute = 200;
    const numberOfWords = text.split(/\s/g).length;
    const minutes = numberOfWords / wordsPerMinute;
    return Math.ceil(minutes);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const handleEdit = (commentId, commentBody) => {
    setCommentToEdit({id: commentId, body: commentBody});
    setShowEditFormModal(true);
  };

  const handleChange = (e) => {
    const {name, value} = e.target;
    setData((prev) => ({...prev, [name]: value}));
    validateField(name, value);
  };

  const handleChangeBlog = (e) => {
    const {name, type, value, files} = e.target;
    const newValue = type === "file" ? files[0] || null : value;
    setBlogData((prev) => ({...prev, [name]: newValue}));
    validateFieldBlog(name, newValue);

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
          setErrors((prev) => ({...prev, [name]: ""}));
        }
      }
    }
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (!value) {
      errorMsg = "Comment is required!";
    }

    setErrors((prev) => ({...prev, [name]: errorMsg}));
  };

  const validateFieldBlog = (name, value) => {
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

    setErrors((prev) => ({...prev, [name]: errorMsg}));
  };

  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  const canSubmit = () => {
    return (
      Object.values(data).every((x) => x) &&
      Object.values(errors).every((x) => !x)
    );
  };

  const canSubmitBlog = () => {
    const requiredFields = ["title", "body"];
    return requiredFields.every((field) => blogData[field]);
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      showToast("Please log in to like articles", "warning");
      return;
    }

    try {
      await axiosInstance.post(`/api/blog/like?id=${id}`);
      fetchLikeStatus().then((r) => r);
      fetchBlog().then((r) => r);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = () => {
    if (!isLoggedIn) {
      showToast("Please log in to add comments", "warning");
      return;
    }
    setShowFormModal(true);
  };

  const handleCommentDelete = async () => {
    await fetchComments().then((r) => r);
    await fetchBlog().then((r) => r);
  };

  const handleDelete = async () => {
    setShowConfirmationModal(true);
  };

  const handleEditBlog = () => {
    setShowBlogModal(true);
  }

  const handleOptimize = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("body", blogData.body);

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/blog/optimize", formData);

      if (response.data.status === true) {
        showToast("Optimized successfully!", "success");
        setBlogData((prev) => ({...prev, body: response.data.data}));
      } else {
        showToast("Failed to optimize. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Failed to optimize. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(false);
    try {
      await axiosInstance.post(`/api/blog/comment/?id=${id}`, {
        body: data.comment,
      });

      showToast("Comment posted successfully!", "success");
      setData({
        comment: "",
      });
      fetchBlog().then((r) => r);
      fetchComments().then((r) => r);
      setShowFormModal(false);
    } catch (error) {
      showToast("Failed to post comment. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const submitEditForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(false);
    try {
      await axiosInstance.post(`/api/blog/comment?id=${commentToEdit?.id}&_method=PUT`, {
        body: data.comment,
      });

      showToast("Comment updated successfully!", "success");
      setData({
        comment: "",
      });
      fetchBlog().then((r) => r);
      fetchComments().then((r) => r);
      setShowEditFormModal(false);
    } catch (error) {
      showToast("Failed to update comment. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const submitEditBlogForm = async (e) => {
    e.preventDefault();
    if (!canSubmitBlog()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("body", blogData.body);
    if (blogData.image) {
      formData.append("image", blogData.image);
    } else {
      formData.append("image", "");
    }

    try {
      const response = await axiosInstance.post(`/api/blog?id=${id}&_method=PUT`, formData, {
        headers: {"Content-Type": "multipart/form-data"},
      });

      if (response.data.status === true) {
        showToast("Blog updated successfully!", "success");
        setBlogData({
          title: "",
          body: "",
          image: null,
        });
        setImageName("");
        setShowBlogModal(false);
        await fetchBlog();
      } else {
        showToast("Failed to update blog. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Failed to update blog. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header/>
        <section>
          <div className="max-w-3xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 md:px-12 lg:px-8 mx-auto">
            <div className="max-w-2xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex w-full sm:items-center gap-x-5 sm:gap-x-3">
                  {isLoading ? (
                    <div className="flex-shrink-0">
                      <Avatar rounded/>
                    </div>
                  ) : (
                    <div className="flex-shrink-0">
                      {blog?.user?.image_path ? (
                        <img
                          className="size-12 rounded-full"
                          src={urlPrefix + blog?.user?.image_path}
                          alt="User Profile"
                        />
                      ) : (
                        <Avatar
                          placeholderInitials={
                            blog?.user?.first_name[0] + blog?.user?.last_name[0]
                          }
                          rounded
                        />
                      )}
                    </div>
                  )}

                  <div className="grow">
                    <div className="flex justify-between items-center gap-x-2">
                      <div>
                        {isLoading ? (
                          <>
                            <div
                              className="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-neutral-400 dark:before:bg-neutral-600 transition duration-500">
                              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-32 rounded-md animate-pulse"></div>
                            </div>
                            <ul className="text-xs text-gray-200 dark:text-gray-700 transition duration-500">
                              <li
                                className="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-neutral-400 dark:before:bg-neutral-600 transition duration-500">
                                <div className="bg-gray-200 dark:bg-gray-700 h-3 w-24 rounded-md animate-pulse"></div>
                              </li>
                              <li
                                className="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-neutral-400 dark:before:bg-neutral-600 transition duration-500">
                                <div className="bg-gray-200 dark:bg-gray-700 h-3 w-16 rounded-md animate-pulse"></div>
                              </li>
                            </ul>
                          </>
                        ) : (
                          <>
                            <div className="inline-block [--trigger:hover] [--placement:bottom]">
                              <div className="sm:mb-1 block text-start cursor-pointer">
                                <Tooltip
                                  content={
                                    <TooltipContent
                                      content={"author"}
                                      other={{
                                        articles: blog?.user?.articles_written,
                                        joined: formatDate(
                                          blog?.user?.created_at
                                        ),
                                      }}
                                    />
                                  }
                                  arrow={false}
                                >
                                  <span className=" font-semibold leading-8 text-primary-600">
                                    {blog?.user?.first_name}{" "}
                                    {blog?.user?.last_name}
                                  </span>
                                </Tooltip>
                              </div>
                            </div>

                            <ul className="text-xs text-gray-500 dark:text-neutral-500 transition duration-500">
                              <li
                                className="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-neutral-400 dark:before:bg-neutral-600 transition duration-500">
                                <time
                                  dateTime={blog?.blog?.created_at}
                                  className="text-xs text-gray-600 dark:text-gray-400 transition duration-500"
                                >
                                  {formatDate(blog?.blog?.created_at)}
                                </time>
                              </li>
                              <li
                                className="inline-block relative pe-6 last:pe-0 last-of-type:before:hidden before:absolute before:top-1/2 before:end-2 before:-translate-y-1/2 before:size-1 before:bg-gray-300 before:rounded-full dark:text-neutral-400 dark:before:bg-neutral-600 transition duration-500">
                                {calculateReadingTime(blog?.blog?.body)} min
                                read
                              </li>
                            </ul>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {isLoggedIn && blog?.user?.is_mine && (
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleEditBlog()}
                      className="text-amber-600 hover:text-amber-900 dark:text-amber-500 dark:hover:text-amber-700"
                    >
                      <FaEdit className="h-5 w-5"/>
                    </button>
                    <button
                      onClick={() => handleDelete()}
                      className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-700"
                    >
                      <IoTrashBin className="h-5 w-5"/>
                    </button>
                  </div>
                )}
              </div>

              {isLoading ? (
                <>
                  <div className="space-y-5 md:space-y-8">
                    <div className="space-y-3">
                      <h2 className="text-2xl font-bold md:text-3xl dark:text-white transition duration-500">
                        <div className="bg-gray-200 dark:bg-gray-700 my-1 h-8 rounded-md animate-pulse"></div>
                        <div className="bg-gray-200 dark:bg-gray-700 my-1 h-8 w-3/4 rounded-md animate-pulse"></div>
                      </h2>

                      <figure>
                        <div className="bg-gray-200 dark:bg-gray-700 w-full h-64 rounded-xl my-8 animate-pulse"></div>
                      </figure>

                      <div className="space-y-8">
                        {Array.from({length: 5}).map((_, i) => (
                          <div
                            key={i}
                            className="text-lg text-gray-800 dark:text-neutral-200 transition duration-500 content-body text-justify"
                          >
                            <div className="space-y-2">
                              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-md animate-pulse"></div>
                              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-md animate-pulse"></div>
                              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-md animate-pulse"></div>
                              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-full rounded-md animate-pulse"></div>
                              <div className="bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded-md animate-pulse"></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-5 md:space-y-8">
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold md:text-3xl dark:text-white transition duration-500">
                      {blog?.blog?.title}
                    </h2>

                    {blog?.blog?.image_path && (
                      <figure>
                        <img
                          className="w-full object-cover rounded-xl my-8"
                          src={urlPrefix + blog?.blog?.image_path}
                          alt="Image Description"
                        />
                      </figure>
                    )}

                    <div
                      className="text-lg text-gray-800 dark:text-neutral-200 transition duration-500 content-body text-justify"
                      dangerouslySetInnerHTML={{__html: blog?.blog?.body}}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {!isLoading && (
            <>
              <div className="sticky bottom-6 inset-x-0 text-center">
                <div
                  className="inline-block bg-white shadow-md rounded-full py-3 px-4 dark:bg-neutral-800 transition duration-500">
                  <div className="flex items-center gap-x-1.5">
                    <div className="inline-block">
                      <Tooltip
                        content={<TooltipContent content={"like"}/>}
                        arrow={false}
                      >
                        <button
                          type="button"
                          onClick={handleLike}
                          className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition duration-500"
                        >
                          <FaRegHeart
                            className={`flex-shrink-0 ${
                              likeStatus ? "text-red-500" : "text-gray-500"
                            }`}
                          />
                          {blog?.blog?.likes || 0}
                          <span
                            className="opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-black"
                            role="tooltip"
                          >
                            Like
                          </span>
                        </button>
                      </Tooltip>
                    </div>

                    <div
                      className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-600 transition duration-500"></div>

                    <div className="inline-block">
                      <Tooltip
                        content={<TooltipContent content={"comment"}/>}
                        arrow={false}
                      >
                        <button
                          type="button"
                          onClick={handleComment}
                          className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition duration-500"
                        >
                          <FaRegCommentDots className="flex-shrink-0"/>
                          {blog?.blog?.comments || 0}
                          <span
                            className="opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm dark:bg-black duration-500"
                            role="tooltip"
                          >
                            Comment
                          </span>
                        </button>
                      </Tooltip>
                    </div>
                    <div
                      className="block h-3 border-e border-gray-300 mx-3 dark:border-neutral-600 transition duration-500"></div>

                    <div className="relative inline-flex">
                      <Tooltip
                        content={<TooltipContent content={"share"}/>}
                        className="!bg-transparent"
                        arrow={false}
                      >
                        <button
                          type="button"
                          className="flex items-center gap-x-2 text-sm text-gray-500 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition duration-500"
                        >
                          <FiShare className="flex-shrink-0"/>
                          Share
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>

              <Comments data={comments} onDelete={handleCommentDelete} onEdit={handleEdit}/>
            </>
          )}
        </section>
        <Footer/>
      </div>

      <ConfirmationModal
        open={showConfirmationModal}
        setOpen={setShowConfirmationModal}
        onConfirm={async () => {
          try {
            const response = await axiosInstance.delete(`/api/blog?id=${id}`);
            console.log(response.data);
            if (response.data.status === true) {
              showToast("Blog deleted successfully!", "success");
              window.location.href = "/blog";
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
        open={showFormModal}
        setOpen={setShowFormModal}
        position={"top-center"}
        size={"2xl"}
        headerText={"Add Comment"}
      >
        <form onSubmit={(e) => submitForm(e)}>
          <div>
            <div>
              <label
                htmlFor="comment"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                placeholder="Type something here..."
              />
              {errors["comment"] && (
                <span className="text-sm text-red-500">
                  {errors["comment"]}
                </span>
              )}
            </div>

            <div className="mt-4 grid">
              <Button
                type="submit"
                disabled={!canSubmit() || isLoading}
                className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-gray-300 focus:!ring-opacity-50"
              >
                Submit
                {isLoading && (
                  <AiOutlineLoading className="h-6 w-6 animate-spin ml-2"/>
                )}
              </Button>
            </div>
          </div>
        </form>
      </FormModal>

      <FormModal
        open={showEditFormModal}
        setOpen={setShowEditFormModal}
        onClose={() => {
          setData({
            comment: "",
          });
          setErrors({});
        }}
        position={"top-center"}
        size={"2xl"}
        headerText={"Update Comment"}
      >
        <form onSubmit={(e) => submitEditForm(e)}>
          <div>
            <div>
              <label
                htmlFor="comment"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows="4"
                defaultValue={commentToEdit?.body}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                placeholder="Type something here..."
              />
              {errors["comment"] && (
                <span className="text-sm text-red-500">
                  {errors["comment"]}
                </span>
              )}
            </div>

            <div className="mt-4 grid">
              <Button
                type="submit"
                disabled={!canSubmit() || isLoading}
                className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-gray-300 focus:!ring-opacity-50"
              >
                Submit
                {isLoading && (
                  <AiOutlineLoading className="h-6 w-6 animate-spin ml-2"/>
                )}
              </Button>
            </div>
          </div>
        </form>
      </FormModal>

      <FormModal
        open={showBlogModal}
        setOpen={setShowBlogModal}
        onClose={() => {
          setBlogData({
            title: blog?.blog?.title,
            body: blog?.blog?.body,
            image: null,
          })
          setErrors({});
        }}
        position={"top-center"}
        size={"2xl"}
        headerText={"Update Blog"}
      >
        <form onSubmit={(e) => submitEditBlogForm(e)} encType="multipart/form-data">
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
                value={blogData["title"]}
                onChange={handleChangeBlog}
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
                disabled={isLoading || errors["body"] || !blogData["body"]}
                className="h-10 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-primary-300 focus:!ring-opacity-50"
              >
                Optimize <WiStars className="size-6"/>
                {isLoading && (
                  <AiOutlineLoading className="h-6 w-6 animate-spin ml-2"/>
                )}
              </Button>
            </div>
            <ReactQuill
              id="body"
              name="body"
              theme="snow"
              value={blogData["body"]}
              onChange={(body) => {
                setBlogData((prev) => ({...prev, body}));
                validateFieldBlog("body", body);
              }}
              readOnly={isLoading}
              modules={Blog.modules}
              formats={Blog.formats}
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
                onChange={handleChangeBlog}
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
              disabled={!canSubmitBlog() || isLoading}
              className="w-full text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform !bg-primary-600 rounded-lg hover:!bg-primary-800 focus:!outline-none focus:!ring focus:!ring-primary-300 focus:!ring-opacity-50"
            >
              Update
              {isLoading && (
                <AiOutlineLoading className="h-6 w-6 animate-spin ml-2"/>
              )}
            </Button>
          </div>
        </form>
      </FormModal>
    </>
  );
};

export default Blog;
