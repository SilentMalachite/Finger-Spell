import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App', () => {
  it('renders JSLFingerSpelling component', async () => {
    // actでラップしてコンポーネントをレンダリング
    await act(async () => {
      render(<App />);
    });

    // モックコンポーネントがレンダリングされていることを確認
    const jslElement = screen.getByTestId('jsl-fingerspelling');
    expect(jslElement).toBeInTheDocument();
    expect(jslElement.textContent).toBe('JSL Finger Spelling Component');
  });
});
