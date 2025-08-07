# Tenkasi District Petition Redressal System

A full-stack web application for managing citizen petitions and official/admin responses for Tenkasi district.

## Tech Stack
- Frontend: React + Tailwind CSS (CRA)
- Backend: Node.js + Express.js
- Database: PostgreSQL
- Auth: JWT (role-based: public/official/admin)

## Quick Start

1) Backend env

Create `backend/.env` from `.env.example` and fill values.

2) Install deps

```bash
npm run install:all
```

3) Create database tables

```bash
npm run migrate
```

4) Run backend (dev)

```bash
npm run dev:backend
```

5) Run frontend (dev)

```bash
npm run start:frontend
```

Open http://localhost:3000

## Deployment
See `DEPLOYMENT_GUIDE.md` and `render.yaml`.