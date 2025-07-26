// This file extends the type definitions for @testing-library/jest-dom
import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace Vi {
    interface JestAssertion<T = any>
      extends jest.Matchers<Promise<void>, T>,
        TestingLibraryMatchers<typeof expect.stringContaining, void> {}
  }
  
  namespace jest {
    interface Matchers<R = void, T = unknown>
      extends TestingLibraryMatchers<typeof expect.stringContaining, R> {}
  }
}
