import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";
import Comments from "../components/Layouts/Comments.jsx";
import {ToastContext} from "../hooks/ToastProvider.jsx";
import useAxios from "../hooks/useAxios.jsx";
import '@testing-library/jest-dom';

// Mock the useAxios hook
vi.mock("../hooks/useAxios.jsx", () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe("Comments", () => {
  const mockAxios = {
    delete: vi.fn().mockResolvedValue({
      data: {status: true},
    }),
  };

  const mockShowToast = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();

  beforeEach(() => {
    useAxios.mockReturnValue(mockAxios);
  });

  const renderWithProviders = (ui) => {
    return render(
      <ToastContext.Provider value={{showToast: mockShowToast}}>
        {ui}
      </ToastContext.Provider>
    );
  };

  const mockComments = [
    {
      id: 1,
      first_name: "John",
      last_name: "Doe",
      body: "This is a comment",
      created_at: "2023-10-01T00:00:00Z",
      is_mine: true,
    },
  ];

  test("renders comments correctly with given data", () => {
    renderWithProviders(<Comments data={mockComments} onDelete={mockOnDelete} onEdit={mockOnEdit}/>);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("This is a comment")).toBeInTheDocument();
    expect(screen.getByText("Oct 1, 2023")).toBeInTheDocument();
  });

  test("shows confirmation modal when delete button is clicked", () => {
    renderWithProviders(<Comments data={mockComments} onDelete={mockOnDelete} onEdit={mockOnEdit}/>);

    // Find the delete button by its aria-label
    fireEvent.click(screen.getByLabelText("Delete comment"));

    // Verify that the confirmation modal is displayed
    expect(screen.getByText("Are you sure you want to delete this comment?")).toBeInTheDocument();
  });


  test("calls onEdit when edit button is clicked", () => {
    renderWithProviders(<Comments data={mockComments} onDelete={mockOnDelete} onEdit={mockOnEdit}/>);

    // Find the edit button by its aria-label
    fireEvent.click(screen.getByLabelText("Edit comment"));

    // Verify that the onEdit function was called with the correct arguments
    expect(mockOnEdit).toHaveBeenCalledWith(1, "This is a comment");
  });
});