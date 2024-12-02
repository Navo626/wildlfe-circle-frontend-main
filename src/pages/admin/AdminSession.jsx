import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import Breadcrumb from "../../components/Miscellaneous/Breadcrumb.jsx";
import {FaEdit, FaEye} from "react-icons/fa";
import Table from "../../components/Layouts/Table.jsx";
import {useContext, useEffect, useState} from "react";
import {format, parseISO} from "date-fns";
import {IoTrashBin} from "react-icons/io5";
import ConfirmationModal from "../../components/Modals/ConfirmationModal.jsx";
import {ToastContext} from "../../hooks/ToastProvider.jsx";
import useAxios from "../../hooks/useAxios.jsx";
import {Button} from "flowbite-react";
import {AiOutlineLoading} from "react-icons/ai";
import FormModal from "../../components/Modals/FormModal.jsx";
import {Link} from "react-router-dom";

const columns = [
  {name: "#", key: "index"},
  {name: "Title", key: "title"},
  {name: "Description", key: "description"},
  {name: "Link", key: "link"},
  {name: "Host", key: "host"},
  {name: "Start Date", key: "start_date"},
  {name: "End Date", key: "end_date"},
  {name: "Created At", key: "created_at"},
  {name: "Updated At", key: "updated_at"},
  {name: "Status", key: "status"},
  {name: "Actions", key: "actions"},
];

const breadcrumbData = [{text: "Sessions", current: true}];

