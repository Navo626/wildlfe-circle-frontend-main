import { GoPlus } from "react-icons/go";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import PropTypes from "prop-types";

const Table = ({
  columns,
  children,
  pagination,
  setPagination,
  setSearchKeyword,
  isLoading,
  addButton,
  setShowFormModal,
}) => {
  const startIndex = (pagination.currentPage - 1) * pagination.perPage + 1;
  const endIndex = Math.min(
    startIndex + pagination.perPage - 1,
    pagination.totalResults
  );

  const handleSearch = (event) => {
    setSearchKeyword(event.target.value);
  };

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
      <div className="w-full py-10 mx-auto">
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-gray-950 dark:border-neutral-700 transition duration-500">
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700 transition duration-500">
                  <div className="sm:col-span-1">
                    <div>
                      <input
                        type="text"
                        name="search"
                        className="py-2 px-3 ps-11 block w-full ring-1 ring-gray-200 dark:ring-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:pointer-events-none dark:bg-gray-950 dark:text-neutral-400 dark:placeholder-neutral-500 transition duration-500"
                        placeholder="Search"
                        onChange={handleSearch}
                      />
                    </div>
                  </div>
                  {addButton && (
                    <div className="sm:col-span-2 md:grow">
                      <div className="flex justify-end gap-x-2">
                        <div>
                          <button
                            className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary-600 text-white hover:bg-primary-800 disabled:opacity-50 disabled:pointer-events-none"
                            onClick={() => setShowFormModal(true)}
                          >
                            <GoPlus className="flex-shrink-0 size-5" />
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 transition duration-500">
                  <thead className="bg-gray-50 dark:bg-gray-950 transition duration-500">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column?.key}
                          className="px-6 py-3 text-start text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200 transition duration-500"
                        >
                          {column?.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  {children}
                </table>

                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-neutral-700 transition duration-500">
                  <div className="max-w-sm space-y-3">
                    {isLoading ? (
                      <div className="animate-pulse">
                        <div className="text-sm bg-gray-300 rounded dark:bg-gray-700 h-6 w-3/4"></div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-800 dark:text-neutral-200 transition duration-500">
                        Showing{" "}
                        <span className="font-medium">{startIndex}</span> to{" "}
                        <span className="font-medium">{endIndex}</span> of{" "}
                        <span className="font-medium">
                          {pagination.totalResults}
                        </span>{" "}
                        results
                      </p>
                    )}
                  </div>

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  children: PropTypes.node.isRequired,
  pagination: PropTypes.object.isRequired,
  setPagination: PropTypes.func.isRequired,
  setSearchKeyword: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  addButton: PropTypes.bool.isRequired,
  setShowFormModal: PropTypes.func,
};

export default Table;
