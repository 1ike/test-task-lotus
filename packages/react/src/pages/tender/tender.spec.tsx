import { render } from '@testing-library/react';

import Tender from '.';

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Tender />);
    expect(baseElement).toBeTruthy();
  });

  it('should have a greeting as the title', () => {
    const { getByText } = render(<Tender />);
    expect(getByText(/Тестовые торги/gi)).toBeTruthy();
  });
});
