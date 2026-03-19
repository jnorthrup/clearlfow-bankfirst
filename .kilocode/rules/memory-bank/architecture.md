# System Patterns: ClearFlow Application

## Architecture Overview

```
clearflow-main/
├── server/                    # Express.js backend
│   ├── db/                   # Database (SQLite + Drizzle)
│   │   ├── database.ts       # Database connection
│   │   └── migrations.sql   # Schema migrations
│   ├── routes/              # API endpoints
│   │   └── plaid.ts         # Plaid integration routes
│   ├── policy/              # Business logic policies
│   │   └── railPolicy.ts    # Transaction rail policies
│   ├── utils/               # Server utilities
│   │   ├── encryption.ts    # Encryption helpers
│   │   └── routingValidator.ts
│   ├── types.ts             # Backend type definitions
│   └── webhooks/            # Webhook handlers
│       └── plaidWebhook.ts  # Plaid webhook handler
├── src/                      # React frontend
│   ├── components/          # UI components
│   │   ├── dashboard/       # Dashboard components
│   │   ├── entity-card/     # Entity card components
│   │   ├── layout/          # Header, Sidebar
│   │   ├── plaid-link-modal/
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   ├── services/           # API client services
│   │   ├── plaid.service.ts
│   │   ├── auth.service.ts
│   │   └── ledgerService.ts
│   ├── hooks/              # Custom React hooks
│   ├── models/             # Data models
│   └── types/              # TypeScript types
└── public/                  # Static assets
```

## Key Design Patterns

### 1. Frontend/Backend Separation

- Frontend: Vite + React (port 5173)
- Backend: Express.js (port 3000)

### 2. Component Organization

```
src/components/
├── [feature-name]/           # Feature-specific components
│   ├── FeatureName.tsx      # Main component
│   └── FeatureName.module.css
└── shared/                  # Shared UI components
```

### 3. Service Layer Pattern

Services handle API communication:
```typescript
// services/plaid.service.ts
export const plaidService = {
  createLinkToken: async () => {
    const response = await fetch('/api/plaid/create-link-token');
    return response.json();
  },
  exchangePublicToken: async (publicToken: string) => {
    const response = await fetch('/api/plaid/exchange-token', {
      method: 'POST',
      body: JSON.stringify({ publicToken })
    });
    return response.json();
  }
};
```

### 4. Context for Global State

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext } from 'react';

interface AuthContextType {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
```

## API Routes

```
server/routes/
├── plaid.ts         # Bank linking endpoints
└── (additional routes as needed)
```

## State Management

- React Context for global auth state
- Local component state with `useState`
- Service layer for API calls

## File Naming Conventions

- Components: PascalCase (`Dashboard.tsx`, `EntityCard.tsx`)
- Services: camelCase (`plaidService.ts`, `authService.ts`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Types/Models: PascalCase (`User.ts`, `Transaction.ts`)
