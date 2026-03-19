# Active Context: ClearFlow Main Application

## Current State

**Project Status**: ClearFlow application integrated as subdirectory

The original Next.js template has been replaced with the ClearFlow application from `jnorthrup/clearflow-main`. Development now focuses on the ClearFlow application in `clearflow-main/` directory.

## Previously Completed (from original template)

- [ ] Base Next.js 16 setup with App Router
- [ ] TypeScript configuration with strict mode
- [ ] Tailwind CSS 4 integration
- [ ] ESLint configuration
- [ ] Memory bank documentation
- [ ] Recipe system for common features

These tasks are now integrated into the ClearFlow application in `clearflow-main/`.

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `clearflow-main/` | Main application | Active development |
| `clearflow-main/src/` | Frontend components | ✅ |
| `clearflow-main/server/` | Backend services | ✅ |
| `clearflow-main/package.json` | Dependencies | ✅ |

## Current Focus

The ClearFlow application is now integrated. Available features include:
- Dashboard with entity management
- Plaid integration for banking
- Governance/QA components
- Payment processing
- User authentication flows

## Quick Start Guide

### ClearFlow Development

The application uses Vite + React (not Next.js). To work on it:

```bash
cd clearflow-main
bun install
bun run dev
```

### To add components:

Add to `clearflow-main/src/components/`:
```tsx
// clearflow-main/src/components/new-component/NewComponent.tsx
export function NewComponent() {
  return <div>Component content</div>;
}
```

### Backend routes:

Add to `clearflow-main/server/routes/`:
```ts
// clearflow-main/server/routes/newRoute.ts
import express from 'express';
const router = express.Router();
router.get('/', (req, res) => res.json({ message: 'Hello' }));
export default router;
```

## Available Recipes

| Recipe | File | Use Case |
|--------|------|----------|
| Add Database | `.kilocode/recipes/add-database.md` | Data persistence with Drizzle + SQLite |

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| Today | ClearFlow application integrated as subdirectory from jnorthrup/clearflow-main |
