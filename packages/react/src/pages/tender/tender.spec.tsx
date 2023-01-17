import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import Tender from '.';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tender />, { wrapper: MemoryRouter });
    expect(baseElement).toBeTruthy();
  });

  it('should have a main header', () => {
    const { getByText } = render(<Tender />, { wrapper: MemoryRouter });
    expect(getByText(/Тестовые торги/gi)).toBeTruthy();
  });
});
