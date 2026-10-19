import { act, fireEvent, render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => { jest.useFakeTimers(); window.scrollTo = jest.fn(); });
afterEach(() => { jest.useRealTimers(); });

test('gathers letters after 10 seconds then reveals the personal letter', () => {
  render(<App />);
  const opening = screen.getByLabelText('Gửi Bùi Thu Hằng, cô gái anh thương.');
  expect(opening).not.toHaveClass('assembled');
  expect(screen.queryByRole('heading', { name: 'Hằng yêu của anh,' })).not.toBeInTheDocument();
  act(() => jest.advanceTimersByTime(9999));
  expect(opening).not.toHaveClass('assembled');
  act(() => jest.advanceTimersByTime(1));
  expect(opening).toHaveClass('assembled');
  act(() => jest.advanceTimersByTime(3500));
  expect(screen.getByRole('heading', { name: 'Hằng yêu của anh,' })).toBeInTheDocument();
});

test('opens immediately without hiding again, sends a hug, and restarts', () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Mở thư ngay/ }));
  act(() => jest.advanceTimersByTime(10000));
  expect(screen.getByRole('heading', { name: 'Hằng yêu của anh,' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Gửi anh một cái ôm/ }));
  expect(screen.getByText(/Ôm em thật chặt/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Xem lại từ đầu/ }));
  expect(screen.queryByRole('heading', { name: 'Hằng yêu của anh,' })).not.toBeInTheDocument();
  expect(screen.getByLabelText('Gửi Bùi Thu Hằng, cô gái anh thương.')).not.toHaveClass('assembled');
  act(() => jest.advanceTimersByTime(3500));
  expect(screen.queryByRole('heading', { name: 'Hằng yêu của anh,' })).not.toBeInTheDocument();
});


test('animates every introductory text node and replaces the intro with the opened letter', () => {
  const { container } = render(<App />);
  for (const selector of ['.site-header', '.hero', 'footer']) {
    const root = container.querySelector(selector);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (/[\p{L}\p{N}]/u.test(node.textContent)) {
        expect(node.parentElement.closest('.flying-letter, .sr-only')).not.toBeNull();
      }
    }
  }
  act(() => jest.advanceTimersByTime(10000));
  expect(container.querySelector('.envelope')).not.toBeInTheDocument();
  expect(container.querySelector('.love-page')).toHaveClass('stage-gathered');
  act(() => jest.advanceTimersByTime(3500));
  expect(container.querySelector('.hero')).not.toBeVisible();
  expect(container.querySelector('.letter-section')).toBeVisible();
  expect(container.querySelector('main').children).toHaveLength(2);
});
