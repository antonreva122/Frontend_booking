# Booking System Frontend

React frontend for the booking management system.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **date-fns** - Date formatting and manipulation

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Frontend_booking/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   ├── pages/          # Page components
│   ├── services/       # API services
│   ├── context/        # React context (auth, etc)
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies
```

## Backend API

Ensure the Django backend is running at `http://localhost:8000`

## Features

- User authentication (register, login, logout)
- User profile management
- Booking creation and management
- Resource browsing
- Availability checking
- Responsive design
