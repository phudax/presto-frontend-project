import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';

test('renders learn react link', () => {
  render(<App />);
  const login = screen.getByText(/login/i);
  expect(login).toBeInTheDocument();
});
