import { render, screen, act } from '@testing-library/react';
import JSLFingerSpelling from '../jsl_fingerspelling';

describe('JSLFingerSpelling Component Tests', () => {
  test('should render JSLFingerSpelling component', async () => {
    // JSLFingerSpellingがレンダリングされることを確認
    await act(async () => {
      render(<JSLFingerSpelling />);
    });

    // コンポーネントがレンダリングされたことを確認
    const component = screen.getByText(/JSL Finger Spelling Component/i);
    expect(component).toBeInTheDocument();
  });
});