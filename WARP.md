# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Project Setup
```bash
# Install dependencies
npm install

# Start development server (Vite + Electron)
npm run electron:dev

# Production build
npm run build

# Build for distribution
npm run electron:build
```

### Testing
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Update snapshots
npm run test:update
```

### Code Quality
```bash
# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## Architecture Overview

Finger-spell is an Electron application built with Vite + React (TypeScript) for Japanese finger spelling recognition using webcam input.

### Key Technology Stack
- Electron 28.x (Desktop application framework)
- React 18.x + TypeScript (Frontend)
- Vite 7.x (Build tool)
- MediaPipe Hands (Hand landmark detection)
- Jest + React Testing Library (Testing)
- TailwindCSS (Styling)

### Core Components

1. Main Process (`electron/main.ts`)
   - Handles application lifecycle
   - Manages window creation and IPC
   - Configures security settings (contextIsolation, nodeIntegration)

2. Renderer Process (`src/`)
   - React application for UI
   - Hand detection and recognition logic
   - Real-time webcam processing

3. Preload Script (`electron/preload.ts`)
   - Securely exposes APIs between main and renderer

### Critical Directories
```
src/
├── components/        # React components
│   ├── button/       # Common UI components
│   └── jsl_fingerspelling.tsx  # Core finger spelling component
├── utils/            # Utility functions
└── App.tsx          # Main application component

electron/
├── main.ts          # Electron main process
└── preload.ts       # Preload script for IPC

tests/
└── __tests__/       # Test suites
```

### Hand Recognition Pipeline

1. Video Input -> MediaPipe Processing -> Landmark Detection
2. Landmark Analysis -> Gesture Recognition -> Character Mapping
3. UI Update -> Real-time Feedback

### Security Considerations

- Electron security settings enforced (contextIsolation, nodeIntegration)
- IPC communications handled through preload script
- External resources limited to MediaPipe CDN

### Build Configuration

The project uses Vite + Electron Builder with specific configurations for:
- macOS (.app)
- Windows (NSIS installer)
- Linux (AppImage)

### Testing Strategy

- Components: Jest + React Testing Library
- Hand recognition logic: Unit tests
- MediaPipe integration: Integration tests
- Target coverage: 
  - Components: 100%
  - Utilities: 93%
  - Overall: 25%