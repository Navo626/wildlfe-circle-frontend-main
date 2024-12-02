import {fireEvent, render, screen} from "@testing-library/react";
import {describe, expect, test, vi} from "vitest";
import LightboxDisplay from "../components/Modals/LightboxDisplay.jsx";
import '@testing-library/jest-dom';

describe("LightboxDisplay", () => {
  const selectedImage = {
    image_path: "/images/sample.jpg",
    title: "Sample Image",
    captured_by: "Photographer"
  };

  test("renders correctly when selectedImage is provided", () => {
    render(
      <LightboxDisplay selectedImage={selectedImage} embedInfo={false} closeLightbox={() => {}} />
    );
    expect(screen.getByAltText("Sample Image")).toBeInTheDocument();
  });

  test("does not render when selectedImage is not provided", () => {
    render(
      <LightboxDisplay selectedImage={null} embedInfo={false} closeLightbox={() => {}} />
    );
    expect(screen.queryByAltText("Sample Image")).not.toBeInTheDocument();
  });

  test("calls closeLightbox when the lightbox is clicked", () => {
    const closeLightboxMock = vi.fn();
    render(
      <LightboxDisplay selectedImage={selectedImage} embedInfo={false} closeLightbox={closeLightboxMock} />
    );
    fireEvent.click(screen.getByAltText("Sample Image"));
    expect(closeLightboxMock).toHaveBeenCalled();
  });

  test("displays image and embed information correctly when embedInfo is true", () => {
    render(
      <LightboxDisplay selectedImage={selectedImage} embedInfo={true} closeLightbox={() => {}} />
    );
    expect(screen.getByText("Title: Sample Image")).toBeInTheDocument();
    expect(screen.getByText("Captured by: Photographer")).toBeInTheDocument();
  });
});