const AdminSession = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });
  const [selectedSessionToView, setSelectedSessionToView] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null);
  const [itemIdToEdit, setItemIdToEdit] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showEditFormModal, setShowEditFormModal] = useState(false);
  const {showToast} = useContext(ToastContext);
  const axiosInstance = useAxios();
  const [data, setData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    link: "",
    host: "",
  });
  const [errors, setErrors] = useState({});

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/admin/session?keyword=${searchKeyword}&page=${pagination.currentPage}`
      );
      if (response.data.status === true) {
        setSessions(response.data.data.data);
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
      console.error("Failed to fetch sessions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions().then((r) => r);
  }, [searchKeyword, pagination.currentPage]);

  const handleDelete = (sessionId) => {
    setItemIdToDelete(sessionId);
    setShowConfirmationModal(true);
  };

  const handleView = (sessionId) => {
    const selectedSession = sessions.find((n) => n.id === sessionId);
    setSelectedSessionToView(selectedSession);
    setShowViewModal(true);
  };

  const handleEdit = (sessionId) => {
    const selectedSession = sessions.find((i) => i.id === sessionId);
    setItemIdToEdit(sessionId);
    setData({
      title: selectedSession.title,
      description: selectedSession.description,
      start_date: selectedSession.start_date,
      end_date: selectedSession.end_date,
      link: selectedSession.link,
      host: selectedSession.host,
    });
    setErrors({});
    setShowEditFormModal(true);
  };

  const formatDate = (dateString) =>
    format(parseISO(dateString), "MMMM d, yyyy, p");

  const handleChange = (e) => {
    const {name, value} = e.target;
    setData((prev) => ({...prev, [name]: value}));
    validateField(name, value, {...data, [name]: value});
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "title":
        if (!value) {
          errorMsg = "Title is required!";
        }
        break;
      case "description":
        if (!value) {
          errorMsg = "Description is required!";
        }
        break;
      case "start_date":
        if (!value) {
          errorMsg = "Start date is required!";
        } else if (new Date(value) > new Date(data.end_date)) {
          errorMsg = "Start date cannot be after end date!";
        }
        break;
      case "end_date":
        if (!value) {
          errorMsg = "End date is required!";
        } else if (new Date(value) < new Date(data.start_date)) {
          errorMsg = "End date cannot be before start date!";
        }
        break;
      case "link":
        if (!value) {
          errorMsg = "Link is required!";
        }
        break;
      case "host":
        if (!value) {
          errorMsg = "Host is required!";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({...prev, [name]: errorMsg}));
  };

  const canSubmit = () => {
    return (
      Object.values(data).every((x) => x) &&
      Object.values(errors).every((x) => !x)
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("link", data.link);
    formData.append("host", data.host);

    try {
      const response = await axiosInstance.post("/api/admin/session", formData,);

      if (response.data.status === true) {
        showToast("Session added successfully!", "success");
        setData({
          title: "",
          description: "",
          start_date: "",
          end_date: "",
        });
        setShowFormModal(false);
        await fetchSessions();
      } else {
        showToast("Failed to add session. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Failed to add session. Please try again.", "danger");
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
    formData.append("description", data.description);
    formData.append("start_date", data.start_date);
    formData.append("end_date", data.end_date);
    formData.append("link", data.link);
    formData.append("host", data.host);

    try {
      const response = await axiosInstance.post(
        `/api/admin/session?id=${itemIdToEdit}&_method=PUT`, formData,
      );

      if (response.data.status === true) {
        showToast("Session updated successfully!", "success");
        setData({
          title: "",
          description: "",
          start_date: "",
          end_date: "",
        });
        setShowEditFormModal(false);
        setItemIdToEdit(null);
        await fetchSessions();
      } else {
        showToast("Failed to update session. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Failed to update session. Please try again.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DashboardLayout>
        <div className="p-4 min-h-screen">
          <Breadcrumb breadcrumbs={breadcrumbData}/>

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
              Array.from({length: 10}).map((_, index) => (
                <tr key={index}>
                  {Array.from({length: 11}, (_, index) => (
                    <td key={index} className="px-6 py-3">
                      <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <>
                {sessions.length > 0 ? (
                  sessions.map((session, index) => (
                    <tr
                      key={index}
                      className="bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 transition duration-500"
                    >
                      <td
                        className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        {index + 1}
                      </td>
                      <td
                        className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        <p className="truncate w-full">
                          {session?.title}
                        </p>
                      </td>
                      <td
                        className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        <p className="truncate w-full">
                          {session?.description}
                        </p>
                      </td>
                      <td
                        className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        <p className="truncate w-full">
                          <Link to={session?.link} target="_blank" className="text-gray-800 dark:text-gray-200 hover:underline">
                            {session?.link}
                          </Link>
                        </p>
                      </td>
                      <td
                        className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        <p className="truncate w-full">
                          {session?.host}
                        </p>
                      </td>
                      <td
                        className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        <p className="truncate w-full">
                          {formatDate(session?.start_date)}
                        </p>
                      </td>
                      <td
                        className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        <p className="truncate w-full">
                          {formatDate(session?.end_date)}
                        </p>
                      </td>
                      <td
                        className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        <p className="truncate w-full">
                          {formatDate(session?.created_at)}
                        </p>
                      </td>
                      <td
                        className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        <p className="truncate w-full">
                          {formatDate(session?.updated_at)}
                        </p>
                      </td>
                      <td
                        className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <span
                            className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium capitalize bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500 transition duration-500">
                            {session?.status}
                          </span>
                      </td>
                      <td
                        className="flex gap-x-5 items-center justify-center px-6 py-3 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        <button
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-700"
                          onClick={() => handleView(session.id)}
                        >
                          <FaEye className="h-5 w-5"/>
                        </button>
                        <button
                          className="text-amber-600 hover:text-amber-900 dark:text-amber-500 dark:hover:text-amber-700"
                          onClick={() => handleEdit(session.id)}
                        >
                          <FaEdit className="h-5 w-5"/>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900 dark:text-red-500 dark:hover:text-red-700"
                          onClick={() => handleDelete(session.id)}
                        >
                          <IoTrashBin className="h-5 w-5"/>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={11}
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
              `/api/admin/session?id=${itemIdToDelete}`
            );
            if (response.data.status === true) {
              showToast("Session deleted successfully!", "success");
              await fetchSessions();
            } else {
              showToast("Failed to delete session!", "danger");
            }
          } catch (error) {
            showToast("Failed to delete session!", "danger");
          }
          setShowConfirmationModal(false);
        }}
      >
        <p>Are you sure you want to delete this session?</p>
      </ConfirmationModal>

      <FormModal
        open={showFormModal}
        setOpen={setShowFormModal}
        position={"top-center"}
        size={"2xl"}
        headerText={"Add New Session"}
      >
        <form onSubmit={(e) => submitForm(e)}>
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
              htmlFor="description"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="Annual Meeting 2024 will be held at the Grand Hotel..."
              name="description"
              value={data["description"]}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
            />
            {errors["description"] && (
              <span className="text-sm text-red-500">{errors["description"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="link"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Link
            </label>
            <input
              type="text"
              id="link"
              placeholder="https://example.com"
              name="link"
              value={data["link"]}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
            />
            {errors["link"] && (
              <span className="text-sm text-red-500">{errors["link"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="host"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Host
            </label>
            <input
              type="text"
              id="host"
              placeholder="John Doe"
              name="host"
              value={data["host"]}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
            />
            {errors["host"] && (
              <span className="text-sm text-red-500">{errors["host"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="start_date"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Start Date
            </label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              value={data["start_date"]}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
            />
            {errors["start_date"] && (
              <span className="text-sm text-red-500">{errors["start_date"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="end_date"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              End Date
            </label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              value={data["end_date"]}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
            />
            {errors["end_date"] && (
              <span className="text-sm text-red-500">{errors["end_date"]}</span>
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
                <AiOutlineLoading className="h-6 w-6 animate-spin ml-2"/>
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
        headerText={"View Session Details"}
      >
        {selectedSessionToView && (
          <div>
            <div>
              <div
                className="flex justify-between items-center gap-x-5 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Title</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedSessionToView?.title}
                </p>
              </div>
              <div
                className="flex justify-between items-center gap-x-5 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Description</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedSessionToView?.description}
                </p>
              </div>
              <div
                className="flex justify-between items-center gap-x-5 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Link</p>
                <Link
                  to={selectedSessionToView?.link}
                  target="_blank"
                  className="text-gray-800 dark:text-gray-200 hover:underline">
                  {selectedSessionToView?.link}
                </Link>
              </div>
              <div
                className="flex justify-between items-center gap-x-5 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Host</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedSessionToView?.host}
                </p>
              </div>
              <div
                className="flex justify-between items-center gap-x-5 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Start Date</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedSessionToView?.start_date)}
                </p>
              </div>
              <div
                className="flex justify-between items-center gap-x-5 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">End Date</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedSessionToView?.end_date)}
                </p>
              </div>
              <div
                className="flex justify-between items-center gap-x-8 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Updated At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedSessionToView?.updated_at)}
                </p>
              </div>
              <div
                className="flex justify-between items-center gap-x-8 py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Created At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedSessionToView?.created_at)}
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
            description: "",
            start_date: "",
            end_date: "",
            link: "",
            host: "",
          });
          setErrors({});
        }}
        position={"top-center"}
        size={"2xl"}
        headerText={"Update Session"}
      >
        <form onSubmit={(e) => submitEditForm(e)}>
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
              htmlFor="description"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="Annual Meeting 2024 will be held at the Grand Hotel..."
              name="description"
              value={data["description"]}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
            />
            {errors["description"] && (
              <span className="text-sm text-red-500">{errors["description"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="link"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Link
            </label>
            <input
              type="text"
              id="link"
              placeholder="https://example.com"
              name="link"
              value={data["link"]}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
            />
            {errors["link"] && (
              <span className="text-sm text-red-500">{errors["link"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="host"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Host
            </label>
            <input
              type="text"
              id="host"
              placeholder="John Doe"
              name="host"
              value={data["host"]}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
            />
            {errors["host"] && (
              <span className="text-sm text-red-500">{errors["host"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="start_date"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Start Date
            </label>
            <input
              type="datetime-local"
              id="start_date"
              name="start_date"
              value={data["start_date"]}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
            />
            {errors["start_date"] && (
              <span className="text-sm text-red-500">{errors["start_date"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="end_date"
              className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              End Date
            </label>
            <input
              type="datetime-local"
              id="end_date"
              name="end_date"
              value={data["end_date"]}
              onChange={handleChange}
              disabled={isLoading}
              className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
            />
            {errors["end_date"] && (
              <span className="text-sm text-red-500">{errors["end_date"]}</span>
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
                <AiOutlineLoading className="h-6 w-6 animate-spin ml-2"/>
              )}
            </Button>
          </div>
        </form>
      </FormModal>
    </>
  )
}

export default AdminSession;