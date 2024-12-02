import {render, screen} from "@testing-library/react";
import {describe, expect, test} from "vitest";
import Breadcrumb from "../components/Miscellaneous/Breadcrumb.jsx";
import {BrowserRouter as Router} from "react-router-dom";
import '@testing-library/jest-dom';

describe("Breadcrumb", () => {
  const breadcrumbs = [
    { text: "Home", url: "/admin/" },
    { text: "Dashboard", url: "/admin/dashboard" },
    { text: "Settings", current: true }
  ];

  const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return render(<Router>{ui}</Router>);
  };

  test("renders correctly with given breadcrumbs", () => {
    renderWithRouter(<Breadcrumb breadcrumbs={breadcrumbs} />);
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("renders home link correctly", () => {
    renderWithRouter(<Breadcrumb breadcrumbs={breadcrumbs} />);
    expect(screen.getByRole("link", { name: /home/i })).toHaveAttribute("href", "/admin/");
  });

  test("renders breadcrumb links correctly", () => {
    renderWithRouter(<Breadcrumb breadcrumbs={breadcrumbs} />);
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute("href", "/admin/dashboard");
  });

  test("renders current breadcrumb correctly", () => {
    renderWithRouter(<Breadcrumb breadcrumbs={breadcrumbs} />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /settings/i })).not.toBeInTheDocument();
  });
});