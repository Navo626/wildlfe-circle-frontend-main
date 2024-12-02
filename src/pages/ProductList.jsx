import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${urlPrefix}/api/products?page=${pagination.currentPage}`
        );

        if (response.status === 200) {
          setProducts(response.data.data.data);
          setPagination({
            currentPage: response.data.data.current_page,
            totalPages: response.data.data.last_page,
            totalResults: response.data.data.total,
            perPage: response.data.data.per_page,
          });
          setIsLoading(false);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [pagination.currentPage, urlPrefix]);

  const startIndex = (pagination.currentPage - 1) * pagination.perPage + 1;
  Math.min(startIndex + pagination.perPage - 1, pagination.totalResults);
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

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <section className="flex-grow">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-12 mx-auto">
            <h1 className="text-3xl mb-8 text-center font-bold text-gray-800 sm:text-4xl dark:text-white transition duration-500">
              Products
            </h1>

            {isLoading ? (
              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                {Array(8)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="animate-pulse flex flex-col">
                      <div className="rounded-lg bg-gray-300 dark:bg-gray-800 h-80 w-full transition duration-500"></div>
                      <div className="mt-2 flex justify-between">
                        <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-2/4 transition duration-500"></div>
                        <div className="h-4 bg-gray-300 dark:bg-gray-800 rounded w-1/4 transition duration-500"></div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <>
                {products.length > 0 ? (
                  <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products?.map((product) => (
                      <div key={product?.id} className="group relative">
                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                          <img
                            src={urlPrefix + product?.image_path[0]}
                            alt={product?.title}
                            className="h-full w-full object-center lg:h-full lg:w-full"
                          />
                        </div>
                        <div className="mt-4 flex justify-between">
                          <div>
                            <h3 className="text-sm text-gray-600 dark:text-gray-400">
                              <Link
                                to={`http://localhost:3000/product/${product?.id}`}
                              >
                                <span
                                  aria-hidden="true"
                                  className="absolute inset-0"
                                />
                                {product?.title}
                              </Link>
                            </h3>
                          </div>
                          <p className="text-sm font-medium text-gray-800 dark:text-gray-100 transition duration-500">
                            Rs. {product?.price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-800 dark:text-white transition duration-500">
                    No products found
                  </div>
                )}
              </>
            )}

            {products.length > 0 && (
              <div className="flex justify-end mt-10">
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                  <button
                    disabled={pagination.currentPage === 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-primary-100 focus:z-20 focus:outline-offset-0"
                  >
                    <IoIosArrowBack />
                  </button>

                  {renderPageNumbers()}
                  <button
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-primary-100 focus:z-20 focus:outline-offset-0"
                  >
                    <IoIosArrowForward />
                  </button>
                </nav>
              </div>
            )}
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default ProductList;
