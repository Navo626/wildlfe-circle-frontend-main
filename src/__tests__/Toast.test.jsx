import {render, screen} from "@testing-library/react";
import {describe, expect, test} from "vitest";
import Toast from "../components/Miscellaneous/Toast.jsx";
import '@testing-library/jest-dom';

describe("Toast", () => {
  test("renders correctly with given type and message", () => {
    render(<Toast type="success" message="Operation successful" />);
    expect(screen.getByText("Operation successful")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveClass("bg-green-100");
  });
});