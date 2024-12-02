import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";
import ConfirmationModal from "../components/Modals/ConfirmationModal.jsx";
import '@testing-library/jest-dom'; // Import jest-dom for custom matchers

describe("ConfirmationModal", () => {
  test("renders correctly when open is true", () => {
    render(
      <ConfirmationModal open={true} setOpen={() => {}} onConfirm={() => {}}>
        Are you sure you want to delete this comment?
      </ConfirmationModal>
    );
    expect(screen.getByText("Are you sure you want to delete this comment?")).toBeInTheDocument();
  });

  test("does not render when open is false", () => {
    render(
      <ConfirmationModal open={false} setOpen={() => {}} onConfirm={() => {}}>
        Are you sure you want to delete this comment?
      </ConfirmationModal>
    );
    expect(screen.queryByText("Are you sure you want to delete this comment?")).not.toBeInTheDocument();
  });

  test("calls onConfirm when the confirm button is clicked", () => {
    const onConfirmMock = vi.fn();
    render(
      <ConfirmationModal open={true} setOpen={() => {}} onConfirm={onConfirmMock}>
        Are you sure you want to delete this comment?
      </ConfirmationModal>
    );
    fireEvent.click(screen.getByText("Yes, I'm sure"));
    expect(onConfirmMock).toHaveBeenCalled();
  });

  test("closes the modal when the cancel button is clicked", () => {
    const setOpenMock = vi.fn();
    render(
      <ConfirmationModal open={true} setOpen={setOpenMock} onConfirm={() => {}}>
        Are you sure you want to delete this comment?
      </ConfirmationModal>
    );
    fireEvent.click(screen.getByText("No, cancel"));
    expect(setOpenMock).toHaveBeenCalledWith(false);
  });
});