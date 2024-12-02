import React from "react";
import PropTypes from "prop-types";
import { TiHome } from "react-icons/ti";
import { Link } from "react-router-dom";

const Breadcrumb = ({ breadcrumbs }) => {
  return (
    <div className="flex items-center overflow-x-auto whitespace-nowrap">
      <Link
        to="/admin/"
        className="text-gray-600 dark:text-gray-200 hover:underline transition duration-500"
      >
        <TiHome className="h-5 w-5" />
      </Link>
      <span className="mx-5 text-gray-500 dark:text-gray-300 transition duration-500">
        /
      </span>

      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {crumb?.current ? (
            <span className="text-gray-600 dark:text-gray-200 transition duration-500">
              {crumb?.text}
            </span>
          ) : (
            <Link
              to={crumb?.url}
              className="text-gray-600 dark:text-gray-200 hover:underline transition duration-500"
            >
              {crumb?.text}
            </Link>
          )}
          {index < breadcrumbs.length - 1 && (
            <span className="mx-5 text-gray-500 dark:text-gray-300 transition duration-500">
              /
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

Breadcrumb.propTypes = {
  breadcrumbs: PropTypes.array.isRequired,
};

export default Breadcrumb;
