import {describe, expect, test} from "vitest";
import {render, screen} from "@testing-library/react";
import '@testing-library/jest-dom';
import Footer from "../components/Layouts/Footer.jsx";
import {BrowserRouter} from "react-router-dom";

describe("Footer", () => {
  test("renders correctly with all elements", () => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );

    // Check if the logo is rendered
    const logo = screen.getByAltText("Brand");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute("src", "/logo/logo-uni.png");

    // Check if the copyright text contains the current year
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText(
      new RegExp(`© ${currentYear} Wildlife Circle. All right reserved.`)
    );
    expect(copyrightText).toBeInTheDocument();

    // Check if social media links are rendered
    const facebookLink = screen.getByLabelText("facebook");
    const instagramLink = screen.getByLabelText("Instagram");
    const youtubeLink = screen.getByLabelText("Youtube");

    expect(facebookLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(youtubeLink).toBeInTheDocument();

    // Check if the social media icons are present
    expect(facebookLink.firstChild).toHaveClass("w-5 h-5");
    expect(instagramLink.firstChild).toHaveClass("w-5 h-5");
    expect(youtubeLink.firstChild).toHaveClass("w-5 h-5");
  });
});
