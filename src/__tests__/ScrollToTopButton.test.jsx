import {fireEvent, render} from '@testing-library/react';
import {beforeAll, describe, expect, it, vi} from 'vitest';
import ScrollToTopButton from "../components/Buttons/ScrollToTopButton.jsx";
import {JSDOM} from 'jsdom';

describe('ScrollToTopButton', () => {
  beforeAll(() => {
    const dom = new JSDOM();
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
  });

  it('should scroll to top when clicked', () => {
    // Mock window.scrollTo
    const scrollToMock = vi.fn();
    Object.defineProperty(globalThis.window, 'scrollTo', { value: scrollToMock, writable: true });

    // Render the component
    const { getByRole } = render(<ScrollToTopButton />);

    // Simulate scroll event to make the button visible
    fireEvent.scroll(window, { target: { scrollY: 200 } });

    // Simulate click event
    const button = getByRole('button', { hidden: true });
    fireEvent.click(button);

    // Assert scrollTo was called with correct arguments
    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});