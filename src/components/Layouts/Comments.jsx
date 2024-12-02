import {useContext, useState} from "react";
import {Avatar} from "flowbite-react";
import PropTypes from "prop-types";
import {IoTrashBin} from "react-icons/io5";
import ConfirmationModal from "../Modals/ConfirmationModal.jsx";
import useAxios from "../../hooks/useAxios.jsx";
import {ToastContext} from "../../hooks/ToastProvider.jsx";
import {FaEdit} from "react-icons/fa";

const Comments = ({ data, onDelete, onEdit }) => {
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const axiosInstance = useAxios();
  const { showToast } = useContext(ToastContext);

  const handleDelete = (commentId) => {
    setItemIdToDelete(commentId);
    setShowConfirmationModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log(data);
  return (
    <>
      <section className="relative">
        <div className="w-full max-w-3xl pt-12 pb-8 px-4 md:px-5 lg-6 mx-auto">
          <div className="py-4 border-t border-gray-400 dark:border-gray-100 max-xl:max-w-2xl max-xl:mx-auto">
            <div className="reviews-container">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-xl leading-9 text-gray-600 dark:text-gray-400 mb-6">
                  Comments
                </h3>
              </div>

              <div className="max-xl:max-w-2xl max-xl:mx-auto">
                {data?.length > 0 ? (
                  <>
                    {data?.map((comment, index) => (
                      <div key={index}>
                        <div className="flex sm:items-center flex-col min-[400px]:flex-row justify-between mb-2 mt-4">
                          <div className="flex items-center gap-3">
                            {comment.image_path ? (
                              <img
                                src={urlPrefix + comment.image_path}
                                alt={comment.firstName + " " + comment.lastName}
                                className="h-10 w-10 object-cover rounded-full"
                              />
                            ) : (
                              <Avatar
                                placeholderInitials={
                                  comment?.first_name[0] + comment?.last_name[0]
                                }
                                rounded
                              />
                            )}
                            <h6 className="font-semibold text-md leading-8 text-primary-600">
                              {comment.first_name} {comment.last_name}
                            </h6>
                          </div>
                          <div className="flex gap-x-4">
                            {comment?.is_mine === true && (
                              <>
                                <button
                                  aria-label="Edit comment"
                                  onClick={() => onEdit(comment?.id, comment?.body)}
                                  className="text-amber-600 hover:text-amber-900 dark:text-amber-500 dark:hover:text-amber-700"
                                >
                                  <FaEdit className="h-5 w-5"/>
                                </button>
                                <button
                                  aria-label="Delete comment"
                                  onClick={() => handleDelete(comment?.id)}
                                  className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-700"
                                >
                                  <IoTrashBin className="h-5 w-5"/>
                                </button>

                              </>
                            )}
                            <p className="font-normal text-sm leading-8 text-gray-600 dark:text-gray-400">
                              {formatDate(comment.created_at)}
                            </p>
                          </div>
                        </div>
                        <p className="font-normal text-md leading-8 text-gray-600 dark:text-gray-400 max-xl:text-justify">
                          {comment.body}
                        </p>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      No comments yet. Be the first to comment.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ConfirmationModal
        open={showConfirmationModal}
        setOpen={setShowConfirmationModal}
        onConfirm={async () => {
          try {
            const response = await axiosInstance.delete(
              `/api/blog/comment?id=${itemIdToDelete}`
            );
            console.log(response.data);
            if (response.data.status === true) {
              showToast("Comment deleted successfully!", "success");
              onDelete(true);
            } else {
              showToast("Failed to delete comment!", "danger");
            }
          } catch (error) {
            showToast("Failed to delete comment!", "danger");
          }
          setShowConfirmationModal(false);
        }}
      >
        <p>Are you sure you want to delete this comment?</p>
      </ConfirmationModal>
    </>
  );
};

Comments.propTypes = {
  data: PropTypes.array,
  onDelete: PropTypes.func,
  onEdit: PropTypes.func,
};

export default Comments;
