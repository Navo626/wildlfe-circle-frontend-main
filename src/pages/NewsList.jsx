import Header from "../components/Layouts/Header.jsx";
import Footer from "../components/Layouts/Footer.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;

  const fetchNews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${urlPrefix}/api/news?page=${pagination.currentPage}`
      );

      if (response.data.status === true) {
        setNews(response.data.data.data);
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
      console.error("Failed to fetch news:", error);
    }
  };

  useEffect(() => {
    fetchNews().then((r) => r);
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

  return (
    <>
      <section className="flex flex-col min-h-screen">
        <Header />
        <section className="flex-grow">
          <div className="max-w-7xl px-4 sm:px-6 lg:px-8 lg:py-12 mx-auto">
            <h1 className="text-3xl mb-8 text-center font-bold text-gray-800 sm:text-4xl dark:text-white transition duration-500">
              News
            </h1>

            {isLoading ? (
              <>
                {Array(10)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="block my-3 p-6 w-full bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 transition duration-500 animate-pulse"
                    >
                      <div className="mb-4 h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 transition duration-500"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 transition duration-500"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2 transition duration-500"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 transition duration-500"></div>
                    </div>
                  ))}
              </>
            ) : (
              <>
                {news.map((newsItem) => (
                  <Link
                    key={newsItem.id}
                    to={`/news/${newsItem.id}`}
                    className="block my-3 p-6 w-full bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition duration-500"
                  >
                    <div className="flex justify-between mb-3">
                      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white transition duration-500 max-w-5xl">
                        {newsItem.title}
                      </h5>
                      <time
                        dateTime={newsItem.created_at}
                        className="hidden md:block font-bold text-gray-600 dark:text-gray-400 transition duration-500"
                      >
                        {new Date(newsItem.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </time>
                    </div>

                    <time
                      dateTime={newsItem.created_at}
                      className="block md:hidden font-bold mb-3 text-gray-600 dark:text-gray-400 transition duration-500"
                    >
                      {new Date(newsItem.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </time>

                    <div
                      className="font-normal line-clamp-3 text-gray-700 dark:text-gray-400 transition duration-500"
                      dangerouslySetInnerHTML={{ __html: newsItem.body }}
                    />
                  </Link>
                ))}

                {news.length > 0 ? (
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
                      No news found
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
        <Footer />
      </section>
    </>
  );
};

export default NewsList;
