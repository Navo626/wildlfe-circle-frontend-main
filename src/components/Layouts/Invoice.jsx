import { MdOutlineFileDownload, MdOutlineLocalPrintshop } from "react-icons/md";
import { PiInvoiceBold } from "react-icons/pi";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import axios from "axios";

const Invoice = ({ order, setShowInvoice }) => {
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;

  const handleDownload = async () => {
    try {
      const response = await axios.get(`${urlPrefix}/api/invoice`, {
        params: {
          order_id: order.order_id,
        },
        responseType: "blob",
      });

      // Create a Blob from the PDF Stream
      const file = new Blob([response.data], { type: "application/pdf" });

      // Build a URL from the file
      const fileURL = URL.createObjectURL(file);

      // Open the URL on new Window
      const link = window.open(fileURL);

      if (link == null || typeof link == "undefined") {
        alert("There was an error opening your download, please try again.");
      } else {
        link.focus();
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div
        className="flex justify-center items-center size-full fixed top-0 start-0 z-[80] overflow-x-hidden overflow-y-auto pointer-events-none"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <div className="ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
          <div className="relative flex flex-col bg-white shadow-lg rounded-xl pointer-events-auto dark:bg-neutral-800 transition duration-500">
            <div className="relative overflow-hidden min-h-32 bg-gray-900 text-center rounded-t-xl dark:bg-neutral-950 transition duration-500">
              <div className="absolute top-2 end-2">
                <button
                  type="button"
                  onClick={() => setShowInvoice(false)}
                  className="inline-flex flex-shrink-0 justify-center items-center size-8 rounded-lg text-gray-500 hover:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all text-sm dark:text-neutral-500 dark:focus:ring-neutral-700 dark:focus:ring-offset-gray-800"
                >
                  <IoClose className="flex-shrink-0 size-6" />
                </button>
              </div>
              <figure className="absolute inset-x-0 bottom-0 -mb-px">
                <svg
                  preserveAspectRatio="none"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  viewBox="0 0 1920 100.1"
                >
                  <path
                    fill="currentColor"
                    className="fill-white dark:fill-neutral-800 transition duration-500"
                    d="M0,0c0,0,934.4,93.4,1920,0v100.1H0L0,0z"
                  ></path>
                </svg>
              </figure>
            </div>

            <div className="relative z-10 -mt-12">
              <span className="mx-auto flex justify-center items-center size-[62px] rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 transition duration-500">
                <PiInvoiceBold className="flex-shrink-0 size-6" />
              </span>
            </div>

            <div className="p-4 sm:p-7 overflow-y-auto">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-neutral-200 transition duration-500">
                  Invoice from Wildlife Circle
                </h3>
                <p className="text-sm text-gray-500 dark:text-neutral-500 transition duration-500">
                  Invoice #{order.order_id}
                </p>
              </div>

              <div className="mt-5 sm:mt-10">
                <div>
                  <span className="block text-xs uppercase text-gray-500 dark:text-neutral-500 transition duration-500">
                    Date paid:
                  </span>
                  <span className="block text-sm font-medium text-gray-800 dark:text-neutral-200 transition duration-500">
                    {order.date}
                  </span>
                </div>
              </div>

              <div className="mt-5 sm:mt-10">
                <h4 className="text-xs font-semibold uppercase text-gray-800 dark:text-neutral-200 transition duration-500">
                  Summary
                </h4>

                <ul className="mt-3 flex flex-col">
                  <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200 transition duration-500">
                    <div className="flex items-center justify-between w-full">
                      <span>Product</span>
                      <span>{order.title}</span>
                    </div>
                  </li>
                  <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200 transition duration-500">
                    <div className="flex items-center justify-between w-full">
                      <span>Color</span>
                      <span>{order.color}</span>
                    </div>
                  </li>
                  <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200 transition duration-500">
                    <div className="flex items-center justify-between w-full">
                      <span>Size</span>
                      <span>{order.size}</span>
                    </div>
                  </li>
                  <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:border-neutral-700 dark:text-neutral-200 transition duration-500">
                    <div className="flex items-center justify-between w-full">
                      <span>Quantity</span>
                      <span>{order.quantity}</span>
                    </div>
                  </li>
                  <li className="inline-flex items-center gap-x-2 py-3 px-4 text-sm font-semibold bg-gray-50 border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 transition duration-500">
                    <div className="flex items-center justify-between w-full">
                      <span>Amount Paid</span>
                      <span>Rs. {order.amount}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-5 flex justify-end gap-x-2">
                <button
                  onClick={handleDownload}
                  className="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-lg border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-primary-600 transition-all text-sm dark:bg-neutral-800 dark:hover:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-400 dark:hover:text-white dark:focus:ring-offset-gray-800 duration-500"
                >
                  <MdOutlineFileDownload className="flex-shrink-0 size-5" />
                  Invoice PDF
                </button>
                <button
                  className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50 disabled:pointer-events-none transition duration-500"
                  onClick={handlePrint}
                >
                  <MdOutlineLocalPrintshop className="flex-shrink-0 size-5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Invoice.propTypes = {
  order: PropTypes.object,
  setShowInvoice: PropTypes.func,
};

export default Invoice;
