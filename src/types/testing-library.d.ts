// This file extends the type definitions for @testing-library/jest-dom

import { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare global {
  namespace jest {
    interface Matchers<R = void, T = unknown> 
      extends TestingLibraryMatchers<typeof expect.stringContaining, R> {
      // Custom matchers can be added here if needed
    }
  }

  // For Vitest compatibility
  namespace Vi {
    interface JestAssertion<T = any>
      extends jest.Matchers<Promise<void>, T>,
        TestingLibraryMatchers<T, void> {}
  }
}

// This is needed to make this file a module
export {}
