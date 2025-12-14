# FCABL - Fairfield County Adult Basketball League

A modern, responsive web application for managing the Fairfield County Adult Basketball League.

## Features

### Current Implementation (v1.0)
- **Homepage** with hero section and league information
- **Authentication System**
  - Login modal with form validation
  - Registration modal with form validation
  - Mock API integration (ready for backend)
  - Persistent authentication with localStorage
- **Recent Games** section with game cards
- **League Standings** table (responsive design)
- **Upcoming Schedule** with detailed game information
- **League Information** section with registration details
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop
- **Dark Theme** - Navy blue and gray color scheme

## Tech Stack

- **Frontend Framework**: Vue 3 (Composition API with `<script setup>`)
- **Language**: TypeScript with comprehensive type definitions
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **Component Library**: DaisyUI
- **State Management**: Pinia
- **Routing**: Vue Router
- **Icons**: Font Awesome (Free)
- **Form Validation**: Custom validation utilities

## Project Structure

```
frontend/
├── src/
│   ├── assets/
│   │   └── styles/         # Tailwind CSS configuration
│   ├── components/
│   │   ├── auth/           # Login and Register modals
│   │   ├── home/           # Homepage sections
│   │   └── layout/         # Navbar and Footer
│   ├── data/               # Mock data for development
│   ├── router/             # Vue Router configuration
│   ├── services/           # API service layer (stubbed)
│   ├── stores/             # Pinia stores
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── views/              # Page components
│   ├── App.vue
│   └── main.ts
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Authentication

The authentication system is currently using mock API calls that simulate a backend. To test:

### Login
- Email: Any valid email format
- Password: Any password
- The system will simulate a successful login and store a mock JWT token

### Register
- Fill in all required fields
- Password must be at least 8 characters with uppercase, lowercase, and number
- Terms and conditions must be accepted
- The system will simulate successful registration

### Persistence
- Authentication state is stored in localStorage
- Refreshing the page will maintain the logged-in state
- Use the logout button to clear the session

## Mock Data

The application currently uses mock data for:
- **Recent Games**: 3 completed games with scores
- **Upcoming Schedule**: 5 scheduled games
- **League Standings**: 6 teams with win/loss records

This data is defined in `src/data/mockData.ts` and can be easily replaced with real API calls.

## API Integration

The API service layer is located at `src/services/api.ts` and contains stubbed methods:

- `authService.login(credentials)` - Login endpoint
- `authService.register(data)` - Registration endpoint
- `authService.logout()` - Logout endpoint
- `authService.verifyToken(token)` - Token verification endpoint

To integrate with a real backend:
1. Update the service methods to call your API endpoints
2. Replace mock delays with actual HTTP requests (using axios or fetch)
3. Update type definitions if API responses differ

## Type Safety

The project uses TypeScript with comprehensive type definitions:

- `src/types/auth.types.ts` - Authentication and user types
- `src/types/game.types.ts` - Game and team types
- `src/types/validation.types.ts` - Form validation types

All components, stores, and utilities are fully typed.

## Responsive Design

The site is built with a mobile-first approach:

- **Mobile**: Single column layouts, hamburger menu, stacked cards
- **Tablet** (768px+): Two-column grids, expanded navigation
- **Desktop** (1024px+): Three-column grids, full horizontal navigation

## Color Theme

Custom color palette defined in `tailwind.config.js`:

- **Primary**: Navy blue (#1e40af)
- **Dark Background**: #0f172a
- **Dark Light**: #1e293b
- **Accent**: Amber/orange (#f59e0b)
- **Secondary**: Gray (#64748b)

## Future Enhancements

- Backend API integration
- User profile management
- Team management system
- Game scheduling interface
- Player statistics tracking
- Real-time score updates
- Admin dashboard
- Email notifications
- Payment processing for registration fees

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

When adding new features:
1. Follow the existing TypeScript patterns
2. Use the Composition API with `<script setup>`
3. Maintain responsive design principles
4. Add proper type definitions
5. Test on multiple screen sizes

## License

Copyright © 2025 Fairfield County Adult Basketball League. All rights reserved.
