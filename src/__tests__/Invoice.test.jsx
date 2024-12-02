import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";
import Invoice from "../components/Layouts/Invoice.jsx";
import axios from "axios";
import '@testing-library/jest-dom';

// Mock the axios library
vi.mock("axios");

// Mock the URL.createObjectURL function
global.URL.createObjectURL = vi.fn();

// Mock the window.open and window.alert functions
global.window.open = vi.fn();
global.window.alert = vi.fn();

describe("Invoice", () => {
  const mockOrder = {
    order_id: "12345",
    date: "2023-10-01",
    title: "Product Title",
    color: "Red",
    size: "M",
    quantity: 1,
    amount: 1000,
  };

  const mockSetShowInvoice = vi.fn();

  test("renders invoice correctly with given order data", () => {
    render(<Invoice order={mockOrder} setShowInvoice={mockSetShowInvoice} />);
    expect(screen.getByText("Invoice from Wildlife Circle")).toBeInTheDocument();
    expect(screen.getByText("Invoice #12345")).toBeInTheDocument();
    expect(screen.getByText("Date paid:")).toBeInTheDocument();
    expect(screen.getByText("2023-10-01")).toBeInTheDocument();
    expect(screen.getByText("Product Title")).toBeInTheDocument();
    expect(screen.getByText("Red")).toBeInTheDocument();
    expect(screen.getByText("M")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Rs. 1000")).toBeInTheDocument();
  });

  test("triggers handleDownload function when download button is clicked", async () => {
    axios.get.mockResolvedValue({
      data: new Blob(["mock data"], { type: "application/pdf" }),
    });

    render(<Invoice order={mockOrder} setShowInvoice={mockSetShowInvoice} />);
    const downloadButton = screen.getByText("Invoice PDF");
    fireEvent.click(downloadButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(`${import.meta.env.VITE_APP_BACKEND_URL}/api/invoice`, {
        params: { order_id: "12345" },
        responseType: "blob",
      });
    });
  });

  test("triggers handlePrint function when print button is clicked", () => {
    window.print = vi.fn();

    render(<Invoice order={mockOrder} setShowInvoice={mockSetShowInvoice} />);
    const printButton = screen.getByText("Print");
    fireEvent.click(printButton);

    expect(window.print).toHaveBeenCalled();
  });
});