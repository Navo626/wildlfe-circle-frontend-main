/* global payhere */

import { useContext, useEffect, useState } from "react";
import { RadioGroup } from "@headlessui/react";
import { FaMinus, FaPlus } from "react-icons/fa";
import Header from "../components/Layouts/Header.jsx";
import { Footer } from "flowbite-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { ToastContext } from "../hooks/ToastProvider.jsx";
import FormModal from "../components/Modals/FormModal.jsx";
import Invoice from "../components/Layouts/Invoice.jsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Product = () => {
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const { showToast } = useContext(ToastContext);
  const { id } = useParams();
  const [images, setImages] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
  });
  const [showInvoice, setShowInvoice] = useState(false);
  const [order, setOrder] = useState(null);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${urlPrefix}/api/products?id=${id}`);

      if (response.status === 200) {
        setProduct(response.data.data);

        let imagesFromResponse = response.data.data.image_path;
        if (imagesFromResponse.length < 3) {
          while (imagesFromResponse.length < 3) {
            imagesFromResponse.push(imagesFromResponse[0]);
          }
        }
        setImages(imagesFromResponse);

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProduct().then((r) => r);
  }, [urlPrefix]);

  const handleColorChange = (color) => {
    setSelectedColor(color);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handlePaymentModal = () => {
    setShowPaymentModal(true);
  };

  const handlePaymentFormChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    switch (name) {
      case "firstName":
        if (!value) {
          errorMsg = "First Name is required!";
        }
        break;
      case "lastName":
        if (!value) {
          errorMsg = "Last Name is required!";
        }
        break;
      case "phone":
        if (!value) {
          errorMsg = "Phone is required!";
        }
        break;
      case "email":
        if (!value) {
          errorMsg = "Email is required!";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          errorMsg = "Email address is invalid!";
        }
        break;
      case "address":
        if (!value) {
          errorMsg = "Address is required!";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const canSubmit = () => {
    return (
      Object.values(user).every((x) => x) &&
      Object.values(errors).every((x) => !x)
    );
  };

  const handleBuy = async (e) => {
    e.preventDefault();
    setShowPaymentModal(false);
    setIsLoading(true);
    const formData = new FormData(e.target);

    const paymentData = {
      id: product.id,
      title: product.title,
      size: selectedSize ? selectedSize.name : "-",
      color: selectedColor.name,
      amount: product.price * quantity,
      quantity: quantity,
      first_name: formData.get("firstName"),
      last_name: formData.get("lastName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      address: formData.get("address"),
    };

    await initPayment(paymentData);
  };

  const initPayment = async (paymentData) => {
    try {
      const response = await axios.post(`${urlPrefix}/api/payment`, {
        id: paymentData.id,
        title: paymentData.title,
        size: paymentData.size,
        color: paymentData.color,
        amount: paymentData.amount,
        quantity: paymentData.quantity,
      });

      if (response.data.status === true) {
        const payment = {
          sandbox: true,
          merchant_id: response.data.data.merchant_id,
          return_url: response.data.data.return_url,
          cancel_url: response.data.data.cancel_url,
          notify_url: response.data.data.notify_url,
          order_id: response.data.data.order_id,
          items: paymentData.title,
          amount: response.data.data.amount,
          currency: response.data.data.currency,
          hash: response.data.data.hash,
          first_name: paymentData.first_name,
          last_name: paymentData.last_name,
          email: paymentData.email,
          phone: paymentData.phone,
          address: paymentData.address,
          city: "",
          country: "",
          delivery_address: "",
          delivery_city: "",
          delivery_country: "",
          custom_1: "",
          custom_2: "",
        };
        setIsLoading(false);
        payhere.startPayment(payment);

        payhere.onCompleted = async function onCompleted() {
          const order = {
            order_id: response.data.data.order_id,
            item_id: paymentData.id,
            title: paymentData.title,
            size: paymentData.size,
            color: paymentData.color,
            quantity: paymentData.quantity,
            amount: response.data.data.amount,
            first_name: paymentData.first_name,
            last_name: paymentData.last_name,
            email: paymentData.email,
            phone: paymentData.phone,
            address: paymentData.address,
            date: new Date().toLocaleString(),
          };
          await makeOrder(order);
          setOrder(order);
          setShowInvoice(true);

          setUser({
            firstName: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
          });
        };

        payhere.onDismissed = function onDismissed() {
          showToast("Payment aborted", "warning");
        };

        payhere.onError = function onError() {
          showToast("Payment failed. Please try again.", "danger");
        };
      } else {
        showToast("Payment failed. Please try again", "danger");
      }
    } catch (error) {
      showToast("Payment failed. Please try again", "danger");
      console.log(error);
    }
  };

  const makeOrder = async (order) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${urlPrefix}/api/order`, {
        order_id: order.order_id,
        product_id: order.item_id,
        size: order.size,
        color: order.color,
        quantity: order.quantity,
        amount: order.amount,
        first_name: order.first_name,
        last_name: order.last_name,
        email: order.email,
        phone: order.phone,
        address: order.address,
      });
      if (response.data.status === true) {
        showToast("Order placed successfully", "success");
      } else {
        showToast("Failed to place order", "danger");
      }
      fetchProduct().then((r) => r);
    } catch (error) {
      showToast("Failed to place order", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <section className="flex-grow">
          <div className="pt-6">
            {/* Image gallery */}
            <div className="mx-auto mt-6 max-w-2xl px-4 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:gap-x-8 lg:px-8">
              {isLoading ? (
                <>
                  <div className="animate-pulse">
                    <div className="animate-pulse rounded-lg overflow-hidden bg-gray-200">
                      <div className="aspect-h-4 aspect-w-3 lg:aspect-h-4 lg:aspect-w-3 w-full h-full bg-gray-300"></div>
                    </div>
                    <div className="hidden lg:grid lg:grid-cols-1 lg:gap-y-8">
                      <div className="animate-pulse rounded-lg overflow-hidden bg-gray-200">
                        <div className="aspect-h-2 aspect-w-3 w-full h-full bg-gray-300"></div>
                      </div>
                      <div className="animate-pulse rounded-lg overflow-hidden bg-gray-200">
                        <div className="aspect-h-2 aspect-w-3 w-full h-full bg-gray-300"></div>
                      </div>
                    </div>
                    <div className="animate-pulse rounded-lg overflow-hidden bg-gray-200">
                      <div className="aspect-h-4 aspect-w-3 lg:aspect-h-4 lg:aspect-w-3 w-full h-full bg-gray-300"></div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={
                        index === 0
                          ? "overflow-hidden rounded-lg block"
                          : "hidden lg:block overflow-hidden rounded-lg"
                      }
                    >
                      <img
                        src={urlPrefix + image}
                        className="h-full w-full object-cover object-center"
                        alt={index}
                      />
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Product info */}
            <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
              <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-300 sm:text-3xl transition duration-500">
                  {product?.title}
                </h1>
              </div>

              {/* Options */}
              <div className="mt-4 lg:row-span-3 lg:mt-0">
                <h2 className="sr-only">Product information</h2>
                <p className="text-3xl tracking-tight text-primary-600 transition duration-500">
                  Rs. {product?.price}
                </p>

                {/* Stock */}
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 transition duration-500">
                    Stock
                  </h3>
                  <p className="my-4 text-sm text-gray-600 dark:text-gray-400 transition duration-500">
                    {product?.stock}
                  </p>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 transition duration-500">
                    Color
                  </h3>

                  <RadioGroup
                    value={selectedColor}
                    onChange={handleColorChange}
                    className="my-4"
                  >
                    <RadioGroup.Label className="sr-only">
                      Choose a color
                    </RadioGroup.Label>
                    <div className="flex items-center space-x-3">
                      {product?.color.map((color, index) => (
                        <RadioGroup.Option
                          key={index}
                          value={color}
                          className={({ active, checked }) =>
                            classNames(
                              "ring-primary-600",
                              active && checked ? "ring ring-offset-1" : "",
                              !active && checked ? "ring-2" : "",
                              "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none focus:ring-2 transition duration-500"
                            )
                          }
                        >
                          <span
                            className={
                              "h-8 w-8 rounded-full border border-black border-opacity-10"
                            }
                            style={{ backgroundColor: color?.value }}
                          />
                        </RadioGroup.Option>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Sizes */}
                {product?.size === "-" ? (
                  <>
                    <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 transition duration-500">
                      Size
                    </h3>
                    <p className="my-4 text-sm text-gray-600 dark:text-gray-400 transition duration-500">
                      One size fits all
                    </p>
                  </>
                ) : (
                  <>
                    <div className="mt-10">
                      <RadioGroup
                        value={selectedSize}
                        onChange={handleSizeChange}
                        className="my-4"
                      >
                        <RadioGroup.Label className="sr-only">
                          Choose a size
                        </RadioGroup.Label>
                        <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                          {product?.size.map((size) => (
                            <RadioGroup.Option
                              key={size.name}
                              value={size}
                              disabled={!size.inStock}
                              className={({ active }) =>
                                classNames(
                                  size.inStock
                                    ? "cursor-pointer text-text-gray-600 dark:text-gray-400 shadow-sm transition duration-500"
                                    : "cursor-not-allowed bg-gray-50 text-gray-600 dark:text-gray-400 transition duration-500",
                                  active
                                    ? "ring-2 ring-primary-500 bg-white dark:bg-gray-900"
                                    : "bg-white dark:bg-gray-900",
                                  "group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6"
                                )
                              }
                            >
                              {({ active, checked }) => (
                                <>
                                  <RadioGroup.Label as="span">
                                    {size.name}
                                  </RadioGroup.Label>
                                  {size.inStock ? (
                                    <span
                                      className={classNames(
                                        active ? "border" : "border-2",
                                        checked
                                          ? "border-primary-500"
                                          : "border-transparent",
                                        "pointer-events-none absolute -inset-px rounded-md"
                                      )}
                                    />
                                  ) : (
                                    <span className="pointer-events-none absolute -inset-px rounded-md border-2 border-gray-200">
                                      <svg
                                        className="absolute inset-0 h-full w-full stroke-2 text-gray-600 dark:text-gray-400 transition duration-500"
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                        stroke="currentColor"
                                      >
                                        <line
                                          x1={0}
                                          y1={100}
                                          x2={100}
                                          y2={0}
                                          vectorEffect="non-scaling-stroke"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </>
                              )}
                            </RadioGroup.Option>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  </>
                )}

                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 transition duration-500 my-4">
                  Quantity
                </h3>
                <div className="relative flex items-center max-w-[8rem] my-4">
                  {/* Decrement button */}
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-2.5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <FaMinus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  </button>
                  {/* Quantity input */}
                  <input
                    type="text"
                    value={quantity}
                    readOnly
                    className="py-2 px-4 block w-full border-gray-200 text-center text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-100 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                    placeholder="1"
                    required
                  />
                  {/* Increment button */}
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-2.5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                  >
                    <FaPlus className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={
                    !selectedColor ||
                    (!selectedSize && product.size !== "-") ||
                    isLoading ||
                    quantity > product.stock
                  }
                  onClick={handlePaymentModal}
                  className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-primary-600 px-8 py-2.5 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Buy
                </button>
              </div>

              <div className="pt-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-10 lg:pr-8 lg:pt-6">
                {/* Description and details */}
                <div>
                  <h3 className="sr-only">Description</h3>

                  <div className="space-y-6">
                    <p className="text-base text-gray-600 dark:text-gray-400 transition duration-500">
                      {product?.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </div>

      <FormModal
        open={showPaymentModal}
        setOpen={setShowPaymentModal}
        position={"top-center"}
        size={"3xl"}
        headerText={"Payment Details"}
      >
        <>
          <section>
            <div className="container px-6 m-auto">
              <div className="col-span-4 lg:col-span-6">
                <form onSubmit={(e) => handleBuy(e)}>
                  <div className="mb-8 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                      >
                        First Name
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          id="firstName"
                          name="firstName"
                          value={user["firstName"]}
                          onChange={handlePaymentFormChange}
                          disabled={isLoading}
                          type="text"
                          className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                        />
                        {errors["firstName"] && (
                          <span className="text-sm text-red-500">
                            {errors["firstName"]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                      >
                        Last Name
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          id="lastName"
                          name="lastName"
                          value={user["lastName"]}
                          onChange={handlePaymentFormChange}
                          disabled={isLoading}
                          type="text"
                          className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                        />
                        {errors["lastName"] && (
                          <span className="text-sm text-red-500">
                            {errors["lastName"]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                      >
                        Email
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          id="email"
                          name="email"
                          value={user["email"]}
                          onChange={handlePaymentFormChange}
                          disabled={isLoading}
                          type="text"
                          className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                        />
                        {errors["email"] && (
                          <span className="text-sm text-red-500">
                            {errors["email"]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                      >
                        Phone
                      </label>
                      <div className="mt-2.5 relative">
                        <input
                          id="phone"
                          name="phone"
                          value={user["phone"]}
                          onChange={handlePaymentFormChange}
                          disabled={isLoading}
                          type="text"
                          className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                        />
                        {errors["phone"] && (
                          <span className="text-sm text-red-500">
                            {errors["phone"]}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
                      >
                        Address
                      </label>
                      <div className="mt-2.5 relative">
                        <textarea
                          id="address"
                          name="address"
                          value={user["address"]}
                          onChange={handlePaymentFormChange}
                          disabled={isLoading}
                          rows="4"
                          className="py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                        />
                        {errors["address"] && (
                          <span className="text-sm text-red-500">
                            {errors["address"]}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit() || isLoading}
                    className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Proceed to Payment
                  </button>
                </form>
              </div>
            </div>
          </section>
        </>
      </FormModal>
      {showInvoice && <Invoice order={order} setShowInvoice={setShowInvoice} />}
    </>
  );
};

export default Product;
