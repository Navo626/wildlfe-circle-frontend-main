import DashboardLayout from "../../components/Layouts/DashboardLayout.jsx";
import Breadcrumb from "../../components/Miscellaneous/Breadcrumb.jsx";
import {useEffect, useState} from "react";
import useAxios from "../../hooks/useAxios.jsx";
import {MdDescription, MdEvent, MdNewReleases, MdPeople, MdPhotoLibrary, MdShoppingCart, MdWork} from "react-icons/md";
import {FaTruck} from "react-icons/fa";
import IncomeChart from "../../components/Charts/IncomeChart.jsx";
import CountUp from "react-countup";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({});
  const [lastOrder, setLastOrder] = useState(null);
  const axiosInstance = useAxios();
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const breadcrumbData = [{ text: "Dashboard", current: true }];
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = axiosInstance.get("/api/admin/dashboard/counts");
    const fetchLastOrder = axiosInstance.get("/api/admin/order/last");

    Promise.all([fetchCounts, fetchLastOrder])
      .then(([countsResponse, lastOrderResponse]) => {
        if (countsResponse.data.status === true) {
          setCounts(countsResponse.data.data);
        } else {
          console.error("Failed to fetch counts");
        }

        if (lastOrderResponse.data.status === true) {
          setLastOrder(lastOrderResponse.data.data[0]);
        } else {
          console.error("Failed to fetch last order details");
        }
      })
      .catch((error) => {
        console.error("An error occurred!", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [axiosInstance]);

  const cardData = [
    {
      title: "Users",
      count: counts?.users || 0,
      icon: MdPeople,
    },
    {
      title: "Blog articles",
      count: counts?.blog || 0,
      icon: MdDescription,
    },
    {
      title: "News",
      count: counts?.news || 0,
      icon: MdNewReleases,
    },
    {
      title: "Projects",
      count: counts?.projects || 0,
      icon: MdWork,
    },
    {
      title: "Sessions",
      count: counts?.sessions || 0,
      icon: MdEvent,
    },
    {
      title: "Gallery",
      count: counts?.gallery || 0,
      icon: MdPhotoLibrary,
    },
    {
      title: "Products",
      count: counts?.products || 0,
      icon: MdShoppingCart,
    },
    {
      title: "Orders",
      count: counts?.orders || 0,
      icon: FaTruck,
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-4">
        <Breadcrumb breadcrumbs={breadcrumbData} />
        <div className="py-10 mx-auto w-full min-h-screen">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {isLoading ? (
              Array(8)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-950 dark:border-neutral-800 transition duration-500"
                  >
                    <div className="p-4 md:p-6 lg:p-8 flex justify-between gap-x-3 animate-pulse">
                      <div>
                        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/3 mb-2 transition duration-500"></div>
                        <div className="mt-1 flex items-center gap-x-2">
                          <div className="h-8 bg-gray-200 dark:bg-neutral-800 rounded w-1/2 transition duration-500"></div>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex justify-center items-center h-12 w-12 bg-gray-200 dark:bg-neutral-800 rounded-full transition duration-500"></div>
                    </div>
                  </div>
                ))
            ) : (
              <>
                {cardData?.map((card, index) => (
                  <div
                    key={index}
                    className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-950 dark:border-neutral-800 transition duration-500"
                  >
                    <div className="p-4 md:p-6 lg:p-8 flex justify-between gap-x-3">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500 transition duration-500">
                          {card?.title}
                        </p>
                        <div className="mt-1 flex items-center gap-x-2">
                          <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200 transition duration-500">
                            <CountUp end={card?.count} />
                          </h3>
                        </div>
                      </div>
                      <div className="flex-shrink-0 flex justify-center items-center size-[46px] bg-primary-600 text-white rounded-full dark:bg-primary-900 dark:text-primary-200 transition duration-500">
                        <card.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <div className="grid grid-cols-4 gap-6 pt-10 lg:pt-16 md:grid-cols-8 lg:grid-cols-12">
            <div className="col-span-4 md:col-span-8">
              <IncomeChart />
            </div>
            <div className="col-span-4 md:col-span-8 lg:col-span-4">
              <div className="bg-white border shadow-sm rounded-xl dark:bg-gray-950 dark:border-neutral-800 w-full transition duration-500">
                <div className="p-4 md:p-6 lg:p-8">
                  {isLoading ? (
                    <div className="animate-pulse">
                      <div className="flex justify-between items-center">
                        <div className="h-6 bg-gray-200 dark:bg-neutral-800 rounded w-1/3 mb-4 transition duration-500"></div>
                        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4 mb-4 transition duration-500"></div>
                      </div>
                      <div className="mt-8 flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-neutral-800 rounded-lg transition duration-500"></div>
                        <div>
                          <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-2/3 mb-2 transition duration-500"></div>
                          <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/3 transition duration-500"></div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4 mb-2 transition duration-500"></div>
                        <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/2 transition duration-500"></div>
                      </div>
                      <div className="mt-4">
                        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4 mb-2 transition duration-500"></div>
                        <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/2 transition duration-500"></div>
                      </div>
                      <div className="mt-4">
                        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4 mb-2 transition duration-500"></div>
                        <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/2 transition duration-500"></div>
                      </div>
                      <div className="mt-5">
                        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4 mb-2 transition duration-500"></div>
                        <div className="mt-2 gap-4">
                          <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/3 mb-2 transition duration-500"></div>
                          <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/3 mb-2 transition duration-500"></div>
                          <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/3 mb-2 transition duration-500"></div>
                          <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/2 mb-2 transition duration-500"></div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/4 mb-2 transition duration-500"></div>
                        <div className="h-3 bg-gray-200 dark:bg-neutral-800 rounded w-1/3 transition duration-500"></div>
                      </div>
                    </div>
                  ) : lastOrder ? (
                    <>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 transition duration-500">
                          Last Order
                        </h3>
                        <span className="text-xs font-semibold text-gray-500 dark:text-neutral-500 transition duration-500">
                          {new Date(lastOrder.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mt-8">
                        <div className="flex items-center gap-4">
                          <img
                            src={urlPrefix + lastOrder.product.image_path[0]}
                            alt="Product"
                            className="w-16 h-16 bg-gray-200 dark:bg-neutral-800 rounded-lg transition duration-500"
                          />
                          <div>
                            <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 transition duration-500">
                              {lastOrder.product.title}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-neutral-500 transition duration-500">
                              {lastOrder.color}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 transition duration-500">
                            Size
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 transition duration-500">
                            {lastOrder.size}
                          </p>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 transition duration-500">
                            Quantity
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 transition duration-500">
                            {lastOrder.quantity}
                          </p>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 transition duration-500">
                            Amount
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-neutral-500 transition duration-500">
                            Rs. {lastOrder.amount}
                          </p>
                        </div>
                        <div className="mt-5">
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 transition duration-500">
                            Billing Details
                          </h4>
                          <div className="flex items-center gap-4">
                            <div>
                              <p className="text-xs text-gray-500 dark:text-neutral-500 transition duration-500">
                                {lastOrder.first_name} {lastOrder.last_name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-neutral-500 transition duration-500">
                                {lastOrder.email}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-neutral-500 transition duration-500">
                                {lastOrder.phone}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-neutral-500 transition duration-500">
                                {lastOrder.address}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 transition duration-500">
                            Status
                          </h4>
                          <p className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium capitalize bg-teal-100 text-teal-800 rounded-full dark:bg-teal-500/10 dark:text-teal-500 transition duration-500">
                            {lastOrder.status}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-neutral-200 transition duration-500">
                      No orders found
                    </h3>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
