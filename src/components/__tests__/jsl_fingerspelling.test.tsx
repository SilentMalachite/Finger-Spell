import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import JSLFingerSpelling from '../jsl_fingerspelling';

describe('JSLFingerSpelling Component Tests', () => {
  test('should render JSLFingerSpelling component', () => {
    // JSLFingerSpellingがレンダリングされることを確認
    render(<JSLFingerSpelling />);

    // コンポーネントがレンダリングされたことを確認
    const component = screen.getByText(/JSL Finger Spelling Component/i);
    expect(component).toBeInTheDocument();
  });
});