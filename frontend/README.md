# NoteDB Frontend

Minimalist notes manager built with React, TypeScript, and Tailwind CSS.

## Features

- Create, read, update, and delete notes
- Color-based organization and filtering
- Clean and intuitive interface

## Tech Stack

- React 19.2.0
- TypeScript 5.6.3
- Vite 5.4.11
- Tailwind CSS 3.4.14
- TanStack Query 5.90.2
- React Router 7.9.3
- Zustand 5.0.8

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:3000
VITE_API_VERSION=v1
VITE_API_TIMEOUT=30000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

Create a production build:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── app/              # Application configuration
├── pages/            # Page components
├── domain/           # Business domain modules
├── core/             # Shared components and utilities
└── assets/           # Static assets and styles
```

## License

MIT