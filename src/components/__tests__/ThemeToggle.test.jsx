import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '../ThemeToggle'

test('renders theme toggle and toggles theme', () => {
  render(<ThemeToggle />)
  const button = screen.getByRole('button')
  expect(button).toBeInTheDocument()
  fireEvent.click(button)
  expect(document.documentElement.classList.contains('dark')).toBe(true)
})
