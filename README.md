# Medicine Search App (FDA Drug Labels)

A clean and simple medicine search web app built with Next.js, TypeScript, Tailwind CSS, TanStack Query, and Nx. It lets users search US FDA-approved medicines by brand name and read their official label details (uses, dosage, warnings, and ingredients).

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production build (with Nx)
```bash
npx nx build
npm run start
```

---

## Tech Stack & Architecture

- **Next.js 15 (App Router)**: Fast page routing and server/client boundary handling.
- **TypeScript**: Strict typing for FDA API responses and component props.
- **Tailwind CSS**: Clean, responsive layout for mobile and desktop screens.
- **TanStack Query (React Query v5)**: Server state management, client-side caching, and request lifecycle.
- **Nx**: Monorepo tooling and task orchestration (`nx build`, `nx dev`).


