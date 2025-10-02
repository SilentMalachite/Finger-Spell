import { render, screen, act } from '@testing-library/react';
import JSLFingerSpelling from '../jsl_fingerspelling';

describe('JSLFingerSpelling Component Logic Tests', () => {
  test('should render component with initial state', async () => {
    await act(async () => {
      render(<JSLFingerSpelling />);
    });

    // コンポーネントが正しくレンダリングされたことを確認
    expect(screen.getByText('JSL Finger Spelling Component')).toBeInTheDocument();
  });
});