import {fireEvent, render} from '@testing-library/react';
import {beforeAll, describe, expect, it, vi} from 'vitest';
import ThemeButton from "../components/Buttons/ThemeButton.jsx";
import {useTheme} from "../hooks/ThemeProvider.jsx";
import {JSDOM} from 'jsdom';

// Mock the useTheme hook
vi.mock('../hooks/ThemeProvider.jsx', () => ({
  useTheme: vi.fn(),
}));

describe('ThemeButton', () => {
  beforeAll(() => {
    const dom = new JSDOM();
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
  });

  it('should toggle theme when clicked', () => {
    const toggleThemeMock = vi.fn();
    useTheme.mockImplementation(() => ({
      currentTheme: 'light',
      toggleTheme: toggleThemeMock,
    }));

    // Render the component
    const { getByRole, rerender } = render(<ThemeButton />);

    // Simulate click event
    const button = getByRole('button');
    fireEvent.click(button);

    // Assert toggleTheme was called
    expect(toggleThemeMock).toHaveBeenCalled();

    // Change the theme to dark and rerender
    useTheme.mockImplementation(() => ({
      currentTheme: 'dark',
      toggleTheme: toggleThemeMock,
    }));
    rerender(<ThemeButton />);

    // Assert the button displays the correct icon
    const svg = button.querySelector('svg');
    expect(svg).not.toBeNull();
    expect(svg.classList.contains('text-white')).toBe(true);
  });
});