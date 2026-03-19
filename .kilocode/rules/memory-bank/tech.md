# Technical Context: ClearFlow Application

## Technology Stack

| Technology   | Version | Purpose                         |
| ------------ | ------- | ------------------------------- |
| Vite         | Latest  | Build tool and dev server       |
| React        | 19.x    | UI library                      |
| TypeScript   | 5.x     | Type-safe JavaScript            |
| Express.js   | Latest  | Backend server                  |
| Bun          | Latest  | Package manager & runtime       |
| Plaid        | Latest  | Banking API integration         |

## Development Environment

### Prerequisites

- Bun installed (`curl -fsSL https://bun.sh/install | bash`)

### Commands

```bash
cd clearflow-main
bun install        # Install dependencies
bun run dev        # Start dev server
bun run build      # Production build
bun run preview    # Preview production build
```

## Project Structure

```
clearflow-main/
├── package.json            # Dependencies and scripts
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── server.js               # Express server entry
├── server/                 # Backend code
│   ├── db/                 # Database
│   ├── routes/             # API routes
│   ├── types.ts            # Type definitions
│   └── utils/              # Utilities
├── src/                    # Frontend code
│   ├── components/         # React components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   ├── models/             # Data models
│   └── types/              # Type definitions
└── public/                 # Static assets
```

## Key Dependencies

### Production Dependencies

- React 19.x
- Express.js
- Plaid SDK

### Dev Dependencies

- Vite
- TypeScript
- ESLint

## Technical Constraints

### Browser Support

- Modern browsers (ES2020+)

## Environment Variables

- Plaid API keys required for banking features
- Database connection string if using persistent storage
