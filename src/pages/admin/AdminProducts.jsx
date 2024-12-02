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
import LightboxDisplay from "../../components/Modals/LightboxDisplay.jsx";

const columns = [
  { name: "#", key: "index" },
  { name: "Image", key: "image" },
  { name: "Title", key: "title" },
  { name: "Description", key: "description" },
  { name: "Color", key: "color" },
  { name: "Size", key: "size" },
  { name: "Price", key: "price" },
  { name: "Stock", key: "stock" },
  { name: "Created At", key: "created_at" },
  { name: "Updated At", key: "updated_at" },
  { name: "Actions", key: "actions" },
];

const breadcrumbData = [{ text: "Product", current: true }];

const AdminProducts = () => {
  const [product, setProduct] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    description: "",
    color: "",
    size: "",
    price: null,
    stock: null,
    image: [],
  });
  const [imageName, setImageName] = useState("");
  const [errors, setErrors] = useState({});

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/admin/product?keyword=${searchKeyword}&page=${pagination.currentPage}`
      );
      if (response.data.status === true) {
        setProduct(response.data.data.data);
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
      console.error("Failed to fetch product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts().then((r) => r);
  }, [searchKeyword, pagination.currentPage]);

  const handleDelete = (productId) => {
    setItemIdToDelete(productId);
    setShowConfirmationModal(true);
  };

  const handleView = (productId) => {
    const selectedProduct = product.find((p) => p.id === productId);
    setSelectedProduct(selectedProduct);
    setShowViewModal(true);
  };

  const handleEdit = (productId) => {
    const selectedProduct = product.find((i) => i.id === productId);
    setItemIdToEdit(productId);
    setData({
      title: selectedProduct.title,
      description: selectedProduct.description,
      highlights: selectedProduct.highlights,
      color: selectedProduct.color,
      size: selectedProduct.size,
      price: selectedProduct.price,
      stock: selectedProduct.stock,
      image: [],
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
    let newValue = type === "file" ? files[0] || null : value;

    if (name === "price") {
      const regex = /^[0-9]*\.?[0-9]{0,2}$/;
      if (regex.test(value)) {
        newValue = value;
      } else {
        newValue = data.price;
      }
    }

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
      case "description":
        if (!value) {
          errorMsg = "Description is required!";
        }
        break;
      case "color":
        if (!value) {
          errorMsg = "Color is required!";
        }
        break;
      case "size":
        if (!value) {
          errorMsg = "Size is required!";
        }
        break;
      case "price":
        if (!value) {
          errorMsg = "Price is required!";
        }
        break;
      case "stock":
        if (!value) {
          errorMsg = "Stock is required!";
        }
        break;
      case "image":
        if (!value) {
          errorMsg = "Image is required!";
        }
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const canSubmit = () => {
    if (showEditFormModal) {
      return (
        data.title &&
        data.description &&
        data.color &&
        data.size &&
        data.price &&
        data.stock &&
        Object.values(errors).every((x) => !x)
      );
    } else {
      return (
        Object.values(data).every((x) => x) &&
        Object.values(errors).every((x) => !x)
      );
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!canSubmit()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("color", data.color);
    // append size only if it is not empty
    if (data.size) {
      formData.append("size", data.size);
    }
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    if (data.image) {
      data.image.forEach((imageFile, i) => {
        formData.append(`image[${i}]`, imageFile);
      });
    } else {
      formData.append("image", "");
    }

    try {
      const response = await axiosInstance.post(
        "/api/admin/product/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.status === true) {
        showToast("Image uploaded successfully!", "success");
        setData({
          title: "",
          description: "",
          color: "",
          size: "",
          price: null,
          stock: null,
          image: [],
        });
        setShowFormModal(false);
        await fetchProducts();
      } else {
        showToast("Image upload failed. Please try again.", "danger");
        setShowFormModal(false);
      }
    } catch (error) {
      showToast("Image upload failed. Please try again.", "danger");
      setShowFormModal(false);
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
    formData.append("color", data.color);
    // append size only if it is not empty
    if (data.size) {
      formData.append("size", data.size);
    }
    formData.append("price", data.price);
    formData.append("stock", data.stock);
    if (data.image) {
      data.image.forEach((imageFile, i) => {
        formData.append(`image[${i}]`, imageFile);
      });
    } else {
      formData.append("image", "");
    }

    try {
      const response = await axiosInstance.post(
        `/api/admin/product?id=${itemIdToEdit}&_method=PUT`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.status === true) {
        showToast("Product updated successfully!", "success");
        setData({
          title: "",
          description: "",
          color: "",
          size: "",
          price: null,
          stock: null,
          image: [],
        });
        setShowEditFormModal(false);
        setItemIdToEdit(null);
        await fetchProducts();
      } else {
        showToast("Failed to update product. Please try again.", "danger");
      }
    } catch (error) {
      showToast("Failed to update product. Please try again.", "danger");
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
                    {Array.from({ length: 11 }, (_, index) => (
                      <td key={index} className="px-6 py-3">
                        <div className="animate-pulse h-4 bg-gray-300 rounded"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <>
                  {product?.length > 0 ? (
                    product?.map((product, index) => (
                      <tr
                        key={index}
                        className="bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900 transition duration-500"
                      >
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <img
                            src={urlPrefix + product?.image_path[0]}
                            alt={product?.title}
                            onClick={() => openLightbox(product)}
                            className="h-10 w-10 object-cover rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{product?.title}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {product?.description}
                          </p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{product?.color}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{product?.size}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{product?.price}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">{product?.stock}</p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {formatDate(product?.created_at)}
                          </p>
                        </td>
                        <td className="px-6 py-3 max-w-96 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <p className="truncate w-full">
                            {formatDate(product?.updated_at)}
                          </p>
                        </td>
                        <td className="flex gap-x-5 items-center justify-center px-6 py-3 text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                          <button
                            onClick={() => handleView(product?.id)}
                            className="text-primary-600 hover:text-primary-900 dark:text-primary-500 dark:hover:text-primary-700"
                          >
                            <FaEye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleEdit(product?.id)}
                            className="text-amber-600 hover:text-amber-900 dark:text-amber-500 dark:hover:text-amber-700"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product?.id)}
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
              `/api/admin/product?id=${itemIdToDelete}`
            );
            if (response.data.status === true) {
              showToast("Product deleted successfully!", "success");
              await fetchProducts();
            } else {
              showToast("Failed to delete Product!", "danger");
            }
          } catch (error) {
            showToast("Failed to delete Product!", "danger");
          }
          setShowConfirmationModal(false);
        }}
      >
        <p>Are you sure you want to delete this Product?</p>
      </ConfirmationModal>

      <FormModal
        open={showFormModal}
        setOpen={setShowFormModal}
        position={"top-center"}
        size={"2xl"}
        headerText={"Add New Product"}
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
                placeholder="Long Sleeve T-Shirt"
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
            <div className="relative">
              <label
                htmlFor="description"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                placeholder="This is a long sleeve t-shirt made of cotton fabric."
                name="description"
                value={data["description"]}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
              />
            </div>
            {errors["description"] && (
              <span className="text-sm text-red-500">
                {errors["description"]}
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="relative">
              <label
                htmlFor="color"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Color
              </label>
              <input
                type="text"
                id="color"
                placeholder="Black, White, Red, Blue, Green"
                name="color"
                value={data["color"]}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
              />
            </div>
            {errors["color"] && (
              <span className="text-sm text-red-500">{errors["color"]}</span>
            )}
          </div>

          <div className="mt-4">
            <div className="relative">
              <label
                htmlFor="size"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Size
              </label>
              <input
                type="text"
                id="size"
                placeholder="XS, S, M, L, XL, XXL"
                name="size"
                value={data["size"]}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
              />
            </div>
            {errors["size"] && (
              <span className="text-sm text-red-500">{errors["size"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="price"
              className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Price
            </label>
            <div className="flex mt-2.5">
              <span className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-200 dark:bg-slate-900 border-r border-gray-300 rounded-s-lg focus:outline-none">
                Rs.
              </span>
              <input
                type="text"
                id="price"
                name="price"
                value={data["price"]}
                onChange={handleChange}
                disabled={isLoading}
                className="py-2.5 px-4 block w-full border-gray-200 rounded-l-none rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                placeholder="1000"
              />
            </div>
            {errors["price"] && (
              <span className="text-sm text-red-500">{errors["price"]}</span>
            )}
          </div>

          <div className="mt-4">
            <div className="relative">
              <label
                htmlFor="stock"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Stock
              </label>
              <input
                type="text"
                id="stock"
                placeholder="100"
                name="stock"
                value={data["stock"]}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
              />
            </div>
            {errors["stock"] && (
              <span className="text-sm text-red-500">{errors["stock"]}</span>
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
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleChange}
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
        size={"3xl"}
        headerText={"View Product Details"}
      >
        {selectedProduct && (
          <div>
            <div className="flex items-center justify-center">
              <img
                src={urlPrefix + selectedProduct.image_path[0]}
                alt={selectedProduct?.title}
                className="h-20 w-20 object-cover rounded-lg"
              />
            </div>
            <div className="my-7">
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Title</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedProduct?.title}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Description</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedProduct?.description}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Highlights</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedProduct?.highlights}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Color</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedProduct?.color}
                </p>
              </div>
              <div className="flex justify-between gap-x-8 items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Size</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedProduct?.size}
                </p>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Price</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedProduct?.price}
                </p>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Stock</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {selectedProduct?.stock}
                </p>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Updated At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedProduct?.updated_at)}
                </p>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <p className="text-gray-800 dark:text-gray-200">Created At</p>
                <p className="text-gray-800 dark:text-gray-200">
                  {formatDate(selectedProduct?.created_at)}
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
            color: "",
            size: "",
            price: null,
            stock: null,
            image: [],
          });
          setImageName("");
          setErrors({});
        }}
        position={"center"}
        size={"2xl"}
        headerText={"Update Product"}
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
                placeholder="Long Sleeve T-Shirt"
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
            <div className="relative">
              <label
                htmlFor="description"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                placeholder="This is a long sleeve t-shirt made of cotton fabric."
                name="description"
                value={data["description"]}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
              />
            </div>
            {errors["description"] && (
              <span className="text-sm text-red-500">
                {errors["description"]}
              </span>
            )}
          </div>

          <div className="mt-4">
            <div className="relative">
              <label
                htmlFor="color"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Color
              </label>
              <input
                type="text"
                id="color"
                placeholder="Black, White, Red, Blue, Green"
                name="color"
                value={data["color"]}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
              />
            </div>
            {errors["color"] && (
              <span className="text-sm text-red-500">{errors["color"]}</span>
            )}
          </div>

          <div className="mt-4">
            <div className="relative">
              <label
                htmlFor="size"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Size
              </label>
              <input
                type="text"
                id="size"
                placeholder="XXS, XS, S, M, L, XL, 2XL, 3XL"
                name="size"
                value={data["size"]}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
              />
            </div>
            {errors["size"] && (
              <span className="text-sm text-red-500">{errors["size"]}</span>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="price"
              className="block text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
            >
              Price
            </label>
            <div className="flex mt-2.5">
              <span className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-200 dark:bg-slate-900 border border-r-0 border-gray-200 dark:border-gray-700 rounded-s-lg focus:outline-none transition duration-500">
                Rs.
              </span>
              <input
                type="text"
                id="price"
                name="price"
                value={data["price"]}
                onChange={handleChange}
                disabled={isLoading}
                className="py-2.5 px-4 block w-full border-gray-200 rounded-l-none rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
                placeholder="1000"
              />
            </div>
            {errors["price"] && (
              <span className="text-sm text-red-500">{errors["price"]}</span>
            )}
          </div>

          <div className="mt-4">
            <div className="relative">
              <label
                htmlFor="stock"
                className="text-sm font-semibold leading-6 text-gray-800 dark:text-gray-200 transition duration-500"
              >
                Stock
              </label>
              <input
                type="text"
                id="stock"
                placeholder="100"
                name="stock"
                value={data["stock"]}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-3 py-2.5 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50 disabled:pointer-events-none bg-gray-200 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600 transition duration-500"
              />
            </div>
            {errors["stock"] && (
              <span className="text-sm text-red-500">{errors["stock"]}</span>
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
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleChange}
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

export default AdminProducts;
