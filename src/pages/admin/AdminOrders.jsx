import Breadcrumb from "../../components/Miscellaneous/Breadcrumb.jsx";
import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import {useEffect, useState} from "react";
import useAxios from "../../hooks/useAxios.jsx";
import {format, parseISO} from "date-fns";
import Table from "../../components/Layouts/Table.jsx";
import FormModal from "../../components/Modals/FormModal.jsx";
import {FaEye} from "react-icons/fa";

const columns = [
  { name: "#", key: "index" },
  { name: "Image", key: "image" },
  { name: "Product", key: "title" },
  { name: "Size", key: "size" },
  { name: "Color", key: "color" },
  { name: "Quantity", key: "quantity" },
  { name: "Amount", key: "amount" },
  { name: "First Name", key: "first_name" },
  { name: "Last Name", key: "last_name" },
  { name: "Phone", key: "phone" },
  { name: "Email", key: "email" },
  { name: "Address", key: "address" },
  { name: "Created At", key: "created_at" },
  { name: "Updated At", key: "updated_at" },
  { name: "Status", key: "status" },
  { name: "Actions", key: "actions" },
];

const breadcrumbData = [{ text: "Orders", current: true }];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });
  const axiosInstance = useAxios();
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/admin/order?keyword=${searchKeyword}&page=${pagination.currentPage}`
      );
      if (response.data.status === true) {
        setOrders(response.data.data.data);
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
      console.error("Failed to fetch orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders().then((r) => r);
  }, [searchKeyword, pagination.currentPage]);

  const handleView = (orderId) => {
    const selectedOrder = orders.find((o) => o.id === orderId);
    setSelectedOrder(selectedOrder);
    setShowViewModal(true);
  };

  const formatDate = (dateString) =>
    format(parseISO(dateString), "MMMM d, yyyy, p");

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
                    {Array.from({ length: 16 }, (_, index) => (
                      <td key={index} className="px-6 py-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <>
                  {orders.length > 0 ? (
                    orders.map((order, index) => (
                      <tr
                        key={index}
                        className="bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 transition duration-500"
                      >
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {index + 1}
                        </td>
                        <td className="flex items-center px-6 py-3  transition duration-500">
                          <img
                            src={
                              urlPrefix + order.product.image_path.split(",")[0]
                            }
                            alt={order?.title}
                            className="h-10 w-10 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {order?.product.title}
                          </p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{order?.size}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{order?.color}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{order?.quantity}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">Rs. {order?.amount}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{order?.first_name}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{order?.last_name}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{order?.phone}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <a
                            href={`mailto:${order?.email}`}
                            className="hover:underline"
                          >
                            {order?.email}
                          </a>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{order?.address}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {formatDate(order?.created_at)}
                          </p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {formatDate(order?.updated_at)}
                          </p>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium capitalize bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500 transition duration-500">
                            {order?.status}
                          </span>
                        </td>
                        <td className="flex gap-x-5 items-center justify-center px-6 py-3 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <button
                            onClick={() => handleView(order.id)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-700"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={16}
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

      <FormModal
        open={showViewModal}
        setOpen={setShowViewModal}
        position={"top-center"}
        size={"lg"}
        headerText={"View Order Details"}
      >
        {selectedOrder && (
          <div>
            <div className="flex items-center justify-center">
              <img
                src={urlPrefix + selectedOrder.product.image_path.split(",")[0]}
                alt={selectedOrder?.title}
                className="h-20 w-20 object-cover rounded-lg"
              />
            </div>
            <div className="my-7">
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Product</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedOrder?.product.title}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Size</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedOrder?.size}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Color</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedOrder?.color}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Quantity</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedOrder?.quantity}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Amount</p>
                <p className="text-gray-800 dark:text-gray-200">
                  Rs. {selectedOrder?.amount}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">First Name</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedOrder?.first_name}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Last Name</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedOrder?.last_name}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Phone</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedOrder?.phone}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Email</p>
                <a
                  href={`mailto:${selectedOrder?.email}`}
                  className="text-gray-800 dark:text-gray-200 hover:underline"
                >
                  {selectedOrder?.email}
                </a>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Address</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedOrder?.address}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Status</p>
                <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium capitalize bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500 transition duration-500">
                  {selectedOrder?.status}
                </span>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Updated At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedOrder?.created_at)}
                </p>
              </div>
              <div className="flex gap-x-8 justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Created At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedOrder?.updated_at)}
                </p>
              </div>
            </div>
          </div>
        )}
      </FormModal>
    </>
  );
};

export default AdminOrders;
