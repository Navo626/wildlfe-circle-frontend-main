import Header from "../components/Layouts/Header.jsx";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Layouts/Footer.jsx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: null,
    totalResults: 0,
    perPage: 10,
  });
  const urlPrefix = import.meta.env.VITE_APP_BACKEND_URL;

  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${urlPrefix}/api/projects?page=${pagination.currentPage}`
      );

      if (response.data.status === true) {
        setProjects(response.data.data.data);
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
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects().then((r) => r);
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
              Projects
            </h1>
            {isLoading ? (
              <>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <div
                        key={index}
                        className="animate-pulse flex flex-col bg-white dark:bg-gray-900 p-3 rounded-lg"
                      >
                        <div className="bg-gray-200 dark:bg-gray-700 h-80 rounded-lg" />
                        <div className="mt-4 h-4 max-w-36 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="mt-2 h-4 max-w-64 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="mt-6 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="mt-2 h-4 max-w-64 bg-gray-200 dark:bg-gray-700 rounded" />
                      </div>
                    ))}
                </div>
              </>
            ) : (
              <>
                <div className="mx-auto grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {projects.map((project) => (
                    <Link key={project.id} to={`/project/${project.id}`}>
                      <article
                        key={project.id}
                        className="flex max-w-xl flex-col items-start justify-between hover:shadow-xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-105 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md"
                      >
                        {project.image_path === null ? (
                          <div className="w-full h-64 lg:h-80 mb-5 bg-gray-200 dark:bg-gray-700 rounded-lg transition duration-500" />
                        ) : (
                          <img
                            className="object-cover object-center w-full h-64 rounded-lg lg:h-80 mb-5"
                            src={urlPrefix + project.image_path[0]}
                            alt=""
                          />
                        )}
                        <div className="flex items-center gap-x-4 text-xs">
                          <time
                            dateTime={project.created_at}
                            className="text-gray-600 dark:text-gray-400 transition duration-500"
                          >
                            {new Date(project.created_at).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </time>
                        </div>

                        <div className="group relative">
                          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 dark:text-gray-200 transition duration-500">
                            {project.title}
                          </h3>
                          <div
                            className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600 dark:text-gray-400 transition duration-500"
                            dangerouslySetInnerHTML={{ __html: project.body }}
                          />
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {projects.length > 0 ? (
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
                      No projects found
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

export default ProjectList;
