import {render, screen} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";
import TooltipContent from "../components/Miscellaneous/TooltipContent.jsx";
import '@testing-library/jest-dom';
import {ToastContext} from "../hooks/ToastProvider.jsx";
import {BrowserRouter as Router} from "react-router-dom";

describe("TooltipContent", () => {
  const mockShowToast = vi.fn();

  const renderWithRouter = (ui, { route = "/" } = {}) => {
    window.history.pushState({}, "Test page", route);
    return render(
      <Router>
        <ToastContext.Provider value={{ showToast: mockShowToast }}>
          {ui}
        </ToastContext.Provider>
      </Router>
    );
  };

  test("renders author content correctly", () => {
    renderWithRouter(<TooltipContent content="author" other={{ articles: 10, joined: "2023-01-01" }} />);
    expect(screen.getByText("Articles")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Joined on")).toBeInTheDocument();
    expect(screen.getByText("2023-01-01")).toBeInTheDocument();
  });

  test("renders like content correctly", () => {
    renderWithRouter(<TooltipContent content="like" />);
    expect(screen.getByText("Like")).toBeInTheDocument();
  });

  test("renders comment content correctly", () => {
    renderWithRouter(<TooltipContent content="comment" />);
    expect(screen.getByText("Comment")).toBeInTheDocument();
  });

  test("renders share content correctly", () => {
    renderWithRouter(<TooltipContent content="share" />);
    expect(screen.getByText("Copy link")).toBeInTheDocument();
    expect(screen.getByText("Share on Twitter")).toBeInTheDocument();
    expect(screen.getByText("Share on Facebook")).toBeInTheDocument();
    expect(screen.getByText("Share on LinkedIn")).toBeInTheDocument();
  });
});