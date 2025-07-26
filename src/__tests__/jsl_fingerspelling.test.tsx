import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import JSLFingerSpelling from '../components/jsl_fingerspelling';

describe('JSLFingerSpelling', () => {
  it('renders without crashing', async () => {
    // actでラップしてコンポーネントをレンダリング
    await act(async () => {
      render(<JSLFingerSpelling />);
    });

    // コンポーネントがレンダリングされていることを確認
    const element = screen.getByText('JSL Finger Spelling Component');
    expect(element).toBeInTheDocument();
  });
});
