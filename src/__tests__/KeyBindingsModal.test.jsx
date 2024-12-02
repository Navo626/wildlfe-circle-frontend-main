import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";
import KeyBindingsModal from "../components/3D/KeyBindingsModal.jsx";

describe("KeyBindingsModal", () => {
  test("renders correctly when open is true", () => {
    render(<KeyBindingsModal open={true} setOpen={() => {}} />);
    expect(screen.getByText("Key")).not.toBeNull();
    expect(screen.getByText("Action")).not.toBeNull();
    expect(screen.getByText("W / Arrow Up")).not.toBeNull();
    expect(screen.getByText("Move Forward")).not.toBeNull();
  });

  test("calls setOpen when the modal is closed", () => {
    const setOpenMock = vi.fn();
    render(<KeyBindingsModal open={true} setOpen={setOpenMock} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(setOpenMock).toHaveBeenCalled();
  });
});