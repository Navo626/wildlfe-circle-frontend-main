import {fireEvent, render} from '@testing-library/react';
import {beforeAll, describe, expect, it, vi} from 'vitest';
import SidebarDrawer from '../components/Drawers/SidebarDrawer.jsx';
import {JSDOM} from 'jsdom';

describe('SidebarDrawer', () => {
  beforeAll(() => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', {
      url: 'http://localhost/',
    });
    globalThis.window = dom.window;
    globalThis.document = dom.window.document;
    Object.defineProperty(globalThis, 'navigator', {
      value: {
        userAgent: 'node.js',
      },
      configurable: true,
    });
  });

  it('should close the sidebar when clicking outside', () => {
    const setOpenMock = vi.fn();
    const { container } = render(
      <SidebarDrawer open={true} setOpen={setOpenMock} title="Test Sidebar">
        <div>Content</div>
      </SidebarDrawer>
    );

    // Simulate click event outside the sidebar
    fireEvent.mouseDown(container);

    // Assert setOpen was called with false
    expect(setOpenMock).toHaveBeenCalledWith(false);
  });
});