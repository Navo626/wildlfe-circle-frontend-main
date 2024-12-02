import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";
import FormModal from "../components/Modals/FormModal.jsx";
import '@testing-library/jest-dom';

describe("FormModal", () => {
  test("renders correctly when open is true", () => {
    render(
      <FormModal open={true} setOpen={() => {}} onClose={() => {}} headerText="Form Header">
        <p>Form content goes here</p>
      </FormModal>
    );
    expect(screen.getByText("Form Header")).toBeInTheDocument();
    expect(screen.getByText("Form content goes here")).toBeInTheDocument();
  });

  test("does not render when open is false", () => {
    render(
      <FormModal open={false} setOpen={() => {}} onClose={() => {}} headerText="Form Header">
        <p>Form content goes here</p>
      </FormModal>
    );
    expect(screen.queryByText("Form Header")).not.toBeInTheDocument();
    expect(screen.queryByText("Form content goes here")).not.toBeInTheDocument();
  });

  test("calls onClose when the modal is closed", () => {
    const onCloseMock = vi.fn();
    render(
      <FormModal open={true} setOpen={() => {}} onClose={onCloseMock} headerText="Form Header">
        <p>Form content goes here</p>
      </FormModal>
    );
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onCloseMock).toHaveBeenCalled();
  });
});